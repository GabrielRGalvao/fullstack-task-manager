import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // tabela 'perfil'
  perfil: defineTable({
    nome: v.string(),
    cargo: v.string(),
    pontos: v.number(),
  }),

// tabela de tarefas
tarefas: defineTable({
  assunto: v.string(),
  finalizada: v.boolean(),
  prioridade: v.string(),
 }),
});