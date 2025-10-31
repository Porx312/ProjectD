// components/corner-marker.tsx
"use client"

import { Edit2, Trash2 } from "lucide-react"
import type React from "react"
import type { Id } from "../../../../../convex/_generated/dataModel"

interface Corner {
  _id: Id<"corners">
  cornerNumber: number
  name: string
  positionX: number
  positionY: number
}

interface CornerMarkerProps {
  corner: {
    _id: Id<"corners">
    cornerNumber: number
    name: string
    positionX: number
    positionY: number
  }
  isHovered?: boolean
  isEditing?: boolean
  isSelected?: boolean
  isNewPosition?: boolean
  onClick?: (e: React.MouseEvent) => void
  onEdit?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  showTooltip?: boolean
  readOnly?: boolean
}

export function CornerMarker({
  corner,
  isHovered = false,
  isEditing = false,
  isSelected = false,
  isNewPosition = false,
  onClick,
  onEdit,
  onDelete,
  showTooltip = false,
  readOnly = false,
}: CornerMarkerProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${corner.positionX}%`,
        top: `${corner.positionY}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative group">
        {/* Corner Marker */}
        <button
          onClick={onClick}
          className={`relative flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
            isNewPosition
              ? "bg-red-500/50 text-white border-2 border-red-400 border-dashed animate-pulse"
              : isEditing
                ? "bg-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/50 scale-110"
                : isSelected
                  ? "bg-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/50"
                  : isHovered
                    ? "bg-red-500 text-white border-2 border-red-400 shadow-md shadow-red-500/30 scale-105"
                    : "bg-red-600/80 text-white border-2 border-red-500/50 hover:bg-red-500 hover:scale-105"
          } ${!isNewPosition ? "cursor-pointer" : "cursor-default"}`}
          disabled={isNewPosition}
        >
          {corner.cornerNumber}
        </button>

        {/* Tooltip */}
        {showTooltip && !isNewPosition && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {corner.name}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
          </div>
        )}

        {/* Edit/Delete Buttons - Only show if not readOnly */}
        {!isNewPosition && !readOnly && (isHovered || isEditing) && (onEdit || onDelete) && (
          <div className="absolute -top-2 -right-2 flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                aria-label="Edit corner"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                aria-label="Delete corner"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
