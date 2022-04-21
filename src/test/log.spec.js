const mongoose = require("mongoose")
const db = require("../models");
const supertest = require("supertest")

const createServer = require("../server")
const app = createServer();

// Test Log-Objekt
const Log = db.log;
const testLog = {
    entryDate: 1234,
    message: "Testing",
    level: 1,
    extraInfo: [],
    logWithDate: false
  };

// Verbindungs-String für MongoDB in .env
require("dotenv").config();
const connectionString = process.env.ATLAS_URI_TEST;

// MongoDB connection öffnen
beforeEach((done) => {
    mongoose.connect(
    connectionString, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, 
    () => done());
})

// Alle Log Daten löschen
afterEach((done) => {
    Log.deleteMany({}).then(() => done())
})

// Connection schliessen
afterAll((done) => {
    mongoose.connection.close(() => done())
})

// Erstellt neuer Log
test("POST /api/v1/log", async () => {

    await supertest(app)
        .post("/api/v1/log")
        .send(testLog)
        .expect(200)
        .then(response => {
            delete response.body.log.__v
            delete response.body.log._id
            expect(response.body.log).toStrictEqual(testLog)
        })
})

// Get all Logs 
test("GET /api/v1/log", async () => {
    // Log erstellen
    await supertest(app)
        .post("/api/v1/log")
        .send(testLog)

    // Check ob log erstellt wurde
    await supertest(app)
      .get("/api/v1/log")
      .expect(200)
      .then(response => {
        const log = response.body[0]
        expect(response.body.length).toBe(1)
        delete log.__v
        delete log._id
        expect(log).toStrictEqual(testLog)
      })
})

