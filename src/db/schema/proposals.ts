import { relations } from "drizzle-orm";
import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { serviceOrders, users } from ".";

export const proposals = pgTable("proposals", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  initialValue: decimal("price", { precision: 10, scale: 2 }).notNull(),
  estimatedTime: text("estimated_time").notNull(),
  comments: text("comments"),
  status: text("status", { enum: ["pending", "accepted", "rejected"] })
    .default("pending")
    .notNull(),

  serviceOrderId: uuid("service_order_id")
    .notNull()
    .references(() => serviceOrders.id, { onDelete: "cascade" }),
  partnerId: text("partner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const proposalsRelations = relations(proposals, ({ one }) => ({
  serviceOrder: one(serviceOrders, {
    fields: [proposals.serviceOrderId],
    references: [serviceOrders.id],
  }),
  partner: one(users, {
    fields: [proposals.partnerId],
    references: [users.id],
  }),
}));
