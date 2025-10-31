import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const listByTrack = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("corners")
      .withIndex("by_track", (q) => q.eq("trackId", args.trackId))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("corners") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: {
    trackId: v.id("tracks"),
    cornerNumber: v.number(),
    name: v.string(),
    targetTime: v.number(),
    targetSpeed: v.number(),
    targetGear: v.number(),
    youtubeUrl: v.optional(v.string()),
    positionX: v.number(),
    positionY: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("corners", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("corners"),
    cornerNumber: v.optional(v.number()),
    name: v.optional(v.string()),
    targetTime: v.optional(v.number()),
    targetSpeed: v.optional(v.number()),
    targetGear: v.optional(v.number()),
    youtubeUrl: v.optional(v.string()),
    positionX: v.optional(v.number()),
    positionY: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("corners") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
