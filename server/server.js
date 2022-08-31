require('dotenv').config()
const express = require('express'),
      app = express(),
      port = process.env.PORT,
      path = require('path'),
      staticPath = path.join(__dirname,'..', 'client/'),
      serveStatic = express.static(staticPath, {
        extensions: ['htm', 'html'],
        index: 'index.html'
      })
      mongoConnection = require('./Models/connectToDb')

try {
  mongoConnection()
    .then(async client => {
      const db = await client.db('triface')
      const collections = await db.listCollections({}, {
        nameOnly: true
      }).toArray()
      //! this is how we access CRUD functionality: 
      // try {
      //   const collection = await db.collection('trifaces')
      //   await collection.insertOne({
      //     test: "hello worldddd!"
      //   })
      // } catch (error) {
      //   throw new Error(`something went wrong inserting a test document into the 'trifaces' collection in the 'triface' database: \n ${error}`)
      // }
      if(collections[0].name === 'trifaces'){
        console.log(`connected to DB and collection 'trifaces' exists!`)
      } else {
        console.log(`DB connected, but couldn't find the collection 'trifaces'`)
      }
      client.close()
    })
} catch (error) {
  console.log(`something went wrong connecting to mongo Atlas: `, error)
}

app.use(serveStatic)

app.listen(port, () => {
  console.log(`now listening at: ${port}`)
})