require('dotenv').config()
const express = require('express'),
      app = express(),
      port = process.env.PORT,
      path = require('path'),
      staticPath = path.join(__dirname,'..', 'client/'),
      serveStatic = express.static(staticPath, {
        extensions: ['htm', 'html'],
        index: 'index.html'
      });

app.use(serveStatic)

app.listen(port, () => {
  console.log(`now listening at: ${port}`)
})