require('dotenv').config()
const MongoClient = require("mongodb").MongoClient

/*
  Due to the evolving nature of the DB schema, we're opting to use the native
  MongoDB driver to avoid having to set a schema. Perhaps this will change
  as the project evolves?

  ! WHEN IMPORTING AN INVOKING THIS FUNCTION, 
  ! DO NOT FORGET TO FINISH WITH THE `mongoClient.close()` function!
*/
async function connectToMongo(){
  try {
    console.log(`Connecting to MongoDB Atlas Cluster`)
    let mongoClient = new MongoClient(process.env.MONGO_CONNECT)
    await mongoClient.connect()
    console.log(`\x1b[32m`,`successfully connected to MongoDB Atlas Cluster`, `\x1b[0m`)
    return mongoClient
  } catch (error) {
    console.log(`Connection to MongoDB Atlast Failed. \n It's probably YOUR fault. \n JK, here's an error message: \n`, error)
    process.exit(1)
  }
}
exports.connectToClient = connectToMongo

exports.connectToDb = async function(client){
  try {
    return await client.db(process.MONGO_DB_NAME)
  } catch (error) {
    console.log(`error attempting to return database "triface" from Mongo Atlas Cluster: ${error}`)
  }
}

exports.testConnection = () => {
  try {
    connectToMongo()
      .then(async client => {
        const db = await client.db(process.env.MONGO_DB_NAME)
        const collections = await db.listCollections({}, {
          nameOnly: true
        }).toArray()
        if(collections[0].name === process.env.MONGO_DB_COLLECTION_NAME){
          console.log(`\x1b[32m`, `connected to DB and collection ${process.env.MONGO_DB_COLLECTION_NAME} exists!`, `\x1b[0m`)
        } else {
          console.log(`DB connected, but couldn't find the collection '${process.env.MONGO_DB_COLLECTION_NAME}'`)
        }
        client.close()
      })
  } catch (error) {
    console.log(`\x1b[31m`, `something went wrong connecting to mongo Atlas: `, `\x1b[0m`, error)
  }
}