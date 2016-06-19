import express from 'express'
import chalk from 'chalk'
import errorHandler from './middleware/errorHandler'
import db from 'sequelize-connect'
import path from 'path'
import pollController from './controllers/pollController'
import voteController from './controllers/voteController'
import bodyParser from 'body-parser'
import compression from 'compression'

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './../webpack.config.js'

const compiler = webpack(config)
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})

async function connect () {
  db.discover = path.join(__dirname, 'models')
  db.matcher = function shouldImportModel (modelFileName) {
    return true
  }
  await db.connect('andvote_schema', 'root', 'r00tpwd', {
    force: false,
    logging: console.log
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

  const isDeveloping = process.env.NODE_ENV !== 'production'
  console.log(isDeveloping)
  if (isDeveloping) {
    app.use(middleware)
    app.use(webpackHotMiddleware(compiler))
    app.get('*', function response (req, res) {
      res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')))
      res.end()
    })
  } else {
    app.use(compression())
    app.use(express.static(path.join(__dirname, '../dist')))
    app.get('*', function response (req, res) {
      res.sendFile(path.join(__dirname, '../dist/index.html'))
    })
  }
  const port = 3000
  app.listen(port, () => console.log(`Running on port ${port}`))
})()
