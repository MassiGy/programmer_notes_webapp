const express = require("express");
const router = express.Router();
const file_controllers = require("../controllers/files_controllers");
const {authenicate} = require("./middelwares/authenicate");
const {upload} = require("./middelwares/upload");

router.get("/", file_controllers.render_file_samples);
router.get("/:file_name", file_controllers.render_file_content);
router.get("/get_suggestions/:query", file_controllers.get_search_suggestion);

router.post("/", upload.array("uploaded_files"),authenicate, file_controllers.upload_file);
router.post("/search", file_controllers.send_search_resault)
router.post("/:file_name", file_controllers.download_file)



router.delete("/", authenicate,file_controllers.delete_file);


module.exports = router;