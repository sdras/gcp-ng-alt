'use strict';

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/Users/sdrasner/misc/ml-ai.json';

function main() {
  async function useVision() {
    const database = { analysis: [] };
    
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();

    const [res] = await client.labelDetection(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/heygirl.jpg'
    );

    // perform label detection
    const labels = res.labelAnnotations;

    // log the labels
    // console.log('Labels:');
    const labelArr = labels.map(label => label.description);
    const labelDesc = `Google sees ${labelArr.join(', ')}`
    database.analysis.push({'labels': labelDesc})

    // perform text detection
    const [result] = await client.textDetection(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/heygirl.jpg'
    );
    const detections = result.textAnnotations;
    const [text, ...others] = detections;
    const fullText = text.description.replace(/(\r\n|\n|\r)/gm, " ");
    database.analysis.push({'text': `Google reads ${fullText}`})

    console.log(JSON.stringify(database, null, 2));
  }

  useVision();
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main(...process.argv.slice(2));