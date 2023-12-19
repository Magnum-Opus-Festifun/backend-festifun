require('dotenv').config()
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const loginRoutes = require("./routes/login");
const middlewareLogRequest = require('./middleware/logs');
const { upload, handleFileUpload } = require('./middleware/multer');
const { uploadToDrive } = require('./routes/drive');
const fs = require('fs');


const PORT = process.env.PORT;



const app = express();
app.use(cors());


app.use(middlewareLogRequest)
app.use(express.json());
app.use('/assets', express.static('public/images'))

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/login", loginRoutes);


app.post('/upload', upload, handleFileUpload, async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Simpan file ke Google Drive
    await uploadToDrive(fileBuffer, fileName);

    res.json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});







app.use((err, req, res, next) => {
  res.json({
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
