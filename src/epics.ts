import { includes, values } from 'lodash'

import { ActionsObservable, combineEpics, ofType, StateObservable, Epic } from 'redux-observable'
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
  RxHttpRequestConfigured,
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
  rxHttpStartRequest,
} from './actions'

import { RX_HTTP_REQUEST } from './constants'

import { rxHttpFetch } from './utils'

const filterActions = (request: RxHttpRequestConfigured, actionTypes: RxHttpActionTypes) => ({ type }: RxHttpAction) =>
  includes(request.actions, type) || includes(values(actionTypes), type)

const httpRequest = (
  action$: ActionsObservable<RxHttpAction>,
  { request, actionTypes, key, args }: RxHttpRequestActionConfigured,
  dependencies: RxHttpDependencies,
) =>
  rxHttpFetch(request, dependencies).pipe(
    mergeMap((response: RxHttpResponse) =>
      [
        rxHttpGlobalSuccess(response, key, args, actionTypes),
        rxHttpSuccess(response, key, args, actionTypes),
        rxHttpGlobalFinally(args, actionTypes),
        rxHttpFinally(args, actionTypes),
      ].filter(filterActions(request, actionTypes)),
    ),
    takeUntil(action$.ofType(actionTypes.CANCEL)),
    catchError((error: RxHttpError) =>
      [
        rxHttpGlobalError(error, args, actionTypes),
        rxHttpError(error, args, actionTypes),
        rxHttpGlobalFinally(args, actionTypes),
        rxHttpFinally(args, actionTypes),
      ].filter(filterActions(request, actionTypes)),
    ),
  )

export const createHttpRequestEpic = <T>(config: RxHttpConfigFactory<T>): Epic<RxHttpAction> => (
  action$: ActionsObservable<RxHttpAction>,
  state$: StateObservable<T | void>,
  dependencies: RxHttpDependencies,
): Observable<RxHttpAction> =>
  action$.pipe(
    ofType(RX_HTTP_REQUEST),
    mergeMap((action: RxHttpRequestAction) =>
      httpRequest(action$, rxHttpRequestConfigured(state$ ? config(state$.value) : config(), action), dependencies),
    ),
  )

export const startRequestEpic = (
  action$: ActionsObservable<RxHttpRequestAction>,
): Observable<RxHttpStartRequestAction> =>
  action$.pipe(
    ofType(RX_HTTP_REQUEST),
    map(rxHttpStartRequest),
  )

export const createRxHttpEpic = <T>(config: RxHttpConfigFactory<T>) =>
  combineEpics(createHttpRequestEpic<T>(config), startRequestEpic)
