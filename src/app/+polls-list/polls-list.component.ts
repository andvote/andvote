import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { PollService } from '../shared';

@Component({
  moduleId: module.id,
  selector: 'app-polls-list',
  templateUrl: 'polls-list.component.html',
  styleUrls: ['polls-list.component.css']
})
export class PollsListComponent implements OnInit {
  polls: any[]
  offset: number = 0
  next: boolean = false
  prev: boolean = false
  constructor(private router: Router,
    private pollService: PollService) { }

  ngOnInit() {
    this.getPolls(this.offset)
  }
  private getPolls(offset) {
    this.pollService.getPolls(offset).subscribe(
      (polls) => {
        this.polls = polls
        if (this.polls.length < 5) {
          if(offset === 5){
            this.prev = false
          }
          this.next = false
        } else {
          this.next = true
        }
      },
      (err) => alert('No More Polls'),
      () => console.log('Finished!')
    )
  }
  nextPolls() {
    this.offset += 5
    this.getPolls(this.offset)
    this.prev = true
  }

  prevPolls() {
    if (this.offset !== 0) {
      this.offset -= 5
      this.getPolls(this.offset)
    } else {
      this.prev = false
    }
  }

  gotoPoll(pollId) {
    let link = ['/poll-info', { id: pollId }]
    this.router.navigate(link)
  }
}
