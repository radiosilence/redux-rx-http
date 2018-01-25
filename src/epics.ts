import { Store } from 'redux'

import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/map'

import { ActionsObservable, combineEpics } from 'redux-observable'
import { Observable } from 'rxjs/Observable'

import {
    RxHttpRequestAction,
    RxHttpActionTypes,
    RxHttpRequest,
    RxHttpConfig,
    RxHttpFetchResponse,
    RxHttpFetchError,
    RxHttpDependencies,
} from './interfaces'

import {
    rxHttpRequestConfigured,
    rxHttpSuccess,
    rxHttpGlobalSuccess,
    rxHttpError,
    rxHttpGlobalError,
    rxHttpFinally,
    rxHttpGlobalFinally,
    RX_HTTP_REQUEST,
    RX_HTTP_SUCCESS,
    RX_HTTP_ERROR,
    RX_HTTP_FINALLY,
} from './actions'

import { rxHttpFetch } from './utils'

const httpRequest
    = (action$: any,
       action: RxHttpRequestAction,
       dependencies: RxHttpDependencies) => {
    const {
        request,
        actionTypes,
        key,
        args,
    } = action

    return rxHttpFetch(request, dependencies)
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

const startRequestEpic
    = (action$: ActionsObservable<RxHttpRequestAction>): Observable<any> =>
    action$.ofType(RX_HTTP_REQUEST)
        .map(({ actionTypes, args }: RxHttpRequestAction) => ({
            type: actionTypes.REQUEST,
            args,
        }))

export const createRxHttpEpic = <T>(config: (state: T) => RxHttpConfig) =>
    combineEpics(
        (action$: ActionsObservable<RxHttpRequestAction>,
         store: Store<T>,
         dependencies: RxHttpDependencies) =>
            action$.ofType(RX_HTTP_REQUEST)
                .mergeMap((action: RxHttpRequestAction) =>
                    httpRequest(
                        action$,
                        rxHttpRequestConfigured(config(store.getState()), action),
                        dependencies,
                    ),
                ),
        startRequestEpic,
    )
