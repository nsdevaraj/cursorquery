"use client"

import React, { useState, useRef, useEffect } from 'react'
import { format, addDays, differenceInDays } from 'date-fns'

export default function DateRangeSlider() {
  const minDate = new Date("2023-01-01")
  const maxDate = new Date("2023-12-31")
  const totalDays = differenceInDays(maxDate, minDate)

  const [range, setRange] = useState([0, totalDays])
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<number | null>(null)

  const handleMouseDown = (event: React.MouseEvent, handleIndex: number) => {
    event.preventDefault()
    setIsDragging(handleIndex)
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging !== null && sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect()
      const newPosition = Math.max(0, Math.min(event.clientX - sliderRect.left, sliderRect.width))
      const newValue = Math.round((newPosition / sliderRect.width) * totalDays)

      setRange(prevRange => {
        const newRange = [...prevRange]
        newRange[isDragging] = newValue

        if (isDragging === 0 && newRange[0] > newRange[1] - 1) {
          newRange[0] = newRange[1] - 1
        } else if (isDragging === 1 && newRange[1] < newRange[0] + 1) {
          newRange[1] = newRange[0] + 1
        }

        return newRange
      })
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const startDate = addDays(minDate, range[0])
  const endDate = addDays(minDate, range[1])

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center text-sm font-medium text-gray-600">
        Selected Range: {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
      </div>
      <div
        ref={sliderRef}
        className="relative h-5 w-full"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={totalDays}
        aria-valuenow={range[1]}
        aria-valuetext={`From ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}`}
      >
        <div className="absolute top-2 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div
            className="absolute h-full bg-blue-500 rounded-full"
            style={{
              left: `${(range[0] / totalDays) * 100}%`,
              right: `${100 - (range[1] / totalDays) * 100}%`
            }}
          />
        </div>
        {range.map((value, index) => (
          <div
            key={index}
            className="absolute top-0 w-5 h-5 bg-white shadow-md rounded-full border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform hover:scale-110 cursor-pointer"
            style={{ left: `calc(${(value / totalDays) * 100}% - 10px)` }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            tabIndex={0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={totalDays}
            aria-valuenow={value}
            aria-valuetext={format(addDays(minDate, value), "MMM d, yyyy")}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{format(minDate, "MMM d, yyyy")}</span>
        <span>{format(maxDate, "MMM d, yyyy")}</span>
      </div>
    </div>
  )
}