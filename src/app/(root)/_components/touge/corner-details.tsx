"use client"

import type React from "react"
import { useState } from "react"
import { X, Clock, Gauge, Settings, Plus, Trash2, ExternalLink } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
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
  youtubeUrl?: string
}

interface CornerDetailsProps {
  corner: Corner
  onClose: () => void
}

export function CornerDetails({ corner, onClose }: CornerDetailsProps) {
  const { user } = useUser()
  const [userTime, setUserTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userTimes = useQuery(api.userTimes.listByCorner, user ? { cornerId: corner._id, userId: user.id } : "skip")
  const createUserTime = useMutation(api.userTimes.create)
  const deleteUserTime = useMutation(api.userTimes.remove)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      await createUserTime({
        cornerId: corner._id,
        userId: user.id,
        userTime: Number.parseFloat(userTime),
        notes: notes || undefined,
      })

      setUserTime("")
      setNotes("")
    } catch (error) {
      console.error("[v0] Error saving time:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (timeId: Id<"userTimes">) => {
    try {
      await deleteUserTime({ id: timeId })
    } catch (error) {
      console.error("[v0] Error deleting time:", error)
    }
  }

  const bestUserTime = userTimes && userTimes.length > 0 ? Math.min(...userTimes.map((t) => t.userTime)) : null
  const timeDifference = bestUserTime ? (bestUserTime - corner.targetTime).toFixed(2) : null

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/)
    if (!videoIdMatch) return null

    const videoId = videoIdMatch[1]
    let startTime = 0

    // Parse timestamp from URL - supports multiple formats
    // Format 1: t=1h2m3s or t=2m30s or t=45s
    const timeParamMatch = url.match(/[?&]t=([^&]+)/)
    if (timeParamMatch) {
      const timeStr = timeParamMatch[1]

      // Parse hours, minutes, seconds
      const hoursMatch = timeStr.match(/(\d+)h/)
      const minutesMatch = timeStr.match(/(\d+)m/)
      const secondsMatch = timeStr.match(/(\d+)s?$/)

      const hours = hoursMatch ? Number.parseInt(hoursMatch[1]) : 0
      const minutes = minutesMatch ? Number.parseInt(minutesMatch[1]) : 0
      const seconds = secondsMatch ? Number.parseInt(secondsMatch[1]) : 0

      startTime = hours * 3600 + minutes * 60 + seconds
    }

    // Format 2: start=123 (already in seconds)
    const startParamMatch = url.match(/[?&]start=(\d+)/)
    if (startParamMatch) {
      startTime = Number.parseInt(startParamMatch[1])
    }

    // Build embed URL with start parameter
    return `https://www.youtube.com/embed/${videoId}?start=${startTime}&rel=0&modestbranding=1`
  }

  const youtubeEmbedUrl = corner.youtubeUrl ? getYouTubeEmbedUrl(corner.youtubeUrl) : null

  return (
    <div className="h-full bg-zinc-900/30 border border-zinc-800 rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-zinc-100">Corner {corner.cornerNumber}</h3>
          <p className="text-zinc-400 mt-1">{corner.name}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Target Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <Clock className="h-5 w-5 mb-2 text-red-400" />
            <span className="text-2xl font-bold text-zinc-100">{corner.targetTime}s</span>
            <span className="text-xs text-zinc-400">Target</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <Gauge className="h-5 w-5 mb-2 text-red-400" />
            <span className="text-2xl font-bold text-zinc-100">{corner.targetSpeed}</span>
            <span className="text-xs text-zinc-400">km/h</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <Settings className="h-5 w-5 mb-2 text-red-400" />
            <span className="text-2xl font-bold text-zinc-100">{corner.targetGear}</span>
            <span className="text-xs text-zinc-400">Gear</span>
          </div>
        </div>

        {/* Best Time Comparison */}
        {bestUserTime && (
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-200">Your Best Time</span>
              <span className="text-2xl font-bold text-zinc-100">{bestUserTime}s</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-zinc-400">Difference</span>
              <span
                className={
                  Number.parseFloat(timeDifference!) > 0 ? "text-red-400 font-semibold" : "text-green-400 font-semibold"
                }
              >
                {Number.parseFloat(timeDifference!) > 0 ? "+" : ""}
                {timeDifference}s
              </span>
            </div>
          </div>
        )}

        {/* YouTube Video */}
        {youtubeEmbedUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">Reference Video</h3>
              <a
                href={corner.youtubeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                Open in YouTube
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-700">
              <iframe
                src={youtubeEmbedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Add Time Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="time" className="block text-sm font-medium text-zinc-200">
              Your Time (seconds)
            </label>
            <input
              id="time"
              type="number"
              step="0.01"
              placeholder="8.50"
              value={userTime}
              onChange={(e) => setUserTime(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-200">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              placeholder="Add notes about your run..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Add Time"}
          </button>
        </form>

        {/* Previous Times */}
        {userTimes && userTimes.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-zinc-200">Previous Times</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userTimes
                .sort((a, b) => b._creationTime - a._creationTime)
                .map((time) => (
                  <div
                    key={time._id}
                    className="flex items-start justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">{time.userTime}s</span>
                        <span className="text-xs text-zinc-400">
                          {new Date(time._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                      {time.notes && <p className="text-sm text-zinc-400 mt-1">{time.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(time._id)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                      aria-label="Delete time"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
