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
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
const sessionFileStore = require("session-file-store")(session);

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
// for compressing our req/res cycles
app.use(compression());
// for security
app.use(helmet());


app.use(session({
    name: String(process.env.SESSION_NAME),
    secret: String(process.env.SESSION_SECRET),
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 50 * 1 * 24 * 60 * 60 * 1000, // recreate every 50days, since ressources do not change often
        path: "/"
    }
}));




app.use((req, res, next) => {

    // only create the session if its not already created or outdated.
    if (req.session && req.session.file_names?.length && req.session.files?.length) {
        
        res.locals.files = req.session.files;
        res.locals.file_names = req.session.file_names;
        return next();
    }
    
  
    // find all the file names
    req.session.file_names = fs.readdirSync("./controllers/ressources", (err, files) => {
        if (err) res.status(500).send("Ressources can not be found!");
        return files;
    });

    // Delete the Guide file to not be rendred twice (look to the view)
    req.session.file_names.splice(req.session.file_names.indexOf("Guide.txt"), 1);
    req.session.files = [];

    req.session.file_names.forEach((file) => {
        req.session.files.push({
            file_name: file,
            sample_text: fs.readFileSync(
                `./controllers/ressources/${file}`,
                "utf-8",
                function (err, file_content) {
                    if (err) return "file content is empty or can not be accessed.";
                    return file_content;
                }).toString().substring(0, 70).concat("...")
        })
    });

    res.locals.files = req.session.files;
    res.locals.file_names = req.session.file_names;
    next();
})



// activate our imported routes


// legacy api routes - text files based
app.use("/legacy/files", file_routes);
app.use("/legacy/cms", cms_routes);
app.use("/legacy", other_routes);


// new api routes   - github gists based







app.listen(port, (req, res) => {
    console.log('server started on ' + port);
})


