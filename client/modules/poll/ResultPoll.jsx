import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router'
import Pusher from 'pusher-js'
import { Pie } from 'react-chartjs'
import Color from 'color'
import { getRandomPastelColor } from './../../utl.js'

const ResultPoll = React.createClass({
  getInitialState () {
    return {
      question: null,
      pollOptions: [],
      loading: true,
      error: false
    }
  },

  componentWillMount () {
    this.serverRequest = this._fetchPoll()
    this.pusher = new Pusher('b15f0d252f16256cab88')
    this.channel = this.pusher.subscribe(this.props.params.pollId)
    this.channel.bind('pollOptionsUpdated', (data) => {
      this.setState({
        pollOptions: data.updatedPollOptions
      })
    })
  },

  _fetchPoll () {
    const { pollId } = this.props.params
    return $.get(`/api/poll/${pollId}`, (result) => {
      const { question, pollOptions } = result
      this.setState({
        question,
        pollOptions,
        loading: false
      })
    }).fail(() => {
      this.setState({error: true})
    })
  },

  componentWillUnmount () {
    this.serverRequest.abort()
    this.channel.unsubscribe()
  },
  render () {
    const chartData = this.state.pollOptions.map(pollOption => {
      const color = getRandomPastelColor()
      return {
        value: pollOption.voteCount,
        label: pollOption.text,
        color: color,
        highlight: Color(color).lighten(0.05).hexString()
      }
    })

    const { question, pollOptions, loading, error } = this.state
    const { pollId } = this.props.params
    return (
      <div className='container'>
        <div className='row'>
          <div className='panel panel-default col-sm-offset-3 col-sm-6'>
            <h2 className='text-center'>Poll Results</h2>
            <div className='panel-body text-center'>
              {error ? <h4 className='text-center' style={{color: 'red'}}>Cannot find poll.</h4> : null}
              <h3>{question}</h3>
              <Pie className='center-block' style={{marginTop: 16, marginBottom: 16}} data={chartData} width='300' height='220' />
              {!loading ? pollOptions.map((option, i) => {
                const { text, voteCount } = option
                return (
                  <div key={i} className='well well-sm'>
                    <h4>Option: {text}</h4>
                    <h4>Votes: {voteCount}</h4>
                  </div>
                )
              }) : null}
              {!error ? <Link to={`/v/${pollId}`}>Vote on this poll</Link> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = ResultPoll
