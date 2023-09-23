const mongoose = require('mongoose')

const url = "mongodb+srv://Fullstack:Sumanth123@cluster0.p3wuumw.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person