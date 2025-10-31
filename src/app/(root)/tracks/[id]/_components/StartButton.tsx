"use client"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { Star } from "lucide-react"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"

function StarButton({ trackId }: { trackId: Id<"tracks"> }) {
  const { user } = useUser()
  const starTrack = useMutation(api.tracks.starTrack)
  const isStarred = useQuery(api.tracks.isTrackStarred, { trackId })
  const starCount = useQuery(api.tracks.getStarCount, { trackId })

  const handleStar = async () => {
    if (!user) return
    await starTrack({ trackId })
  }

  return (
    <button
      onClick={handleStar}
      disabled={!user}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
        ${
          isStarred
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-gray-500/10 text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400"
        }
        ${!user && "cursor-not-allowed opacity-50"}
      `}
    >
      <Star className={`size-3.5 ${isStarred ? "fill-yellow-400" : ""}`} />
      <span className="text-sm font-medium">{starCount || 0}</span>
    </button>
  )
}

export default StarButton
