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
    .get((req, res) => {
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