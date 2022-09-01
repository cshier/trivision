console.clear()
require('dotenv').config()
const express = require('express'),
      //global express.js setup
      app = express(),
      port = process.env.PORT,
      path = require('path'),
      staticPath = path.join(__dirname,'..', 'client/'),
      serveStatic = express.static(staticPath, {
        extensions: ['htm', 'html'],
        index: 'index.html'
      }),
      controller = require('./controllers/controller'),
      //global database setup
      { testConnection } = require('./Models/connectToDb')

testConnection()
app.use('/api/', controller)
app.use(serveStatic)

app.listen(port, () => {
  console.log(`\x1b[33m`,`now listening at port:`, `\x1b[35m`, port, `\x1b[0m`)
})