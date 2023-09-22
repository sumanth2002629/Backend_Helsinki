const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

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
    response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
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

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})