const mongoose = require("mongoose")

if (process.argv.length<5) {
  console.log("give password, name and number as arguments")
  process.exit(1)
}


const url = process.env.MONGO_URI

mongoose.set("strictQuery",false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(() => {
  console.log(`added ${process.argv[3]} number ${process.argv[4]} to the phonebook`)
})

console.log("phonebook:")
Person.find({}).then(persons => {
  persons.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})