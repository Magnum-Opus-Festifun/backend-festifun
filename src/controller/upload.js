// controllers/uploadController.js

const { google } = require('googleapis');
const privatekey = require('../service-account-key.json');
const { Readable } = require('stream');
const router = require('express').Router();

const drive = google.drive({
  version: 'v3',
  auth: new google.auth.JWT({
    email: privatekey.client_email,
    key: privatekey.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  }),
});

const uploadToDrive = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const fileMetadata = {
      name: fileName,
      parents: [''], // Ganti dengan ID folder Google Drive Anda
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: Readable.from(fileBuffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    const imageUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { uploadToDrive };
