const path = require('path')
const express = require('express')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const hbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const { formatDate, editIcon, truncate, stripTags, select } = require('./utils/hbs')

//load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

connectDB()

//aplication
const app = express()

//logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//ststic folder
app.use(express.static(path.join(__dirname, './public')))

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//view engine setup
app.engine('.hbs', hbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: { formatDate, editIcon, truncate, stripTags, select }
}))
app.set('view engine', '.hbs')
app.set("views", "./views")

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

//run the server
const PORT = process.env.SERVER_PORT || 4000
app.listen(PORT, () => {
    console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`)
})