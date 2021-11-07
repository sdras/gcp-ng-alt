'use strict';

const express = require('express');
const app = express();
const port = 3000;

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/Users/sdrasner/misc/ml-ai.json';

app.get('/analysis', async (req, res) => {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();

  const [labelRes] = await client.labelDetection(req.query.image);

  // perform label detection
  const labels = labelRes.labelAnnotations;

  // log the labels
  const labelArr = labels.map(label => label.description);
  const labelDesc = `Google sees ${labelArr.slice(0, 3).join(', ')}`

  // perform text detection
  const [textRes] = await client.textDetection(req.query.image);
  const detections = textRes.textAnnotations;
  const [text, ...others] = detections;
  const fullText = text.description.replace(/(\r\n|\n|\r)/gm, " ");
  
  const database = {
    analysis: [
      { 'labels': labelDesc },
      { 'text': `Google reads ${fullText}` }
    ]
  };
  console.log(JSON.stringify(database));
  res.json(database);
})

app.listen(port, () => {
  console.log('Listening on port: ' + port);
})

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});