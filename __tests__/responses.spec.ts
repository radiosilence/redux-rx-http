export { createRxHttpActionTypes } from '../src/utils'
import { rxHttpSuccess, rxHttpError } from '../src/actions'
import { createRxHttpActionTypes } from '../src/utils';

const actionTypes = createRxHttpActionTypes('ARGH')

describe('mocked responses', () => {
    it('should mock a successful response', () => {
        const body = { fruit: 'tomato' }
        const action = rxHttpSuccess(
            {
                data: { fruit: 'tomato' },
                response: new Response(JSON.stringify(body), { status: 200 }),
            },
            'fruit',
            undefined,
            actionTypes,
        )

        expect(action.result).toBe(body.fruit)
        expect(action.response.status).toEqual(200)
        expect(action.response.ok).toEqual(true)
    })
    it('should mock an error response', () => {
        const body = { message: 'argh' }
        const action = rxHttpError(
            { body: 'argh', response: new Response(JSON.stringify(body), { status: 500 }) },
            undefined,
            actionTypes,
        )
        expect(action.error).toEqual('argh')
        expect(action.response.status).toEqual(500)
        expect(action.response.ok).toEqual(false)
    })
})
