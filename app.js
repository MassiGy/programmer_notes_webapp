if(process.NODE_ENV !="production"){
    require("dotenv").config()
}

const express = require('express');
const app = express();
const path = require('path');
const ejs_mate = require('ejs-mate');
const fs = require("fs");
const port = process.env.PORT || 8000;
const multer = require("multer");

const storage_config = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./ressources")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage_config })




// app config
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/assets", express.static('assets'));
app.use("/images", express.static('images'));
app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
    res.locals.files = fs.readdirSync("./ressources", (err, files) => {
        if (err) throw new Error(err.message);
        return files;
    })
    next();
})


app.get("/", (req, res) => {
    let data = [];
    res.locals.files.forEach((file) => {
        data.push({
            file_name: file,
            sample_text: fs.readFileSync(`./ressources/${file}`, "utf-8", function (err, file_content) {
                if (err) res.status(400).send(err.message);
                return file_content;
            }).toString().substring(0, 100).concat("...")
        })
    })
    res.render("index", { data });
})



app.get("/files/:file_name", (req, res) => {
    const { file_name } = req.params;

    fs.readFile(`./ressources/${file_name}`, "utf-8", (err, file_content) => {
        if (err) {
            throw new Error(err.message);
        }
        let data = {}
        data.content = file_content.replace(/\n/g, "<br>")
        data.title = req.params.file_name;
        res.render("generic", { data });
    })
})


app.get("/upload", (req, res) => {
    res.render("upload");
})

function authenicate(req,res,next){
   if(req.body.api_key===process.env.api_key) return next()
   res.status(401).send("Unauthorized")
}

app.post("/files" ,upload.array("uploaded_files"),authenicate, (req, res) => {
    res.redirect("/");
})


app.post("/files/:file_name", (req, res) => {
    res.download(path.join(__dirname, `./ressources/${req.params.file_name}`), `${req.params.file_name}`, function (err) {
        if (err) res.status(400).send(err.message);
    })
})























app.listen(port, (req, res) => {
    console.log('server started');
})


