"use client"
import { useUser } from "@clerk/nextjs"
import type React from "react"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Clock, Trash2, MapPin, Car, Ruler, MessageSquare, Star } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"

interface Track {
  _id: Id<"tracks">
  _creationTime: number
  userId: string
  userName: string
  name: string
  location: string
  carModel: string
  lengthKm: number
  createdAt: number
  mapImageId?: string
  mapImageUrl?: string
  starCount: number
  commentCount: number
}

function TrackCard({ track }: { track: Track }) {
  const { user } = useUser()
  const deleteTrack = useMutation(api.tracks.remove)
  const [isDeleting, setIsDeleting] = useState(false)

  const isStarred = useQuery(api.tracks.isTrackStarred, { trackId: track._id })
  const starTrack = useMutation(api.tracks.starTrack)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this track?")) return

    setIsDeleting(true)

    try {
      await deleteTrack({ id: track._id })
      toast.success("Track deleted successfully")
    } catch (error) {
      console.log("Error deleting track:", error)
      toast.error("Error deleting track")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please sign in to star tracks")
      return
    }

    try {
      await starTrack({ trackId: track._id })
    } catch (error) {
      console.log("Error toggling star:", error)
      toast.error("Error updating star")
    }
  }

  return (
    <motion.div layout className="group relative" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={`/tracks/${track._id}`} className="h-full block">
        <div
          className="relative h-full bg-[#1e1e2e]/80 backdrop-blur-sm rounded-xl 
          border border-[#313244]/50 hover:border-[#313244] 
          transition-all duration-300 overflow-hidden"
        >
          {/* Map Image */}
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            {track.mapImageUrl ? (
              <Image
                src={track.mapImageUrl || "/placeholder.svg"}
                alt={track.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2e] to-transparent" />
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {track.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{track.location}</span>
                </div>
              </div>

              <div className="flex gap-2 items-center" onClick={(e) => e.preventDefault()}>
                {/* Star Button */}
                <button
                  onClick={handleToggleStar}
                  className={`group/star flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      isStarred
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/10 text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-400"
                    }
                  `}
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-current" : ""}`} />
                  <span className="text-xs font-medium">{track.starCount}</span>
                </button>

                {/* Delete Button */}
                {user?.id === track.userId && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete()
                    }}
                    disabled={isDeleting}
                    className={`group/delete flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                      ${
                        isDeleting
                          ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                          : "bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                      }
                    `}
                  >
                    {isDeleting ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Track Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Car className="w-4 h-4" />
                  <span>{track.carModel}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Ruler className="w-4 h-4" />
                  <span>{track.lengthKm} km</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>{track.commentCount} comments</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(track._creationTime).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
export default TrackCard
