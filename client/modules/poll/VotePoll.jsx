import React from 'react'
import axios from 'axios'
import { browserHistory, Link } from 'react-router'

const VotePoll = React.createClass({
  getInitialState () {
    return {
      question: null,
      pollOptions: null,
      loading: true,
      error: false,
      optionIdChecked: ''
    }
  },

  componentWillMount () {
    this.serverRequest = this._fetchPoll()
  },

  componentWillUnmount () {
    this.serverRequest.abort()
  },

  _fetchPoll () {
    const { pollId } = this.props.params
	return axios
		.get(`/api/poll/${pollId}`)
		.then(({data: res}) => {
			this.setState({
				question: res.question,
				pollOptions: res.pollOptions,
				loading: false
			});
		})
		.catch(err => this.setState({error: true}));
  },

  render () {
    const { question, pollOptions, loading, error } = this.state
    const { pollId } = this.props.params
    return (
      <div className='container'>
        <div className='row'>
          <div className='panel panel-default col-sm-offset-3 col-sm-6' style={{marginBottom: 4}}>
            <h2 className='text-center'>&amp;VOTE!</h2>
            <div className='panel-body'>
              <h4 style={{fontSize: 18}} className='text-center'>QUESTION: </h4>
              <h2 className='text-center' style={{marginTop: 0}}>{question}</h2>
                {error ? <h4 className='text-center' style={{color: 'red'}}>Cannot find poll</h4> : null}
              <form onSubmit={this.createVote}>
                {!loading ? pollOptions.map((pollOption, i) => {
                  const { optionId, text } = pollOption
                  return (
                    <div key={i} className='radio text-center' style={{margin: 12}}>
                      <label style={{fontSize: 24}}>
                        <input
                          type='radio'
                          onClick={(event) => this.checkedOption(event) }
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
                    {!error ? <button className='btn btn-block btn-primary center-block' type='submit'>Vote</button> : null}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Link className='text-center center-block' to={`/r/${pollId}`}>Poll Results</Link>
      </div>
    )
  },

  createVote (event) {
    event.preventDefault()

    const { pollId } = this.props.params
    const { optionIdChecked } = this.state
    const data = {
      pollOptionId: optionIdChecked,
      pollId
    }

    if (!optionIdChecked) {
      return alert('Please select an option.')
    }

	axios
		.post('/api/poll', data)
		.then(({data: res, status}) => {
			if (status === 400) {
				return alert(res.responseText.message);
			} else {
				if (screen.width <= 800) {
					window.location = `/r/${pollId}`;
				} else {
					browserHistory.push(`/r/${pollId}`)
				}
			}
		})
		.catch(err => console.log(err))
  },

  checkedOption (event) {
    const { value } = event.target
    this.setState({optionIdChecked: value})
  }
})

module.exports = VotePoll
