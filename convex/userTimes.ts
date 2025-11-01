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

export const listByUserWithDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userTimes = await ctx.db
      .query("userTimes")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    const timesWithDetails = await Promise.all(
      userTimes.map(async (time) => {
        const corner = await ctx.db.get(time.cornerId)
        if (!corner) return null

        const track = await ctx.db.get(corner.trackId)
        if (!track) return null

        return {
          ...time,
          corner: {
            _id: corner._id,
            name: corner.name,
            cornerNumber: corner.cornerNumber,
            targetTime: corner.targetTime,
          },
          track: {
            _id: track._id,
            name: track.name,
            location: track.location,
            carModel: track.carModel,
          },
        }
      }),
    )

    return timesWithDetails.filter((time) => time !== null)
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
