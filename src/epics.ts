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
    APIRequestAction,
    APIRequestActionTypes,
    APIRequest,
    APIResponse,
    APIResponseAction,
} from 'interfaces'

import { API_REQUEST_CONFIGURED, API_SUCCESS, API_ERROR } from './actions'

const API_BASE = ''
const API_KEY = ''

const BASE_HEADERS = {
    'Content-Type': 'application/json',
    'Authorisation': API_KEY,
}

const apiRequest = (action$: any, action: APIRequestAction) => {
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
                    actionTypes: APIRequestActionTypes) => ({
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
                  actionTypes: APIRequestActionTypes) => ({
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

const apiRequestEpic = (action$: ActionsObservable<APIRequestAction>) =>
    action$.ofType(API_REQUEST_CONFIGURED)
        .mergeMap(action => apiRequest(action$, action))

const startRequestEpic = (action$: ActionsObservable<APIRequestAction>):
    Observable<Action> =>
    action$.ofType(API_REQUEST_CONFIGURED)
        .map(({ actionTypes }: APIRequestAction) => ({ type: actionTypes.REQUEST }))

export default combineEpics(
    apiRequestEpic,
    startRequestEpic,
)
