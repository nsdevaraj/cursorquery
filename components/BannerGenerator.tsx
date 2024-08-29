"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Download, Shuffle } from 'lucide-react'

const PartyIcon = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <path d="M10 24V10c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v14l-6-4-6 4z" fill="#FFD700" />
    <path d="M14 4V2M10 6L8 4M18 6l2-2M14 24v-8" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
  </g>
)

const Balloon = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M10 20c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z" fill={color} />
    <path d="M10 20v10" stroke={color} strokeWidth="0.5" />
  </g>
)

const Firecracker = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <rect x="0" y="0" width="4" height="20" fill="#FF6B6B" />
    <circle cx="2" cy="0" r="4" fill="#FFD700" />
    <path d="M2 0 L4 -4 M2 0 L0 -4 M2 0 L6 -2 M2 0 L-2 -2" stroke="#FFD700" strokeWidth="0.5" />
  </g>
)

const Cake = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <rect x="0" y="10" width="20" height="10" fill="#FFA07A" />
    <rect x="0" y="5" width="20" height="5" fill="#F08080" />
    <rect x="8" y="0" width="4" height="5" fill="#FFD700" />
    <circle cx="10" cy="0" r="1" fill="#FF6347" />
  </g>
)

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex space-x-2 mb-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <select
        className="border rounded px-2 py-1"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      >
        <option value="#000000">Black</option>
        <option value="#ffffff">White</option>
        <option value="#ff0000">Red</option>
        <option value="#00ff00">Green</option>
        <option value="#0000ff">Blue</option>
      </select>
    </div>
  )
}

export default function Component() {
  const [bannerText, setBannerText] = useState('Celebration Banner')
  const [gradientColors, setGradientColors] = useState(['rgb(56, 189, 248)', 'rgb(49, 46, 129)'])
  const [elements, setElements] = useState<JSX.Element[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      TextStyle,
    ],
    content: bannerText,
    onUpdate: ({ editor }) => {
      setBannerText(editor.getHTML())
    },
  })

  const generateRandomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
  }

  const shuffleGradientColors = useCallback(() => {
    const newColors = [generateRandomColor(), generateRandomColor()]
    setGradientColors(newColors)
  }, [])

  const generateRandomElements = useCallback(() => {
    const newElements = []
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F']
    
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 280 + 10
      const y = Math.random() * 80 + 10
      const randomChoice = Math.floor(Math.random() * 4)
      switch (randomChoice) {
        case 0:
          newElements.push(<PartyIcon key={`party-${i}`} x={x} y={y} scale={0.7} />)
          break
        case 1:
          const color = colors[Math.floor(Math.random() * colors.length)]
          newElements.push(<Balloon key={`balloon-${i}`} x={x} y={y} color={color} />)
          break
        case 2:
          newElements.push(<Firecracker key={`firecracker-${i}`} x={x} y={y} scale={0.7} />)
          break
        case 3:
          newElements.push(<Cake key={`cake-${i}`} x={x} y={y} scale={0.7} />)
          break
      }
    }
    return newElements
  }, [])

  useEffect(() => {
    setElements(generateRandomElements())
  }, [generateRandomElements])

  const exportAsJpg = useCallback(() => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const canvas = document.createElement('canvas')
      canvas.width = 900
      canvas.height = 300
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        const jpgUrl = canvas.toDataURL('image/jpeg')
        const link = document.createElement('a')
        link.download = 'celebration-banner.jpg'
        link.href = jpgUrl
        link.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <div className="space-y-2"> 
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="border rounded-md p-2" />
      </div>
      <div className="w-full aspect-[3/1] relative">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 300 100"
          preserveAspectRatio="xMidYMid meet"
          className="rounded-lg shadow-lg"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradientColors[0], stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradientColors[1], stopOpacity: 1 }} />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          {elements}
          <foreignObject x="10" y="10" width="280" height="80">
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="text-white text-center font-bold text-2xl"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                dangerouslySetInnerHTML={{ __html: bannerText }}
              />
            </div>
          </foreignObject>
        </svg>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={exportAsJpg} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export as JPG</span>
        </Button>
        <Button onClick={shuffleGradientColors} className="flex items-center space-x-2">
          <Shuffle className="h-4 w-4" />
          <span>Shuffle Colors</span>
        </Button>
      </div> 
    </div>
  )
}