import 'rxjs/add/operator/toArray'
import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware, ActionsObservable } from 'redux-observable'
import thunk from 'redux-thunk'
import * as fetchMock from 'fetch-mock'

import { createHttpRequestEpic, startRequestEpic } from '../src/epics'

import {
    rxHttpGet, rxHttpPost, rxHttpDelete, rxHttpPut,
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

describe('startRequestEpic', () => {
    it('should emit a request action', async () => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes', ACTION_TYPES))
        const expectedOutputAction = {
            type: ACTION_TYPES.REQUEST,
        }

        return startRequestEpic(action$)
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions[0]).toMatchObject(expectedOutputAction)
            })
    })
})

describe('httpRequestEpic', () => {
    beforeEach(() => {
        fetchMock.mock(`${BASE_URL}/potatoes`, [{ id: 1, name: 'barry' }])
        fetchMock.mock(`${BASE_URL}/potatoes/1`, { id: 1, name: 'barry' })
        fetchMock.mock(`${BASE_URL}/potatoes/2`, 404)
        fetchMock.mock(`${BASE_URL}/potatoes/3`, 'argh')
        fetchMock.mock(`${BASE_URL}/message`, { thanks: 'Thank you for your valuable input'})
        fetchMock.mock(`${BASE_URL}/broken`, 500)
        fetchMock.mock(`${BASE_URL}/post`, (req: any, opts: any) => req.body)
        fetchMock.mock(`${BASE_URL}/delete/1`, '"ok"')
        fetchMock.mock(`${BASE_URL}/patch/1`, (req: any) => ({
            id: 1,
            name: JSON.parse(req.body).name,
        }))
    })

    afterEach(() => {
        fetchMock.restore()
    })

    it('should get a response success', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes', ACTION_TYPES))
        const expectedOutputAction: Partial<RxHttpSuccessAction> = {
            type: ACTION_TYPES.SUCCESS,
            result: [{ id: 1, name: 'barry' }],
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions[1]).toMatchObject(expectedOutputAction)
                done()
            })
    })

    it('should get a global response success', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes', ACTION_TYPES))
        const expectedOutputAction = {
            type: '@@rx-http/SUCCESS',
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions[0]).toMatchObject(expectedOutputAction)
                done()
            })
    })

    it('should handle not found', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes/2', ACTION_TYPES))

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const errorAction: RxHttpErrorAction = actualOutputActions[1]
                expect(errorAction.response.status).toEqual(404)
                done()
            })
    })

    it('should get a global error', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes/2', ACTION_TYPES))

        const expectedOutputAction = {
            type: '@@rx-http/ERROR',
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions[0]).toMatchObject(expectedOutputAction)
                done()
            })
    })

    it('should handle malformed json', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/potatoes/3', ACTION_TYPES))

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const errorAction: RxHttpErrorAction = actualOutputActions[1]
                expect(errorAction.error).toEqual(JSON_PARSE_ERROR)
                done()
            })
    })

    it('should handle a 500 error', (done) => {
        const action$ = ActionsObservable.of(rxHttpGet('/broken', ACTION_TYPES))

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const errorAction: RxHttpErrorAction = actualOutputActions[1]
                expect(errorAction.response.status).toEqual(500)
                done()
            })
    })

    it('should post some data', (done) => {
        const action$ = ActionsObservable.of(rxHttpPost('/post', ACTION_TYPES, {
            some: 'data',
        }))
        const expectedOutputAction: Partial<RxHttpSuccessAction> = {
            type: ACTION_TYPES.SUCCESS,
            result: { some: 'data' },
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const successAction: RxHttpSuccessAction = actualOutputActions[1]
                expect(actualOutputActions[1]).toMatchObject(expectedOutputAction)
                expect(successAction.response.status).toEqual(200)
                done()
            })
    })

    it('should delete something', (done) => {
        const action$ = ActionsObservable.of(rxHttpDelete('/delete/1', ACTION_TYPES))
        const expectedOutputAction: Partial<RxHttpSuccessAction> = {
            type: ACTION_TYPES.SUCCESS,
            result: 'ok',
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const successAction: RxHttpSuccessAction = actualOutputActions[1]
                expect(actualOutputActions[1]).toMatchObject(expectedOutputAction)
                expect(successAction.response.status).toEqual(200)
                done()
            })
    })

    it('should put some data', (done) => {
        const action$ = ActionsObservable.of(rxHttpPut('/patch/1', ACTION_TYPES, {
            id: 1,
            name: 'steve',
        }))
        const expectedOutputAction: Partial<RxHttpSuccessAction> = {
            type: ACTION_TYPES.SUCCESS,
            result: { id: 1, name: 'steve' },
        }

        httpRequestEpic(action$, null, { fetch })
            .toArray()
            .subscribe((actualOutputActions: any[]) => {
                const successAction: RxHttpSuccessAction = actualOutputActions[1]
                expect(actualOutputActions[1]).toMatchObject(expectedOutputAction)
                expect(successAction.response.status).toEqual(200)
                done()
            })
    })
})
