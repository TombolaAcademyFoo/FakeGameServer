# FakeGameServer

A fake bingo game sever, the purpose being to allow trainees to write a more realistic client, without the need to deal with the full complexity of a live server. As a note, the app *currently has no persistent store - everything is hard coded for now*. This means there is one login, one game card and one set of bingo calls. Hopefully this will all evolve to enable as psuedo-real game of bingo.

The server is a non-REST API mirroring some of the features of the real game server - the biggest technical difference is the read server is long-polled (the client polls, then waits for a respsonse, which may be one of serveral types), whereas this fake server has a standard "synchronous" call/response cycle. If you are working on a client, from a preparation for "real server" work, it is better to just to have one thing dealing with all responses based on the response message.

The server is embryonic and has very little built in resilience when running -you have been warned...


#API Calls
**Note** All request calls must have a content type of `application/json`. Any calls for secured api urls must have a header 
`x-token`, this must be the token issued at login, this includes the logout method.
A basic and very/totally insecure authentication method has been adopted. The username is 'drwho' and the password 'tardis123!'.
##Authentication
### Login
The login message is as follows:
```
method: post
url: /users/login
body: {"username":"drwho", "password":"tardis123!"}
```
A successful response will be: 
```
 {
    "message": "LoginSuccess",
    "payload": {
        "user": {
            "username": "drwho",
            "balance": 20000,
            "token": "f36bb73b-83cc-4539-aac0-893914bc73ec"
        }
    }
}
 ```
 Or you'll get a `401 (unauthorized)` error if the details are incorrect.
 
###Logout
The key detail is in the headers - the `x-token`, which should be the users 'secure' token issued at login. Any body is ignored.
```
method: post
url: /users/logout
 ```
 A successful response will be: 
 ```
 {
    "message": "LogoutSuccess",
}
 ```
 Or you'll get a `400 (Bad Request)` error if the token is missing or incorrect.
```
{
    "message": "Error",
    "payload": "Error logging out"
}
```
##Game Calls
**All Game calls are sercured, worth re-stating you'll need the x-token header, or you'll just get a 401 (Unauthorized) response.**
###Get Next Game
Gets the number, pricing options and time of the next game. The time is really there for simulation purposes at the moment - you should show a countdown and start at the time. The start time is always the time the server recieved your request, plus ten seconds. In reality you get the calls immediately (and in any order).
```
method: get
url: /game/next
 ```
  A successful response will be: 
 ```
 {
    "message": "NextGame",
    "payload": {
        "gameId": 1,
        "start": "2015-07-24T13:02:03.496Z",
        "ticketPrice": 10
    }
}
 ```
###Get Call
This gets the call - the message doesn't change between calls, though repsonses can differ depending on the game stage.
```
method: post
url: /game/getcall
body: {"gameId":1, "userId":"drwho", "balance":19990, "callnumber":1}
```
The balance is there to calculate the new balance. When the server is better developed it will be unecessary. The call number is the number of the call you want to get, 1-indexed. As this is a bingo 90 game range 1--> 90.
The *standard* response is the call:
```
{
    "message": "Call",
    "payload": {
        "gameId": 1,
        "callnumber": 1,
        "call": 54,
        "user": {
            "username": "drwho",
            "balance": 19990,
            "token": "f36bb73b-83cc-4539-aac0-893914bc73ec"
        }
    }
}
```
Depending on the stage in the game, any given call might be a line prize (in which case this will happen):
```
{
    "message": "Line",
    "payload": {
        "gameId": 1,
        "callnumber": 85,
        "call": 5,
        "user": {
            "username": "drwho",
            "balance": 19991,
            "token": "f36bb73b-83cc-4539-aac0-893914bc73ec"
        },
        "winnerInfo": {
            "linewinnername": "drwho",
            "lineprize": 1
        }
    }
}
```
When the game ends and the winner message is sent:
```
{
    "message": "Winner",
    "payload": {
        "gameId": 1,
        "callnumber": 89,
        "call": 6,
        "user": {
            "username": "drwho",
            "balance": 19995,
            "token": "f36bb73b-83cc-4539-aac0-893914bc73ec"
        },
        "winnerInfo": {
            "linewinnername": "drwho",
            "lineprize": 1,
            "housewinnername": "drwho",
            "houseprize": 5
        }
    }
}
```
