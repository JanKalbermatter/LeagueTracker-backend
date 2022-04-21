const app = require("../server")
const mongoose = require("mongoose")
const supertest = require("supertest");
const Log = require("../models/log.model");
const { collapseTextChangeRangesAcrossMultipleVersions } = require("typescript");

// Verbindungs-String für MongoDB in .env
require("dotenv").config();
const connectionString = process.env.ATLAS_URI;

// Zur MongoDB verbinden
beforeEach((done) => {
    mongoose.connect(
    connectionString, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, 
    () => done());
})

// Daten aus DB löschen
afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    })
})


xtest("POST /api/v1/log", async () => {
    const log = {
        entryDate: 1234,
        message: "Testing POST /api/v1/log",
        level: 1,
        extraInfo: [],
        logWithDate: false
      };

    await supertest(app)
        .post("/api/v1/log")
        .send(log)
        .expect(200)
        .then(response => {
            delete response.body.log.__v
            delete response.body.log._id
            expect(response.body.log).toBe(log)
        })
})

