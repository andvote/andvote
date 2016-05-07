# andvote
:ballot_box_with_check: NG&amp;Vote clone of [Andvote](andvote.com) ,  but with Angular2 as weapon

Made this by inspring live coding sessions by [alexbooker](https://github.com/alexbooker/ "Alex Booker") and [DmsChrisPena](https://github.com/DmsChrisPena/ "Chris Pena")

Though UI is little bit different in adding poll form

### Todo
1. Change how the URL i shown. Currently its like `localhost:4200/poll-info;id=1` 
2. Make UI smililar to original from where options added on the fly by focusing

### API documentation

### Poll

#### Create

```
POST /api/poll
```

##### Parameters

| Name       | Type   | Notes                                           |
|------------|--------|-------------------------------------------------|
| `question` | string | Required                                        |
| `options`  | array  | Required. Must contain _at least_ two elements  |


```json
{
  "question": "What is the best editor?",
  "options": [
    "Vim",
    "Emacs"
  ]
}
```

##### Response
If the poll was successfully created:

```
Status 201
```

```json
{
  "createdPollId": 1
}
```

If something wrong:

```
Status 500
```

```json
{
  "message": "An internal server error occured"
}
```

#### Read

```
GET /api/poll/:pollId
```

##### Response

If the poll was found:

```
Status 200
```

```json
{
  "question": "What video should I make next?",
  "options": [
    {
      "pollOptionId": 1,
      "text": "Advanced React",
      "votes": 0
    },
    {
      "pollOptionId": 2,
      "text": "Arrow Functions Tutorial",
      "votes": 0
    },
    {
      "pollOptionId": 3,
      "text": "Arch Linux Tutorial",
      "votes": 0
    }
  ]
}
```

If the poll cannot be found:

```
Status 404
```

If something wrong:

```
Status 500
```

```json
{
  "message": "An internal server error occured"
}
```

### Vote

#### Create

```
POST /api/vote
```
##### Parameters

| Name         | Type   | Notes       |
|--------------|--------|-------------|
| `pollOptionId` | number | Required. |

##### Response

If vote was successfully created:

```
Status 201
```

```json
{
  "pollOptionId": 1
}
```

If user has already voted on poll:

```
Status 400
```

```json
{
  "message": "You've already voted on this poll."
}
```

If something wrong:

```
Status 500
```

```json
{
  "message": "An internal server error occured"
}
```
