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
      <div
        ref={sliderRef}
        className="relative h-12 w-full"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={totalDays}
        aria-valuenow={range[1]}
        aria-valuetext={`From ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}`}
      >
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-blue-100 rounded-full -translate-y-1/2">
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
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-md cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ left: `calc(${(value / totalDays) * 100}% - 2rem)` }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            tabIndex={0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={totalDays}
            aria-valuenow={value}
            aria-valuetext={format(addDays(minDate, value), "MMM d, yyyy")}
          >
            {format(addDays(minDate, value), "d,MMM")}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-2">
        <span>{format(minDate, "MMM d, yyyy")}</span>
        <span>{format(maxDate, "MMM d, yyyy")}</span>
      </div>
    </div>
  )
}