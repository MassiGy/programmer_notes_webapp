module.exports.get_home_page = (req, res) => {
    res.render("index");
};

module.exports.get_all = (req,res) => {
    res.status(400).redirect("/");
}