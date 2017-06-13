import { Observable } from 'rxjs/Observable'

import {
    RxHttpActionTypes,
    RxHttpRequest,
    RxHttpFetchResponse,
} from './interfaces'

export const createRxHttpActionTypes = (base: string): RxHttpActionTypes => ({
    ERROR: `${base}_ERROR`,
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    CANCEL: `${base}_CANCEL`,
    FINALLY: `${base}_FINALLY`,
})


export const rxHttpFetch = ({ url, headers, method, body }: RxHttpRequest): Observable<any> =>
    Observable.from((async (): Promise<RxHttpFetchResponse> => {
        const response = await fetch(new Request(url, { method, headers, body }))
        if (!response.ok) {
            const error = (new Error() as any)
            error.response = response
            error.status = response.status
            try {
                error.error = await response.json()
            } catch (parseError) {
                error.error = response.body
            }
            throw error
        }
        return ({
            response,
            data: await response.json(),
        })
    })())
