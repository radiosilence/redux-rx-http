import { createRxHttpActionTypes, rxHttpFetch } from '../src/utils'

describe('createRxHttpActionTypes', () => {
    const desiredActionTypes = {
        ERROR: 'TEST_ERROR',
        REQUEST: 'TEST_REQUEST',
        SUCCESS: 'TEST_SUCCESS',
        CANCEL: 'TEST_CANCEL',
        FINALLY: 'TEST_FINALLY',
    }
    it('should create an action types object', () => {
        expect(createRxHttpActionTypes('TEST')).toMatchObject(desiredActionTypes)
    })
    it('should create an action types object and uppercase string', () => {
        expect(createRxHttpActionTypes('test')).toMatchObject(desiredActionTypes)
    })
    it('should fail to create the wrong action types', () => {
        expect(createRxHttpActionTypes('potato')).not.toMatchObject(desiredActionTypes)
    })
})
