import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router'

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
    const { pollId } = this.props.params
    this.serverRequest = $.get(`/api/poll/${pollId}`, (result) => {
      const { question, pollOptions } = result
      this.setState({
        question,
        pollOptions,
        loading: false
      })
    }).fail(() => {
      this.setState({
        error: true
      })
    })
  }

  componentWillUnmount () {
    this.serverRequest.abort()
  }

  render () {
    const { question, pollOptions, loading, error } = this.state
    const { pollId } = this.props.params
    return (
      <div className="container">
        <div className='row'>
          <div className='panel panel-default col-sm-offset-3 col-sm-6'> 
            <h2 className='text-center'>Poll Result</h2>  
            <div className='panel-body text-center'>
              <h3>{question}</h3>
              {!loading ? pollOptions.map((option, i) => {
                const { optionId, text, voteCount } = option
                return (
                  <div key={i} className="well well-sm">
                    <h4>Option: {text}</h4>
                    <h4>Votes: {voteCount}</h4>
                  </div>
                )
              }): null}
              <Link to={`/v/${pollId}`}>Vote on this poll</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ResultPoll
