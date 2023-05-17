const express = require("express");
const router = express.Router();
const file_controllers = require("../controllers/files_controllers");
const { authenicate } = require("./middelwares/authenicate");
const { upload } = require("./middelwares/upload");

/** These will be triggered on legacy and new modes */

router.get("/", file_controllers.render_file_samples);
router.get("/:file_name", file_controllers.render_file_content);

router.post("/:file_name", file_controllers.download_file)


/** These will be triggered only on legacy mode */

router.post("/", upload.array("uploaded_files"), authenicate, file_controllers.upload_file);
router.delete("/", authenicate, file_controllers.delete_file);


module.exports = router;


/** The trigger mechanism is implemented on the views  */