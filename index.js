require('dotenv').config();
const express = require("express")
const { createtable } = require('./db')
const http = require('http')
const path = require('path')

// FOR WEB

const systemUser = require('./Routes/SystemUsers')
const User = require('./Routes/Usres')
const Otp = require('./Routes/Otp')
const BlockedNumber = require('./Routes/BlockedNumber')
const Payments = require('./Routes/payments')
const Donate = require('./Routes/DonateNumbers')





var cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { create } = require('domain');

const createtable1 = () => {
    try {
        createtable();
    }
    catch (error) {
        console.log("error", error)
    }
}
createtable1()

const app = express()
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '100mb', extended: 'true' }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use('/storege', express.static(path.join(__dirname, 'storege')));


app.use('/systemuser', systemUser)
app.use('/user', User)
app.use('/otp', Otp)
app.use('/blockednumber', BlockedNumber)
app.use('/payments', Payments)
app.use('/donate', Donate)





const port = 3001 || process.env.appport
const sarver = http.createServer(app)
sarver.listen(port, () => {
    console.log("servar is running at port", +port)

});