# redux-rx-http

## TODO: Update Readme for 1.0.1

So, you like redux, you like RxJS, you're using redux-observable. You want to talk to APIs, and
consume the side effects through epics, and you want a nice, simple way to do it. This library
works by having a single API action where the side-effect actions (request, success, error, cancel)
are passed in with the initial action in a clean, consistent way. Oh, and we have type definitions!

> **Important note:** As of version 0.14, fetch is used internally. This means you will have to inject fetch as a dependency
in your `createEpicMiddleware` function, e.g. *isomorphic-fetch*. Also, cancellation won't actually cancel the original
request, it will just terminate the inner stream (so no further actions will be emitted).

## Configuration

Configuration allows you to set the base URL and initial headers for all requests.

Because your base request configuration could be dynamic based on your application state,
config is done as a function, with store.getState() as the primary argument.

For instance, say your authorisation token was acquired asyncronously and put in your store...

**`configure-store.ts`**

```typescript
// ...imports...
import { createRxHttpEpic, RxHttpRequestBase } from 'redux-rx-http'

const rxHttpEpic = createRxHttpEpic((state: AppState): RxHttpRequestBase => ({
    baseUrl: 'https://my-excellent-api.com/v1.0',
    headers: {
        // Here we're dynamically configuring the auth token
        Authorization: getAuthToken(state),
    },
}))

const epicMiddleware = createEpicMiddleware(
    combineEpics(rootEpic, rxHttpEpic),
    // Inject our fetch dependency (at least)
    { dependencies: { fetch } },
)

const store = createStore(rootReducer, applyMiddleware(epicMiddleware))
```

## Usage

To make a simple HTTP GET request, and then listen to the results...

**`actions.ts`**

```typescript
import { rxHttpGet, createRxHttpActionTypes } from 'redux-rx-http'

const FETCH_POTATO = createRxHttpActionTypes('FETCH_POTATO')

// Action to fetch a potat from our API
export const fetchPotato = (id: string): RxHttpRequestAction =>
    rxHttpGet(`/potato/${id}`)
```

**`epics.ts`**

```typescript
import { FETCH_POTATO } from './actions'

// Simply take the request, and map it to some sort of UI action.
const showSpinner = (action$: ActionsObservable<PotatoAction>): Observable<UIAction> =>
  action$.ofType(FETCH_POTATO.REQUEST)
    .mapTo({ type: UIActions.SHOW_SPINNER })

// Hide the spinner on done.
const showSpinner = (action$: ActionsObservable<PotatoAction>): Observable<UIAction> =>
  action$.ofType(FETCH_POTATO.FINALLY, FETCH_POTATO.CANCEL)
    .mapTo({ type: UIActions.HIDE_SPINNER })

// Consume the results of loading our potato!
const setPotato = (action$: ActionsObservable<PotatoAction>): Observable<SetPotatoAction> =>
  action$.ofType(FETCH_POTATO.SUCCESS)
    .map(action => ({ type: PotatoActions.SET_POTATO, potato: action.result }))

// Handle erroneous potato fetch
const potatoError = (action$ ActionsObservable<PotatoAction>): Observable<PotatoErrorAction> =>
  action$.ofType(FETCH_POTATO.ERROR)
    .map(action => ({ type: PotatoActions.POTATO_ERROR, error: action.error }))

```

## More complex usage

Of course, simply getting a potato is simple, but each function takes a third argument of a
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

**`actions.ts`**

```typescript
export const fetchPotatosForField = (fieldId: string,
                                     status: Status = 'ALL'): RxHttpRequestAction =>
  rxHttpGet(`/fields/${fieldId}/potatoes`, FETCH_POTATOES_FOR_FIELD, { status }, {
    key: 'potatoes',
    args: { fieldId },
  })


export const savePotato (potato: Potato): RxHttpRequestAction =>
  rxHttpPut(`/potato/${potato.id}`, SAVE_POTATO, potato, { args: { id } })
```

**`epics.ts`**

```typescript
const potatoSavedNotification = (action$: ActionsObservable<PotatoAction>): Observable<UIAction> =>
  action$.ofType(SAVE_POTATO.SUCCESS)
    .map((action: SavePotatoAction): NotifyAction => ({
      type: UIActions.NOTIFY,
      message: `Saved potato ${action.args.id} successfully!`,
    }))
```

I would advise against putting callbacks in args, as that entirely misses the point.

## Cancellation

Because we're using observables, requests can be cancelled!

**`actions.ts`**

```typescript
// Action to cancel said fetching
export const cancelFetchPotato = () => ({ type: FETCH_POTATO.CANCEL })
```


## Filtering output actions

If for some utterly bizarre reason the amount of actions going through the redux
store is a performance issue, you can filter both global and your local actions.

### Global actions

Only generate success action:

```typescript
rxHttpGet('https://potato.com/api', myActions, {}, {
  request: {
    actions: [RX_HTTP_SUCCESS],
  }
})
```

This can be added to base request config, as with anything else

### Specific actions

Only generate success action:

```typescript
const myActions = createRxHttpActions('MY', ['SUCCESS'])
```

Simple!