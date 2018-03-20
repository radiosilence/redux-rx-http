export { createRxHttpActionTypes } from '../src/utils'
import { rxHttpSuccess, rxHttpError } from '../src/actions'
import { createRxHttpActionTypes } from '../src/utils';

const actionTypes = createRxHttpActionTypes('ARGH')

describe('mocked responses', () => {
    it('should mock a successful response', () => {
        const success = rxHttpSuccess(
            {
                data: { tomato: 'tomato' },
                response: new Response(),
            },
            'tomato',
            undefined,
            actionTypes,
        )

        expect(success.result).toBe('tomato')
    })
    it('should mock an error response', () => {
        const error = rxHttpError(
            { body: 'argh', response: new Response() },
            undefined,
            actionTypes,
        )
        expect(error.error).toEqual('argh')
    })
})
