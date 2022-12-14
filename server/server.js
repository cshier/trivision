console.clear()
require('dotenv').config()
const Express = require('express'),
      //global Express.js setup
      app = Express(),
      port = process.env.PORT,
      path = require('path'),
      staticPath = path.join(__dirname,'..', 'client/'),
      serveStatic = Express.static(staticPath, {
        index: 'index.html'
      }),
      apiController = require('./controllers/api-controller'),
      uploadController = require('./controllers/upload-controller'),
      //global database setup
      { testConnection } = require('./Models/connectToDb');

app.use(Express.json())
testConnection()
app.use('/api', apiController)
app.use('/up', uploadController)
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