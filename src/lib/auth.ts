import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/auth-schema";
import type { UserType } from "@/types";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  user: {
    additionalFields: {
      userType: {
        type: ["customer", "partner"],
        required: true,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }) => {
        console.log(`Code ${code} sent to the number: ${phoneNumber}`);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@acme.com`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          const userType = context?.headers?.get("x-user-type") as UserType;

          if (userType) {
            await db
              .update(users)
              .set({ userType })
              .where(eq(users.id, user.id));
          }
        },
      },
    },
  },
});
