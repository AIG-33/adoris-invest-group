// @ts-nocheck
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { uploadToS3 } from '@/lib/s3'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `exhibition-${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try S3 upload first if configured
    if (process.env.AWS_S3_BUCKET_NAME) {
      try {
        const publicUrl = await uploadToS3(buffer, filename, file.type)
        return NextResponse.json({ url: publicUrl }, { status: 200 })
      } catch (s3Error) {
        const errorMessage = s3Error instanceof Error ? s3Error.message : 'S3 upload failed'
        if (process.env.NODE_ENV === 'development') {
          console.error('S3 upload error:', s3Error)
        }
        // Fall through to try local filesystem
      }
    }

    // Try to save to local filesystem (for development/local servers)
    try {
      const exhibitionsDir = join(process.cwd(), 'public', 'exhibitions')
      if (!existsSync(exhibitionsDir)) {
        await mkdir(exhibitionsDir, { recursive: true })
      }
      const filepath = join(exhibitionsDir, filename)
      await writeFile(filepath, buffer)
      const publicUrl = `/exhibitions/${filename}`
      return NextResponse.json({ url: publicUrl }, { status: 200 })
    } catch (fsError) {
      // If both S3 and filesystem fail, return error
      const errorMessage = fsError instanceof Error ? fsError.message : 'File system write failed'
      if (process.env.NODE_ENV === 'development') {
        console.error('Filesystem write error:', fsError)
      }
      return NextResponse.json(
        { 
          error: 'Failed to save image. Please configure AWS S3 or use image URLs instead.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : 'File upload is not available on this platform. Please use image URLs.'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Error uploading image:', error)
      console.error('Error details:', { errorMessage, errorStack })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

