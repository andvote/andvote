import { Component, OnInit } from '@angular/core'
import { PollService } from '../shared/'
import { Poll } from '../shared'
import { Router, OnActivate, RouteSegment } from '@angular/router'


@Component({
  moduleId: module.id,
  selector: 'app-poll-info',
  templateUrl: 'poll-info.component.html',
  styleUrls: ['poll-info.component.css']
})

export class PollInfoComponent implements OnInit, OnActivate {
  poll: Poll
  selectedOption
  createdPollId
  message: string = ''

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit() { }

  routerOnActivate(segment: RouteSegment) {
    this.createdPollId = +segment.getParam('id')
    this.pollService
      .getPoll(this.createdPollId)
      .subscribe(
      (poll) => { 
        this.poll = poll
        this.message = ''
      },
      (error) => {
        if (error.status === 404) {
          this.message = 'Poll not found!'
        } else {
          console.log('Error' + error)
        }
      },
      () => console.log('Completed')
      )
  }
  onOptionSelected(event) {
    this.selectedOption = parseInt(event.target.value, 10)
    console.log('Option Selected ', this.selectedOption)
  }

  onSubmit(event) {
    event.preventDefault()
    // fire service
    if (this.selectedOption === '') {
      return alert('Select an option')
    }
    this.pollService
      .votePoll(this.selectedOption)
      .subscribe(
      (res) => {
        console.log(res)
        let link = ['/poll-result', { id: this.createdPollId }]
        this.router.navigate(link)
      },
      (err) => {
        if (err.status === 400) {
          return alert('You have already voted on this poll!')
        }
        return alert('Internal Server Error!')
      },
      () => console.log('finished!')
      )
  }

  goBack() {
    window.history.back()
  }

}
