import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { proposals, services, users } from ".";

export const serviceOrders = pgTable("service_orders", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  brand: text("brand").notNull(),
  warrantyStatus: text("warranty_status").notNull(),
  serviceType: text("service_type").notNull(),
  issueType: text("issue_type").notNull(),
  urgency: text("urgency").notNull(),
  notes: text("notes"),
  postalCode: text("postal_code").notNull(),
  status: text("status", { enum: ["opened", "closed"] })
    .default("opened")
    .notNull(),

  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const serviceOrdersRelations = relations(
  serviceOrders,
  ({ one, many }) => ({
    service: one(services, {
      fields: [serviceOrders.serviceId],
      references: [services.id],
    }),
    customer: one(users, {
      fields: [serviceOrders.customerId],
      references: [users.id],
    }),
    proposals: many(proposals),
  }),
);
