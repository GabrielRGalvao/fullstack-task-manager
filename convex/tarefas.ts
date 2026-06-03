import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tarefas")
      .order("desc")
      .collect();
  },
});

export const adicionar = mutation({
  args: {
    assunto: v.string(),
    prioridade: v.string(),
    prazo: v.string(),
  },
  handler: async (ctx, args) => {
    const prazoFinal = args.prazo.trim() === "" ? "Sem prazo" : args.prazo;
    await ctx.db.insert("tarefas", {
      assunto: args.assunto,
      prioridade: args.prioridade,
      finalizada: false,
      prazo: prazoFinal,
    });
  },
});

export const alternarStatus = mutation({
  args: { 
    id: v.id("tarefas"), 
    atual: v.boolean() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      finalizada: !args.atual 
    });
  },
});

export const remover = mutation({
  args: { 
    id: v.id("tarefas") 
  },
  handler: async (ctx, args) => {
    const tarefaExistente = await ctx.db.get(args.id);
    
    if (tarefaExistente) {
      await ctx.db.delete(args.id);
    }
  },
});