const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('content', (req, res)=>{
    if(req.body){
        return JSON.stringify(req.body)
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response)=>{
    response.send('<h1>api for phonebook</h1>')
})

app.get('/info', (req, res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date.now()}</p>`)
})

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get('/api/persons/:id', (req, res)=>{
    //req.params.id is a string, but so is person.id
    const id = req.params.id
    const person = persons.find((person)=>person.id===id)

    if(!person){
        res.status(404).end()
    }
    else{
        res.json(person)
    }
})

app.post('/api/persons', (req,res)=>{
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: "no name or number"
        })
    }
    if(persons.find((person)=>person.name===body.name) || persons.find((person)=>person.number===body.number)){
        return res.status(400).json({
            error: "name or number already exists in phonebook"
        })
    }

    console.log(body)
    const id = String(Math.floor(Math.random()*9999))

    const person = {...body, id: id}

    persons = persons.concat(person)

    res.json(person)
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = req.params.id

    console.log(id)
    persons = persons.filter((person)=>person.id!==id)
    res.status(204).end()
})

const PORT = 3001

app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})