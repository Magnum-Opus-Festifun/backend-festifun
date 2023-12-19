require('dotenv').config()
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const loginRoutes = require("./routes/login");
const middlewareLogRequest = require('./middleware/logs');
const upload = require('./middleware/multer');
const PORT = process.env.PORT;

const app = express();
app.use(cors());


app.use(middlewareLogRequest)
app.use(express.json());
app.use('/assets', express.static('public/images'))

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/login", loginRoutes);

app.post('/upload', upload.single('photo'),(req, res) => {
  res.json({
    message: 'Upload Success'
  })
})

app.use((err, req, res, next) => {
  res.json({
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
