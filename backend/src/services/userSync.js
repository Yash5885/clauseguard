import { getClerkClient } from "../config/clerk.js";
import { getDatabasePool } from "../config/database.js";

function getPrimaryEmail(clerkUser) {
  const primaryEmail = clerkUser.emailAddresses.find(
    (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId,
  );

  return primaryEmail?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
}

function getDisplayName(clerkUser, email) {
  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || clerkUser.username || email.split("@")[0];
}

export async function syncClerkUser(
  clerkUserId,
  { clerk = getClerkClient(), database = getDatabasePool() } = {},
) {
  const clerkUser = await clerk.users.getUser(clerkUserId);
  const email = getPrimaryEmail(clerkUser);

  if (!email) {
    throw new Error("The Clerk user does not have an email address");
  }

  const name = getDisplayName(clerkUser, email);
  const parameters = [email, name, clerkUserId];
  let result;

  try {
    result = await database.query(
      `
        INSERT INTO users (email, name, auth_provider_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (auth_provider_id)
        DO UPDATE SET
          email = EXCLUDED.email,
          name = EXCLUDED.name
        RETURNING
          id,
          email,
          name,
          auth_provider_id AS "authProviderId",
          created_at AS "createdAt"
      `,
      parameters,
    );
  } catch (error) {
    const isExistingEmail =
      error?.code === "23505" && error?.constraint === "users_email_key";

    if (!isExistingEmail) {
      throw error;
    }

    // A Clerk development user can be deleted and recreated with the same
    // verified email but a new provider ID. Reconnect the existing database
    // row so its documents and review history remain attached to that person.
    result = await database.query(
      `
        UPDATE users
        SET name = $2, auth_provider_id = $3
        WHERE email = $1
        RETURNING
          id,
          email,
          name,
          auth_provider_id AS "authProviderId",
          created_at AS "createdAt"
      `,
      parameters,
    );
  }

  return result.rows[0];
}
