# cypherpunk.privacy.network/api/v1 spec

## /app - static data about app versions

##### `GET /app/versions`
Returns the latest available app versions, and the minimum required app versions.
* 200 -> OK
```
{
  "windows": {
    "latest": "0.5.0-beta",
    "required": "0.5.0-beta",
    "description": ""
  },
  "macos": {
    "latest": "0.5.0-beta",
    "required": "0.5.0-beta",
    "description": ""
  },
  "linux": {
    "latest": "0.5.0-beta",
    "required": "0.5.0-beta",
    "description": ""
  }
}
```

## /account - account, subscription, billing related operations

##### `GET /account/status`
Requires authenticated session.
Returns up-to-date account metadata for the current session.
* 401 -> Requires valid session
* 200 -> OK
```
{
  "secret": "K7Q5KOX2OXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXS25ZK7Q5KOX2OZI2",
  "privacy": {
    "username": "CYXIXXXXXXXXXXXXXXXXXXXT2J",
    "password": "BDNQXXXXXXXXXXXXXXXXXXXRKT"
  },
  "account": {
    "type": "premium",
    "id": "RIOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXSFBS",
    "email": "test@test.test",
    "confirmed": "true"
  },
  "subscription": {
    "renewal": "none",
    "expiration": "0"
  }
}
```

##### `POST /account/identify/email`
Creates an unauthenticated session for a given account, identified by its email address.
Parameters:
```
{
  "email": "test@test.test"
}
```
Returns:
* 401 -> Email not registered
* 200 -> OK, session created + cookie returned
```
  (no body)
```

##### `POST /account/authenticate/password`
Requires unauthenticated session from /account/identify/* methods
If successful, session is authenticated and can then call any other method.
Parameters:
```
{
  "password": "test123"
}
```
Returns:
* 401 -> Authentication Failure
* 200 -> OK, session created + cookie returned
```
  (same as /account/status)
```

##### `POST /account/authenticate/userpasswd`
Creates an authenticated session for a given account, identified by its email address, and authenticated by its password.
Parameters:
```
{
  "login": "test@test.test",
  "password": "test123"
}
```
Returns:
* 401 -> Authentication Failure
* 200 -> OK, session created + cookie returned
```
  (same as /account/status)
```

##### `POST /account/confirm/email`
Creates an authenticated session for a given account, identified by its accountId, and authenticated by its confirmationToken.
Parameters:
```
{
  "accountId":"RIOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXSFBS",
  "confirmationToken":"B5NGRXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXMMZFPZG"
}
```
Returns:
* 404 -> No matching account + token found
* 200 -> OK, session created + cookie returned
```
  (same as /account/status)
```

##### `POST /account/register/signup`
Registers a new account, and starts an authenticated session for the new account.
Parameters:
```
{
  "email":"test@test.test",
  "password":"foobar"
}
```
Returns:
* 400 -> Invalid or missing parameters
* 409 -> Email already registered
* 202 -> OK
```
  (same as /account/status)
```

##### `GET /account/source/list`
Requires authenticated session.
Returns list of Stripe payment sources for current account.
* 200 -> OK
```
{
  "default_source":"card_19hw7PCymPOZwO5rzXXcupS4",
  "sources":
  [
    {
      "id": "card_19hw7PCymPOZwO5rzXXcupS4",
      "brand": "Visa",
      "last4": "4242",
      "exp_month": 5,
      "exp_year": 2019
    }
  ]
}
```

##### `POST /account/source/add`
* 200 -> OK

##### `POST /account/source/default`
* 200 -> OK

##### `POST /account/upgrade/amazon`
##### `POST /account/upgrade/apple`
##### `POST /account/upgrade/google`
##### `POST /account/upgrade/stripe`

##### `POST /account/logout`
Destroys current session, if any.
* 200 -> OK, logs out user
```
  (no body)
```

### Blog
##### `GET /blog/posts`
##### `GET /blog/post/{postId}`

### Network
##### `GET /network/status`

### Location
##### `GET /location/world`
##### `GET /location/list/{accountType}`

### Support
##### `GET /support/posts`
##### `GET /support/post/{postId}`
##### `POST /support/request/new`

