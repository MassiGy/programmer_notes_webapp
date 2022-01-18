const express = require("express");
const router = express.Router();
const cms_controllers = require("../controllers/cms_controllers");


router.get("/", cms_controllers.get_cms_forms);

module.exports = router