require('dotenv').config()
const express = require("express");
const userRoutes = require("./routes/users");
const middlewareLogRequest = require('./middleware/logs')
const PORT = process.env.PORT;

const app = express();



app.use(middlewareLogRequest)
app.use(express.json());


app.use("/users", userRoutes);


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
