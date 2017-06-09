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
    Action,
    RxAPIRequestAction,
    RxAPIRequestActionTypes,
    RxAPIRequest,
    RxAPIResponse,
    RxAPIResponseAction,
} from 'interfaces'

import { API_REQUEST_CONFIGURED, API_SUCCESS, API_ERROR } from './actions'

const API_BASE = ''
const API_KEY = ''

const BASE_HEADERS = {
    'Content-Type': 'application/json',
    'Authorisation': API_KEY,
}

const apiRequest = (action$: any, action: RxAPIRequestAction) => {
    const {
        apiRequest: {
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
        headers: {
            ...BASE_HEADERS,
            ...headers,
        },
        method: (method as string),
        body,
    })
        .mergeMap((response: AjaxResponse) => [
            apiGlobalSuccess(response, key, args),
            apiSuccess(response, key, args, actionTypes),
        ])
        .takeUntil(action$.ofType(actionTypes.CANCEL))
        .catch((error: any) => [
            apiGlobalError(error, args),
            apiError(error, args, actionTypes),
        ])
}

const apiSuccess = ({ response }: AjaxResponse,
                    key: string | undefined,
                    args: object | undefined,
                    actionTypes: RxAPIRequestActionTypes) => ({
        type: actionTypes.SUCCESS,
        result: key ? response[key] : response,
        args,
    })

const apiGlobalSuccess = ({ response }: AjaxResponse,
                          key: string | undefined,
                          args: object | undefined) => ({
        type: API_SUCCESS,
        key,
        response,
        args,
    })

const apiError = (error: any, args: object | undefined,
                  actionTypes: RxAPIRequestActionTypes) => ({
        type: actionTypes.ERROR,
        payload: error.xhr.response,
        error: true,
        args,
    })

const apiGlobalError = (error: any, args: object | undefined) => ({
    type: API_ERROR,
    args,
    error,
})

const apiRequestEpic = (action$: ActionsObservable<RxAPIRequestAction>) =>
    action$.ofType(API_REQUEST_CONFIGURED)
        .mergeMap(action => apiRequest(action$, action))

const startRequestEpic = (action$: ActionsObservable<RxAPIRequestAction>):
    Observable<Action> =>
    action$.ofType(API_REQUEST_CONFIGURED)
        .map(({ actionTypes }: RxAPIRequestAction) => ({ type: actionTypes.REQUEST }))

export const rxApiEpic = combineEpics(
    apiRequestEpic,
    startRequestEpic,
)
