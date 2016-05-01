import React from 'react'
import $ from 'jquery'
import { browserHistory, Link } from 'react-router'

class VotePoll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      pollOptions: null,
      loading: true,
      error: false,
      optionIdChecked: ''
    }
  }
  componentWillMount () {
    this.serverRequest = this._fetchPoll.bind(this)()
  }

  componentWillUnmount () {
    this.serverRequest.abort()
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

  render () {
    const { question, pollOptions, loading, error } = this.state
    const { pollId } = this.props.params
    return (
      <div className='container'>
        <div className='row'>
          <div className='panel panel-default col-sm-offset-3 col-sm-6' style={{marginBottom: 4}}>
            <div className='panel-body'>
                <h2 className='text-center' style={{marginTop: 0}}>{question}</h2>
                {error ? <h4 style={{color: 'red'}}>Cannot find poll</h4> : null}
                <form onSubmit={this.createVote.bind(this)}>
                  {!loading ? pollOptions.map((pollOption, i) => {
                    const { optionId, text } = pollOption
                    return (
                      <div key={i} className='radio text-center' style={{margin: 12}}>
                        <label style={{fontSize: 24}}>
                          <input 
                          type='radio' 
                          onClick={this.checkedOption.bind(this, optionId)} 
                          name='option' 
                          value={optionId} 
                          style={{marginTop: 10}}
                          /> {text} 
                        </label>
                      </div>
                    )
                  }) : null}
                  <div className='row'>
                    <div className='col-sm-4 col-sm-offset-4'>
                      <button className='btn btn-block btn-primary center-block' type='submit'>Create</button>
                    </div>
                  </div>
                </form>
            </div>
          </div>
        </div> 
        <Link className='text-center center-block' to={`/r/${pollId}`}>Poll Results</Link>
      </div>
    )
  }

  createVote (event) {
    event.preventDefault()

    const { pollId } = this.props.params
    const { optionIdChecked } = this.state
    const data = {
      pollOptionId: optionIdChecked
    }

    if (!optionIdChecked) {
      return alert('Please select an option.')
    }

    $.ajax({
      method: 'POST',
      url: '/api/vote/',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json'
    }).always((result) => {
      if (result.status === 400) {
        return alert(JSON.parse(result.responseText).message)
      } else {
        if (!localStorage.voted) {
          localStorage.voted = ''
        }
        localStorage.voted += `${pollId},`

        browserHistory.push(`/r/${pollId}`)
      }
    })
  }

  checkedOption (id) {
    this.setState({optionIdChecked: id})
  }
}

module.exports = VotePoll
