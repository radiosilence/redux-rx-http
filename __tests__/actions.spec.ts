import { rxHttpGet, RX_HTTP_REQUEST } from '../src/actions'
import { createRxHttpActionTypes } from '../src/utils'

const URL = 'https://example.com'
const ACTION_TYPES = createRxHttpActionTypes('TEST')

describe('rxHttpGet', () => {
    it('should do create a get request', () => {
        const action = rxHttpGet('https://example.com', ACTION_TYPES)
        console.log('action', action)
        expect(action).toMatchObject({
            type: RX_HTTP_REQUEST,
            actionTypes: ACTION_TYPES,
            request: {
                url: URL,
                method: 'GET',
            },
        })
    })
})
