/**
 * !NOTE!
 * 
 * This works... at least the /test-upload route works. However, I am concerned about server load, so I want to try following
 * the guide for how to abstract file-uploading to the front-end:
 * 
 * https://github.com/mattwelke/upload-file-to-backblaze-b2-from-browser-example
 */

require('dotenv').config()
const AWS = require('aws-sdk'),
      uuid = require('node-uuid'),
      router = require('express').Router()

const endpoint = new AWS.Endpoint(`s3.${process.env.B2_REGION}.backblazeb2.com`),
      s3 = new AWS.S3({
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_KEY,
        region: process.env.B2_REGION,
        endpoint
      })

class UploadParams {
  constructor(fileName, fileContents){
    this.Key = fileName
    this.Body = fileContents
    this.Bucket = process.env.B2_BUCKET_NAME //+ '-' + uuid.v4()
  }
}

router.route('/upload-file')
  .post(async (req, res) => {
    let imageData = req.body.image
    let imageName = req.body.imageName
    let uploadParams = new UploadParams(imageName, imageData)
    const uploadedImage = await s3.upload(uploadParams).promise()
    console.log(uploadedImage)
  })

router.route('/test-upload')
  .get(async(_, res) => {
    let uploadParams = new UploadParams('hell_world.txt', 'Hey World!')
    // await s3.createBucket({Bucket: uploadParams.Bucket}).promise()
    try {
      const uploadedFile = await s3.upload(uploadParams).promise()//await s3.putObject(uploadParams).promise()
      console.log(uploadedFile.Location)
      res.status(200).json({uploadedFile})
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: error
      })
    }
  })

module.exports = router