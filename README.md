# request

[![browser support](https://ci.testling.com/bloodyowl/request.png)](https://ci.testling.com/bloodyowl/request)

## Install

```
$ npm install bloody-request
```

## Require

```javascript
var request = require("bloody-request")
```

## API

### `request.create(params||url) -> new request`

Creates a new request, accepts `params` as an object, or a simple `url` string with the default params. 

* `headers` : object (default `null`)
* `method` : string (default `"GET"`)
* `url` : string (default `null`)
* `queryString` : string (default `null`)
* `data` : string (default `null`)
* `withCredentials` : boolean (default `false`)

### `request.destroy()`

Removes `this.xhr` reference. 

### `request.load() -> promise`

Creates a XHR objects, and starts loading the target. 
Promise is fulfilled if 200 < status < 300 (or status = 304). 
Promise is rejected if status < 200 or if status status > 300 (not 304). The XHR object is passed as the value or the reason. 
