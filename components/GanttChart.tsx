'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Task {
  id: number
  name: string
  start: Date
  end: Date
  dependencies: number[]
  color: string
}

const sampleTasks: Task[] = [
  { id: 1, name: 'Task 1', start: new Date(2023, 0, 1), end: new Date(2023, 0, 15), dependencies: [], color: '#ff6b6b' },
  { id: 2, name: 'Task 2', start: new Date(2023, 0, 5), end: new Date(2023, 0, 20), dependencies: [1], color: '#4ecdc4' },
  { id: 3, name: 'Task 3', start: new Date(2023, 0, 15), end: new Date(2023, 1, 5), dependencies: [1], color: '#45b7d1' },
  { id: 4, name: 'Task 4', start: new Date(2023, 0, 20), end: new Date(2023, 1, 10), dependencies: [2], color: '#f9d56e' },
  { id: 5, name: 'Task 5', start: new Date(2023, 1, 5), end: new Date(2023, 1, 25), dependencies: [3, 4], color: '#ff8a5c' },
]

export default function GanttChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState(0)
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null)

  const dayWidth = 20
  const taskHeight = 40
  const taskPadding = 10

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw timeline
      const startDate = new Date(Math.min(...sampleTasks.map(task => task.start.getTime())))
      const endDate = new Date(Math.max(...sampleTasks.map(task => task.end.getTime())))
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      for (let i = 0; i <= totalDays; i += 7) {
        const x = i * dayWidth * scale + offset
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
        ctx.fillText(date.toLocaleDateString(), x, 20)
        ctx.beginPath()
        ctx.moveTo(x, 25)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = '#eee'
        ctx.stroke()
      }

      // Draw tasks
      sampleTasks.forEach((task, index) => {
        const taskStart = (task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
        const x = taskStart * dayWidth * scale + offset
        const y = index * (taskHeight + taskPadding) + 40

        ctx.fillStyle = task.color
        ctx.fillRect(x, y, taskDuration * dayWidth * scale, taskHeight)

        ctx.fillStyle = '#333'
        ctx.fillText(task.name, x + 5, y + 20)

        // Draw dependencies
        task.dependencies.forEach(depId => {
          const depTask = sampleTasks.find(t => t.id === depId)
          if (depTask) {
            const depIndex = sampleTasks.indexOf(depTask)
            const depEnd = (depTask.end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            const depX = depEnd * dayWidth * scale + offset
            const depY = depIndex * (taskHeight + taskPadding) + 40 + taskHeight / 2

            ctx.beginPath()
            ctx.moveTo(depX, depY)
            ctx.lineTo(x, y + taskHeight / 2)
            ctx.strokeStyle = '#999'
            ctx.stroke()
          }
        })
      })
    }

    drawChart()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const hoveredTask = sampleTasks.find((task, index) => {
        const taskStart = (task.start.getTime() - sampleTasks[0].start.getTime()) / (1000 * 60 * 60 * 24)
        const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
        const taskX = taskStart * dayWidth * scale + offset
        const taskY = index * (taskHeight + taskPadding) + 40

        return (
          x >= taskX &&
          x <= taskX + taskDuration * dayWidth * scale &&
          y >= taskY &&
          y <= taskY + taskHeight
        )
      })

      setHoveredTask(hoveredTask || null)
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [scale, offset, hoveredTask])

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5))
  const handlePanLeft = () => setOffset(prev => prev + 50)
  const handlePanRight = () => setOffset(prev => prev - 50)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gantt Chart</h2>
          <div className="space-x-2">
            <Button onClick={handleZoomIn}>Zoom In</Button>
            <Button onClick={handleZoomOut}>Zoom Out</Button>
            <Button onClick={handlePanLeft}>Pan Left</Button>
            <Button onClick={handlePanRight}>Pan Right</Button>
          </div>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="border border-gray-300 rounded"
          />
          {hoveredTask && (
            <div className="absolute bg-white border border-gray-300 p-2 rounded shadow-md">
              <p><strong>{hoveredTask.name}</strong></p>
              <p>Start: {hoveredTask.start.toLocaleDateString()}</p>
              <p>End: {hoveredTask.end.toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}