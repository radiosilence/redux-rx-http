import 'rxjs/add/operator/toArray'
import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware, ActionsObservable } from 'redux-observable'
import thunk from 'redux-thunk'
import * as fetchMock from 'fetch-mock'

import { createHttpRequestEpic, startRequestEpic } from '../src/epics'

import {
    rxHttpGet, rxHttpPost,
} from '../src/actions'

import {
    createRxHttpActionTypes,
    JSON_PARSE_ERROR,
} from '../src/utils'
import { RxHttpErrorAction, RxHttpSuccessAction } from '../src/interfaces';

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
        fetchMock.mock(`${BASE_URL}/potatoes/3`, 'argh')
        fetchMock.mock(`${BASE_URL}/message`, { thanks: 'Thank you for your valuable input'})
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

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const errorAction: RxHttpErrorAction = actualOutputActions[1]
                expect(errorAction.error.response.status).toEqual(404)
                done()
            })
    })

    it('should handle malformed json', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes/3', ACTION_TYPES))

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                console.log('actualOutputActions', actualOutputActions)
                const errorAction: RxHttpErrorAction = actualOutputActions[1]
                expect(errorAction.error.body).toEqual(JSON_PARSE_ERROR)
                done()
            })
    })

    it('should post a request and get a message back', (done) => {
        const action$ = ActionsObservable.of(rxHttpPost('/message', ACTION_TYPES, {
            message: 'sup',
        }))

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                console.log('actualOutputActions', actualOutputActions)
                const successAction: RxHttpSuccessAction = actualOutputActions[1]
                expect(successAction.result).toMatchObject({
                    thanks: 'Thank you for your valuable input',
                })
                done()
            })
    })

})
