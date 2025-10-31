"use client"

import { useState } from "react"
import type { Id } from "../../../../../convex/_generated/dataModel"
import { CornerDetails } from "./corner-details"
import { CornersList } from "./corners-list"
import { CornerMarker } from "./cornerMarker"

interface Corner {
  _id: Id<"corners">
  cornerNumber: number
  name: string
  targetTime: number
  targetSpeed: number
  targetGear: number
  youtubeUrl?: string
  positionX: number
  positionY: number
}

interface TrackViewerProps {
  trackId: string
  corners: Corner[]
  mapImageUrl?: string
}

export function TrackViewer({ trackId, corners, mapImageUrl }: TrackViewerProps) {
  const [selectedCorner, setSelectedCorner] = useState<Corner | null>(null)

  return (
    <div className="grid  grid-cols-1 lg:grid-cols-3 gap-6 ">
      {/* Track Map */}
      <div className="lg:col-span-2 p-12 bg-zinc-950 border  border-red-600/30 rounded-lg">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="text-3xl font-bold text-red-500 tracking-tight">秋名山</h2>
            <p className="text-sm text-zinc-400 tracking-wider">AKINA DOWNHILL</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Mt. Akina</div>
            <div className="text-lg font-mono text-red-400">峠</div>
          </div>
        </div>
        <div
          className="relative w-full bg-black rounded-lg overflow-hidden border-2 border-red-600/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          style={{ aspectRatio: "8 / 8" }}
        >
          {/* Gradient overlay for depth effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-black/40 pointer-events-none z-10" />

          {mapImageUrl ? (
            <div className="w-full h-full p-8 md:p-12 flex items-center justify-center">
              <img
                src={mapImageUrl || "/placeholder.svg"}
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

          {corners.map((corner) => (
            <CornerMarker
              key={corner._id}
              corner={corner}
              isSelected={selectedCorner?._id === corner._id}
              onClick={() => setSelectedCorner(corner)}
              showTooltip={true}
            />
          ))}
        </div>
      </div>

      {/* Corner Details or List */}
      <div className="lg:col-span-1">
        {selectedCorner ? (
          <CornerDetails corner={selectedCorner} onClose={() => setSelectedCorner(null)} />
        ) : (
          <CornersList corners={corners} onSelectCorner={(corner) => setSelectedCorner(corner as Corner)} />
        )}
      </div>
    </div>
  )
}
