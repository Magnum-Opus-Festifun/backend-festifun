const { google } = require("googleapis");
const privatekey = require("../../service-account-key.json");
const { Readable } =  require('stream')

const drive = google.drive({
  version: "v3",
  auth: new google.auth.JWT({
    email: privatekey.client_email,
    key: privatekey.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  }),
});

const uploadToDrive = async (fileBuffer, fileName) => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: ["13-PdSlVhh3vXXUPqZ7-yPhZt_V0iN3zp"],
    };

    const media = {
      mimeType: "application/octet-stream",
      body: Readable.from(fileBuffer),

    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("File ID:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error.message);
    console.error("Google Drive API Error:", error.errors);
    throw error;
  }
};

module.exports = { uploadToDrive };
