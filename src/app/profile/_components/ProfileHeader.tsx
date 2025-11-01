"use client"

import { Activity, Flag, Timer, TrendingUp, Trophy, UserIcon, Zap, Target } from "lucide-react"
import { motion } from "framer-motion"
import type { Id } from "../../../../convex/_generated/dataModel"

type UserResource = {
  imageUrl?: string | null
}

interface ProfileHeaderProps {
  userData: {
    _id: Id<"users">
    _creationTime: number
    proSince?: number | undefined
    lemonSqueezyCustomerId?: string | undefined
    lemonSqueezyOrderId?: string | undefined
    name: string
    userId: string
    email: string
    isPro: boolean
  }
  user: UserResource
  userTimes: Array<{
    _id: Id<"userTimes">
    _creationTime: number
    cornerId: Id<"corners">
    userId: string
    userTime: number
    notes?: string
    corner: {
      _id: Id<"corners">
      name: string
      cornerNumber: number
      targetTime: number
    }
    track: {
      _id: Id<"tracks">
      name: string
      location: string
      carModel: string
    }
  }>
}

function ProfileHeader({ userData, user, userTimes }: ProfileHeaderProps) {
  const totalTimes = userTimes.length
  const bestTime = userTimes.length > 0 ? Math.min(...userTimes.map((t) => t.userTime)) : 0
  const avgTime = userTimes.length > 0 ? userTimes.reduce((sum, t) => sum + t.userTime, 0) / userTimes.length : 0
  const recentTimes = userTimes.filter((t) => Date.now() - t._creationTime < 24 * 60 * 60 * 1000).length

  const targetsAchieved = userTimes.filter((t) => t.userTime <= t.corner.targetTime).length
  const uniqueTracks = new Set(userTimes.map((t) => t.track._id)).size

  const STATS = [
    {
      label: "Total Times",
      value: totalTimes,
      icon: Timer,
      color: "from-blue-500 to-cyan-500",
      gradient: "group-hover:via-blue-400",
      description: "Recorded lap times",
      metric: {
        label: "Last 24h",
        value: recentTimes,
        icon: Activity,
      },
    },
    {
      label: "Best Time",
      value: bestTime > 0 ? `${bestTime.toFixed(3)}s` : "N/A",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      gradient: "group-hover:via-yellow-400",
      description: "Personal best",
      metric: {
        label: "Average",
        value: avgTime > 0 ? `${avgTime.toFixed(3)}s` : "N/A",
        icon: TrendingUp,
      },
    },
    {
      label: "Targets Hit",
      value: `${targetsAchieved}/${totalTimes}`,
      icon: Target,
      color: "from-green-500 to-emerald-500",
      gradient: "group-hover:via-green-400",
      description: "Times under target",
      metric: {
        label: "Unique tracks",
        value: uniqueTracks,
        icon: Flag,
      },
    },
  ]

  return (
    <div
      className="relative mb-8 bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-2xl p-8 border
     border-gray-800/50 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="relative flex items-center gap-8">
        <div className="relative group">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full 
          blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
          />
          <img
            src={user.imageUrl ?? undefined}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-800/50 relative z-10 group-hover:scale-105 transition-transform"
          />
          {userData.isPro && (
            <div
              className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 p-2
             rounded-full z-20 shadow-lg animate-pulse"
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
            {userData.isPro && (
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
                Pro Member
              </span>
            )}
          </div>
          <p className="text-gray-400 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            {userData.email}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {STATS.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="group relative bg-gradient-to-br from-black/40 to-black/20 rounded-2xl overflow-hidden"
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-all 
              duration-500 ${stat.gradient}`}
            />

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-400">{stat.description}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Additional metric */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                <stat.metric.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">{stat.metric.label}:</span>
                <span className="text-sm font-medium text-white">{stat.metric.value}</span>
              </div>
            </div>

            {/* Interactive hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
export default ProfileHeader
