import { stringify } from 'qs'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'

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
        const {
            url,
            method,
            params,
            body,
            mode,
            cache,
        } = rxHttpRequest

        console.log('rxHttpRequest', rxHttpRequest)

        const headers = new Headers(rxHttpRequest.headers)

        const urlWithParams = params && Object.keys(params).length > 0
            ? `${url}?${stringify(params)}`
            : url

        const request = new Request(urlWithParams, {
            method,
            headers,
            body,
            mode,
            cache,
        })

        console.log('request mode', request.mode, mode)
        console.log('request cache', request.cache, cache)

        const response = await fetch(request)
        console.log('response', response.ok, response.status, response)
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
        try {
            return ({
                response,
                data: await response.json(),
            })
        } catch (parseError) {
            return ({
                response,
                data: response.body,
            })
        }
    })())
