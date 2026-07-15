import assert from "node:assert/strict";
import test from "node:test";
import { syncClerkUser } from "../src/services/userSync.js";

test("syncClerkUser creates or updates the PostgreSQL user from Clerk data", async () => {
  const clerk = {
    users: {
      async getUser(userId) {
        assert.equal(userId, "user_clerk_123");
        return {
          emailAddresses: [
            { id: "email_primary", emailAddress: "alex@example.com" },
          ],
          firstName: "Alex",
          lastName: "Morgan",
          primaryEmailAddressId: "email_primary",
          username: null,
        };
      },
    },
  };
  const databaseUser = {
    id: "1",
    email: "alex@example.com",
    name: "Alex Morgan",
    authProviderId: "user_clerk_123",
    createdAt: new Date("2026-07-16T00:00:00.000Z"),
  };
  const database = {
    async query(sql, parameters) {
      assert.match(sql, /INSERT INTO users/);
      assert.match(sql, /ON CONFLICT \(auth_provider_id\)/);
      assert.deepEqual(parameters, [
        "alex@example.com",
        "Alex Morgan",
        "user_clerk_123",
      ]);
      return { rows: [databaseUser] };
    },
  };

  const result = await syncClerkUser("user_clerk_123", { clerk, database });

  assert.equal(result, databaseUser);
});
