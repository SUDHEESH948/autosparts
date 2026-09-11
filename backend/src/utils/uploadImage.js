const cloudinary = require("cloudinary").v2;

/*
  Configure Cloudinary with credentials
  from environment variables
*/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
  Upload image to Cloudinary
  
  Accepts a file buffer and returns the secure URL
*/
async function uploadToCloudinary(
    fileBuffer,
    fileName
) {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "automobile_products",
                    public_id: fileName,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

        uploadStream.end(fileBuffer);
    });
}

module.exports = {
    uploadToCloudinary,
};
