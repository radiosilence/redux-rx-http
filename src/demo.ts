import { createStore, applyMiddleware, compose } from 'redux'
import { rxHttpGet, rxHttpPost } from './actions'
import { createRxHttpActionTypes } from './utils'

import { createEpicMiddleware, combineEpics, ActionsObservable } from 'redux-observable';

import { createRxHttpEpic } from './epics'
import { RX_HTTP_SUCCESS } from './actions'

const POTATO = createRxHttpActionTypes('POTATO')

interface RootState { }

const rootReducer = (state: RootState = {}, action: any) => state

const rxHttpEpic = createRxHttpEpic(() => ({
    baseUrl: 'http://localhost:3030',
    headers: {
        'content-type': 'application/json',
    },
    json: true,
}))

const resultEpic = (action$: ActionsObservable<any>): any =>
    action$.ofType(RX_HTTP_SUCCESS)
        .map(result => resultNode.innerHTML = JSON.stringify(result.response.data))

const epicMiddleware = createEpicMiddleware(combineEpics(rxHttpEpic, resultEpic))

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            epicMiddleware,
        ),
    ),
);

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
    store.dispatch(rxHttpGet('/zen', POTATO, null, {
        request: {
            baseUrl: 'http://api.github.com',
        },
    }))
})

const postNode = createButton('POST', () => {
    store.dispatch(rxHttpPost('/', POTATO, {
        some: 'data',
    }))
})

const resultNode = document.createElement('pre')
resultNode.style.height = '400px'
resultNode.style.width = '500px'
resultNode.style.border = '1px solid #ccc'
document.body.appendChild(resultNode)

document.body.style.width = '500px'
document.body.style.margin = 'auto'
