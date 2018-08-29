import { includes, values } from 'lodash'

import {
    ActionsObservable,
    combineEpics,
    ofType,
    StateObservable,
} from 'redux-observable'
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
    rxHttpStartRequest,
} from './actions'

import { RX_HTTP_REQUEST } from './constants'

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
    state$: StateObservable<T | void>,
    dependencies: RxHttpDependencies,
) =>
    action$.pipe(
        ofType(RX_HTTP_REQUEST),
        mergeMap((action: RxHttpRequestAction) =>
            httpRequest(
                action$,
                rxHttpRequestConfigured(
                    state$ ? config(state$.value) : config(),
                    action,
                ),
                dependencies,
            ),
        ),
    )

export const startRequestEpic = (
    action$: ActionsObservable<RxHttpRequestAction>,
) => action$.pipe(ofType(RX_HTTP_REQUEST), map(rxHttpStartRequest))

export const createRxHttpEpic = <T>(config: RxHttpConfigFactory<T>) =>
    combineEpics(createHttpRequestEpic<T>(config), startRequestEpic)
