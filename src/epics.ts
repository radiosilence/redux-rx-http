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

const httpRequest = (
    action$: any,
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
    action$: ActionsObservable<RxHttpRequestAction>,
    store: Store<T>,
    dependencies: RxHttpDependencies,
): Observable<any> =>
    action$
        .ofType(RX_HTTP_REQUEST)
        .mergeMap((action: RxHttpRequestAction) =>
            httpRequest(
                action$,
                rxHttpRequestConfigured(
                    config(store ? store.getState() : null),
                    action,
                ),
                dependencies,
            ),
        )

export const startRequestEpic = (
    action$: ActionsObservable<RxHttpRequestAction>,
): Observable<any> =>
    action$
        .ofType(RX_HTTP_REQUEST)
        .map(({ actionTypes, args }: RxHttpRequestAction) => ({
            type: actionTypes.REQUEST,
            args,
        }))

export const createRxHttpEpic = <T>(config: RxHttpConfigFactory<T>) =>
    combineEpics(createHttpRequestEpic<T>(config), startRequestEpic)
