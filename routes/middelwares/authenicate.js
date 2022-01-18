module.exports.authenicate = (req, res, next) => {
    if (req.body.api_key === process.env.API_KEY) return next()
    res.status(401).send("Unauthorized")
};