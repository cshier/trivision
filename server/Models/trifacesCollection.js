require('dotenv').config()
const { connectToDb, connectToClient } = require("./connectToDb");
const { uniqueNamesGenerator, colors, countries } = require('unique-names-generator')
//! this is how we access CRUD functionality: 
// try {
//   const collection = await db.collection('trifaces')
//   await collection.insertOne({
//     test: "hello worldddd!"
//   })
// } catch (error) {
//   throw new Error(`something went wrong inserting a test document into the 'trifaces' collection in the 'triface' database: \n ${error}`)
// }
const defaultObj = {
  "time": 0.0011,
  "wave1": {
    "x": 2.35,
    "y": 1.18
  },
  "wave2": {
    "x": -2.65,
    "y": -0.29
  },
  "slatCount": 13,
  "slatWidth": 0.75,
  "slatRadius": 0.2857142857142857,
  "slatSpread": 1.2,
  "texAsrc": "https://upcdn.io/FW25au8UtuPXoWf3PfU8gh4",
  "texBsrc": "https://upcdn.io/FW25au8XNu4cNyFQJ5474Ke",
  "src": "https://upcdn.io/FW25au822kovm1bLqxHyErT",
  "off": {
    "x": 0,
    "y": 0
  },
  "title": "Default",
  "preset": "",
  "x": 1792,
  "y": 864
}

const songs = [
  "Further",
  "Passed",
  "Tense",
  "Betelgeuse",
  "SettingSun",
  "Cold",
  "Cosmonaut",
  "Retina",
  "Transmission",
  "Rainbows",
  "Burns",
  "RollBack",
  "PassingTrains"
]

const UrlConstructorConfig = {
  dictionaries: [songs, colors, countries],
  length: 3,
  separator:''
}

exports.createNewTriface = async function(){
  try {
    const client = await connectToClient()
    const db = await connectToDb(client)
    const collection = await db.collection(process.env.MONGO_DB_COLLECTION_NAME)
    if(!collection){
      throw new Error(`something went wrong attempting to connect to collection ${process.env.MONGO_DB_COLLECTION_NAME}`)
    } else {
      /*
        TODOS:
          * create URL
          * create, salt, and hash passphrase for later editing
          * create new mongo Document with default config string 
          * save to collection
          * CLOSE CONNECTION
      */
      let newUrl = uniqueNamesGenerator(UrlConstructorConfig)
      let newTriface = {url: newUrl}
      Object.assign(newTriface, defaultObj)
      let insertedTriface = await collection.insertOne(newTriface)
      await client.close()
      return insertedTriface
    }
  } catch (error) {
    console.log(`\x1b[31m`, `Hark! An error approaches: `, `\x1b[0m`, error)
  }
}
