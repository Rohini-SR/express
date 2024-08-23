const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const {logger} = require('./middleware/logEvents')
const logEvents = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500;
app.use(cors())

//cross origin resource sharing

const whitelist = ['https://www.google.com', 'http://127.0.0.1.5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin,callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(logger)

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./public')))
app.use('/',express.static(path.join(__dirname,'./public')))
app.use('/subdir',express.static(path.join(__dirname,'./public')))
app.use('/',require('./routes/roots'))
app.use('/subdir',require('./routes/subdir'))

app.get('/*',(req,res)=>{
    res.status(path.join(__dirname, 'views','404.html'))
})
app.use(errorHandler)
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`)
)
