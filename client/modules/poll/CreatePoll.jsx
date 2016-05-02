import React from 'react'
import $ from 'jquery'
import { browserHistory } from 'react-router'
class CreatePoll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      optionsCount: 2
    }
  }
  render () {
    const options = this.createOptions.bind(this)()

    return (
      <div className='container'>
        <div className='row'>
          <div className='panel panel-default col-sm-6 col-sm-offset-3'>
            <div className='panel-body'>
              <h2 className='text-center'>Create Poll</h2>
              <form onSubmit={this.createPoll.bind(this)}>
                <div className='form-group'>
                  <label>Question:</label>
                  <input placeholder='Enter a question...' className='form-control' ref='question' /> <br />
                </div>
                {options}
                <div className='row'>
                  <div className='col-sm-4 col-sm-offset-4'>
                    <button className='btn btn-block btn-primary center-block' type='submit'>Create</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  createOptions () {
    const { optionsCount } = this.state
    let options = []

    for (var i = 0; i < optionsCount; i++) {
      const index = i + 1
      let addOption
      let removeOption

      if (i === optionsCount - 1) {
        addOption = this.addOption.bind(this)
      }
      if (i === optionsCount - 2) {
        removeOption = this.removeOption.bind(this)
      }

      const optionElement = (
        <div key={index} className='form-group'>
          <label>Options {index}</label>
          <input
            className='form-control'
            placeholder={`Enter option ${index}...`}
            ref={`option${index}`}
            onFocus={addOption}
            onBlur={removeOption}
          />
        </div>
      )
      options.push(optionElement)
    }
    return options
  }

  addOption () {
    const { optionsCount } = this.state
    this.setState({optionsCount: optionsCount + 1})
  }

  removeOption () {
    const { optionsCount } = this.state
    const lastOption = this.refs[`option${optionsCount - 1}`]
    if (!lastOption.value && optionsCount > 2) {
      this.setState({optionsCount: optionsCount - 1})
    }
  }

  createPoll (event) {
    event.preventDefault()

    const { question } = this.refs

    let data = {
      question: question.value.trim(),
      options: []
    }

    for (let option in this.refs) {
      let optionValue = this.refs[option].value.trim()
      if (option !== 'question' && optionValue) {
        data.options.push(optionValue)
      }
    }

    const checkValidPoll = this.validatePoll(data)
    if (checkValidPoll) {
      return alert(checkValidPoll)
    }

    $.ajax({
      method: 'POST',
      url: '/api/poll',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json'
    }).done((result) => {
      browserHistory.push(`/v/${result.createdPollId}`)
    }).fail((er) => {
      console.log(er)
    })
  }

  validatePoll (pollData) {
    if (pollData.question.length <= 8) {
      return 'Question must be longer than 8 characters.'
    }
    if (pollData.options.length < 2) {
      return 'Must enter atleast 2 options.'
    }
    if (pollData.options.length > 16) {
      return 'Cannot enter more than 16 options'
    }
  }
}

module.exports = CreatePoll
