import express from 'express'
import fs from 'fs'
import path from 'path'
const pathToFile = path.resolve('./data.json')

const getResources = () => JSON.parse(fs.readFileSync(pathToFile))

const app = express()
const PORT = 3001

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Hello world')
})

app.get('/api/resources/:id', (req, res) => {
  const resources = getResources()
  const { id } = req.params
  const resource = resources.find((resource) => resource.id === id)
  res.send(resource)
})
