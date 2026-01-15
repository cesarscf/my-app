import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from ".";

export const partnerDetails = pgTable("partner_details", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  postalCode: text("postal_code").notNull(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const partnerDetailsRelations = relations(partnerDetails, ({ one }) => ({
  user: one(users, {
    fields: [partnerDetails.userId],
    references: [users.id],
  }),
}));
