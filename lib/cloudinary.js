import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImage(file) {
  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: 'products', resource_type: 'image' },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
      )
      .end(buffer)
  })

  return result.secure_url
}
