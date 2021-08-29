const { Router } = require('express')
const router = Router()
const { translate } = require('../components/Translate')

router.post('/', async (req, res) => {
  const { value, fromTo } = req.body
  try {
    let translation = await translate(value, fromTo)
    if (!translation) {
      throw new error('Translation API error')
    }
    res.status(200).json(translation)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
