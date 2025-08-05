const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response)=>{
    response.send('<h1>hello world!</h1>')
})

app.get('/api/notes', (request, response)=>{
    response.json(notes)
})

app.get('/api/notes/:id', (request,response)=>{
    console.log('bruh')
    const id = request.params.id
    console.log(id)
    const note = notes.find((note)=>note.id===id)
    console.log(note)
    if(note) {
        response.json(note)
    }
    else{
        response.status(404).end()
    }
})

app.post('/api/notes', (request, response)=>{
    const body = request.body

    if(!body.content){
        response.status(400).json({
            error: "content missing"
        })
    }

    const note = {
        content: body.content,
        important: body.important || false
    }

    const maxID = notes.length > 0 
        ? Math.max(...notes.map((note)=>Number(note.id))) 
        : 0
    note.id=maxID+1

    notes = notes.concat(note)
    console.log(note)
    response.json(note)
    console.log(notes.find((note)=>note.id===maxID+1))
})

app.put('/api/notes/:id', (request,response)=>{
    const body = request.body

    if(!body.content){
        response.status(400).json({
            error: "content missing"
        })
    }

    const note = {
        content: body.content,
        important: body.important,
        id: body.id
    }

    notes = notes.map((bruh)=>bruh.id===note.id ? note : bruh)

    response.json(note)
})

app.delete('/api/notes/:id', (request, response)=>{
    const id = request.params.id
    notes = notes.filter((note)=> note.id!==id)

    response.status(204).end()
})



const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})