require('dotenv').config()
const { connectToDb, connectToClient, connectToCollection } = require("./connectToDb");
const { uniqueNamesGenerator, colors, names, animals } = require('unique-names-generator')
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
  dictionaries: [songs, colors, names],
  length: 3,
  separator:'',
  style: 'capital'
}

const PassphraseConstructorConfig = {
  dictionaries: [colors, animals],
  length: 2,
  separator:'',
  style: 'capital'
}

exports.createNewTriface = async function(cfg){
  try {
    const client = await connectToClient()
    const collection = await connectToCollection(client)
    if(!collection){
      throw new Error(`something went wrong attempting to connect to collection ${process.env.MONGO_DB_COLLECTION_NAME}`)
    } else {
      let newUrl = uniqueNamesGenerator(UrlConstructorConfig)
      let newPass = uniqueNamesGenerator(PassphraseConstructorConfig)
      let newTriface = {
        url: newUrl, 
        pass: newPass
      }
      Object.assign(newTriface, cfg)
      let insertedTriface = await collection.insertOne(newTriface)
      console.log(
        `\x1b[34m`, 
        `new document successfully created: `, 
        insertedTriface.insertedId, 
        `\x1b[0m`)
      await client.close()
      insertedTriface.url = newUrl
      insertedTriface.pass = newPass
      return insertedTriface
    }
  } catch (error) {
    console.log(`\x1b[31m`, `Hark! An error approaches: `, `\x1b[0m`, error)
  }
}

exports.updateTriface = async function(cfg){
  try {
    const client = await connectToClient()
    const collection = await connectToCollection(client)
    if(!collection){
      throw new Error(`something went wrong attempting to connect to collection ${process.env.MONGO_DB_COLLECTION_NAME}`)
    } else {
      let triface = await collection.findOne({url: cfg.url})
      if(!triface){
        throw new Error(`no document with the url ${cfg.url} could be found in collection ${process.env.MONGO_DB_COLLECTION_NAME}`)
      } else {
        try {
          if(triface.pass === cfg.pass){
            Object.assign(triface, cfg)
            let updatedTriface = await collection.updateOne(
              {'_id': triface._id},
              {$set: triface}
            )
            console.log(
              `\x1b[34m`, 
              `new document successfully updated: `, 
              updatedTriface, 
              `\x1b[0m`)
            return updatedTriface
          } else {
            const passErr = new Error(`passphrases don't match`)
            passErr.name = `PassMismatch`
            throw passErr
          }
        } catch (error) {
          if(error.name === `PassMismatch`){
            throw error
          } else {
            throw new Error(`something went wrong... the document was found, but couldn't be modified: ${error}`)
          }
        }
      }
    }
  } catch (error) {
    if(error.name === `PassMismatch`){
      throw error
    } else {
      console.log(`\x1b[31m`, `Hark! An error approaches: `, `\x1b[0m`, error)
      throw error
    }
  }
}

exports.findTriface = async function(url){
  try {
    const client = await connectToClient()
    const collection = await connectToCollection(client)
    if(!collection){
      throw new Error(`something went wrong attempting to connect to collection ${process.env.MONGO_DB_COLLECTION_NAME}`)
    } else {
      // console.log(`currently looking for ${url} in the ${collection.namespace} space`)
      return await collection.findOne({url: url})
    }
  } catch (error) {
    throw error
  }
}
