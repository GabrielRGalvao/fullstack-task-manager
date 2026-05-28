import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // O sistema vai na tabela 'perfil' e pega oque encontrar
    return await ctx.db.query("perfil").collect();
  },
});

export const criar = mutation({
    args: { 
      nome: v.string(), 
      cargo: v.string(), 
      pontos: v.number() 
    },
    handler: async (ctx, args) => {
      // Insere os dados na tabela 'perfil'
      const id = await ctx.db.insert("perfil", {
        nome: args.nome,
        cargo: args.cargo,
        pontos: args.pontos,
      });
      return id;
    },
  });