"use client"

import { useUser} from "@clerk/nextjs"
import { useQuery } from "convex/react"
import Link from "next/link"
import { use } from "react"
import { Plus } from "lucide-react"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"
import { TrackViewer } from "../../_components/touge/TrackViewer"

export default function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useUser()

  const track = useQuery(api.tracks.get, { id: id as Id<"tracks"> })
  const corners = useQuery(api.corners.listByTrack, { trackId: id as Id<"tracks"> })

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500 text-xl">Please sign in</div>
      </div>
    )
  }

  if (!track || !corners) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className=" bg-zinc-950">

      <div className="container  mx-auto  p-5">
      
       <div className=" flex items-center justify-between gap-3 mb-3 text-sm">
          <div className="flex items-center gap-3">
             
          <span className="font-semibold text-red-400 uppercase tracking-wider">Vehicle:</span>
          <span className="text-zinc-300 font-mono">{track.carModel}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">{track.lengthKm} km</span>
            </div>
          
          <Link
              href={`/your-tracks/${id}/corners/new`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 h-9 px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Corner
            </Link>
        </div>

        <TrackViewer trackId={id} corners={corners} mapImageUrl={track.mapImageUrl} />
      </div>
    </main>
  )
}
