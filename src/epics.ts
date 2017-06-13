import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mapTo'

import { ActionsObservable, combineEpics } from 'redux-observable'
import { Observable } from 'rxjs/Observable'

import {
    RxHttpRequestAction,
    RxHttpActionTypes,
    RxHttpRequest,
    RxHttpSuccess,
    RxHttpError,
    RxHttpConfig,
    RxHttpFetchResponse,
    RxHttpFetchError,
} from './interfaces'

import {
    rxHttpRequestConfigured,
    rxHttpSuccess,
    rxHttpGlobalSuccess,
    rxHttpError,
    rxHttpGlobalError,
    rxHttpFinally,
    rxHttpGlobalFinally,
} from './actions'

import { rxHttpFetch } from './utils'

import { RX_HTTP_REQUEST, RX_HTTP_SUCCESS, RX_HTTP_ERROR, RX_HTTP_FINALLY } from './actions'

const httpRequest = (action$: any, action: RxHttpRequestAction) => {
    const {
        request: {
            url,
            method,
            params,
            body,
            headers,
        },
        actionTypes,
        key,
        args,
    } = action

    return rxHttpFetch({
        url,
        headers,
        method: (method as string),
        body,
        params,
    })
        .mergeMap((response: RxHttpFetchResponse) => [
            rxHttpGlobalSuccess(response, key, args),
            rxHttpSuccess(response, key, args, actionTypes),
            rxHttpGlobalFinally(args),
            rxHttpFinally(args, actionTypes),
        ])
        .takeUntil(action$.ofType(actionTypes.CANCEL))
        .catch((error: RxHttpFetchError) => [
            rxHttpGlobalError(error, args),
            rxHttpError(error, args, actionTypes),
            rxHttpGlobalFinally(args),
            rxHttpFinally(args, actionTypes),
        ])
}

const startRequestEpic = (action$: ActionsObservable<RxHttpRequestAction>): Observable<any> =>
    action$.ofType(RX_HTTP_REQUEST)
        .map(({ actionTypes }: RxHttpRequestAction) => ({ type: actionTypes.REQUEST }))

export const createRxHttpEpic = (config: (store: any) => RxHttpConfig) => {

    const httpRequestEpic = (action$: ActionsObservable<RxHttpRequestAction>, store: any) =>
        action$.ofType(RX_HTTP_REQUEST)
            .mergeMap(action =>
                httpRequest(action$, rxHttpRequestConfigured(config(store.getState()), action)),
            )

    return combineEpics(
        httpRequestEpic,
        startRequestEpic,
    )
}
