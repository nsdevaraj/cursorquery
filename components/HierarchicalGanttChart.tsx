'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface Task {
  id: string
  name: string
  start: Date
  end: Date
  color: string
  children?: Task[]
}

const sampleTasks: Task[] = [
  {
    id: '1',
    name: 'Project A',
    start: new Date(2023, 0, 1),
    end: new Date(2023, 2, 31),
    color: '#ff6b6b',
    children: [
      {
        id: '1.1',
        name: 'Phase 1',
        start: new Date(2023, 0, 1),
        end: new Date(2023, 1, 15),
        color: '#4ecdc4',
        children: [
          { id: '1.1.1', name: 'Task 1', start: new Date(2023, 0, 1), end: new Date(2023, 0, 15), color: '#45b7d1' },
          { id: '1.1.2', name: 'Task 2', start: new Date(2023, 0, 16), end: new Date(2023, 1, 15), color: '#f9d56e' },
        ],
      },
      {
        id: '1.2',
        name: 'Phase 2',
        start: new Date(2023, 1, 16),
        end: new Date(2023, 2, 31),
        color: '#ff8a5c',
        children: [
          { id: '1.2.1', name: 'Task 3', start: new Date(2023, 1, 16), end: new Date(2023, 2, 15), color: '#45b7d1' },
          { id: '1.2.2', name: 'Task 4', start: new Date(2023, 2, 16), end: new Date(2023, 2, 31), color: '#f9d56e' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Project B',
    start: new Date(2023, 1, 1),
    end: new Date(2023, 3, 30),
    color: '#ff6b6b',
    children: [
      { id: '2.1', name: 'Task 5', start: new Date(2023, 1, 1), end: new Date(2023, 2, 15), color: '#4ecdc4' },
      { id: '2.2', name: 'Task 6', start: new Date(2023, 2, 16), end: new Date(2023, 3, 30), color: '#45b7d1' },
    ],
  },
]

export default function HierarchicalGanttChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState(0)
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['1', '2']))

  const dayWidth = 20
  const taskHeight = 40
  const taskPadding = 10
  const indentWidth = 20

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const flattenTasks = (tasks: Task[], depth = 0): { task: Task; depth: number }[] => {
    return tasks.flatMap((task) => {
      const result = [{ task, depth }]
      if (expandedTasks.has(task.id) && task.children) {
        result.push(...flattenTasks(task.children, depth + 1))
      }
      return result
    })
  }

  const drawChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    const flatTasks = flattenTasks(sampleTasks)
    const startDate = new Date(Math.min(...flatTasks.map(({ task }) => task.start.getTime())))
    const endDate = new Date(Math.max(...flatTasks.map(({ task }) => task.end.getTime())))
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Draw timeline
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    for (let i = 0; i <= totalDays; i += 7) {
      const x = i * dayWidth * scale + offset
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      ctx.fillText(date.toLocaleDateString(), x, 20)
      ctx.beginPath()
      ctx.moveTo(x, 25)
      ctx.lineTo(x, height)
      ctx.strokeStyle = '#eee'
      ctx.stroke()
    }

    // Draw tasks
    flatTasks.forEach(({ task, depth }, index) => {
      const taskStart = (task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
      const x = taskStart * dayWidth * scale + offset
      const y = index * (taskHeight + taskPadding) + 40

      ctx.fillStyle = task.color
      ctx.fillRect(x, y, taskDuration * dayWidth * scale, taskHeight)

      ctx.fillStyle = '#333'
      ctx.fillText(task.name, x + 5 + depth * indentWidth, y + 25)
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawChart(ctx, canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [scale, offset, expandedTasks])

  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.5))
  const handlePanLeft = () => setOffset((prev) => prev + 50)
  const handlePanRight = () => setOffset((prev) => prev - 50)

  const renderTaskHierarchy = (tasks: Task[], depth = 0) => {
    return tasks.map((task) => (
      <div key={task.id}>
        <div
          className={`flex items-center p-2 ${depth > 0 ? 'ml-6' : ''}`}
          style={{ backgroundColor: depth % 2 === 0 ? 'var(--background)' : 'var(--muted)' }}
        >
          {task.children && task.children.length > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => toggleExpand(task.id)}
              aria-expanded={expandedTasks.has(task.id)}
              aria-label={expandedTasks.has(task.id) ? 'Collapse' : 'Expand'}
            >
              {expandedTasks.has(task.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-10" />
          )}
          <span>{task.name}</span>
        </div>
        {expandedTasks.has(task.id) && task.children && renderTaskHierarchy(task.children, depth + 1)}
      </div>
    ))
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Hierarchical Gantt Chart</h2>
          <div className="space-x-2">
            <Button onClick={handleZoomIn}>Zoom In</Button>
            <Button onClick={handleZoomOut}>Zoom Out</Button>
            <Button onClick={handlePanLeft}>Pan Left</Button>
            <Button onClick={handlePanRight}>Pan Right</Button>
          </div>
        </div>
        <div className="flex">
          <div className="w-1/4 border-r pr-4">
            <h3 className="text-lg font-semibold mb-2">Project Structure</h3>
            <div className="border rounded-md overflow-hidden">
              {renderTaskHierarchy(sampleTasks)}
            </div>
          </div>
          <div className="w-3/4 pl-4">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded w-full h-[600px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}