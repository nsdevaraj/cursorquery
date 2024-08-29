'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

const projects = [
  { id: 1, title: 'Project 1', image: '/placeholder.svg?height=400&width=600' },
  { id: 2, title: 'Project 2', image: '/placeholder.svg?height=400&width=600' },
  { id: 3, title: 'Project 3', image: '/placeholder.svg?height=400&width=600' },
  { id: 4, title: 'Project 4', image: '/placeholder.svg?height=400&width=600' },
  { id: 5, title: 'Project 5', image: '/placeholder.svg?height=400&width=600' },
  { id: 6, title: 'Project 6', image: '/placeholder.svg?height=400&width=600' },
]

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Alex Designer</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <section className="px-4 sm:px-0 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-600">
            Hi, I'm Alex, a passionate designer with over 5 years of experience in creating beautiful and functional
            digital experiences. My work focuses on user-centered design principles and innovative solutions that make
            a lasting impact.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 px-4 sm:px-0">My Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="cursor-pointer"
                  onClick={() => setSelectedImage(project)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300 ease-in-out" />
              </div>
            ))}
          </div>
        </section>
      </main>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </button>
            <Image
              src={selectedImage.image}
              alt={selectedImage.title}
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}