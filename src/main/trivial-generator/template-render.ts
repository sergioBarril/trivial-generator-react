import ejs from "ejs";
import fs from "fs";

import counter from "./counter.ejs?asset";

export async function renderTemplate() {
  // Data to pass to the template
  const data = {
    count: 0 // Initial count value
  };

  // Render the template with the data
  const renderedHtml = await ejs.renderFile(counter, data);

  // Save the rendered HTML to a file (optional)
  const outputPath = "./counter.html";
  fs.writeFileSync(outputPath, renderedHtml);

  // Log success message
  console.log('EJS template rendered successfully. Open "counter.html" to view the result.');
}
