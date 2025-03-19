require('dotenv').config();
const express = require("express")
const { createtable } = require('./db')
const http = require('http')
const path = require('path')

// FOR WEB

const systemUser = require('./Routes/SystemUsers')
const User = require('./Routes/Usres')
const Otp = require('./Routes/Otp')
const Task = require('./Routes/Task')
const Tc = require('./Routes/T & C')
const Request = require('./Routes/Request')
const Transaction = require('./Routes/Transection')
const Bids = require('./Routes/Bids')
const Categories = require('./Routes/Categories')
const SubCategories = require('./Routes/SubCategories')












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
app.use('/task', Task)
app.use('/t&C', Tc)
app.use('/request', Request)
app.use('/transections', Transaction)
app.use('/Bids', Bids)
app.use('/categories', Categories)
app.use('/sub-categories', SubCategories)





const port = 3001 || process.env.appport
const sarver = http.createServer(app)
sarver.listen(port, () => {
    console.log("servar is running at port", +port)

});