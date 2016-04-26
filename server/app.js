import express from 'express'
import chalk from 'chalk'
import errorHandler from './middleware/errorHandler'
import db from 'sequelize-connect'
import path from 'path'
import pollController from './controllers/pollController'
import voteController from './controllers/voteController'
import bodyParser from 'body-parser'

async function connect () {
  db.discover = path.join(__dirname, 'models')
  db.matcher = function shouldImportModel (modelFileName) {
    return true
  }
  await db.connect('andvote_schema', 'root', '', {
    force: false
  })
}

(async function () {
  try {
    await connect()
  } catch (err) {
    console.log(chalk.red(`An error occured when connecting: ${err}`))
  }
  const app = express()
  app.use(bodyParser.json())
  app.post('/api/poll', pollController.handlePost)
  app.get('/api/poll/:pollId', pollController.handleGet)
  app.post('/api/vote', voteController.handlePost)

  app.use(errorHandler)

  const port = 3000
  app.listen(port, () => console.log(`Running on port ${port}`))
})()

