// @ts-nocheck
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME
  const folder = process.env.AWS_S3_EXHIBITIONS_FOLDER || 'exhibitions'

  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured')
  }

  const key = `${folder}/${filename}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  })

  await s3Client.send(command)

  // Return public URL
  const region = process.env.AWS_REGION || 'us-east-1'
  const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
  
  return publicUrl
}

