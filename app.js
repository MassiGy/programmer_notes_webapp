if (process.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const ejs_mate = require('ejs-mate');
const port = process.env.PORT || 8000;
const methodOverride = require("method-override");


// import our route hundlers
const file_routes = require("./routes/files_routes");
const cms_routes = require("./routes/cms_routes");
const other_routes = require("./routes/other_routes");





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



app.use((req, res, next) => {
    res.locals.file_names = fs.readdirSync("./controllers/ressources", (err, files) => {
        if (err) throw new Error(err.message);
        return files;
    });
    res.locals.files = [];
    res.locals.file_names.forEach((file) => {
        res.locals.files.push({
            file_name: file,
            sample_text: fs.readFileSync(
                `./controllers/ressources/${file}`,
                "utf-8",
                function (err, file_content) {
                    if (err) return "file content can not be accessed.";
                    return file_content;
                }).toString().substring(0, 70).concat("...")
        })
    })
    next();
})



// activate our imported routes
app.use("/files", file_routes);
app.use("/cms", cms_routes);
app.use("/", other_routes);









app.listen(port, (req, res) => {
    console.log('server started on ' + port);
})


