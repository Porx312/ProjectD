"use client"

import type React from "react"
import { useMutation, useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import {  useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { MousePointer2, Lock } from "lucide-react"
import { CornerMarker } from "./cornerMarker"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"

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

export default function NewCornerPage() {
  const { user } = useUser()
  const params = useParams()
  const trackId = params.id as string
  const [cornerNumber, setCornerNumber] = useState("")
  const [name, setName] = useState("")
  const [targetTime, setTargetTime] = useState("")
  const [targetSpeed, setTargetSpeed] = useState("")
  const [targetGear, setTargetGear] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [positionX, setPositionX] = useState("")
  const [positionY, setPositionY] = useState("")
  const [isSelectingPosition, setIsSelectingPosition] = useState(false)
  const [editingCorner, setEditingCorner] = useState<Id<"corners"> | null>(null)
  const [hoveredCorner, setHoveredCorner] = useState<Id<"corners"> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const track = useQuery(api.tracks.get, { id: trackId as Id<"tracks"> })
  const existingCorners = useQuery(api.corners.listByTrack, { trackId: trackId as Id<"tracks"> })
  const isTrackSaved = useQuery(api.tracks.isTrackSaved, user && track ? { trackId: trackId as Id<"tracks"> } : "skip")

  const createCorner = useMutation(api.corners.create)
  const updateCorner = useMutation(api.corners.update)
  const deleteCorner = useMutation(api.corners.remove)

  const isOwner = user && track ? track.userId === user.id : false
  const canEdit = isOwner

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingPosition || !canEdit) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPositionX(x.toFixed(1))
    setPositionY(y.toFixed(1))
    setIsSelectingPosition(false)
  }

  const handleCornerClick = (corner: Corner, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSelectingPosition || !canEdit) return

    setEditingCorner(corner._id)
    setCornerNumber(corner.cornerNumber.toString())
    setName(corner.name)
    setTargetTime(corner.targetTime.toString())
    setTargetSpeed(corner.targetSpeed.toString())
    setTargetGear(corner.targetGear.toString())
    setYoutubeUrl(corner.youtubeUrl || "")
    setPositionX(corner.positionX.toString())
    setPositionY(corner.positionY.toString())
  }

  const handleDeleteCorner = async (cornerId: Id<"corners">, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit) return
    if (!confirm("Are you sure you want to delete this corner?")) return

    try {
      await deleteCorner({ id: cornerId })
      if (editingCorner === cornerId) {
        handleCancelEdit()
      }
    } catch (error) {
      console.error("[v0] Error deleting corner:", error)
      setError("Failed to delete corner")
    }
  }

  const handleCancelEdit = () => {
    setEditingCorner(null)
    setCornerNumber("")
    setName("")
    setTargetTime("")
    setTargetSpeed("")
    setTargetGear("")
    setYoutubeUrl("")
    setPositionX("")
    setPositionY("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !canEdit) return

    setIsLoading(true)
    setError(null)

    try {
      if (editingCorner) {
        await updateCorner({
          id: editingCorner,
          cornerNumber: Number.parseInt(cornerNumber),
          name,
          targetTime: Number.parseFloat(targetTime),
          targetSpeed: Number.parseInt(targetSpeed),
          targetGear: Number.parseInt(targetGear),
          youtubeUrl: youtubeUrl || undefined,
          positionX: Number.parseFloat(positionX),
          positionY: Number.parseFloat(positionY),
        })
        handleCancelEdit()
      } else {
        await createCorner({
          trackId: trackId as Id<"tracks">,
          cornerNumber: Number.parseInt(cornerNumber),
          name,
          targetTime: Number.parseFloat(targetTime),
          targetSpeed: Number.parseInt(targetSpeed),
          targetGear: Number.parseInt(targetGear),
          youtubeUrl: youtubeUrl || undefined,
          positionX: Number.parseFloat(positionX),
          positionY: Number.parseFloat(positionY),
        })

        setCornerNumber("")
        setName("")
        setTargetTime("")
        setTargetSpeed("")
        setTargetGear("")
        setYoutubeUrl("")
        setPositionX("")
        setPositionY("")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const mapImageUrl = track?.mapImageUrl

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-red-500 tracking-tight">峠 TOUGE</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href={`/your-tracks/${trackId}`} className="text-red-500 hover:text-red-400 text-sm">
            ← Back to Track
          </Link>
        </div>

        {!canEdit && isTrackSaved && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-500">Saved Track - View Only</h3>
              <p className="text-sm text-amber-200/80 mt-1">
                This is a saved track. You can view corners and add your own times, but you cannot edit or delete
                corners.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {canEdit ? (
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-bold text-zinc-100">{editingCorner ? "Edit Corner" : "Add New Corner"}</h2>
                <p className="text-zinc-400 mt-1">
                  {editingCorner ? "Update corner details" : "Add corner details and target times"}
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="cornerNumber" className="block text-sm font-medium text-zinc-200">
                        Corner Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cornerNumber"
                        type="number"
                        placeholder="1"
                        required
                        value={cornerNumber}
                        onChange={(e) => setCornerNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
                        Corner Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="First Hairpin"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="targetTime" className="block text-sm font-medium text-zinc-200">
                        Target Time (s) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="targetTime"
                        type="number"
                        step="0.01"
                        placeholder="8.50"
                        required
                        value={targetTime}
                        onChange={(e) => setTargetTime(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="targetSpeed" className="block text-sm font-medium text-zinc-200">
                        Speed (km/h) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="targetSpeed"
                        type="number"
                        placeholder="85"
                        required
                        value={targetSpeed}
                        onChange={(e) => setTargetSpeed(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="targetGear" className="block text-sm font-medium text-zinc-200">
                        Gear <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="targetGear"
                        type="number"
                        placeholder="3"
                        required
                        value={targetGear}
                        onChange={(e) => setTargetGear(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="youtubeUrl" className="block text-sm font-medium text-zinc-200">
                      YouTube URL (optional)
                    </label>
                    <input
                      id="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/watch?v=...&t=27s"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                    <p className="text-xs text-zinc-500">Add a reference video with timestamp (e.g., &t=27s)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-200">
                      Position on Track <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSelectingPosition(!isSelectingPosition)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        isSelectingPosition
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      <MousePointer2 className="h-4 w-4" />
                      {isSelectingPosition ? "Click on the map to select position" : "Click to select position on map"}
                    </button>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="X: 50"
                        required
                        value={positionX}
                        onChange={(e) => setPositionX(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        readOnly={isSelectingPosition}
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Y: 50"
                        required
                        value={positionY}
                        onChange={(e) => setPositionY(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        readOnly={isSelectingPosition}
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      {positionX && positionY
                        ? `Selected: ${positionX}%, ${positionY}%`
                        : "Click the button and then click on the map"}
                    </p>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                      {isLoading
                        ? editingCorner
                          ? "Updating..."
                          : "Creating..."
                        : editingCorner
                          ? "Update Corner"
                          : "Create Corner"}
                    </button>
                    {editingCorner ? (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-zinc-700 bg-transparent text-zinc-300 font-medium rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                      >
                        Cancel Edit
                      </button>
                    ) : (
                      <Link
                        href={`/your-tracks/${trackId}`}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-zinc-700 bg-transparent text-zinc-300 font-medium rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                      >
                        Cancel
                      </Link>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-bold text-zinc-100">Track Corners</h2>
                <p className="text-zinc-400 mt-1">View corners and add your times</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Lock className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">
                    You can view corners on the map and add your own times by clicking on them.
                  </p>
                  <p className="text-zinc-500 text-sm mt-2">Only the track owner can add or edit corners.</p>
                </div>
              </div>
            </div>
          )}

          <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-4">
              Track Map {existingCorners && existingCorners.length > 0 && `(${existingCorners.length} corners)`}
            </h3>
            {mapImageUrl ? (
              <div
                className={`relative w-full bg-black rounded-lg overflow-hidden border-2 ${
                  isSelectingPosition && canEdit ? "border-red-500 cursor-crosshair" : "border-red-600/20"
                } shadow-[0_0_30px_rgba(239,68,68,0.3)]`}
                style={{ aspectRatio: "15 / 15" }}
                onClick={handleMapClick}
              >
                <div className="w-full h-full p-8 flex items-center justify-center">
                  <img
                    src={mapImageUrl || "/placeholder.svg"}
                    alt="Track map"
                    className="max-w-full max-h-full object-contain"
                    style={{ filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))" }}
                  />
                </div>
                {existingCorners?.map((corner) => (
                  <div
                    key={corner._id}
                    className="absolute"
                    style={{
                      left: `${corner.positionX}%`,
                      top: `${corner.positionY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseEnter={() => setHoveredCorner(corner._id)}
                    onMouseLeave={() => setHoveredCorner(null)}
                  >
                    <CornerMarker
                      corner={corner}
                      isHovered={hoveredCorner === corner._id}
                      isEditing={editingCorner === corner._id}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        if (isSelectingPosition) return
                        handleCornerClick(corner, e)
                      }}
                      onEdit={
                        canEdit
                          ? (e: React.MouseEvent) => {
                              e.stopPropagation()
                              handleCornerClick(corner, e)
                            }
                          : undefined
                      }
                      onDelete={
                        canEdit
                          ? (e: React.MouseEvent) => {
                              e.stopPropagation()
                              handleDeleteCorner(corner._id, e)
                            }
                          : undefined
                      }
                      showTooltip={false}
                      readOnly={!canEdit}
                    />
                  </div>
                ))}

                {positionX && positionY && !editingCorner && canEdit && (
                  <CornerMarker
                    corner={{
                      _id: "temp" as Id<"corners">,
                      cornerNumber: Number.parseInt(cornerNumber) || 0,
                      name: name || "New Corner",
                      positionX: Number.parseFloat(positionX),
                      positionY: Number.parseFloat(positionY),
                    }}
                    isNewPosition={true}
                  />
                )}

                {isSelectingPosition && canEdit && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none z-50">
                    <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Click to place corner
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-video bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                No track map available
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
