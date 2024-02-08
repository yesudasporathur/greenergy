const express = require('express');
const multer  = require('multer');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/imageuploads', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for storing image filenames
const imageSchema = new mongoose.Schema({
  filename: String
});
const Image = mongoose.model('Image', imageSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Generate unique filenames
  }
})
const upload = multer({ storage: storage });

// Route to handle file uploads
app.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    // Save filenames to the database
    const images = req.files.map(file => ({ filename: file.filename }));
    await Image.insertMany(images);
    res.send('Files uploaded and filenames saved to the database.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading files.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
