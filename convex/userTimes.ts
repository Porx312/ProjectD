import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const listByCorner = query({
  args: {
    cornerId: v.id("corners"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userTimes")
      .withIndex("by_corner_and_user", (q) => q.eq("cornerId", args.cornerId).eq("userId", args.userId))
      .collect()
  },
})

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userTimes")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect()
  },
})

export const create = mutation({
  args: {
    cornerId: v.id("corners"),
    userId: v.string(),
    userTime: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userTimes", args)
  },
})

export const remove = mutation({
  args: { id: v.id("userTimes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
