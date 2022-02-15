"use strict";
const express = require('express');
const { google } = require('googleapis');
const fs = require("fs");
const path = require("path");

const credentials = require('../google_credentials_token/credentials.json');
const TOKEN = require('../google_credentials_token/token.json');

const client_id = credentials.web.client_id;
const client_secret = credentials.web.client_secret;
const redirect_uris = credentials.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.setCredentials(TOKEN);
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const SCOPE = ['https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive']

let router = express.Router();

router
    .route("/")
    .get((req, res) => res.send(' API Running'));

router
    .route("/readFolder/:id")
    .post((req, res) => {
        //if (req.body.token == null) return res.status(400).send('Token not found');
        //oAuth2Client.setCredentials(req.body.token);
        if (TOKEN == null) return res.status(400).send('Token not found');

        drive.files.list({
            pageSize: 100,
            q: "'" + req.params.id + "' in parents"
        }, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                return res.status(400).send(err);
            }
            const files = response.data.files;
            if (files.length) {
                console.log('Files:');
                // files.map((file) => {
                //     console.log(`${file.name} (${file.id})`);
                // });
            } else {
                console.log('No files found.');
            }
            res.send(files);
        });
    });

router
    .route("/fileUpload")
    .post((req, res) => {
        // var form = new formidable.IncomingForm();
        // form.parse(req, (err, fields, files) => {});
        //if (err) return res.status(400).send(err);
        // const token = JSON.parse(fields.token);
        // console.log(token)
        // if (token == null) return res.status(400).send('Token not found');
        // oAuth2Client.setCredentials(token);
        console.log(TOKEN);
        if (TOKEN == null) return res.status(400).send('Token not found');
        // const filePath = path.join(__dirname, 'example.png');
        const filePath = require('./example.png');
        const fileMetadata = {
            name: filePath.name,
        };
        const media = {
            mimeType: filePath.type,
            body: fs.createReadStream(filePath.path),
        };
        drive.files.create(
            {
                resource: fileMetadata,
                media: media,
                fields: "id",
            },
            (err, file) => {
                oAuth2Client.setCredentials(null);
                if (err) {
                    console.error(err);
                    res.status(400).send(err)
                } else {
                    res.send('Successful')
                }
            }
        );

    });

router
    .route("/download/:id")
    .post((req, res) => {
        // if (req.body.token == null) return res.status(400).send('Token not found');
        // oAuth2Client.setCredentials(req.body.token);
        // const drive = google.drive({ version: 'v3', auth: oAuth2Client });
        // var fileId = req.params.id;

        if (TOKEN == null) return res.status(400).send('Token not found');
        var fileId = req.params.id;
        drive.files.get({ fileId: fileId }, (er, re) => { // Added
            if (er) {
                console.log(er);
                return;
            }

            //https://stackoverflow.com/questions/57742157/node-js-how-to-find-the-desktop-path
            const homeDir = require('os').homedir();
            const desktopDir = `${homeDir}/Desktop`;
            var file_path = path.join(desktopDir, re.data.name);
            var dest = fs.createWriteStream(file_path);

            drive.files.get(
                { fileId: fileId, alt: "media" },
                { responseType: "stream" },
                function (err, res) {
                    res.data
                        .on("end", () => { // Modified
                            console.log("done");
                        })
                        .on("error", err => {
                            console.log("Error", err);
                        })
                        .pipe(dest);
                }
            );
        });
    });

//Needs at the set up
router
    .route("/getAuthURL")
    .get((req, res) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPE,
        });
        console.log(authUrl);
        return res.send(authUrl);
    });

//create token.json using the code from /getAuthURL
router
    .route("/getToken")
    .post((req, res) => {
        if (req.body.code == null) return res.status(400).send('Invalid Request');
        oAuth2Client.getToken(req.body.code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return res.status(400).send('Error retrieving access token');
            }
            res.send(token);
        });
    });

module.exports = router;