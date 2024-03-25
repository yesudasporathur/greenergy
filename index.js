const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');

const app = express();

// Sample HTML content
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Sample PDF</title>
</head>
<body>
  <h1>Hello, PDF!</h1>
  <p>This is a sample PDF generated using puppeteer in Node.js.</p>
</body>
</html>
`;

// Route to generate PDF and provide download link
app.get('/generate-pdf', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();
    await browser.close();

    res.setHeader('Content-Disposition', 'attachment; filename=sample.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
