import { createRxHttpActionTypes, rxHttpFetch } from '../src/utils'

describe('createRxHttpActionTypes', () => {
    const desiredActionTypes = {
        ERROR: '@@rx-http/TEST_ERROR',
        REQUEST: '@@rx-http/TEST_REQUEST',
        SUCCESS: '@@rx-http/TEST_SUCCESS',
        CANCEL: '@@rx-http/TEST_CANCEL',
        FINALLY: '@@rx-http/TEST_FINALLY',
    }
    it('should create an action types object', () => {
        expect(createRxHttpActionTypes('TEST')).toMatchObject(
            desiredActionTypes,
        )
    })
    it('should create an action types object and uppercase string', () => {
        expect(createRxHttpActionTypes('test')).toMatchObject(
            desiredActionTypes,
        )
    })
    it('should fail to create the wrong action types', () => {
        expect(createRxHttpActionTypes('potato')).not.toMatchObject(
            desiredActionTypes,
        )
    })

    it('should create custom action types', () => {
        expect(
            createRxHttpActionTypes('test', ['ERROR', 'SUCCESS']),
        ).toMatchObject({
            ERROR: '@@rx-http/TEST_ERROR',
            SUCCESS: '@@rx-http/TEST_SUCCESS',
        })
    })
})
