require('dotenv').config()
const MongoClient = require("mongodb").MongoClient,
      DB_CONNECTION_STRING = process.env.MONGO_CONNECT;

/*
  Due to the evolving nature of the DB schema, we're opting to use the native
  MongoDB driver to avoid having to set a schema. Perhaps this will change
  as the project evolves?

  ! WHEN IMPORTING AN INVOKING THIS FUNCTION, 
  ! DO NOT FORGET TO FINISH WITH THE `mongoClient.close()` function!
*/
module.exports = async function connectToDb(){
  try {
    console.log(`Connecting to MongoDB Atlas Cluster`)
    let mongoClient = new MongoClient(DB_CONNECTION_STRING)
    await mongoClient.connect()
    console.log(`successfully connected to MongoDB Atlas Cluster`)
    return mongoClient
  } catch (error) {
    console.log(`Connection to MongoDB Atlast Failed. \n It's probably YOUR fault. \n JK, here's an error message: \n`, error)
    process.exit(1)
  }
}