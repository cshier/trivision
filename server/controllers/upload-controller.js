require('dotenv').config()
const AWS = require('aws-sdk'),
      uuid = require('node-uuid'),
      router = require('express').Router(),
      axios = require('axios')

// let apiUrl = `https://api004.backblazeb2.com/b2api/v2`

router.route('/get-details')
  .get(async (_, res) => {
    try {
      const authRes = await axios({
        method: 'GET',
        url: `https://api.backblazeb2.com/b2api/v2/b2_authorize_account`,
        auth: {
          username: process.env.B2_KEY_ID,
          password: process.env.B2_KEY
        }
      })
      if(authRes.status !== 200){
        throw new Error(`backblaze error ${authRes.data.status}: ${authRes.data.message}`)
      } else {
        res.status(200).json({
          apiUrl: authRes.data.apiUrl,
          authToken: authRes.data.authorizationToken
        })
      }
    } catch (error) {
      res.status(500).json({
        status: error
      })
    }
  })

router.route('/get-upload-url')
  .post(async (req, res) => {
    console.log(`this is the request for get-upload-url`)
    console.log(req)
    try {
      if(!req.body.apiUrl && !req.body.authToken){
        console.log(req.body)
        throw new Error(`request is missing the B2 apiUrl and authToken`)
      } else {
        let getUploadRes = await axios({
          method: 'POST',
          url: `${req.body.apiUrl}/b2api/v2/b2_get_upload_url`,
          headers: {
            'Authorization': req.body.authToken,
          },
          data: {
            bucketId: process.env.B2_BUCKET_ID
          }
        })
        if(getUploadRes.status !== 200){
          throw new Error(`backblaze error ${getUploadRes.data.status}: ${getUploadRes.data.message}`)
        } else {
          console.log(getUploadRes.data)
          res.status(200).json({
            authToken: getUploadRes.data.authorizationToken,
            uploadUrl: getUploadRes.data.uploadUrl
          })
        }
      }
    } catch (error) {
      console.log(`error trying to get upload url: ${error}`)
      res.status(500).json({
        status: error
      })
    }
  })


module.exports = router