"use client"

import { useQuery, useMutation } from "convex/react"
import { useParams } from "next/navigation"
import { Clock, MapPin, Car, Ruler, MessageSquare, User, Bookmark, BookmarkCheck } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import Comments from "./_components/Comments"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"
import { CornerMarker } from "../../_components/touge/cornerMarker"

function TrackDetailPage() {
  const trackId = useParams().id
  const { user } = useUser()
  const [isSaving, setIsSaving] = useState(false)

  const track = useQuery(api.tracks.get, { id: trackId as Id<"tracks"> })
    const corners = useQuery(api.corners.listByTrack, { trackId: trackId as Id<"tracks"> })
  const comments = useQuery(api.tracks.getComments, { trackId: trackId as Id<"tracks"> })
  const isTrackSaved = useQuery(api.tracks.isTrackSaved, { trackId: trackId as Id<"tracks"> })

  const saveTrack = useMutation(api.tracks.saveTrack)
  const unsaveTrack = useMutation(api.tracks.unsaveTrack)

  console.log("[v0] Track data:", track)
  console.log("[v0] Comments data:", comments)

  const handleSaveTrack = async () => {
    if (!user || !track) return

    setIsSaving(true)
    try {
      if (isTrackSaved) {
        await unsaveTrack({ trackId: track._id })
      } else {
        await saveTrack({ trackId: track._id })
      }
    } catch (error) {
      console.error("[v0] Error saving/unsaving track:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (track === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Track not found</div>
      </div>
    )
  }

  const isOwner = user?.id === track.userId

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,500px] gap-6 lg:gap-8">
            {/* Left Column - Track Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2.5">
                      <MapPin className="w-full h-full text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">{track.name}</h1>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-[#8b8b8d]">
                          <User className="w-4 h-4" />
                          <span>{track.userName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8b8b8d]">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(track.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8b8b8d]">
                          <MessageSquare className="w-4 h-4" />
                          <span>{comments?.length || 0} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {user && !isOwner && (
                    <button
                      onClick={handleSaveTrack}
                      disabled={isSaving}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isTrackSaved
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-[#ffffff08] text-white hover:bg-[#ffffff0a]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isTrackSaved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Save Track</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Track Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#ffffff08] rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-xs text-gray-400">Location</div>
                      <div className="text-white font-medium">{track.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#ffffff08] rounded-lg">
                    <Car className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-xs text-gray-400">Car Model</div>
                      <div className="text-white font-medium">{track.carModel}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#ffffff08] rounded-lg">
                    <Ruler className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-xs text-gray-400">Length</div>
                      <div className="text-white font-medium">{track.lengthKm} km</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Image */}
        <div
                       className="relative w-full bg-black rounded-lg overflow-hidden border-2 border-red-600/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                       style={{ aspectRatio: "8 / 8", }}
                       
                     >
                       {/* Gradient overlay for depth effect */}
                       <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-black/40 pointer-events-none z-10" />
             
                       {track.mapImageUrl ? (
                         <div className="w-full h-full p-8 md:p-12 flex items-center justify-center">
                           <img
                             src={track.mapImageUrl || "/placeholder.svg"}
                             alt="Track map"
                             className="max-w-full max-h-full object-contain"
                             style={{ filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))" }}
                           />
                         </div>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-zinc-500">
                           <p>No track map available</p>
                         </div>
                       )}
             {(corners ?? []).map((corner) => (
               <CornerMarker
                 key={corner._id}
                 corner={corner}
                 showTooltip={true}
               />
             ))}
                     </div>

              {/* Corners Section */}
              {track.corners && track.corners.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
                  <div className="px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
                    <h2 className="text-lg font-semibold text-white">Corners ({track.corners.length})</h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {track.corners.map((corner) => (
                      <div
                        key={corner._id}
                        className="p-4 bg-[#ffffff08] rounded-lg hover:bg-[#ffffff0a] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">
                            Corner {corner.cornerNumber}: {corner.name}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <div>Target Time: {corner.targetTime}s</div>
                          <div>Target Speed: {corner.targetSpeed} km/h</div>
                          <div>Target Gear: {corner.targetGear}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="lg:hidden">
                <Comments trackId={track._id} />
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-6">
                <Comments trackId={track._id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TrackDetailPage


        