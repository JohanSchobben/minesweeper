const ghPages= require("gh-pages");
const fs = require('fs');
const path = require("path");

const indexHtml = path.join(__dirname, "www", "minesweeper", "index.html")

fs.readFile(indexHtml, "utf-8", function(err, data) {
  if (err) throw err;

  const newData = data.replace(/\/build/, "build");
  fs.writeFile(indexHtml, newData, 'utf-8', function (err) {
    if (err) throw err;
    ghPages.publish("www/minesweeper")
    console.log('update complete');
  });
})


