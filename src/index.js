/* eslint-disable linebreak-style */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const sha512 = require('js-sha512');
const axios = require('axios');

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const URL = 'https://api.openai.com/v1/engines/davinci/completions';
const filterURL = 'https://api.openai.com/v1/engines/content-filter-alpha-c4/completions';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.API_KEY}`,
};

if (!process.env.API_KEY || !process.env.AUTH_KEY || !process.env.ADMIN_KEY || !process.env.USER_LIMIT || !process.env.TOKEN_LIMIT) return console.error('Please set all the required env vars: API_KEY AUTH_KEY ADMIN_KEY USER_LIMIT TOKEN_LIMIT');

// Erstellt Express Anwendung
const app = express();
app.use(express.json());
app.use(cors());

app.post('/solveProblem', async (req, res) => {
  if (req.headers.authorization !== process.env.AUTH_KEY) return res.status(401).send();
  axios.post(URL, req.body, { headers })
    .then(async (r) => {
      const encoded = encode(r.data.choices[0].text)
      await addCounter(encoded.length);
      await res.status(200).send(r.data);
    })
    .catch(() => res.status(500).send('internal server error'));
  return true;
});

app.post('/filterData', (req, res) => {
  if (req.headers.authorization !== process.env.AUTH_KEY) return res.status(401).send();
  axios.post(filterURL, req.body, { headers })
    .then((r) => res.status(200).send(r.data))
    .catch((err) => {
      console.log(err);
      res.status(500).send('internal server error')
    });
});

// startet Server
const server = http.createServer(app);
server.listen(3000);
// eslint-disable-next-line no-console
console.log(Date.now(), 'Server gestartet @ 3000');
