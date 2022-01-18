if (process.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require('express');
const app = express();
const path = require('path');
const ejs_mate = require('ejs-mate');
const fs = require("fs");
const port = process.env.PORT || 8000;
const multer = require("multer");
const methodOverride = require("method-override");



const storage_config = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./ressources")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

// for multipart/form-data html5 forms
// this will append to the req object the body and file(s) object
// the body object will be filled as it was done by express.urlencoded method.
// the file(s) object will be filled and parsed so as it contains the passed file(s)
const upload = multer({ storage: storage_config })




// app config
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/assets", express.static('assets'));
app.use("/images", express.static('images'));
// for normal html5 forms
app.use(express.urlencoded({ extended: true }));
// for hundling forms with http verbs diffrent then GET | POST.
app.use(methodOverride("_method"))

// import our cached data 
const  {file_names,files} = require("./cache/files");

app.use((req, res, next) => {
    res.locals.file_names = file_names;
    res.locals.files = files;
    next();
})


app.get("/", (req, res) => {
    res.render("index");
})



app.get("/files/:file_name", (req, res) => {
    const { file_name } = req.params;

    fs.readFile(`./ressources/${file_name}`, "utf-8", (err, file_content) => {
        if (err) {
            return new Error(err.message);
        }
        let data = {}
        data.content = file_content.replace(/\n/g, "<br>")
        data.title = req.params.file_name;
        res.render("generic", { data });
    })
})


app.get("/cms", (req, res) => {
    res.render("cms");
})

app.get("/files/search/:query", (req,res)=>{
    const found_data = file_names.filter((name => name.includes(req.params.query)))
    if(found_data) res.status(200).json(found_data);
})

app.post("/files/search", (req,res) => {
    if(file_names.includes(req.body.query)) return res.redirect(`/files/${req.body.query}`)    
    else res.status(404).send("File Not Found");
})


function authenicate(req, res, next) {
    if (req.body.api_key === process.env.api_key) return next()
    res.status(401).send("Unauthorized")
}

app.post("/files", upload.array("uploaded_files"), authenicate, (req, res) => {
    res.redirect("/");
})

app.delete("/files", authenicate, (req, res) => {
    fs.unlink(`./ressources/${req.body.file_to_delete}`, function (err) {
        if (err) return res.status(404).send("file not found");
        res.redirect("/");
    })
})
app.post("/files/:file_name", (req, res) => {
    res.download(path.join(__dirname, `./ressources/${req.params.file_name}`), `${req.params.file_name}`, function (err) {
        if (err) res.status(404).send("file not found");
    })
})





















app.listen(port, (req, res) => {
    console.log('server started on ' + port);
})


