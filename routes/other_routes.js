const express = require("express");
const router = express.Router();
const other_controllers = require("../controllers/other_controllers");


router.get("/",other_controllers.get_home_page);

// this is the final use case | final hundler in the req\res chain
router.all('*',other_controllers.get_home_page);

module.exports = router;