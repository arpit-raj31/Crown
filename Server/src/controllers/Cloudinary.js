const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file'); // 'file' is the key from the frontend form

// Function to upload image to Cloudinary
const uploadToCloudinary = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send('Error uploading file');
    }

    try {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // 'auto' automatically detects file type (image, pdf, etc.)
        async (error, result) => {
          if (error) {
            return res.status(500).send('Error uploading image to Cloudinary');
          }

          // Return the uploaded image URL or file details
          res.status(200).send({
            url: result.secure_url, // Cloudinary's secure URL for the uploaded file
            public_id: result.public_id, // Public ID of the uploaded file for future reference
          });
        }
      );
      
      req.file.stream.pipe(result); // Send file stream to Cloudinary
    } catch (error) {
      res.status(500).send('Error uploading file to Cloudinary');
    }
  });
};
