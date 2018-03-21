import { Store } from 'redux'

import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/map'

import { ActionsObservable, combineEpics, Epic } from 'redux-observable'
import { Observable } from 'rxjs/Observable'

import {
    RxHttpRequestAction,
    RxHttpActionTypes,
    RxHttpRequest,
    RxHttpResponse,
    RxHttpDependencies,
    RxHttpConfigFactory,
    RxHttpRequestActionConfigured,
    RxHttpError,
    RxHttpAction,
    RxHttpStartRequestAction,
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
    rxHttpStartRequest,
} from './actions'

import { rxHttpFetch } from './utils'

const httpRequest = (
    action$: ActionsObservable<RxHttpAction>,
    { request, actionTypes, key, args }: RxHttpRequestActionConfigured,
    dependencies: RxHttpDependencies,
) =>
    rxHttpFetch(request, dependencies)
        .mergeMap((response: RxHttpResponse) => [
            rxHttpGlobalSuccess(response, key, args),
            rxHttpSuccess(response, key, args, actionTypes),
            rxHttpGlobalFinally(args),
            rxHttpFinally(args, actionTypes),
        ])
        .takeUntil(action$.ofType(actionTypes.CANCEL))
        .catch((error: RxHttpError) => [
            rxHttpGlobalError(error, args),
            rxHttpError(error, args, actionTypes),
            rxHttpGlobalFinally(args),
            rxHttpFinally(args, actionTypes),
        ])

export const createHttpRequestEpic = <T>(config: RxHttpConfigFactory<T>) => (
    action$: ActionsObservable<RxHttpAction>,
    store: Store<T>,
    dependencies: RxHttpDependencies,
) =>
    action$.ofType(RX_HTTP_REQUEST).mergeMap((action: RxHttpRequestAction) => {
        const requestConfigured = rxHttpRequestConfigured(
            config(store ? store.getState() : null),
            action,
        )
        return httpRequest(action$, requestConfigured, dependencies)
    })

export const startRequestEpic = (
    action$: ActionsObservable<RxHttpRequestAction>,
) => action$.ofType(RX_HTTP_REQUEST).map(rxHttpStartRequest)

export const createRxHttpEpic = <T>(config: RxHttpConfigFactory<T>) =>
    combineEpics(createHttpRequestEpic<T>(config), startRequestEpic)
