"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { api } from "../../../convex/_generated/api"
import { useState } from "react"
import { TracksList } from "./TrackList"

type ViewMode = "all" | "created" | "saved"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [viewMode, setViewMode] = useState<ViewMode>("all")

  // Cargar ambas listas
  const myTracks = useQuery(api.tracks.list, user ? { userId: user.id } : "skip")
  const savedTracks = useQuery(api.tracks.getSavedTracks)

  if (isLoaded && !user) {
    redirect("/")
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500 text-xl">Loading...</div>
      </div>
    )
  }

  // Combinar y filtrar según el modo
  const getDisplayedTracks = () => {
    if (viewMode === "created") return myTracks || []
    if (viewMode === "saved") return savedTracks || []

    // Modo "all": combinar ambas listas
    const all = [
      ...(myTracks || []).map(t => ({ ...t, source: "created" as const })),
      ...(savedTracks || []).map(t => ({ ...t, source: "saved" as const }))
    ]
    // Eliminar duplicados (si un track fue creado y guardado por el mismo usuario)
    const seen = new Set()
    return all.filter(track => {
      if (seen.has(track._id)) return false
      seen.add(track._id)
      return true
    })
  }
  
  const displayedTracks = getDisplayedTracks()
  console.log(displayedTracks)

  return (
    <main className="min-h-screen bg-[#0a0a0f] rounded-md">
      <div className="container mx-auto px-4 py-8">
        {/* Header con filtro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-100 mb-2">Your Touge Dashboard</h2>
            <p className="text-zinc-400">Manage your created and saved mountain passes</p>
          </div>

          {/* Filtro por pestañas */}
          <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "all"
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              All ({(myTracks?.length || 0) + (savedTracks?.length || 0)})
            </button>
            <button
              onClick={() => setViewMode("created")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "created"
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Created ({myTracks?.length || 0})
            </button>
            <button
              onClick={() => setViewMode("saved")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "saved"
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Saved ({savedTracks?.length || 0})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {displayedTracks.length === 0 ? (
          <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-12 text-center">
            {viewMode === "created" && (
              <>
                <p className="text-zinc-400 mb-4">You havent created any tracks yet.</p>
                <Link
                  href="/your-tracks/new"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Create Your First Track
                </Link>
              </>
            )}
            {viewMode === "saved" && (
              <>
                <p className="text-zinc-400 mb-4">You havent saved any tracks yet.</p>
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Explore Tracks
                </Link>
              </>
            )}
            {viewMode === "all" && (
              <>
                <p className="text-zinc-400 mb-4">No tracks yet. Start by creating or saving one!</p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/your-tracks/new"
                    className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Create Track
                  </Link>
                  <Link
                    href="/explore"
                    className="px-5 py-2 text-sm bg-zinc-700 text-zinc-200 rounded-md hover:bg-zinc-600"
                  >
                    Explore
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Grid de pistas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TracksList displayedTracks={displayedTracks}/>
          </div>
        )}
      </div>
    </main>
  )
}