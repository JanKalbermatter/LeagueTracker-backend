const mongoose = require('mongoose')
const sinon = require('sinon')
const LogController = require('../controllers/log.controller')
const LogModel = require('../models/log.model')


describe('Log Controller', () => {
    const req = {
        body: { // for testing addLog
            entryDate: 12312412,
            message: 'Log Message',
            level: 1, 
            extraInfo: [],
            logWithDate: true
        }, 
        params: {
            logId: "5aa06bb80738152cfd536fdc" // for testing get, delete and update vehicle
        }
    }
    let res = {}
    let expectedResult;

    const expectedLogs = [
        {
            _id: "5aa06bb80738152cfd536fdc",
            entryDate: 12312412,
            message: 'Log Message',
            level: 1, 
            extraInfo: [],
            logWithDate: true
        }, 
        {
            _id: '7be06bb80723152cfd536fdc',
            entryDate: 12312412,
            message: 'Log Message',
            level: 1, 
            extraInfo: [],
            logWithDate: true
        }
    ]

    beforeAll(() => {
        sinon.stub(mongoose.Model, 'find').callsFake(() => {
            return expectedLogs
        })

        sinon.stub(mongoose.Model, 'findOne').callsFake((params) => {
            const id = params._id.toString()
            return expectedLogs.find((log) => {
                return log._id === id
            })
        })

        sinon.stub(mongoose.Model.prototype, 'save').callsFake(function() {
            return this
        })
    })

    beforeEach(() => {
        res = {
            json: sinon.spy(), 
            status: sinon.stub().returns({end: sinon.spy(), json: sinon.spy()}),
            send: sinon.spy()
        }
    })

    test('should return created Log Object', () => {
        expectedResult = req.body
        let returnVal = LogController.addLog(req, res)
        sinon.stub(LogController, 'addLog').yields(null, expectedResult)

        sinon.assert.calledOnce(LogModel.prototype.save) // save has been called on mongoose model
        expect(returnVal.entryDate).toBe(expectedResult.entryDate) // created log object is returned
        expect(returnVal.message).toBe(expectedResult.message)
        expect(returnVal).toHaveProperty('_id') // mongoose automatically added the _id property

    })

    test('should return all Objects', () => {
        expectedResult = req.body
        let returnVal = LogController.getAllLogs(null, res)

        sinon.assert.calledOnce(LogModel.find) // find has been called once on mongoose model
        expect(returnVal[0].entryDate).toBe(expectedLogs[0].entryDate) // all log objects are returned
        expect(returnVal[0].message).toBe(expectedLogs[0].message)
        expect(returnVal.length).toBe(2)
    })

    test('should return Object by id', () => {
        expectedResult = req.body
        let returnVal = LogController.getLogById(req, res)

        sinon.assert.calledOnce(LogModel.findOne) // findOne has been called on mongoose model
        expect(returnVal._id).toBe(req.params.logId) // got correct log object
        expect(returnVal.entryDate).toBe(expectedResult.entryDate)
        expect(returnVal.message).toBe(expectedResult.message)
    })
})