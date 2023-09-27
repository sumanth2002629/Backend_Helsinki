require('dotenv').config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")


const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use(express.static("dist"))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch((e)=>{response.status(404).send({error:e})})
  })    

app.get("/info", (request,response)=>{
    response.send("<p>Phonebook has info for "+ persons.length.toString() + " persons</p> <br/>"+new Date())
})

app.get("/api/persons/:id", (req,response) => {
    const id = req.params.id;

    const person = persons.find(person=>person.id.toString()===id)

    if(person)
    {
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response,next) => {
    const id = Number(request.params.id)

    Person.findByIdAndRemove(request.params.id)
    .then((result)=>{
        if(result){
        return response.status(204).end()}
        else{
          return response.status(404).end()
        }
    })
    .catch((error => next(error)))
  })


  const generateId = () => {
    const Id = Math.floor(Math.random()*10000000)
    return Id
  } 
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number is missing' 
      })
    }
  
    const nameExists = persons.find(person=>person.name===body.name)

    if(nameExists)
    {
      return response.status(400).json({ 
        error: 'name already exists' 
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then((result)=>{console.log("added")})
  
    persons = persons.concat(person)
  
    response.json(person)
  })


  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})