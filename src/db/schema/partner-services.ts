import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { services, users } from ".";

export const partnerServices = pgTable("partner_services", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  partnerId: text("partner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partnerServicesRelations = relations(
  partnerServices,
  ({ one }) => ({
    partner: one(users, {
      fields: [partnerServices.partnerId],
      references: [users.id],
    }),
    service: one(services, {
      fields: [partnerServices.serviceId],
      references: [services.id],
    }),
  }),
);
