import { createStore, applyMiddleware, compose } from 'redux'
import { rxHttpGet, rxHttpPost } from './actions'

import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { createRxHttpEpic } from './epics'

interface RootState { }

const rootReducer = (state: RootState = {}, action: any) => state

const rxHttpEpic = createRxHttpEpic(() => ({
    baseUrl: 'http://localhost:3030/',
    headers: {
        'Content-Type': 'application/json',
    },
}))

const epicMiddleware = createEpicMiddleware(combineEpics(rxHttpEpic))

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            epicMiddleware,
        ),
    ),
);
