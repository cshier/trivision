console.clear()
require('dotenv').config()
const express = require('express'),
      //global express.js setup
      app = express(),
      port = process.env.PORT,
      path = require('path'),
      staticPath = path.join(__dirname,'..', 'client/'),
      serveStatic = express.static(staticPath, {
        index: 'index.html'
      }),
      apiController = require('./controllers/api-controller'),
      //global database setup
      { testConnection } = require('./Models/connectToDb');

app.use(express.json())
testConnection()
app.use('/api', apiController)
app.use(serveStatic)
app.use((req, res) => {
  //this conditional prevents users from navigating to something like
  //george-fitzgerald.com/ApricotLadyDream/butts
  //which would return a blank screen.
  if(req.path.split('/').length > 2){
    res.redirect(301, '/')
  } else {
    res.sendFile(`${staticPath}index.html`)
  }
})

app.listen(port, () => {
  console.log(`\x1b[33m`,`now listening at port:`, `\x1b[35m`, port, `\x1b[0m`)
})