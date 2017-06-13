import { stringify } from 'qs'
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

export const rxHttpFetch = (rxHttpRequest: RxHttpRequest): Observable<any> =>
    Observable.from((async (): Promise<RxHttpFetchResponse> => {
        const { url, headers, method, params, body } = rxHttpRequest
        const urlWithParams = params && Object.keys(params).length > 0
            ? `${url}?${stringify(params)}`
            : url

        const request = new Request(urlWithParams, { method, headers, body })
        const response = await fetch(request)
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
