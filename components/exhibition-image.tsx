'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ExhibitionImageProps {
  src: string
  alt: string
  index: number
}

export function ExhibitionImage({ src, alt, index }: ExhibitionImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className="relative aspect-square bg-neutral-200 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-neutral-400 text-xs text-center p-4">
          Image {index + 1}
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-square bg-neutral-200 rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 50vw, 25vw"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

