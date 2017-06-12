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

`configure-store.ts`
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

// Action to fetch a potat from our API
export const fetchPotato = (id: string): RxHttpRequestAction =>
  rxHttpGet(`/potato/${id}`)


// Action to cancel said fetching
export const cancelFetchPotato = () => ({ type: FETCH_POTATO.CANCEL })

```

`epics.ts`
```typescript
import { FETCH_POTATO } from './actions'

// Simply take the request, and map it to some sort of UI action.
const showSpinner = (action$: ActionsObservable<any>): Observable<any> =>
  action$.ofType(FETCH_POTATO.REQUEST)
    .mapTo({ type: UIActions.SHOW_SPINNER })

// Hide the spinner on done.
const showSpinner = (action$: ActionsObservable<any>): Observable<any> =>
  action$.ofType(
    FETCH_POTATO.SUCCESS,
    FETCH_POTATO.ERROR,
    FETCH_POTATO.CANCEL,
  )
    .mapTo({ type: UIActions.HIDE_SPINNER })

// Consume the results of loading our potato!
const setPotato = (action$: ActionsObservable<any>): Observable<any> =>
  action$.ofType(FETCH_POTATO.SUCCESS)
    .map(action => ({ type: PotatoActions.SET_POTATO, courier: action.result }))

// Handle erroneous potato fetch
  action$.ofType(FETCH_POTATO.ERROR)
    .map(action => ({ type: PotatoActions.POTATO_ERROR, courier: action.error }))

```

More complex usage
------------------

Of course, simply getting a potato is simple, but each function takes a secondary argument of a
relevant thing:

  * Query params: `rxHttpGet`
  * Request body: `rxHttpPost`, `rxHttpPut`, `rxHttpPatch`
  * None: `rxHttpDelete`, `rxHttpHead`

And a final argument which is of type `RxHttpRequestConfig`.

```typescript
export interface RxHttpRequestConfig {
  // Represents data about the request to be sent
  request?: RxHttpRequestBase

  // An arbitrary object that you can pass additional metadata in order to provide context to
  // whatever epic is consuming the side-effects, e.g. an ID, a parent ID, etc.
  args?: {}

  // Shortcut to allow easy destructuring API responses that are of the form:
  // { potato: { ... potato data ...} }
  key?: string
}
```

So a more complex usage could look something like this:

`actions.ts`
```typescript
export const fetchPotatosForField = (fieldId: string,
                                     status: Status = 'ALL'): RxHttpRequestAction =>
  rxHttpGet(`/fields/${fieldId}/potatoes`, FETCH_POTATOES_FOR_FIELD, { status }, {
    key: 'potatoes',
    args: { fieldId },
  })


export const savePotato (id: string, potato: Potato): RxHttpRequestAction =>
  rxHttpPut(`/potato/${id}`, SAVE_POTATO, potato, { args: { id } })
```


`epics.ts`
```typescript
const potatoSavedNotification = (action$: ActionsObservable<any>): Observable<any> =>
  action$.ofType(SAVE_POTATO.SUCCESS)
    .map(action => ({
      type: PotatoActions.NOTIFY,
      message: `Saved potato ${action.args.id} successfully!`,
    }))
```

I would advise against putting callbacks in args, as that entirely misses the point.
