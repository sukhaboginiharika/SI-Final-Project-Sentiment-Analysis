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

const key = "PLACE_YOUR_AZURE_API_KEY_HERE"
const endpoint = "PLACE_YOUR_AZURE_ENDPOINT_HERE"

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
 *         description: Input to send to Sentiment API in Azure with key as text.
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
 *         description: Input to send to Sentiment Opnion API in Azure with key as text.
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
  var text = req.body.text;
    const sentimentInput = [
      {
        text: text,
        id: "0",
        language: "en"
      }
    ];
    console.log(typeof(sentimentInput))
    try{
     const results = await textAnalyticsClient.analyzeSentiment(sentimentInput, { includeOpinionMining: true });
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
}
catch(err){
  console.log(err);
}
});
