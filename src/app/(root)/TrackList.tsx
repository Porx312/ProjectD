import Link from "next/link"
interface Corner {
  _id: string
  _creationTime: number
  youtubeUrl?: string
  name: string
  trackId: string
  cornerNumber: number
  positionX: number
  positionY: number
}

interface Track {
  _id: string
  carModel: string
  userName: string
  userId: string
  name: string
  location: string
  lengthKm: number
  mapImageId?: string
  mapImageUrl?: string
  source?: string
  commentCount?: number
  starCount?: number
  savedAt?: number
  createdAt: number
  _creationTime: number
  corners?: Corner[]
}

interface TracksListProps {
  displayedTracks: Track[]
}

export function TracksList({ displayedTracks }: TracksListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayedTracks.map((track) => (
        <Link
          key={track._id}
          href={`/your-tracks/${track._id}`}
          className="block h-full"
        >
          <div className="h-full border border-zinc-800 bg-zinc-900/30 rounded-lg p-6 hover:bg-zinc-900/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-zinc-100">{track.name}</h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  track.source === "created"
                    ? "bg-blue-900/50 text-blue-300"
                    : "bg-green-900/50 text-green-300"
                }`}
              >
                {track.source === "created" ? "Created" : "Saved"}
              </span>
            </div>

            <p className="text-zinc-400 mb-4">{track.location}</p>

            <div className="space-y-2 text-sm">
              {track.source === "saved" && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Creator</span>
                  <span className="text-zinc-200 font-mono">{track.userName}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Vehicle</span>
                <span className="text-zinc-200 font-mono">{track.carModel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Length</span>
                <span className="text-zinc-200">{track.lengthKm} km</span>
              </div>
              {track.starCount !== undefined && (
                <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                  <span className="text-zinc-400">Stars</span>
                  <span className="text-yellow-400 font-mono">{track.starCount}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
