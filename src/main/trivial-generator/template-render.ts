import ejs from "ejs";
import fs from "fs";

import templatePath from "./trivial.template.ejs?asset";

export async function renderTemplate() {
  // Data to pass to the template

  const songs = [
    {
      id: "aSvlULw3zHI",
      anime: "Patata",
      difficulty: "normal",
      band: "Del patio",
      name: "Sergio",
      oped: "Ending"
    }
  ];

  const data = {
    songs
  };

  // Render the template with the data
  const renderedHtml = await ejs.renderFile(templatePath, data);

  // Save the rendered HTML to a file (optional)
  const outputPath = "./trivial.html";
  fs.writeFileSync(outputPath, renderedHtml);

  // Log success message
  console.log('EJS template rendered successfully. Open "counter.html" to view the result.');
}
