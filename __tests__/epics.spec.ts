import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware } from 'redux-observable'
import thunk from 'redux-thunk'
import * as fetchMock from 'fetch-mock'

import {
    createRxHttpEpic,
} from '../src/epics'

import {
    rxHttpGet,
} from '../src/actions'

import {
    createRxHttpActionTypes,
} from '../src/utils'

const BASE_URL = 'https://not.a.real.domain'

const rxHttpEpic = createRxHttpEpic(() => ({
    baseUrl: BASE_URL,
    json: true,
}))

const epicMiddleware = createEpicMiddleware(rxHttpEpic, {
    dependencies: {
        fetch,
    },
})
const mockStore = configureMockStore([thunk, epicMiddleware])

const ACTION_TYPES = createRxHttpActionTypes('TEST')

describe('http request', () => {
    let store;

    beforeEach(() => {
        store = mockStore()
        fetchMock.mock(`${BASE_URL}/potatoes`, {
            potato: { id: 1, name: 'barry' },
        })
        fetchMock.mock(`${BASE_URL}/potatoes/1`, { id: 1, name: 'barry' })
    });

    afterEach(() => {
        epicMiddleware.replaceEpic(rxHttpEpic)
        fetchMock.restore()
    })

    it('stub', () => {
        expect(1).toEqual(1)
    })

    // it('should get a response success', async () => {
    //     store.dispatch(rxHttpGet('/potatoes/1', ACTION_TYPES))
    //     console.log('dispatched!', await fetch(`${BASE_URL}/potatoes/1`))
    //     console.log(store.getActions())
    //     expect(store.getActions()).toContainEqual({
    //         type: ACTION_TYPES.SUCCESS,
    //         args: undefined,
    //     })
    // })

    // it('mocks simplest http get request', (done) => {
    //     fetchMock.mock('http://rambo.was.ere', 301)
    //     fetch('http://rambo.was.ere')
    //         .then(res => {
    //             console.log('res', res)
    //             console.log('fetchMock.calls()', fetchMock.calls())
    //             expect(fetchMock.calls().matched.length).toEqual(1)
    //             expect(res.status).toEqual(301);
    //             fetchMock.restore();
    //             done();
    //         });
    // });
})
