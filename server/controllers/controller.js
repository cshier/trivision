const router = require('express').Router()
const { createNewTriface } = require('../Models/trifacesCollection')


router.route('/triface')
  .get(async (_, res) => {
    try {
      let newTriface = await createNewTriface()
      res.status(200).json(newTriface)
    } catch (error) {
      res.status(500).send(`oh noes: ${error}`)
    }
  })

module.exports = router