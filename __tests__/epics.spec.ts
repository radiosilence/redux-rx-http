/* tslint:disable:no-implicit-dependencies */
import { toArray } from 'rxjs/operators'
import { ActionsObservable } from 'redux-observable'
import { TestScheduler } from 'rxjs/testing'

import fetchMock from 'fetch-mock'

import { createHttpRequestEpic, startRequestEpic } from '../src/epics'

import { rxHttpGet } from '../src/actions'

import { createRxHttpActionTypes } from '../src/utils'

const BASE_URL = 'https://not.a.real.domain'

const ACTION_TYPES = createRxHttpActionTypes('TEST')

const httpRequestEpic = createHttpRequestEpic(() => ({
  baseUrl: BASE_URL,
  json: true,
}))

describe('startRequestEpic', () => {
  it('should emit a request action', async () => {
    const action$ = ActionsObservable.of(rxHttpGet('/potatoes', ACTION_TYPES))
    const expectedOutputAction = {
      type: ACTION_TYPES.REQUEST,
    }

    return startRequestEpic(action$)
      .pipe(toArray())
      .subscribe((actualOutputActions: any[]) => {
        expect(actualOutputActions[0]).toMatchObject(expectedOutputAction)
      })
  })
})

describe('httpRequestEpic', () => {
  const testScheduler = new TestScheduler((actual, expected) => {
    // somehow assert the two objects are equal
    // e.g. with chai `expect(actual).deep.equal(expected)`
  })
  beforeEach(() => {
    fetchMock.mock(`${BASE_URL}/potatoes`, [{ id: 1, name: 'barry' }])
    fetchMock.mock(`${BASE_URL}/potatoes/1`, { id: 1, name: 'barry' })
    fetchMock.mock(`${BASE_URL}/potatoes/2`, 404)
    fetchMock.mock(`${BASE_URL}/potatoes/3`, 'argh')
    fetchMock.mock(`${BASE_URL}/message`, {
      thanks: 'Thank you for your valuable input',
    })
    fetchMock.mock(`${BASE_URL}/broken`, 500)
    fetchMock.mock(`${BASE_URL}/post`, (req: any, opts: any) => req.body)
    fetchMock.mock(`${BASE_URL}/delete/1`, '"ok"')
    fetchMock.mock(`${BASE_URL}/patch/1`, (req: any) => ({
      id: 1,
      name: JSON.parse(req.body).name,
    }))
  })

  afterEach(() => {
    fetchMock.restore()
  })
})
