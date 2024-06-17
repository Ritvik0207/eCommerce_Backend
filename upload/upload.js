const stream = require("node:stream");
const path = require("node:path");
const { google } = require("googleapis");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  scopes: SCOPE,
  credentials: {
    project_id: process.env.project_id,
    private_key: process.env.private_key
      .replace(/\\n/g, "\n")
      .replace(/"/g, ""),
    client_email: process.env.client_email,
    private_key_id: process.env.private_key_id,
    type: process.env.type,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
  },
});
const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  console.log(fileObject.fieldname);
  bufferStream.end(fileObject.buffer);
  const { data } = await google
    .drive({
      version: "v3",
      auth: auth,
    })
    .files.create({
      media: {
        mimeType: fileObject.mimetype,
        body: bufferStream,
      },
      requestBody: {
        name: `${fileObject.fieldname}-${Date.now()}`,
        parents: ["1JvajDnaF1Fu0XzdaLfDrGHynpRPVGcSx"],
      },
      fields: "id,name",
    });

  return data.id;
};
module.exports = { uploadFile };
