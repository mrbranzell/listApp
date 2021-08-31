const { Router } = require('express')
const router = Router()
const Item = require('../models/Item')
const { translate } = require('../components/Translate')

router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
    if (!items) {
      throw new error('No items')
    }
    res.status(200).json(items)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  const { lang1, lang2, bought, date, fromTo } = req.body
  try {
    const newItem = new Item({ lang1, lang2, bought, date, fromTo })
    const item = await newItem.save()
    if (!item) {
      throw new error('item save error')
    }
    res.status(200).json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/:id', async (req, res) => {
  const { bought } = req.body
  const { id } = req.params
  try {
    let item = await Item.findById(id)
    if (!item) {
      throw new error('No items')
    }
    const changed = await item.save((item.bought = bought))
    if (!changed) {
      throw new error('Problem changing item.bought')
    }
    res.status(200).json({ id })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  
  if(id === 'all') {
    
    try {
      const items = await Item.find()
      items && console.log(items)
      if (!items) {
        throw new error('No items')
      }
      const removed = await items.map(i => i.remove())
      if (!removed) {
        throw new error('Problem Deleting items')
      }
      res.status(200).json({ id })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
} else {
  try {
    const item = await Item.findById(id)
    if (!item) {
      throw new error('No items')
    }
    const removed = await item.remove()
    if (!removed) {
      throw new error('Problem Deleting item')
    }
    res.status(200).json({ id })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
})

router.delete('/', async (res) => {
  

})

module.exports = router
