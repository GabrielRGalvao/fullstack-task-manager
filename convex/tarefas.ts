import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// busca todas as tarefas
export const listar = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tarefas").collect();
    },
});

// adiciona uma nova tarefa
export const adicionar = mutation({
    args: {
        assunto: v.string(),
        prioridade: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("tarefas", {
            assunto: args.assunto,
            prioridade: args.prioridade,
            finalizada: false, // todas as tarefas começam como não finalizadas.
        });
    },
});

// marca como concluída ou desmarcar 
export const alternarStatus = mutation({
    args: { id: v.id("tarefas"), atual: v.boolean() },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.id, {
        finalizada: !args.atual, // Inverte o valor booleano
      });
    },
  });

  // remove uma tarefa do banco
export const remover = mutation({
    args: { id: v.id("tarefas") }, // usamos o ID para saber qual apagar
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    },
  });