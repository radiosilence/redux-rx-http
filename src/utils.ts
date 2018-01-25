import { stringify } from 'qs'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'

import {
    RxHttpActionTypes,
    RxHttpRequest,
    RxHttpFetchResponse,
    RxHttpDependencies,
} from './interfaces'

export const createRxHttpActionTypes = (base: string): RxHttpActionTypes => ({
    ERROR: `${base}_ERROR`.toUpperCase(),
    REQUEST: `${base}_REQUEST`.toUpperCase(),
    SUCCESS: `${base}_SUCCESS`.toUpperCase(),
    CANCEL: `${base}_CANCEL`.toUpperCase(),
    FINALLY: `${base}_FINALLY`.toUpperCase(),
})

export const rxHttpFetch
    = (rxHttpRequest: RxHttpRequest,
       { fetch }: RxHttpDependencies): Observable<any> =>
    Observable.from((async (): Promise<RxHttpFetchResponse> => {
        const {
            url,
            method,
            query,
            body,
            mode,
            cache,
            json,
        } = rxHttpRequest

        const headers = new Headers(rxHttpRequest.headers)

        const urlWithParams = query && Object.keys(query).length > 0
            ? `${url}?${stringify(query)}`
            : url

        const request = new Request(urlWithParams, {
            body: json ? JSON.stringify(body) : body,
            method,
            headers,
            mode,
            cache,
        })
        console.log('FETCHING...')
        const response = await fetch(request)
        console.log('RESPONSE', response)
        if (!response.ok) {
            const error = (new Error() as any)
            error.response = response
            error.status = response.status
            try {
                error.error = await response.json()
            } catch (parseError) {
                if (json) throw error
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
            if (json) throw parseError
            return ({
                response,
                data: response.body,
            })
        }
    })())
