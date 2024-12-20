const stream = require("node:stream");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Object} fileObject - The file object with a buffer and mimetype.
 * @param {Object} options - Additional upload options (resourceType, folder, transformation).
 * @returns {Object} - Cloudinary upload result.
 */

const uploadFile = async (fileObject, resourceType = "image") => {
  try {
    if (!fileObject || !fileObject.buffer) {
      throw new Error("No file provided or file buffer is missing");
    }

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          quality: "auto",
          fetch_format: "auto",
          width: 500,
          // height: "auto",
          crop: "limit",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      bufferStream.pipe(uploadStream);
    });
    console.log(uploadResult);

    return uploadResult.public_id;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    throw new Error("File upload failed");
  }
};

module.exports = { uploadFile };

// const stream = require("node:stream");
// const cloudinary = require("cloudinary").v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// /**
//  * Upload file to Cloudinary
//  * @param {Object} fileObject - The file object with a buffer and mimetype.
//  * @param {Object} options - Additional upload options (resourceType, folder, transformation).
//  * @returns {Object} - Cloudinary upload result.
//  */
// const uploadFile = async (fileObject, options = {}) => {
//   try {
//     // Validate input file
//     if (!fileObject || !fileObject.buffer) {
//       throw new Error("No file provided or file buffer is missing");
//     }

//     // Set default options
//     const {
//       resourceType = "image",
//       folder = "uploads",
//       transformations = {
//         width: 500,
//         crop: "limit",
//         quality: "auto",
//         fetch_format: "auto",
//       },
//     } = options;

//     // Prepare buffer stream for upload
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(fileObject.buffer);

//     // Upload to Cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: resourceType,
//           folder,
//           ...transformations,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );

//       bufferStream.pipe(uploadStream); // Pipe the buffer to Cloudinary
//     });

//     console.log("Upload successful:", uploadResult);

//     // Return full upload result for flexibility
//     return {
//       publicId: uploadResult.public_id,
//       secureUrl: uploadResult.secure_url,
//       format: uploadResult.format,
//       size: uploadResult.bytes,
//     };
//   } catch (error) {
//     console.error("Error uploading file to Cloudinary:", error.message);
//     throw new Error("File upload failed");
//   }
// };

// module.exports = { uploadFile };

//The given below code is using google drive

// const { google } = require("googleapis");
// const SCOPE = ["https://www.googleapis.com/auth/drive"];
// const auth = new google.auth.GoogleAuth({
//   scopes: SCOPE,
//   credentials: {
//     project_id: process.env.project_id,
//     private_key: process.env.private_key
//       .replace(/\\n/g, "\n")
//       .replace(/"/g, ""),
//     client_email: process.env.client_email,
//     private_key_id: process.env.private_key_id,
//     type: process.env.type,
//     client_id: process.env.client_id,
//     auth_uri: process.env.auth_uri,
//     token_uri: process.env.token_uri,
//     auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//     client_x509_cert_url: process.env.client_x509_cert_url,
//     universe_domain: process.env.universe_domain,
//   },
// });
// const uploadFile = async (fileObject) => {
//   const bufferStream = new stream.PassThrough();
//   console.log(fileObject.fieldname);
//   bufferStream.end(fileObject.buffer);
//   const { data } = await google
//     .drive({
//       version: "v3",
//       auth: auth,
//     })
//     .files.create({
//       media: {
//         mimeType: fileObject.mimetype,
//         body: bufferStream,
//       },
//       requestBody: {
//         name: `${fileObject.fieldname}-${Date.now()}`,
//         parents: ["1JvajDnaF1Fu0XzdaLfDrGHynpRPVGcSx"],
//       },
//       fields: "id,name",
//     });

//   return data.id;
// };
// module.exports = { uploadFile };
