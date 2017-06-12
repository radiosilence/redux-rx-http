redux-rx-http
=============

So, you like redux, you like RxJS, you're using redux-observable. You want to talk to APIs, and
consume the side effects through epics, and you want a nice, simple way to do it. This library
works by having a single API action where the side-effect actions (request, success, error, cancel)
are passed in with the initial action in a clean, consistent way. Oh, and we have type definitions!


Configuration
-------------

Configuration allows you to set the base URL and initial headers for all requests.

Because your base request configuration could be dynamic based on your application state,
config is done as a function, with store.getState() as the primary argument.

For instance, say your authorisation token was acquired asyncronously and put in your store...

```typescript
// ...imports...
import { createRxHttpEpic } from 'redux-rx-http'

const rxHttpEpic = createRxHttpEpic((state) => ({
  baseUrl: 'https://my-excellent-api.com/v1.0',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': state.auth.token, // Here we're dynamically configuring the auth token
  },
}))

const epicMiddleware = createEpicMiddleware(combineEpics(
  rootEpic,
  rxHttpEpic,
))

const store = createStore(
  rootReducer,
  applyMiddleware(
    epicMiddleware,
  ),
)
```

Usage
-----

To make a simple HTTP GET request, and then listen to the results...

`actions.ts`
```typescript
import { rxHttpGet, createRxHttpActionTypes } from 'redux-rx-http'

const FETCH_POTATO = createRxHttpActionTypes('FETCH_POTATO')

export const fetchPotato = (id: string): RxHttpRequestAction =>
  rxHttpGet(`/potato/${id}`)
```

`epics.ts`
```

```