import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
const pathToFile = path.resolve('./data.json')

const getResources = () => JSON.parse(fs.readFileSync(pathToFile))
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors(corsOptions))

app.get('/', (_req, res) => {
  res.send('Hello world')
})

app.get('/api/resources/', (_req, res) => {
  const resources = getResources()
  res.send(resources)
})

app.get('/api/resources/:id', (req, res) => {
  const resources = getResources()
  const { id } = req.params
  const resource = resources.find((resource) => resource.id === id)
  res.send(resource)
})

app.patch('/api/resources/:id', (req, res) => {
  const resources = getResources()
  const { id } = req.params
  const index = resources.findIndex((resource) => resource.id === id)
  const activeResource = resources.find(
    (resource) => resource.status === 'active'
  )
  resources[index] = req.body
  if (req.body.status === 'active') {
    if (activeResource) {
      return res.status(422).send('There is active resource already')
    }
    resources[index].status = 'active'
    resources[index].activationTime = new Date()
  }

  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res.status(422).send('Cannot store data in the file!')
    }

    return res.send('Data has been updated!')
  })
})

app.get('/api/activeresource', (_req, res) => {
  const resources = getResources()
  const activeResource = resources.find(
    (resource) => resource.status === 'active'
  )
  return res.send(activeResource)
})

app.post('/api/resources', (req, res) => {
  const resources = getResources()
  const resource = req.body

  resource.createdAt = new Date()
  resource.status = 'inactive'
  resource.id = Date.now().toString()
  resources.unshift(resource)

  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res.status(422).send('Cannot store data in the file')
    }
    return res.send('Data has been saved')
  })
})

app.listen(PORT, () => {
  console.info(`Server is Listening on PORT ${PORT}`)
})
