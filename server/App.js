const express = require('express');
const multer = require('multer');
// const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload', upload.single('textFile'), (req, res) => {
    console.log("uploaded");
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const text = req.file.buffer.toString(); 
      const wordFrequency = analyzeText(text);
    
      res.json({ message: 'File uploaded and analyzed successfully', wordFrequency });
    });
    
    function analyzeText(text) {
      
      const words = text.split(/\s+/);
    
      const wordCount = {};
      words.forEach((word) => {
        const cleanedWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // Remove punctuation
        if (cleanedWord) {
          wordCount[cleanedWord] = (wordCount[cleanedWord] || 0) + 1;
        }
      });
   
  const coOccurrences = {};
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const word2 = words[i + 1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (word1 && word2) {
      const pair = `${word1} ${word2}`;
      coOccurrences[pair] = (coOccurrences[pair] || 0) + 1;
    }
  }

  const sortedWordFrequency = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
  const sortedCoOccurrences = Object.entries(coOccurrences).sort((a, b) => b[1] - a[1]);

  const top5Words = sortedWordFrequency.slice(0, 5);
  const top5CoOccurrences = sortedCoOccurrences.slice(0, 5);
return {
    wordFrequency: sortedWordFrequency,
    coOccurrences: sortedCoOccurrences,
    top5Words,
    top5CoOccurrences,
  };

};
app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});