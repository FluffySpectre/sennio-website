const fs = require("fs");

const packageJSON = JSON.parse(fs.readFileSync("package.json"));

const buildDate = new Date().toLocaleDateString("de-DE");
packageJSON.buildAt = buildDate;

let newJSON = JSON.stringify(packageJSON, null, 2);
newJSON += "\n"; // add a new line
fs.writeFileSync("package.json", newJSON);

console.log("Changed buildAt to: " + buildDate);
