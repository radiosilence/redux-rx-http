import { createStore, applyMiddleware, compose } from 'redux'
import { map } from 'rxjs/operators'
import thunk from 'redux-thunk'
import { RxHttpGlobalSuccessAction } from './interfaces'
import { rxHttpGet, rxHttpPost } from './actions'
import { RX_HTTP_SUCCESS } from './constants'
import { createRxHttpActionTypes } from './utils'

import { createEpicMiddleware, combineEpics, ActionsObservable, ofType } from 'redux-observable'

import { createRxHttpEpic } from './epics'

const POTATO = createRxHttpActionTypes('POTATO')

interface RootState {
  exampleVal: number
}

const rootReducer = (
  state: RootState = {
    exampleVal: 1,
  },
  action: any,
) => state

const rxHttpEpic = createRxHttpEpic((state: RootState) => ({
  baseUrl: 'http://localhost:3030',
  json: true,
}))

const resultEpic = (action$: ActionsObservable<RxHttpGlobalSuccessAction>) =>
  action$.pipe(
    ofType(RX_HTTP_SUCCESS),
    map((result) => {
      resultNode.innerHTML = JSON.stringify(result.response.data)
      return { type: 'NOOP' }
    }),
  )

const epicMiddleware = createEpicMiddleware({ dependencies: { fetch } })

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, epicMiddleware)))

epicMiddleware.run(combineEpics(rxHttpEpic))

const createButton = (name: string, cb: () => any) => {
  const node = document.createElement('button')
  node.innerHTML = name
  node.addEventListener('click', (event: Event) => {
    event.preventDefault()
    cb()
  })
  document.body.appendChild(node)
}

const getNode = createButton('GET', () => {
  store.dispatch(rxHttpGet('/', POTATO))
})
const getGhNode = createButton('GET github', () => {
  store.dispatch(
    rxHttpGet('/zen', POTATO, null, {
      request: {
        baseUrl: 'http://api.github.com',
      },
    }),
  )
})

const postNode = createButton('POST', () => {
  store.dispatch(
    rxHttpPost('/', POTATO, {
      some: 'data',
    }),
  )
})

const resultNode = document.createElement('pre')
resultNode.style.height = '400px'
resultNode.style.width = '500px'
resultNode.style.border = '1px solid #ccc'
document.body.appendChild(resultNode)

document.body.style.width = '500px'
document.body.style.margin = 'auto'
