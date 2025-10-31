"use client"

import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import type { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"

interface Corner {
  _id: Id<"corners">
  cornerNumber: number
  name: string
  targetTime: number
  targetSpeed: number
  targetGear: number
}

interface CornersListProps {
  corners: Corner[]
  onSelectCorner: (corner: Corner) => void
}

export function CornersList({ corners, onSelectCorner }: CornersListProps) {
  const { user } = useUser()
  const allUserTimes = useQuery(api.userTimes.listByUser, user ? { userId: user.id } : "skip")

  return (
    <div className="h-full bg-zinc-900/50 border border-zinc-700 rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h3 className="text-lg font-semibold text-white">All Corners</h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[1000px] space-y-2">
        {corners.map((corner) => {
          const cornerTimes = allUserTimes?.filter((time) => time.cornerId === corner._id) || []
          const bestUserTime = cornerTimes.length > 0 ? Math.min(...cornerTimes.map((t) => t.userTime)) : null
          const difference = bestUserTime ? bestUserTime - corner.targetTime : null

          return (
            <button
              key={corner._id}
              onClick={() => onSelectCorner(corner)}
              className="w-full text-left p-4 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              <div className="flex items-start gap-3 w-full">
                {/* Corner Number Badge */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm flex-shrink-0">
                  {corner.cornerNumber}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="font-semibold text-white">{corner.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                    <Clock className="h-3 w-3" />
                    <span>{corner.targetTime}s</span>
                    <span>•</span>
                    <span>{corner.targetSpeed} km/h</span>
                    <span>•</span>
                    <span>Gear {corner.targetGear}</span>
                  </div>

                  {/* Time Difference */}
                  {difference !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      {difference > 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : difference < 0 ? (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      ) : (
                        <Minus className="h-3 w-3 text-zinc-500" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          difference > 0 ? "text-red-500" : difference < 0 ? "text-green-500" : "text-zinc-500"
                        }`}
                      >
                        {difference > 0 ? "+" : ""}
                        {difference.toFixed(2)}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
