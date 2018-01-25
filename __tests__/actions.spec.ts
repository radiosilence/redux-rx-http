import * as A from '../src/actions'
import { createRxHttpActionTypes } from '../src/utils'

const URL = 'https://example.com'
const ACTION_TYPES = createRxHttpActionTypes('TEST')

describe('rxHttpGet', () => {
    it('should return a get action', () => {
        const action = A.rxHttpGet(URL, ACTION_TYPES)
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'GET',
            },
        })
    })
    it('should return a get action with querystring', () => {
        const action = A.rxHttpGet(URL, ACTION_TYPES, { hi: 'ho' })
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                query: { hi: 'ho' },
                method: 'GET',
            },
        })
    })
})

describe('rxHttpPost', () => {
    it('should return a post action', () => {
        const action = A.rxHttpPost(URL, ACTION_TYPES)
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'POST',
            },
        })
    })

    it('should return a post action with body', () => {
        const action = A.rxHttpPost(URL, ACTION_TYPES, { potato: 'tomato' })
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'POST',
                body: { potato: 'tomato' },
            },
        })
    })
})

describe('rxHttpPut', () => {
    it('should return a put action', () => {
        const action = A.rxHttpPut(URL, ACTION_TYPES)
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'PUT',
            },
        })
    })

    it('should return a put action with body', () => {
        const action = A.rxHttpPut(URL, ACTION_TYPES, { potato: 'tomato' })
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'PUT',
                body: { potato: 'tomato' },
            },
        })
    })
})

describe('rxHttpDelete', () => {
    it('should return a delete action', () => {
        const action = A.rxHttpDelete(URL, ACTION_TYPES)
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'DELETE',
            },
        })
    })
})

describe('rxHttpHead', () => {
    it('should return a head action', () => {
        const action = A.rxHttpHead(URL, ACTION_TYPES)
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'HEAD',
            },
        })
    })
})

describe('rxHttpPatch', () => {
    it('should return a patch action', () => {
        const action = A.rxHttpPatch(URL, ACTION_TYPES)
        expect(action).toMatchObject({
            type: A.RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'PATCH',
            },
        })
    })
})
