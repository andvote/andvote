import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { PollService } from '../shared'
import { Poll } from '../shared'

@Component({
  moduleId: module.id,
  selector: 'app-create-poll',
  templateUrl: 'create-poll.component.html',
  styleUrls: ['create-poll.component.css']
})
export class CreatePollComponent implements OnInit {
  poll: Poll
  pollOptionString: string
  constructor(private pollService: PollService, private router: Router) {
  }
  ngOnInit() {
    this.poll = new Poll()
    this.poll.question = ''
    this.poll.options = []
    this.pollOptionString = ''
  }

  createPoll(): any {
    event.preventDefault()
    if (this.poll.question.trim() === '') {
      return alert('Enter Question')
    }
    if (this.pollOptionString.trim() === '') {
      return alert('Enter Poll Options')
    }

    // console.log(`Question : ${this.poll.questione}`)
    // console.log(`Options : ${pollOptionString.split('\n').join(', ')}`)

    // removing null lines if any 
    let optionsArray = this.pollOptionString.trim().split('\n').map(option => {
      let text = option.trim()
      if (text !== '') {
        return text
      }
    })

    if (optionsArray.length && optionsArray.length < 2) {
      return alert('Enter 2 or more options')
    }
    //console.log(optionsArray)

    this.poll.question.trim()     // strip spaces if any?
    this.poll.options = optionsArray
    // console.log('Poll ', this.poll)
    // fire up the poll service
    this.pollService
      .createPoll(this.poll)
      .subscribe(
        (res) => {
          this.poll.question = ''
          this.poll.options = []
          this.pollOptionString = ''
          
          // redirect to create poll via createdPollId
          let { createdPollId } = res;
          let link = ['/poll-info/', {id: createdPollId}]
          this.router.navigate(link)      
         },
        (err) => console.log('Error occured ', err),
        () => console.log('Complete!')
      )
  }
}
