const stream = require("node:stream");
const path = require("node:path");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (fileObject, resourceType = "image") => {
  try {
    // Ensure the file object exists and has the necessary buffer for upload
    if (!fileObject || !fileObject.buffer) {
      throw new Error("No file provided or file buffer is missing");
    }

    // Prepare the file for uploading by creating a buffer stream
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    // Use Cloudinary's upload_stream method to upload the file
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType }, // Uploading an image file
        (error, result) => {
          if (error) {
            reject(error); // Handle upload error
          } else {
            resolve(result); // Resolve with Cloudinary's result
          }
        }
      );

      // Stream the buffer to Cloudinary for upload
      bufferStream.pipe(uploadStream);
    });
    // Return the Cloudinary result, including secure_url for accessing the image
    console.log(uploadResult);

    return uploadResult.public_id;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    throw new Error("File upload failed");
  }
};

module.exports = { uploadFile };

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
