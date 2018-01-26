import { keys } from 'lodash'

interface Mocks {
    [key: string]: Response
}

export class TestFetch {
    public mocks: Mocks
    public async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {

        return new Response({ error: 'Not found' }, {
            status: 404,
        })
    }

    public mock(url: string, response: Response): void {

    }
}
