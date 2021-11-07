'use strict';

const cors = require('cors'); 
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/Users/sdrasner/misc/ml-ai.json';

app.post('/analysis', async (req, res) => {
  try {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();

    console.log(JSON.stringify(req.body));
    var buf = req.body.imageUrl;
    if (buf === undefined) {
      console.log("Falling back to image data field");
      buf = Buffer.from(req.body.imageData, 'base64');
    }

    // perform label detection
    const [labelRes] = await client.labelDetection(buf);
    if (labelRes.error !== null) {
      console.log("Failed to label")
      throw labelRes.error
    }

    // create the appropriate labels
    const labels = labelRes.labelAnnotations;
    const labelArr = labels.map(label => label.description);
    const labelDesc = labelArr.slice(0, 3).join(', ')

    // perform text detection
    const [textRes] = await client.textDetection(buf);
    if (textRes.error !== null) {
      console.log("Failed to provide a text label")
      throw textRes.error
    }

    // create the description from it
    const detections = textRes.textAnnotations;
    const [text, ...others] = detections;
    const fullText = text.description.replace(/(\r\n|\n|\r)/gm, " ");
    
    const database = {
      analysis: `Google sees ${labelDesc}. Google reads ${fullText}`
    };
    res.json(database);
  } catch(err) {
    res.json({ "error": err });
    console.warn(err);
  }
})

app.listen(port, () => {
  console.log('Listening on port: ' + port);
})

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});