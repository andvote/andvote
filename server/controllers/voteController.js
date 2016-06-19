import db from 'sequelize-connect'
import Pusher from 'pusher'

const voteController = { }

voteController.handlePost = async function (req, res, next) {
  try {
    const foundVote = await db.models.vote.findOne({
      where: {
        voterIp: req.ip,
        pollOptionId: {
          $in: db.sequelize.literal(`
            (SELECT pollOptions.id
             FROM pollOptions
             WHERE pollOptions.pollId = (
               SELECT pollOptions.pollId
               FROM pollOptions
               WHERE pollOptions.id = ${db.sequelize.escape(req.body.pollOptionId)}
             ))
          `)
        }
      }
    })
    if (foundVote === null) {
      await db.models.vote.create({
        voterIp: req.ip,
        pollOptionId: req.body.pollOptionId
      })
      var pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_APP_KEY,
        secret: process.env.PUSHER_APP_SECRET
      })
      const foundPoll = await db.models.poll.findOne({
        where: {
          id: req.body.pollId
        },
        group: ['pollOptions.id'],
        order: [[db.sequelize.literal('`pollOptions.voteCount`'), 'ASC']],
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
      pusher.trigger(req.body.pollId, 'pollOptionsUpdated', {
        'updatedPollOptions': foundPoll.dataValues.pollOptions
      })
      res.sendStatus(201)
    } else {
      res.status(400).json({
        message: 'You have already voted on this poll.'
      })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export default voteController
