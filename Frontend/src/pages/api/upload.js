import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { createReadStream } from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js built-in body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log Cloudinary configuration
    console.log("Cloudinary config:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
    });

    // Parse the form data using the updated formidable approach
    const form = formidable({ 
      keepExtensions: true,
      multiples: true // Enable multiple file uploads
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error:", err);
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    // Access the file(s) from the parsed form data
    const file = files.file;
    
    if (!file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log("File object structure:", JSON.stringify(file).substring(0, 200) + "...");
    
    // Handle single file or array of files
    const fileArray = Array.isArray(file) ? file : [file];
    console.log(`Attempting to upload ${fileArray.length} files`);

    if (fileArray.length === 0) {
      return res.status(400).json({ error: 'No valid files to upload' });
    }

    // Process all files
    const uploadResults = await Promise.all(
      fileArray.map(async (singleFile, index) => {
        const filename = singleFile.originalFilename || singleFile.newFilename || `file-${index}`;
        console.log(`Uploading file ${index + 1}/${fileArray.length}: ${filename}`);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            {
              folder: 'my-ride/cars',
              transformation: [
                { width: 1200, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) {
                console.error(`Cloudinary upload error for file ${index + 1}:`, error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          createReadStream(singleFile.filepath).pipe(upload_stream);
        });

        console.log(`File ${index + 1} uploaded successfully: ${result.secure_url}`);
        return result;
      })
    );

    // Return the Cloudinary URLs
    return res.status(200).json({
      urls: uploadResults.map(result => result.secure_url),
      publicIds: uploadResults.map(result => result.public_id),
      url: uploadResults[0]?.secure_url, // For backward compatibility
      publicId: uploadResults[0]?.public_id // For backward compatibility
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 