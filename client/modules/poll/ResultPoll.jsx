import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router'
import Pusher from 'pusher-js'

class ResultPoll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      pollOptions: null,
      loading: true,
      error: false
    }
  }

  componentWillMount () {
    this.serverRequest = this._fetchPoll.bind(this)()
    this.pusher = new Pusher('c5a1ce2844ebf5089362')
    this.channel = this.pusher.subscribe(this.props.params.pollId)
    this.channel.bind('pollOptionsUpdated', (data) => {
      this.setState({
        pollOptions: data.updatedPollOptions
      })
    })
  }

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
  }

  componentWillUnmount () {
    this.serverRequest.abort()
    this.channel.unsubscribe()
  }

  render () {
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
              {!loading ? pollOptions.map((option, i) => {
                const { text, voteCount } = option
                return (
                  <div key={i} className='well well-sm'>
                    <h4>Option: {text}</h4>
                    <h4>Votes: {voteCount}</h4>
                  </div>
                )
              }) : null}
              {!error ? <Link to={`/v/${pollId}`}>Vote on this poll</Link> : null }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ResultPoll
