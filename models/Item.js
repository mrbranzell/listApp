const { Schema, model } = require('mongoose')

const now = new Date().getTime()
const ItemSchema = new Schema({
  lang1: {
    type: String,
    required: true,
  },
  lang2: {
    type: String,
  },
  fromTo: {
    type: String,
    //required: true,
  },
  bought: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
    default: now,
  },
})

const Item = model('item', ItemSchema)

module.exports = Item
