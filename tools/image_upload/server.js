//node js (express) server for image upload
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require('cors');
require('dotenv').config();

//config
const port = Number(process.env.PORT) || 5000;
const formField = process.env.FORMFIELD || "image"
const sizeLimit = Number(process.env.SIZELIMIT) || 5 * 1024 //5mb
const destFolder = process.env.DESTFOLDER || "images/"
const corsSetting = process.env.CORS || "*"
const allowedFillextensions = process.env.EXTENSIONS.split(",") || [".png", ".jpeg", ".jpg", ".gif", ".bmp"]


const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, destFolder)
  },
  filename: function (req, file, callback) {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    const uniqueSuffix = new Date().toISOString().slice(0, 10).replace("-", "_") + "_" + Date.now() + ext
    callback(null, file.fieldname + '_' + uniqueSuffix)
  }
})
const upload = multer({
  limits: sizeLimit,
  storage: diskStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(!allowedFillextensions.includes(ext.toLowerCase())) {
        return callback(new Error('only images are allowed'))
    }
    callback(null, true)
  }
}).single(formField);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: corsSetting
}));

//routes
app.post("/images", function(req, res){
  console.log("received upload request" , req.path)
  upload(req, res , function(err){
    if(err){
      res.status(500)
      res.json({message: "unable to upload file", error: err.message, date: new Date().toISOString()})
    }else{
      uploadFileHandler(req, res)
    }
  })
});
app.delete("/images/:filename", deleteFile )
app.get("/ping", function(req, res){
  const msg = "received ping at " + new Date().toISOString()
  console.log(msg)
  res.json({message: msg})
})

app.listen(port, () => { //start server
    console.log("Server started...")
    console.log("config: ", {port: port, sizeLimit_kb: sizeLimit, corsSettings: corsSetting, allowedFillextensions: allowedFillextensions, destFolder: destFolder, formField: formField})
    console.log("listening on port " + port)
});

function uploadFileHandler(req, res) {
  try{
    console.log("uploaded file", req.body, req.file);
    res.status(201)
    res.json({
      message: "successfully uploaded file",
      mimetype: req.file["mimetype"],
      filename: req.file["filename"],
      date: new Date().toISOString()
    });
  }catch(err){
    res.status(500)
    res.json({message: "unable to upload file " + req.file.originalname, error: err.message, date: new Date().toISOString()})
  }
}

function deleteFile(req, res){
  console.log("received delete request", req.path, req.params)
  if (!req.params.filename) {
    console.log("no file received");
    res.status(404)
    res.json({message: "path param /{filename} missing"})
  } else {
    console.log('try to delete file ' + req.params.filename);
    try {
        fs.unlinkSync( destFolder + req.params.filename );
        console.log('deleted file ' + req.params.filename);
        res.json({
          message: "successfully deleted file",
          filename: req.params.filename,
          date: new Date().toISOString()
        });
      } catch (err) {
        console.log('error while deleting file ' + req.params.filename);
        res.status(500)
        res.json({
          message: "unable to deleted file",
          error: err.message,
          filename: req.params.filename,
          date: new Date().toISOString()
        });
      }
  }

}

function toUnixPath(path){
  return path.replace(/[\\/]+/g, '/').replace(/^([a-zA-Z]+:|\.\/)/, '')
}
