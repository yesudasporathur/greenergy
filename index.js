const express = require('express');
const multer  = require('multer');
const app = express();
const port = 3000;

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });

// Route to handle multiple file upload
app.post('/upload', upload.array('images', 5), (req, res) => {
  // Files uploaded successfully
  res.send('Files uploaded');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
