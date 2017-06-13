import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mapTo'

import { ActionsObservable, combineEpics } from 'redux-observable'
import { Observable, AjaxResponse } from 'rxjs'

import {
    RxHttpRequestAction,
    RxHttpActionTypes,
    RxHttpRequest,
    RxHttpSuccess,
    RxHttpError,
    RxHttpConfig,
} from './interfaces'

import { RX_HTTP_REQUEST, RX_HTTP_SUCCESS, RX_HTTP_ERROR, RX_HTTP_FINALLY } from './actions'

const configured = (config: RxHttpConfig, action: RxHttpRequestAction): RxHttpRequestAction => ({
    ...action,
    type: RX_HTTP_REQUEST,
    request: {
        ...action.request,
        url: `${config.baseUrl}${action.request.url}`,
        headers: {
            ...config.headers,
            ...action.request.headers,
        },
    },
})

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

    return ajax({
        url,
        headers,
        method: (method as string),
        body,
    })
        .mergeMap((response: AjaxResponse) => [
            httpGlobalSuccess(response, key, args),
            httpSuccess(response, key, args, actionTypes),
            httpGlobalFinally(args),
            httpFinally(args, actionTypes),
        ])
        .takeUntil(action$.ofType(actionTypes.CANCEL))
        .catch((error: any) => [
            httpGlobalError(error, args),
            httpError(error, args, actionTypes),
            httpGlobalFinally(args),
            httpFinally(args, actionTypes),
        ])
}

const httpSuccess = ({ response }: AjaxResponse,
                     key: string | undefined,
                     args: object | undefined,
                     actionTypes: RxHttpActionTypes) => ({
        type: actionTypes.SUCCESS,
        result: key ? response[key] : response,
        args,
    })

const httpGlobalSuccess = ({ response }: AjaxResponse,
                           key: string | undefined,
                           args: object | undefined): RxHttpSuccess => ({
        type: RX_HTTP_SUCCESS,
        key,
        response,
        args,
    })

const httpError = (error: any, args: object | undefined,
                   actionTypes: RxHttpActionTypes) => ({
        type: actionTypes.ERROR,
        payload: error.xhr.response,
        error: true,
        args,
    })

const httpGlobalError = (error: any, args: object | undefined): RxHttpError => ({
    type: RX_HTTP_ERROR,
    args,
    error,
})

const httpFinally = (args: any, actionTypes: RxHttpActionTypes) => ({
    type: actionTypes.FINALLY,
    args,
})

const httpGlobalFinally = (args: any) => ({
    type: RX_HTTP_FINALLY,
    args,
})


const startRequestEpic = (action$: ActionsObservable<RxHttpRequestAction>): Observable<any> =>
    action$.ofType(RX_HTTP_REQUEST)
        .map(({ actionTypes }: RxHttpRequestAction) => ({ type: actionTypes.REQUEST }))

export const createRxHttpEpic = (config: (store: any) => RxHttpConfig) => {

    const httpRequestEpic = (action$: ActionsObservable<RxHttpRequestAction>, store: any) =>
        action$.ofType(RX_HTTP_REQUEST)
            .mergeMap(action => httpRequest(action$, configured(config(store.getState()), action)))

    return combineEpics(
        httpRequestEpic,
        startRequestEpic,
    )
}
