import fs from "fs";
export default function saveToFile(
    content,
    filename,
    relativePathOfFolder = "scrappedContent",
    fileType = "json"
) {
    // creates folder if it does not exist
    if (!fs.existsSync(relativePathOfFolder)) {
        fs.mkdirSync(relativePathOfFolder);
    }
    // writes the files
    let data;
    if (fileType.lower() === "json") {
        data = JSON.stringify(content);
    } else {
        data = content;
    }
    fs.writeFile(
        `${relativePathOfFolder}/${filename}.${fileType}`,
        data,
        (err) => {
            if (err) throw err;
            console.log(
                `data saved to ${relativePathOfFolder}/${filename}.${fileType}`
            );
        }
    );
}
