import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

tarefas: defineTable({
  assunto: v.string(),
  finalizada: v.boolean(),
  prioridade: v.string(),
  prazo: v.optional(v.string()),
 }),
});