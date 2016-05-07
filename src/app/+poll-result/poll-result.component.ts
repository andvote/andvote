import { Component, OnInit } from '@angular/core'
import { Router, OnActivate, RouteSegment } from '@angular/router'
import { PollService, PollResult } from '../shared'

@Component({
  moduleId: module.id,
  selector: 'app-poll-result',
  templateUrl: 'poll-result.component.html',
  styleUrls: ['poll-result.component.css']
})
export class PollResultComponent implements OnInit, OnActivate {
  poll: PollResult
  pollId;
  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit() {
  }

  routerOnActivate(segment: RouteSegment) {
    this.pollId = +segment.getParam('id')
    this.pollService
      .getPoll(this.pollId)
      .subscribe(
      (poll) => this.poll = poll,
      (err) => console.log('Error occured', err),
      () => console.log('finished!'))
  }

  gotoPoll(pollId) {
    let link = ['/poll-info', { id: pollId }]
    this.router.navigate(link)
  }

}
