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
const axios = require("axios");


// import our route hundlers
const file_routes = require("./routes/files_routes");
const cms_routes = require("./routes/cms_routes");
const other_routes = require("./routes/other_routes");


/*
    the session store is memory based to make the dev faster.
    This is not a good practice, but since we do not expect a lot of clients it is okey.
    Also we made the session age relatively small. This will automatically force nodejs to free them
    when the user access them again.

    I tried to implement file base session storage, but something did not work with the used package.
    My css did not work anymore when setting up the session file store.
*/

app.use(session({
    name: String(process.env.SESSION_NAME),
    secret: String(process.env.SESSION_SECRET),
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000, // recreate every 1 hour, since ressources do not change often
    }
}));



// app config
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/images", express.static(__dirname + '/images'));
// for normal html5 forms
app.use(express.urlencoded({ extended: true }));
// for hundling forms with http verbs diffrent then GET | POST.
app.use(methodOverride("_method"))
// for compressing our req/res cycles
app.use(compression());
// for security , we've disabled it since it blocks scripts due to Content Security Policy errors.
// app.use(helmet());





app.use(async (req, res, next) => {


    /* 
        The mode is either legacy or new
        legacy for text based content
        new for the github gists based content

        the mode is retreived from the actual req path
    */
    res.locals.mode = req.originalUrl.split("/")[1];


    // only create the session if its not already created or outdated.
    if (req.session.file_names?.length && req.session.files?.length && req.session.gists?.length) {

        res.locals.files = req.session.files;
        res.locals.file_names = req.session.file_names;

        res.locals.gists = req.session.gists;

        return next();
    }


    /** Get the local ressources */
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



    /** Get my github gists */
    const response = await axios.get("https://api.github.com/users/MassiGy/gists");

    req.session.gists = response.data.map(el => {
        return {
            gist_url: el.html_url,
            gist_name: Object.values(el.files)[0].filename,
        };
    })






    res.locals.gists = req.session.gists;
    res.locals.files = req.session.files;
    res.locals.file_names = req.session.file_names;

    return next();
})



// activate our imported routes
app.get("/", (req, res) => res.redirect("/new"));

// legacy api routes - text files based
app.use("/legacy/files", file_routes);
app.use("/legacy/cms", cms_routes);
app.use("/legacy", other_routes);


// new api routes   - github gists based


app.use("/new/files", file_routes);
app.use("/new", other_routes);



app.listen(port, (req, res) => {
    console.log('server started on ' + port);
})


