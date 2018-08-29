import { Store } from 'redux'
import { includes, values } from 'lodash'

import {
    ActionsObservable,
    combineEpics,
    ofType,
    StateObservable,
} from 'redux-observable'
import { Observable } from 'rxjs'
import { map, mergeMap, takeUntil, catchError } from 'rxjs/operators'

import {
    RxHttpRequestAction,
    RxHttpActionTypes,
    RxHttpResponse,
    RxHttpDependencies,
    RxHttpConfigFactory,
    RxHttpRequestActionConfigured,
    RxHttpError,
    RxHttpAction,
    RxHttpStartRequestAction,
    RxHttpRequestConfigured,
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
    rxHttpStartRequest,
} from './actions'

import { rxHttpFetch } from './utils'

const filterActions = (
    request: RxHttpRequestConfigured,
    actionTypes: RxHttpActionTypes,
) => ({ type }: RxHttpAction) =>
    includes(request.actions, type) || includes(values(actionTypes), type)

const httpRequest = (
    action$: ActionsObservable<RxHttpAction>,
    { request, actionTypes, key, args }: RxHttpRequestActionConfigured,
    dependencies: RxHttpDependencies,
) =>
    rxHttpFetch(request, dependencies).pipe(
        mergeMap((response: RxHttpResponse) =>
            [
                rxHttpGlobalSuccess(response, key, args),
                rxHttpSuccess(response, key, args, actionTypes),
                rxHttpGlobalFinally(args),
                rxHttpFinally(args, actionTypes),
            ].filter(filterActions(request, actionTypes)),
        ),
        takeUntil(action$.ofType(actionTypes.CANCEL)),
        catchError((error: RxHttpError) =>
            [
                rxHttpGlobalError(error, args),
                rxHttpError(error, args, actionTypes),
                rxHttpGlobalFinally(args),
                rxHttpFinally(args, actionTypes),
            ].filter(filterActions(request, actionTypes)),
        ),
    )

export const createHttpRequestEpic = <T>(config: RxHttpConfigFactory<T>) => (
    action$: ActionsObservable<RxHttpAction>,
    state$: StateObservable<T>,
    dependencies: RxHttpDependencies,
): Observable<RxHttpAction> =>
    action$.pipe(
        ofType(RX_HTTP_REQUEST),
        mergeMap((action: RxHttpRequestAction) => {
            const req = httpRequest(
                action$,
                rxHttpRequestConfigured(config(state$.value), action),
                dependencies,
            )
            console.log('req is', req)
            return req
        }),
    )

export const startRequestEpic = (
    action$: ActionsObservable<RxHttpRequestAction>,
): Observable<RxHttpStartRequestAction> =>
    action$.pipe(ofType(RX_HTTP_REQUEST), map(rxHttpStartRequest))

export const createRxHttpEpic = <T>(config: RxHttpConfigFactory<T>) =>
    combineEpics(createHttpRequestEpic<T>(config), startRequestEpic)
