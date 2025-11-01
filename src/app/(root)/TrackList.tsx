import Link from "next/link"
import { Star, MapPin, Car } from "lucide-react"

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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {displayedTracks.map((track) => (
        <Link
          key={track._id}
          href={`/your-tracks/${track._id}`}
          className="group relative block"
        >
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800 shadow-lg hover:shadow-red-900/20 hover:border-red-600/50 transition-all duration-300 backdrop-blur-sm">
            {/* Imagen o fondo decorativo */}
            {track.mapImageUrl && (
              <div
                className="h-40 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"
                style={{ backgroundImage: `url(${track.mapImageUrl})` }}
              />
            )}

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-red-400 transition-colors">
                  {track.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    track.source === "created"
                      ? "bg-blue-900/50 text-blue-300"
                      : "bg-green-900/50 text-green-300"
                  }`}
                >
                  {track.source === "created" ? "Created" : "Saved"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{track.location}</span>
              </div>

              <div className="space-y-2 text-sm">
                {track.source === "saved" && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Creator</span>
                    <span className="text-zinc-200 font-mono">{track.userName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Car className="w-4 h-4 text-zinc-500" /> Vehicle
                  </span>
                  <span className="text-zinc-200 font-mono">{track.carModel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Length</span>
                  <span className="text-zinc-200">{track.lengthKm} km</span>
                </div>

                {track.starCount !== undefined && (
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" /> Stars
                    </span>
                    <span className="text-yellow-400 font-semibold">
                      {track.starCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
