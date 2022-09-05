const router = require('express').Router()
const { 
  createNewTriface, 
  updateTriface, 
  findTriface,
  checkPassphrase 
} = require('../Models/trifacesCollection')


router.route('/new-trivision')
  .post(async (req, res) => {
    try {
      if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(500).json({
          status: 'the request body is empty, did you mean to include a cofig object?'
        })
      } else {
        let newTriface = await createNewTriface(req.body)
        res.status(200).json(newTriface)
      }
    } catch (error) {
      res.status(500).send(`oh noes: ${error}`)
    }
  })

router.route(`/:url`)
  .get(async (req, res, next) => {
    if(!req.params.url){
      next()
    }
    try {
      const url = req.params.url
      let trifaceFromUrl = await findTriface(url)
      if(!trifaceFromUrl){
        res.sendStatus(500)
      } else {
        //send cfg string minus the password to the client:
        delete trifaceFromUrl.pass
        delete trifaceFromUrl._id
        res.status(200).json(trifaceFromUrl)
      }
    } catch (error) {
      
    }
  })
  .put(async (req, res) => {
    try {
      if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(500).json({
          status: 'the request body is empty, did you mean to include an object?'
        })
      } else {
        try {
          const updatedTriface = await updateTriface(req.body)
          res.status(201).json(updatedTriface)
        } catch (error) {
          throw new Error(error)
        }
      }
    } catch (error) {
      console.log(
        `\x1b[31m`,
        `error updating triface: `,
        `\x1b[0m`,
        error
      )
      res.status(500).json({
        status: error.message
      })
    }
  })

router.route(`/check-pass`)
  .post(async (req, res, next) => {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
      res.status(500).json({
        status: 'the request body is empty, did you mean to include a password to compare?'
      })
    } else {
      try {
        let goodPass = await checkPassphrase(req.body.url, req.body.pass)
        console.log(`checkpass: `, goodPass)
        if(goodPass === true){
          res.status(200).send('true')
        } else {
          res.status(401).send('false')
        }
      } catch (error) {
        res.status(500).json({
          status: error
        })
      }
    }
  })

module.exports = router