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
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const axios = require("axios");


// import our route hundlers
const file_routes = require("./routes/files_routes");
const cms_routes = require("./routes/cms_routes");
const other_routes = require("./routes/other_routes");



// app config
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/images", express.static(__dirname + '/images'));
app.use(express.static('public'));
// for normal html5 forms
app.use(express.urlencoded({ extended: true }));
// for hundling forms with http verbs diffrent then GET | POST.
app.use(methodOverride("_method"))
// for compressing our req/res cycles
app.use(compression());
// for security , we've disabled it since it blocks scripts due to Content Security Policy errors.
// app.use(helmet());

// to parse our cookies
app.use(cookieParser());



app.use(async (req, res, next) => {


    /* 
        The mode is either legacy or new
        legacy for text based content
        new for the github gists based content

        the mode is retreived from the actual req path
    */
    res.locals.mode = req.originalUrl.split("/")[1];

    // declare our variables
    let file_names;
    let gists_names;
    let gists_ids;

    // declare our cookie options
    const cookiesOptions = {
        httpOnly: process.NODE_ENV == "production",
        maxAge: 3 * 24 * 60 * 60 * 1000
    }


    try {
        // try to get the cookies if any
        file_names = req.cookies.file_names;
        gists_names = req.cookies.gists_names;
        gists_ids = req.cookies.gists_ids;

    } catch (error) {
        // otherwise, set our variable to null
        file_names = null;
        gists_names = null;
        gists_ids = null;
    }


    // if no file_names in cookie
    if (!file_names) {

        // find all the file names
        file_names = fs.readdirSync("./controllers/ressources", (err, files) => {
            if (err) res.status(500).send("Ressources can not be found!");
            return files;
        });

        // Delete the Guide file to not be rendred twice (look to the view)
        file_names.splice(file_names.indexOf("Guide.txt"), 1);
        
        // add the filename to a cookie to not overload our fs api
        res.cookie(
            "file_names",
            file_names,
            cookiesOptions
        );

    }

    // if no gists data
    if (!gists_names || !gists_ids) {


        // get my github gists
        const response = await axios.get("https://api.github.com/users/MassiGy/gists");

        // get the names
        gists_names = response.data.map(el => Object.values(el.files)[0].filename);
        // get the ids
        gists_ids = response.data.map(el => String(el.html_url).substring(String(el.html_url).lastIndexOf("/") + 1));

        // add the data as cookies to not overload github api
        res.cookie(
            "gists_names",
            gists_names,
            cookiesOptions
        );
        res.cookie(
            "gists_ids",
            gists_ids,
            cookiesOptions
        );

    }


    // add the filenames & the gists data to the locals to have access to them from the views
    res.locals.gists_names = gists_names;
    res.locals.gists_ids = gists_ids;
    res.locals.file_names = file_names;

    // go to the next middleware.
    return next();

});



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


