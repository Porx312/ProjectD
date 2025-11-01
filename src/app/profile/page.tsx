"use client"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { api } from "../../../convex/_generated/api"
import NavigationHeader from "@/components/NavigationHeader"
import ProfileHeader from "./_components/ProfileHeader"
import ProfileHeaderSkeleton from "./_components/ProfileHeaderSkeleton"
import { Clock, Flag, MapPin, Timer, Trophy, TrendingUp, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const TABS = [
  {
    id: "times",
    label: "My Times",
    icon: Timer,
  },
  {
    id: "tracks",
    label: "My Tracks",
    icon: Flag,
  },
  {
    id: "saved",
    label: "Saved Tracks",
    icon: Trophy,
  },
]

function ProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"times" | "tracks" | "saved">("times")

  const userTimesWithDetails = useQuery(api.userTimes.listByUserWithDetails, {
    userId: user?.id ?? "",
  })

  const userTracks = useQuery(api.tracks.list, {
    userId: user?.id ?? "",
  })

  const savedTracks = useQuery(api.tracks.getSavedTracks)

  const userData = useQuery(api.users.getUser, { userId: user?.id ?? "" })

  if (!user && isLoaded) return router.push("/")

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Profile Header */}
        {userData && <ProfileHeader userData={userData} user={user!} userTimes={userTimesWithDetails ?? []} />}

        {!isLoaded && <ProfileHeaderSkeleton />}

        {/* Main content */}
        <div
          className="bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-3xl shadow-2xl 
        shadow-black/50 border border-gray-800/50 backdrop-blur-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-800/50">
            <div className="flex space-x-1 p-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "times" | "tracks" | "saved")}
                  className={`group flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden ${
                    activeTab === tab.id ? "text-blue-400" : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-500/10 rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {tab.icon && <tab.icon className="w-4 h-4 relative z-10" />}
                  <span className="text-sm font-medium relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {/* ACTIVE TAB IS TIMES: */}
              {activeTab === "times" && (
                <div className="space-y-6">
                  {userTimesWithDetails && userTimesWithDetails.length > 0 ? (
                    userTimesWithDetails.map((time) => (
                      <Link key={time._id} href={`/your-tracks/${time.track._id}`}>
                        <div className="group rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/50 border border-gray-800/50 bg-black/30 cursor-pointer">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                                  <Timer className="w-10 h-10 text-blue-400 relative z-10" />
                                </div>
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-white">{time.userTime.toFixed(3)}s</span>
                                    {time.userTime <= time.corner.targetTime && (
                                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        Target achieved!
                                      </span>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Flag className="w-4 h-4 text-blue-400" />
                                      <span className="text-sm font-medium text-white">{time.track.name}</span>
                                      <span className="text-xs text-gray-500">•</span>
                                      <MapPin className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-400">{time.track.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-400">
                                        Corner {time.corner.cornerNumber}: {time.corner.name}
                                      </span>
                                      <span className="text-xs text-gray-500">•</span>
                                      <span className="text-xs text-gray-500">
                                        Target: {time.corner.targetTime.toFixed(3)}s
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium">
                                  {time.track.carModel}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(time._creationTime).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {time.notes && (
                              <div className="mt-4 p-4 rounded-lg bg-black/40 border border-gray-800/30">
                                <h4 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">
                                  Notes
                                </h4>
                                <p className="text-sm text-gray-300">{time.notes}</p>
                              </div>
                            )}

                            {/* Performance indicator */}
                            <div className="mt-4 pt-4 border-t border-gray-800/50">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Performance vs Target</span>
                                <div className="flex items-center gap-2">
                                  {time.userTime <= time.corner.targetTime ? (
                                    <>
                                      <TrendingUp className="w-4 h-4 text-green-400" />
                                      <span className="text-sm font-medium text-green-400">
                                        {((time.corner.targetTime - time.userTime) * 1000).toFixed(0)}ms faster
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <TrendingUp className="w-4 h-4 text-orange-400 rotate-180" />
                                      <span className="text-sm font-medium text-orange-400">
                                        {((time.userTime - time.corner.targetTime) * 1000).toFixed(0)}ms slower
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Timer className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">No times recorded yet</h3>
                      <p className="text-gray-500">Start tracking your lap times on the track!</p>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVE TAB IS TRACKS: */}
              {activeTab === "tracks" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userTracks && userTracks.length > 0 ? (
                    userTracks.map((track) => (
                      <Link key={track._id} href={`/your-tracks/${track._id}`}>
                        <div
                          className="group relative bg-black/20 rounded-xl border border-gray-800/50 hover:border-gray-700/50 
                          transition-all duration-300 overflow-hidden h-full group-hover:transform
                        group-hover:scale-[1.02]"
                        >
                          {track.mapImageUrl && (
                            <div className="relative h-48 w-full overflow-hidden">
                              <Image
                                src={track.mapImageUrl || "/placeholder.svg"}
                                alt={track.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            </div>
                          )}
                          <div className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                              {track.name}
                            </h2>
                            <div className="space-y-2 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{track.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Flag className="w-4 h-4" />
                                <span>{track.lengthKm} km</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                                  {track.carModel}
                                </span>
                                <span className="text-xs text-gray-500">{track.cornerCount || 0} corners</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Flag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">No tracks created yet</h3>
                      <p className="text-gray-500">Create your first track to start tracking times!</p>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVE TAB IS SAVED: */}
              {activeTab === "saved" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedTracks && savedTracks.length > 0 ? (
                    savedTracks.map((track) => (
                      <Link key={track._id} href={`/your-tracks/${track._id}`}>
                        <div
                          className="group relative bg-black/20 rounded-xl border border-gray-800/50 hover:border-gray-700/50 
                          transition-all duration-300 overflow-hidden h-full group-hover:transform
                        group-hover:scale-[1.02]"
                        >
                          {track.mapImageUrl && (
                            <div className="relative h-48 w-full overflow-hidden">
                              <Image
                                src={track.mapImageUrl || "/placeholder.svg"}
                                alt={track.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            </div>
                          )}
                          <div className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                              {track.name}
                            </h2>
                            <div className="space-y-2 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{track.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Flag className="w-4 h-4" />
                                <span>{track.lengthKm} km</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                                  {track.carModel}
                                </span>
                                <span className="text-xs text-gray-500">by {track.userName}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">No saved tracks yet</h3>
                      <p className="text-gray-500">Explore and save tracks from other users!</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
export default ProfilePage
