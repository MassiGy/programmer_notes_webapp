const fs = require("fs");
const { Client, Schema, Repository, Entity } = require("redis-om");

class File extends Entity { };

const file_schema = new Schema(File,

    {
        file_name: { type: "string", textSearch: true },
        sample_text: { type: "string", textSearch: true },
    }
    ,
    {
        dataStructure: "JSON",
    }
);

// main function | execution context
(async function () {
    // declare an iefe to establish the connection with redis via the 
    // client class
    let client = new Client();
    await client.open("redis://localhost:6379");

    // declare a new collection in the newly created client behalf.
    const file_collection = new Repository(file_schema, client);

    // save some data 
    let files = [];
    // find all files in the ressources dir
    files = fs.readdirSync("./ressources/", (err, files) => {
        if (err) return new Error(err.message);
        return files;
    });

    // save each file in the collection.

    let ids = files.forEach(async(file) => {
        // create an empty entity.
        let el = file_collection.createEntity();

        // populate this entity according to the schema.
        el.file_name = file.toString();
        el.sample_text = fs.readFileSync(`./ressources/${file}`, "utf-8", function (err, file_content) {
            if (err) return new Error(err.message);
            return file_content;
        }).toString().substring(0, 100).concat("...");
        console.log(el);
        
        // save the entity.
        await file_collection.save(el);
    });

})(); 

