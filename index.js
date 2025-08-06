require('dotenv').config()
const cors = require('cors')
const express = require('express')
const Note = require('./models/note')

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
    Note.find({}).then(notes=>{
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request,response, next)=>{
    const note = Note.findById(request.params.id)
    .then(note=>{
        if(note){
            response.json(note)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => {
        // console.log(error)
        // response.status(400).send({error: "malformed id"})
        next(error)
    })
})

app.post('/api/notes', (request, response)=>{
    const body = request.body

    if(!body.content){
        response.status(400).json({
            error: "content missing"
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    const maxID = notes.length > 0 
        ? Math.max(...notes.map((note)=>Number(note.id))) 
        : 0
    note.id=maxID+1

    note.save().then(saved=>{
        response.json(saved)
    })
})

app.put('/api/notes/:id', (request,response)=>{
    const body = request.body

    Note.findById(request.params.id)
    .then(note=>{
        if (!note){
            return response.status(404).end()
        }

        note.content=body.content
        note.important=body.important

        return note.save().then(updatedNote=>{
            response.json(updatedNote)
        })
    })
    .catch(error=>next(error))

})

app.delete('/api/notes/:id', (request, response, next)=>{
    Note.findByIdAndDelete(request.params.id)
    .then(result=>{
        response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response,next)=>{
    console.log(error.message)

    if(error.name=== 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    }

    next(error)
}

app.use(errorHandler)

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})