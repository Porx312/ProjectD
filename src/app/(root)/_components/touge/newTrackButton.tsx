import Link from 'next/link'
import React from 'react'

export const TrackButton = () => {
  return (
        <div className="flex items-center justify-between">
          <Link
            href="/your-tracks/new"
            className="px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Add New Track
          </Link>
        </div>
  )
}
