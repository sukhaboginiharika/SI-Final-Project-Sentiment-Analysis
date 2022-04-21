"use strict";
const express = require('express');
const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(express.json());
const options = {
    swaggerDefinition: {
        info: {
            title: '6177 Final - Sentiment Analysis',
            version: '1.0.0',
            description: 'Final project using Sentiment Analysis from Azure'
        }
    },
    apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

const {TextAnalyticsClient, AzureKeyCredential} = require("@azure/ai-text-analytics");
const { json } = require('body-parser');

const key = '0f72ae5265c242289a5c582002a154a7';
const endpoint = 'https://text-analytics-instance-si.cognitiveservices.azure.com/';

/**
 * @swagger
 * /sentiment:
 *   post:
 *     tags:
 *       - Sentiment Analysis
 *     description: Calls the Sentiment Analysis API from Azure Text Analytics
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: document
 *         description: Input to send to Sentiment API in Azure.
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully retrieved response
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server Error
 */

const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(bodyParser.json({type: 'application/json'}));

app.post('/sentiment', async (req,res) =>{
  var strInput = JSON.stringify(req.body);
    console.log(strInput);

    const sentimentInput = [
        strInput
    ];
    try{
  const sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput);
  sentimentResult.forEach(document => {
      res.setHeader('Content-Type', 'application/json');
      res.json(sentimentResult);
    
  }); 
}
catch(err){
  console.log(error);
}
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

/**
 * @swagger
 * /opinion:
 *   post:
 *     tags:
 *       - Sentiment Opnion Analysis
 *     description: Calls the Sentiment Opnion Analysis API from Azure Text Analytics
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: document
 *         description: Input to send to Sentiment Opnion API in Azure.
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully retrieved response
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server Error
 */
 
 app.post('/opinion', async (req,res) =>{
  // var strInput = JSON.stringify(req.body);
  //   console.log(strInput);
  var text = req.body.text;
    const sentimentInput = [
      {
        text: text,
        id: "0",
        language: "en"
      }
    ];
    // sentimentInput = String(sentimentInput)
    console.log(typeof(sentimentInput))
    try{
     const results = await textAnalyticsClient.analyzeSentiment(sentimentInput, { includeOpinionMining: true });

    //  for (let i = 0; i < results.length; i++) {
    //    const result = results[i];
    //    console.log(`- Document ${result.id}`);
    //      console.log(`\tDocument text: ${sentimentInput[i].text}`);
    //      console.log(`\tOverall Sentiment: ${result.sentiment}`);
    //      console.log("\tSentiment confidence scores:", result.confidenceScores);
    //      console.log("\tSentences");
    //      res.setHeader('Content-Type', 'application/json');
    //      res.json(results);
    //      for (const { sentiment, confidenceScores, opinions } of result.sentences) {
    //        console.log(`\t- Sentence sentiment: ${sentiment}`);
    //        console.log("\t  Confidence scores:", confidenceScores);
    //        console.log("\t  Mined opinions");
    //        res.json(results);
    //        for (const { target, assessments } of opinions) {
    //          console.log(`\t\t- Target text: ${target.text}`);
    //          console.log(`\t\t  Target sentiment: ${target.sentiment}`);
    //          console.log("\t\t  Target confidence scores:", target.confidenceScores);
    //          console.log("\t\t  Target assessments");
    //         //  res.setHeader('Content-Type', 'application/json');
    //          res.json(results);
    //          for (const { text, sentiment } of assessments) {
    //            console.log(`\t\t\t- Text: ${text}`);
    //            console.log(`\t\t\t  Sentiment: ${sentiment}`);
    //           //  res.setHeader('Content-Type', 'application/json');
    //            res.json(results);
    //          }
    //        }
    //      }
    //  }
      res.setHeader('Content-Type', 'application/json');
      res.json(results);


}
catch(err){
  console.log("sukhabo")
  console.log(err);
}
});