import db from 'sequelize-connect'
import _ from 'underscore'
const pollController = {}

pollController.handlePost = function (req, res, next) {
  db.sequelize.transaction(async transaction => {
    if (req.body.options.length < 2) {
      res.status(400).json({
        message: 'You need to specify at least two poll options'
      })
      return
    }

    if (req.body.options.length > 16) {
      res.status(400).json({
        message: 'You can\'t specify more than 16 poll options, dude'
      })
      return
    }

    const createdPoll = await db.models.poll.create({
      question: req.body.question
    }, {
      transaction
    })
    const pollOptions = req.body.options.map(option => {
      return {
        text: option,
        pollId: createdPoll.dataValues.id
      }
    })
    await db.models.pollOption.bulkCreate(pollOptions, {
      transaction
    })
    res.status(201).json({
      createdPollId: createdPoll.dataValues.id
    })
  }).catch(next)
}

pollController.handleGet = async function (req, res, next) {
  try {
    const foundPoll = await db.models.poll.findOne({
      where: {
        id: req.params.pollId
      },
      group: ['pollOptions.id'],
      attributes: ['question'],
      include: {
        model: db.models.pollOption,
        attributes: [
          ['id', 'optionId'],
          'text',
          [db.sequelize.fn('COUNT', db.sequelize.col('pollOptions.votes.id')), 'voteCount']
        ],
        include: {
          model: db.models.vote,
          attributes: []
        }
      }
    })
    if (foundPoll === null) {
      res.status(404).json({
        message: 'Poll not found!'
      })
    } else {
      res.status(200).json(foundPoll.dataValues)
    }
  } catch (err) {
    next(err)
  }
}
// TODO : This method seems to not working
pollController.handleGetRandom = async function (req, res, next) {
  try {
    const randId = db.models.poll.count()
    const foundPoll = await db.models.poll.findOne({
      where: {
        id: _.random(1, randId)
      },
      group: ['pollOptions.id'],
      attributes: ['question'],
      include: {
        model: db.models.pollOption,
        attributes: [
          ['id', 'optionId'],
          'text',
          [db.sequelize.fn('COUNT', db.sequelize.col('pollOptions.votes.id')), 'voteCount']
        ],
        include: {
          model: db.models.vote,
          attributes: []
        }
      }
    })
    console.log(foundPoll)
    res.status(200).json(foundPoll.dataValues)
  } catch (err) {
    next(err)
  }
}

pollController.getPolls = async function (req, res, next) {
  try {
    const offset = parseInt(req.params.offset, 10)
    const polls = await db.models.poll.findAll({
      offset: offset,
      limit: 5,
      order: [['id', 'DESC']],
      attributes: ['id', 'question']
    })
    res.status(200).json(polls)
  } catch (error) {
    next(error)
  }
}

export default pollController
