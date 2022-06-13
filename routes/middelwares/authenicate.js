module.exports.authenicate = (req, res, next) => {
    if (req.body.api_key === process.env.API_KEY) return next();
    return res.status(401).send("Unauthorized");
};