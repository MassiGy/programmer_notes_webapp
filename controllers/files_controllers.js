const fs = require("fs");
const path = require('path');



module.exports.render_file_samples = (req, res) => {
    res.render("index");
}

module.exports.render_file_content = (req, res) => {

    const { file_name } = req.params;

    fs.readFile(`./controllers/ressources/${file_name}`, "utf-8", (err, file_content) => {
        if (err) {
            return res.status(500).send("File Can Not Be Viewed.");
        }
        if (!file_content) return res.status(404).send("File Can Not Be Viewed.");

        let data = {}
        data.content = file_content.replace(/\n/g, "<br>")
        data.title = req.params.file_name;

        return res.render("generic", { data });
    })
};

module.exports.get_search_suggestion = (req, res) => {

    const found_data = res.locals.file_names.filter((name => name.includes(req.params.query)));

    if (found_data && found_data.length) return res.status(200).send(found_data);
    return res.status(404).send(null);
};


module.exports.send_search_resault = (req, res) => {
    if (res.locals.file_names.includes(req.body.query.toString())) {
        return res.redirect(`/files/${req.body.query}`);
    }
    return res.status(404).send("File Not Found");
};

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
