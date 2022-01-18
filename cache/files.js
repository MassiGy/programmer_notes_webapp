const fs = require("fs");


// cache the files_names to avoid fetching it in every 
// REQ:RES cycle
let file_names = [];

// cache the files samples to avoid fetching it in every 
// REQ:RES cycle
let files = [];


function _updater() {
    // this function will take the two object by refrence
    // it will take them with thier addresses
    // and then update them.
    let file_names_array = fs.readdirSync("./ressources", (err, files) => {
        if (err) throw new Error(err.message);
        return files;
    });

    let files_array = [];
    file_names_array.forEach((file) => {
        files_array.push({
            file_name: file,
            sample_text: fs.readFileSync(`./ressources/${file}`, "utf-8", function (err, file_content) {
                if (err) return "file content can not be accessed.";
                return file_content;
            }).toString().substring(0, 70).concat("...")
        })
    })
    return { file_names_array, files_array };
}


// update the cache according to a schedual
const temp = _updater(files, file_names);
file_names = temp.file_names_array;
files = temp.files_array;
setInterval(function () {
    const temp = _updater(files, file_names);
    file_names = temp.file_names_array;
    files = temp.files_array;
    
    console.log("intervaled update executed")
}, 2 * 60 * 1000)


// export the addresses
module.exports = {
    file_names: file_names,
    files: files,
}