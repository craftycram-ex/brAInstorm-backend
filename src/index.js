/* eslint-disable linebreak-style */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');

const logPath = path.join(__dirname, '../res/iplog.txt');
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const URL = 'https://api.openai.com/v1/engines/davinci/completions';
const filterURL = 'https://api.openai.com/v1/engines/content-filter-alpha-c4/completions';
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

// Erstellt Express Anwendung
const app = express();
app.use(express.json());
app.use(cors());


// startet Server
const server = http.createServer(app);
server.listen(3000);
// eslint-disable-next-line no-console
console.log(Date.now(), 'Server gestartet @ 3000');