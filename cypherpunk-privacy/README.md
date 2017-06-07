# cypherpunk.privacy.network/api/v1 spec

## /app - static data about app versions

##### `GET /app/versions`
Returns the latest available app versions, and the minimum required app versions.  

Parameters:
```
  (none)
```
Returns:
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
Requires authenticated session. Returns up-to-date account metadata for the current session.  

Parameters:
```
  (none)
```
Returns:
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
Retrieves the list of Stripe payment sources for current account, if any.  

Parameters:
```
  (none)
```
Returns:
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
Requires authenticated session.
Attempts to add a new card to customer's stripe profile, and if successful, deletes old registered cards.  

Parameters:
```
{
  "token":"card_19hw7PCymPOZwO5rzXXcupS4" // card token from Stripe.js
}
```
Returns:
* 402 -> Failed to add card
* 200 -> OK
```
  (same as /account/source/list)
```

##### `POST /account/source/default`
Requires authenticated session.
Updates customer's default card to the specified card id.  

Parameters:
```
{
  "default_source":"card_19hw7PCymPOZwO5rzXXcupS4" // card id from /account/source/list
}
```
Returns:
* 200 -> OK
```
  (same as /account/source/list)
```

##### `POST /account/logout`
Destroys current session, if any.
Parameters:
```
  (none)
```
Returns:
* 200 -> OK, logs out user
```
  (no body)
```

##### `POST /account/purchase/stripe`
Creates a Stripe customer account, card source, and recurring subscription using the specified tokenized card and given plan ID, creates a new user account, starts an authenticated session.

Parameters:
```
{
  "email":"test@test.test",
  "password":"foobar",
  "plan": "monthly",
  "token":"card_19hw7PCymPOZwO5rzXXcupS4", // card token from Stripe.js
  "referralCode":"123456"
}
```
Returns:
* 400 -> Invalid or missing parameters
* 402 -> Authorizing the card failed
```
  (TODO: add billing errors here)
```
* 409 -> Email already registered
* 200 -> OK
```
  (same as /account/status)
```

##### `POST /account/upgrade/stripe`
Requires authenticated session.

Parameters:
```
{
  "plan": "monthly",
  "token":"card_19hw7PCymPOZwO5rzXXcupS4", // card token from Stripe.js
  "referralCode":"123456"
}
```
Returns:
* 400 -> Invalid or missing parameters
* 401 -> Requires valid session
* 402 -> Authorizing the card failed
```
  (TODO: add billing errors here)
```
* 200 -> OK
```
  (same as /account/status)
```

##### `POST /account/purchase/amazon`
Confirms the given amazon billing agreement, charges the amazon billing agreement, creates a new account, authorizes and captures the specified plan's price, and starts an authenticated session for the account.  

Parameters:
```
{
  "email":"test@test.test",
  "password":"foobar",
  "plan": "monthly",
  "AmazonBillingAgreementId": "xxx",
  "referralCode":"123456"
}
```
Returns:
* 400 -> Invalid or missing parameters
* 402 -> Authorizing the billing agreement failed
```
  (TODO: add billing errors here)
```
* 409 -> Email already registered
* 200 -> OK
```
  (same as /account/status)
```

##### `POST /account/upgrade/amazon`
Requires authenticated session.

Parameters:
```
{
  "AmazonBillingAgreementId": "xxx",
  "plan": "monthly",
  "referralCode":"123456"
}
```
Returns:
* 400 -> Invalid or missing parameters
* 401 -> Requires valid session
* 200 -> OK
```
  (same as /account/status)
```

##### `POST /account/upgrade/apple`
##### `POST /account/upgrade/google`

### Blog
##### `GET /blog/posts`
##### `GET /blog/post/{postId}`

### /pricing - pricing for promo codes

##### `POST /pricing/plans`
Returns the pricing for a given coupon code.  

Parameters:
```
{
    "referralCode":"123"
}
```
Returns:
* 200 -> OK
```
{
    "monthly":
    {
        "price": 8.99,
        "paypalPlanId": "monthly899",
        "bitpayPlanId": "monthly899",
    },
    "semiannually":
    {
        "price": 8.99,
        "paypalPlanId": "monthly899",
        "bitpayPlanId": "monthly899",
    },
    "annually":
    {
        "price": 8.99,
        "paypalPlanId": "monthly899",
        "bitpayPlanId": "monthly899",
    }
}
```

### Network

##### `GET /network/status`
Get IP address and Geo-location country of user.  

Returns:
```
  {
    "ip": "185.176.52.7",
    "country": "IS"
  }
```

### Location
##### `GET /location/world`
##### `GET /location/list/{accountType}`

### Support
##### `GET /support/posts`
##### `GET /support/post/{postId}`
##### `POST /support/request/new`

