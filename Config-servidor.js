const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// establecer motor de plantilas embebidas de javascript
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.static(path.join(__dirname, '../static')))
app.use(express.static(path.join(__dirname, '/public')));

module.exports = app;