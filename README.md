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

### `request.create(params||url) > r`

Creates a new request, accepts `params` as an object, or a simple `url` string with the default params.

* `headers` : object (default `null`)
* `method` : string (default `"GET"`)
* `url` : string (default `null`)
* `queryString` : string (default `null`)
* `body` : string (default `null`)
* `withCredentials` : boolean (default `false`)


### `request.load() > promise`

Creates a XHR objects, and starts loading the target.
Promise is fulfilled if 200 < status < 300 (or status = 304).
Promise is rejected if status < 200 or if status status > 300 (not 304). The XHR object is passed as the value or the reason.

### shorthands

- `request.get(url || options) > promise`
- `request.post(url || options[, body]) > promise`
- `request.put(url[, body] || options) > promise`
- `request.del(url[, body] || options) > promise`
- `request.options(url[, body] || options) > promise`
- `request.head(url[, body] || options) > promise`

### events

returned promises have events you can listen to [bloodyowl/promise](http://github.com/bloodyowl/promise)

- `.on("resolve", cb)`
- `.on("reject", cb)`
- `.on("done", cb)`
- `.on("error", cb)`
