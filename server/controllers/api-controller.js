const router = require('express').Router()
const { createNewTriface, updateTriface, findTriface } = require('../Models/trifacesCollection')


router.route('/new-triface')
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
          await updateTriface(req.body)
          res.status(201).json({
            status: `triface with url ${req.body.url} has been updated`
          })
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

module.exports = router