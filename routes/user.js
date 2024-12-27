const express = require('express');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const TifFile = require('../models/TifFile');
const User = require('../models/User');
const Log = require('../models/Log');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Register User

router.post('/register', upload.single('tifFile'), async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
  
      const { name, houseNumber, floor, age, email } = req.body;
  
      // Read file content and hash it
      const fileBuffer = fs.readFileSync(req.file.path);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  
      // Save the file hash and file path
      const tifFile = new TifFile({ hash, filePath: req.file.path });
      await tifFile.save();
  
      // Save user details with the file hash
      const user = new User({ name, houseNumber, floor, age, email, tifHash: hash });
      await user.save();
  
      res.status(201).send('User registered successfully');
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user');
    }
  });

// Check Access
router.post('/check-access', upload.single('tifFile'), async (req, res) => {
    try {
      // Read file content and hash it
      const fileBuffer = fs.readFileSync(req.file.path);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  
      // Check if a user exists with this hash
      const user = await User.findOne({ tifHash: hash });
      if (user) {
        // Log access to MongoDB
        const log = new Log({ userName: user.name });
        await log.save(); // Saves the log entry
  
        // Respond with success message
        res.send(`Access Granted for ${user.name}`);
      } else {
        // Respond with failure message
        res.send('Access not granted. Contact Admin.');
      }
    } catch (err) {
      console.error('Error checking access:', err);
      res.status(500).send('Error checking access');
    }
  });

  router.get('/logs', async (req, res) => {
    try {
      const logs = await Log.find().sort({ accessTime: -1 });
      res.json(logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      res.status(500).send('Error fetching logs');
    }
  });

module.exports = router;