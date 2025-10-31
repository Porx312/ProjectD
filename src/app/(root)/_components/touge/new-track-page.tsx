"use client"

import type React from "react"
import { useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Upload } from "lucide-react"
import { api } from "../../../../../convex/_generated/api"

export default function NewTrackPage() {
  const { user } = useUser()
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [carModel, setCarModel] = useState("")
  const [lengthKm, setLengthKm] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const createTrack = useMutation(api.tracks.create)
  const generateUploadUrl = useMutation(api.tracks.generateUploadUrl)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, etc.)")
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      let mapImageId: string | undefined

      if (imageFile) {
        const uploadUrl = await generateUploadUrl()
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        })
        const { storageId } = await result.json()
        mapImageId = storageId
      }

      const trackId = await createTrack({
        name,
        location,
        carModel,
        lengthKm: Number.parseFloat(lengthKm),
        mapImageId,
        userId: user.id,
      })

      router.push(`/your-tracks/${trackId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950">
     

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-semibold text-zinc-100">Add New Track</h2>
            <p className="text-sm text-zinc-400 mt-2">Create a new touge to track your times</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-zinc-200">
                  Track Name *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Akina Downhill"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium text-zinc-200">
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="Mt. Akina, Gunma Prefecture"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="carModel" className="text-sm font-medium text-zinc-200">
                  Vehicle *
                </label>
                <input
                  id="carModel"
                  type="text"
                  placeholder="Toyota AE86 Trueno (Tuned)"
                  required
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="lengthKm" className="text-sm font-medium text-zinc-200">
                  Length (km) *
                </label>
                <input
                  id="lengthKm"
                  type="number"
                  step="0.1"
                  placeholder="5.2"
                  required
                  value={lengthKm}
                  onChange={(e) => setLengthKm(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="imageFile" className="text-sm font-medium text-zinc-200">
                  Upload Track Map (optional)
                </label>
                <div className="relative">
                  <input id="imageFile" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <label
                    htmlFor="imageFile"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-md hover:bg-zinc-700 cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {imageFile ? imageFile.name : "Choose image file"}
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-2 border border-zinc-700 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Track preview"
                      className="w-full h-72 object-contain bg-black"
                    />
                  </div>
                )}
                <p className="text-xs text-zinc-500">Upload a PNG or JPG image of your track layout</p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Track"}
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
