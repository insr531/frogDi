"use strict";
const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const googleApi = require("./routes/googleApi");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/googleApi", googleApi);

app.get('/', (req, res) => res.send('home page'));


app.listen(PORT, () => console.log(`Server Started ${PORT}`));