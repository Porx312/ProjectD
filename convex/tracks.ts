import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const update = mutation({
  args: {
    id: v.id("tracks"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    carModel: v.optional(v.string()),
    lengthKm: v.optional(v.number()),
    mapImageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const track = await ctx.db.get(args.id)
    if (!track) throw new Error("Track not found")
    if (track.userId !== identity.subject) throw new Error("Unauthorized")

    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const track = await ctx.db.get(args.id)
    if (!track) throw new Error("Track not found")
    if (track.userId !== identity.subject) throw new Error("Unauthorized")

    await ctx.db.delete(args.id)
  },
})

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl()
})

export const create = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    carModel: v.string(),
    lengthKm: v.number(),
    mapImageId: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const userName = identity?.name || identity?.nickname || "Unknown User"

    const trackId = await ctx.db.insert("tracks", {
      name: args.name,
      location: args.location,
      carModel: args.carModel,
      lengthKm: args.lengthKm,
      mapImageId: args.mapImageId,
      userId: args.userId,
      userName: userName,
      createdAt: Date.now(),
    })
    return trackId
  },
})

export const get = query({
  args: { id: v.id("tracks") },
  handler: async (ctx, args) => {
    const track = await ctx.db.get(args.id)
    if (!track) return null

    let mapImageUrl: string | undefined
    if (track.mapImageId) {
      const url = await ctx.storage.getUrl(track.mapImageId as any)
      mapImageUrl = url ?? undefined
    }

    const corners = await ctx.db
      .query("corners")
      .withIndex("by_track", (q) => q.eq("trackId", args.id))
      .collect()

    return {
      ...track,
      mapImageUrl,
      corners,
    }
  },
})

// En tu archivo convex/tracks.ts
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    const tracksWithDetails = await Promise.all(
      tracks.map(async (track) => {
        let mapImageUrl: string | undefined
        if (track.mapImageId) {
          const url = await ctx.storage.getUrl(track.mapImageId as any)
          mapImageUrl = url ?? undefined
        }

        // Obtener corners para este track
        const corners = await ctx.db
          .query("corners")
          .withIndex("by_track", (q) => q.eq("trackId", track._id))
          .collect()

        return {
          ...track,
          mapImageUrl,
          corners, // Agregar corners al objeto
          cornerCount: corners.length, // Contar corners para mostrar
        }
      }),
    )

    return tracksWithDetails
  },
})

// Get all tracks with star and comment counts
export const getAllTracks = query({
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").order("desc").collect()

    const tracksWithDetails = await Promise.all(
      tracks.map(async (track) => {
        const starCount = await ctx.db
          .query("trackStars")
          .withIndex("by_track_id", (q) => q.eq("trackId", track._id))
          .collect()

        const commentCount = await ctx.db
          .query("trackComments")
          .withIndex("by_track_id", (q) => q.eq("trackId", track._id))
          .collect()

        let mapImageUrl: string | undefined
        if (track.mapImageId) {
          const url = await ctx.storage.getUrl(track.mapImageId as any)
          mapImageUrl = url ?? undefined
        }

        return {
          ...track,
          starCount: starCount.length,
          commentCount: commentCount.length,
          mapImageUrl,
          userName: track.userName,
        }
      }),
    )

    return tracksWithDetails
  },
})

// Star/Unstar track
export const starTrack = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const existingStar = await ctx.db
      .query("trackStars")
      .withIndex("by_user_id_and_track_id", (q) => q.eq("userId", identity.subject).eq("trackId", args.trackId))
      .first()

    if (existingStar) {
      await ctx.db.delete(existingStar._id)
      return { isStarred: false }
    } else {
      await ctx.db.insert("trackStars", {
        userId: identity.subject,
        trackId: args.trackId,
      })
      return { isStarred: true }
    }
  },
})

// Check if user starred track
export const isTrackStarred = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return false

    const star = await ctx.db
      .query("trackStars")
      .withIndex("by_user_id_and_track_id", (q) => q.eq("userId", identity.subject).eq("trackId", args.trackId))
      .first()

    return !!star
  },
})

// Get star count
export const getStarCount = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const stars = await ctx.db
      .query("trackStars")
      .withIndex("by_track_id", (q) => q.eq("trackId", args.trackId))
      .collect()

    return stars.length
  },
})

// Add comment
export const addComment = mutation({
  args: {
    trackId: v.id("tracks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const userName = identity.name || identity.nickname || "Unknown User"

    await ctx.db.insert("trackComments", {
      trackId: args.trackId,
      userId: identity.subject,
      userName: userName,
      content: args.content,
    })
  },
})

// Get comments
export const getComments = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("trackComments")
      .withIndex("by_track_id", (q) => q.eq("trackId", args.trackId))
      .order("desc")
      .collect()

    return comments
  },
})

// Delete comment
export const deleteComment = mutation({
  args: { commentId: v.id("trackComments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const comment = await ctx.db.get(args.commentId)
    if (!comment) throw new Error("Comment not found")
    if (comment.userId !== identity.subject) throw new Error("Unauthorized")

    await ctx.db.delete(args.commentId)
  },
})

export const saveTrack = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const track = await ctx.db.get(args.trackId)
    if (!track) throw new Error("Track not found")

    // Check if user is trying to save their own track
    if (track.userId === identity.subject) {
      throw new Error("You cannot save your own track")
    }

    // Check if already saved
    const existingSave = await ctx.db
      .query("savedTracks")
      .withIndex("by_user_and_track", (q) => q.eq("userId", identity.subject).eq("trackId", args.trackId))
      .first()

    if (existingSave) {
      throw new Error("Track already saved")
    }

    await ctx.db.insert("savedTracks", {
      userId: identity.subject,
      trackId: args.trackId,
      savedAt: Date.now(),
    })

    return { success: true }
  },
})

export const unsaveTrack = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const savedTrack = await ctx.db
      .query("savedTracks")
      .withIndex("by_user_and_track", (q) => q.eq("userId", identity.subject).eq("trackId", args.trackId))
      .first()

    if (!savedTrack) {
      throw new Error("Track not saved")
    }

    await ctx.db.delete(savedTrack._id)
    return { success: true }
  },
})

export const isTrackSaved = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return false

    const savedTrack = await ctx.db
      .query("savedTracks")
      .withIndex("by_user_and_track", (q) => q.eq("userId", identity.subject).eq("trackId", args.trackId))
      .first()

    return !!savedTrack
  },
})

export const getSavedTracks = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const savedTracks = await ctx.db
      .query("savedTracks")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect()

    const tracksWithDetails = await Promise.all(
      savedTracks.map(async (savedTrack) => {
        const track = await ctx.db.get(savedTrack.trackId)
        if (!track) return null

        const starCount = await ctx.db
          .query("trackStars")
          .withIndex("by_track_id", (q) => q.eq("trackId", track._id))
          .collect()

        const commentCount = await ctx.db
          .query("trackComments")
          .withIndex("by_track_id", (q) => q.eq("trackId", track._id))
          .collect()

        let mapImageUrl: string | undefined
        if (track.mapImageId) {
          const url = await ctx.storage.getUrl(track.mapImageId as any)
          mapImageUrl = url ?? undefined
        }

        return {
          ...track,
          starCount: starCount.length,
          commentCount: commentCount.length,
          mapImageUrl,
          savedAt: savedTrack.savedAt,
        }
      }),
    )

    return tracksWithDetails.filter((track) => track !== null)
  },
})
