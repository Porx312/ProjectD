import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // clerkId
    email: v.string(),
    name: v.string(),
    displayName: v.optional(v.string()),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    lemonSqueezyCustomerId: v.optional(v.string()),
    lemonSqueezyOrderId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  codeExecutions: defineTable({
    userId: v.string(),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  snippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    userName: v.string(), // store user's name for easy access
  }).index("by_user_id", ["userId"]),

  snippetComments: defineTable({
    snippetId: v.id("snippets"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(), // This will store HTML content
  }).index("by_snippet_id", ["snippetId"]),

  stars: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),
       tracks: defineTable({
    userId: v.string(),
    userName: v.string(), // store user's name for easy access
    name: v.string(),
    location: v.string(),
    carModel: v.string(),
    lengthKm: v.number(),
    mapImageId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),
  corners: defineTable({
    trackId: v.id("tracks"),
    cornerNumber: v.number(),
    name: v.string(),
    targetTime: v.number(),
    targetSpeed: v.number(),
    targetGear: v.number(),
    youtubeUrl: v.optional(v.string()),
    positionX: v.number(),
    positionY: v.number(),
  }).index("by_track", ["trackId"]),

  savedTracks: defineTable({
    userId: v.string(), // User who saved the track
    trackId: v.id("tracks"), // Reference to the original track
    savedAt: v.number(), // Timestamp when saved
  })
    .index("by_user_id", ["userId"])
    .index("by_track_id", ["trackId"])
    .index("by_user_and_track", ["userId", "trackId"]),
  userTimes: defineTable({
    cornerId: v.id("corners"),
    userId: v.string(), // Clerk user ID
    userTime: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_corner", ["cornerId"])
    .index("by_user_id", ["userId"])
    .index("by_corner_and_user", ["cornerId", "userId"]),
      trackComments: defineTable({
    trackId: v.id("tracks"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(),
  }).index("by_track_id", ["trackId"]),

  trackStars: defineTable({
    userId: v.string(),
    trackId: v.id("tracks"),
  })
    .index("by_user_id", ["userId"])
    .index("by_track_id", ["trackId"])
    .index("by_user_id_and_track_id", ["userId", "trackId"]),
});
