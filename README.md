# request

[![browser support](https://ci.testling.com/bloodyowl/request.png)](https://ci.testling.com/bloodyowl/request)

## install

```sh
$ npm install bloody-request
```

## require

```javascript
var request = require("bloody-request")
```

## api

### var req = request.create(params || url)

Creates a new request, accepts `params` as an object, or a simple `url` string with the default params.

* `headers` : object (default `null`)
* `method` : string (default `"GET"`)
* `url` : string (default `null`)
* `queryString` : string (default `null`)
* `body` : string (default `null`)
* `withCredentials` : boolean (default `false`)

**NOTE** : a `{"headerName":null}` will cancel default headers.

### var reqPromise = req.load()

Creates a XHR objects, and starts loading the target.
Promise is fulfilled if 200 < status < 300 (or status = 304).
Promise is rejected if status < 200 or if status status > 300 (not 304). The XHR object is passed as the value or the reason.

### shorthands

- `var reqPromise = request.get(url || options)`
- `var reqPromise = request.post(url || options[, body])`
- `var reqPromise = request.put(url[, body] || options)`
- `var reqPromise = request.del(url[, body] || options)`

### events

returned promises have events you can listen to [bloodyowl/promise](http://github.com/bloodyowl/promise)

- `.on("resolve", cb)`
- `.on("reject", cb)`
- `.on("done", cb)`
- `.on("error", cb)`

## example

```javascript
var request = require("bloody-request")

// if we are in a flux architecture
var AppDispatcher = require("../dispatcher")
var AppConstants = require("../constants")
var ActionTypes = AppConstants.ActionTypes

var API = {
  getTweets : function(){
    request.get(path.join(API_PATH, "tweets"))
      .then(
        function(xhr){
          AppDispatcher.handleServerAction({
            type : ActionTypes.RECEIVED_TWEETS_LIST,
            response : JSON.parse(xhr.responseText)
          })
        },
        function(xhr){
          AppDispatcher.handleServerAction({
            type : ActionTypes.DIDNT_RECEIVE_TWEETS_LIST,
            status : xhr.status
          })
        }
      )
  }
}

module.exports = API
```
