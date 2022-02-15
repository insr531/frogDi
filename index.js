const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const googleApi = require("./routes/googleApi");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("client/build"));

app.use("/googleApi", googleApi);

app.listen(PORT, () => console.log(`Server Started ${PORT}`));