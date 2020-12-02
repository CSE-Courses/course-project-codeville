const client = require("../db");
const express = require("express");
const app = express.Router();
const bodyparser = require("body-parser");
const loggedin = require("../middleware/loggedin");
const multer = require("multer");
const path = require("path");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/PictureUpload", loggedin, (req, res) => {
  res.render("PictureUpload");
});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../uploads/');
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
const upload = multer({ dest: "./uploads/" });

app.post("/profile", upload.single("p"), (req, res, next) => {
  console.log("Uploaded Successfully");
});

module.exports = app;
