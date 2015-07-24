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
 url: /users/login
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
