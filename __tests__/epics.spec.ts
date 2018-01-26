import 'rxjs/add/operator/toArray'
import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware, ActionsObservable } from 'redux-observable'
import thunk from 'redux-thunk'
import * as fetchMock from 'fetch-mock'

import { createHttpRequestEpic, startRequestEpic } from '../src/epics'

import {
    rxHttpGet,
} from '../src/actions'

import {
    createRxHttpActionTypes,
} from '../src/utils'

const BASE_URL = 'https://not.a.real.domain'

const ACTION_TYPES = createRxHttpActionTypes('TEST')

const httpRequestEpic = createHttpRequestEpic(() => ({
    baseUrl: BASE_URL,
    json: true,
}))

describe('http request', () => {
    beforeEach(() => {
        fetchMock.mock(`${BASE_URL}/potatoes`, [{ id: 1, name: 'barry' }])
        fetchMock.mock(`${BASE_URL}/potatoes/1`, { id: 1, name: 'barry' })
        fetchMock.mock(`${BASE_URL}/potatoes/2`, 404)
    });

    afterEach(() => {
        fetchMock.restore()
    })

    it('stub', () => {
        expect(1).toEqual(1)
    })

    it('should get a request action', async () => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes', ACTION_TYPES))
        const expectedOutputAction = {
            type: ACTION_TYPES.REQUEST,
            args: undefined,
        }

        return startRequestEpic(action$)
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions).toContainEqual(expectedOutputAction)
            })
    })

    it('should get a response success', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes', ACTION_TYPES))
        const expectedOutputAction = {
            type: ACTION_TYPES.SUCCESS,
            args: undefined,
            result: [{ id: 1, name: 'barry' }],
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions).toContainEqual
                    (expectedOutputAction)
                done()
            })
    })

    it('should get a response failure', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes/2', ACTION_TYPES))
        const expectedOutputAction = {
            type: ACTION_TYPES.ERROR,
            args: undefined,
            error: { status: 404 },
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const errorAction = actualOutputActions[1]
                expect(errorAction.error.response.status).toEqual(404)
                // console.log('actual output', actualOutputActions[1])
                done()
            })
    })

})
