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
  const result = await database.query(
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
    [email, name, clerkUserId],
  );

  return result.rows[0];
}
