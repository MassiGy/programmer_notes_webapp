const fs = require("fs");
const path = require('path');


/** These are for the /legacy & /new routes  */

module.exports.render_file_samples = (req, res) => {
    /*
        When the index ejs page is processed the mode will affect the end
        result.

        if legacy then add title, sample text & download btn
        if new then add only the title
    */
    res.render("index");
}

module.exports.render_file_content = (req, res) => {

    const { file_name } = req.params;

    if (res.locals.mode == "new") {

        /* 
            if mode == new then find the right gist.
        */
        let data = {};


        const target_gist = res.locals.gists.filter(gist => gist.gist_name == file_name)[0];

        // content should be html, since in ejs it is not escaped.
        data.content = `<script src="${target_gist.gist_url}.js"></script>`
        data.title = target_gist.gist_name;

        return res.render("generic", { data });
    }

    fs.readFile(`./controllers/ressources/${file_name}`, "utf-8", (err, file_content) => {
        if (err) {
            return res.status(500).send("File Can Not Be Viewed.");
        }
        if (!file_content) return res.status(404).send("File Can Not Be Viewed.");

        let data = {}

        // content should be html, since in ejs it is not escaped.
        data.content = file_content.replace(/\n/g, "<br>")
        data.title = req.params.file_name;

        return res.render("generic", { data });
    })
};


/** These are only for the /legacy routes */

module.exports.upload_file = (req, res) => {
    res.redirect("/");
};

module.exports.delete_file = (req, res) => {
    fs.unlink(`./controllers/ressources/${req.body.file_to_delete}`, function (err) {
        if (err) return res.status(404).send("file not found");
        res.redirect("/");
    })
}

module.exports.download_file = (req, res) => {
    res.download(path.join(__dirname, `./ressources/${req.params.file_name}`), `${req.params.file_name}`, function (err) {
        if (err) return res.status(404).send("file not found");
    })
}
