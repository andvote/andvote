import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import 'rxjs/add/operator/map'
import {config} from './config'
import { Poll } from './poll.model'

@Injectable()
export class PollService {
    constructor(private http: Http) { }

    getPoll(id) {
        return this.http
            .get(`${config.api}/poll/${id}`)
            .map(res => res.json())
    }

    votePoll(optionId) {
        let data = {
            pollOptionId: optionId
        }
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        return this.http.post(`${config.api}/vote`,
            JSON.stringify(data),
            {
                headers: headers
            }).map(res => res.json())
    }

    createPoll(poll: Poll) {
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        return this.http
            .post(`${config.api}/poll`,
            JSON.stringify(poll), {
                headers: headers
            }).map(res => res.json())
    }

    getPolls(offset) {
        return this.http
            .get(`${config.api}/polls/${offset}`)
            .map((res) => res.json())
    }
}