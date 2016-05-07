import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { Routes, Router, ROUTER_DIRECTIVES } from '@angular/router';
import 'rxjs/Rx'; // load the full rxjs

import { CreatePollComponent } from './+create-poll';
import { PollInfoComponent } from './+poll-info';
import { PollResultComponent } from './+poll-result';
import { PollsListComponent } from './+polls-list';

import { PollService } from './shared';

@Component({
  moduleId: module.id,
  selector: 'andvote-angular-app',
  templateUrl: 'andvote-angular.component.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['andvote-angular.component.css'],
  providers: [
    HTTP_PROVIDERS,
    PollService    
  ]
})
@Routes([
  {path: '/', component: CreatePollComponent},
  {path: '/create-poll', component: CreatePollComponent},
  {path: '/poll-info', component: PollInfoComponent},
  {path: '/poll-result', component: PollResultComponent},
  {path: '/polls', component: PollsListComponent}
])

export class AndvoteAngularAppComponent implements OnInit {
  title = 'andvote-angular works!' 
  constructor(private router: Router) {}
  ngOnInit(){
   // this.router.navigate(['/create-poll'])
  }
}
