import 'dotenv/config'
import http from 'http'
import { default as request } from 'supertest'
import app from '../../src/app.js'
import { getFromMatchId, saveManyMatchStat } from '../../src/services/dataAccessService.js'
import { createManyMatchStat } from '../../src/services/matchStatService.js'
import { retrieveMatchData, retrievePlayerData, retrieveProfileData } from '../../src/services/valApiService.js'
import { mockMatchStat } from '../mockData.js'

let server: http.Server

jest.mock('../../src/services/valApiService.js')
jest.mock('../../src/services/matchStatService.js')
jest.mock('../../src/services/dataAccessService.js')

beforeAll((done): void => {
    server = app.listen(3000, (): void => {
        done()
    })
})

afterAll((done): void => {
    server.close((): void => {
        done()
    })
})

describe('testing GET /players', (): void => {
    beforeEach((): void => {
        ;(retrievePlayerData as jest.Mock).mockResolvedValue({
            searched_player_id: mockMatchStat.player.id,
            match_data: {},
        })
        ;(createManyMatchStat as jest.Mock).mockReturnValue([mockMatchStat, mockMatchStat])
        ;(saveManyMatchStat as jest.Mock).mockResolvedValue(undefined)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return status 200 with a valid input', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const size = 10
        const region = 'na'
        const url = `/players/${name}?tag=${tag}&mode=${mode}&size=${size}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrievePlayerData).toHaveBeenCalledWith(name, tag, mode, size, region)
        expect(retrievePlayerData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
        expect(saveManyMatchStat).toHaveBeenCalledWith([mockMatchStat, mockMatchStat])
        expect(saveManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 with an out of bounds mode', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = 'spike rush'
        const size = 10
        const region = 'na'
        const url = `/players/${name}?tag=${tag}&mode=${mode}&size=${size}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrievePlayerData).toHaveBeenCalledWith(name, tag, 'competitive', size, region)
        expect(retrievePlayerData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
        expect(saveManyMatchStat).toHaveBeenCalledWith([mockMatchStat, mockMatchStat])
        expect(saveManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 with an out of bounds size', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const size = 15
        const region = 'na'
        const url = `/players/${name}?tag=${tag}&mode=${mode}&size=${size}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrievePlayerData).toHaveBeenCalledWith(name, tag, mode, 5, region)
        expect(retrievePlayerData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
        expect(saveManyMatchStat).toHaveBeenCalledWith([mockMatchStat, mockMatchStat])
        expect(saveManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 with an out of bounds region', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const size = 10
        const region = 'wonderland'
        const url = `/players/${name}?tag=${tag}&mode=${mode}&size=${size}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrievePlayerData).toHaveBeenCalledWith(name, tag, mode, size, 'na')
        expect(retrievePlayerData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
        expect(saveManyMatchStat).toHaveBeenCalledWith([mockMatchStat, mockMatchStat])
        expect(saveManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 400 with an invalid input', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const size = 10
        const region = 'na'
        const url = `/players/${name}?mode=${mode}&size=${size}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Invalid input' })
        expect(retrievePlayerData).toHaveBeenCalledTimes(0)
        expect(createManyMatchStat).toHaveBeenCalledTimes(0)
        expect(saveManyMatchStat).toHaveBeenCalledTimes(0)
    })
})

describe('testing GET /matches', (): void => {
    beforeEach((): void => {
        ;(getFromMatchId as jest.Mock).mockResolvedValue([])
        ;(retrieveMatchData as jest.Mock).mockResolvedValue([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
        ;(createManyMatchStat as jest.Mock).mockReturnValue([])
        ;(saveManyMatchStat as jest.Mock).mockResolvedValue(undefined)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("should return status 200 if the match hasn't yet been stored", async (): Promise<void> => {
        const match_id = mockMatchStat.match_id
        const region = 'na'
        const url = `/matches/${match_id}?region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(getFromMatchId).toHaveBeenCalledWith(match_id)
        expect(getFromMatchId).toHaveBeenCalledTimes(1)
        expect(retrieveMatchData).toHaveBeenCalledWith(match_id, region)
        expect(retrieveMatchData).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 if the match has already been stored', async (): Promise<void> => {
        ;(getFromMatchId as jest.Mock).mockResolvedValue([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
        const match_id = mockMatchStat.match_id
        const region = 'na'
        const url = `/matches/${match_id}?region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(getFromMatchId).toHaveBeenCalledWith(match_id)
        expect(getFromMatchId).toHaveBeenCalledTimes(1)
        expect(retrieveMatchData).toHaveBeenCalledTimes(0)
    })

    test('should return 200 if the region is out of bounds and there are no other issues', async (): Promise<void> => {
        const match_id = mockMatchStat.match_id
        const region = 'na'
        const url = `/matches/${match_id}?region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(getFromMatchId).toHaveBeenCalledWith(match_id)
        expect(getFromMatchId).toHaveBeenCalledTimes(1)
        expect(retrieveMatchData).toHaveBeenCalledWith(match_id, 'na')
        expect(retrieveMatchData).toHaveBeenCalledTimes(1)
    })

    test('should return status 500 if there is a database error', async (): Promise<void> => {
        const match_id = mockMatchStat.match_id
        const region = 'na'
        const url = `/matches/${match_id}?region=${region}`

        ;(getFromMatchId as jest.Mock).mockRejectedValueOnce('database error')
        const response = await request(app).get(url)

        expect(response.status).toBe(500)
        expect(response.body).toEqual({ error: 'database error' })
    })

    test('should return status 200 if no region is provided', async (): Promise<void> => {
        const match_id = mockMatchStat.match_id
        const url = `/matches/${match_id}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
    })
})

describe('testing GET /profiles', (): void => {
    beforeEach((): void => {
        ;(retrieveProfileData as jest.Mock).mockResolvedValue({})
        ;(createManyMatchStat as jest.Mock).mockReturnValue([mockMatchStat, mockMatchStat])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return status 200 with valid input', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const page = 1
        const region = 'na'
        const url = `/profiles/${name}?tag=${tag}&mode=${mode}&page=${page}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrieveProfileData).toHaveBeenCalledWith(name, tag, mode, page, region)
        expect(retrieveProfileData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 with valid input with out of bounds mode', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = 'spike rush'
        const page = 1
        const region = 'na'
        const url = `/profiles/${name}?tag=${tag}&mode=${mode}&page=${page}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrieveProfileData).toHaveBeenCalledWith(name, tag, 'competitive', page, region)
        expect(retrieveProfileData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 with valid input with out of bounds page', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const page = 0
        const region = 'na'
        const url = `/profiles/${name}?tag=${tag}&mode=${mode}&page=${page}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrieveProfileData).toHaveBeenCalledWith(name, tag, mode, 1, region)
        expect(retrieveProfileData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 200 with valid input with out of bounds region', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const page = 1
        const region = 'wonderland'
        const url = `/profiles/${name}?tag=${tag}&mode=${mode}&page=${page}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(200)
        expect(retrieveProfileData).toHaveBeenCalledWith(name, tag, mode, page, 'na')
        expect(retrieveProfileData).toHaveBeenCalledTimes(1)
        expect(createManyMatchStat).toHaveBeenCalledWith({})
        expect(createManyMatchStat).toHaveBeenCalledTimes(1)
    })

    test('should return status 400 with an invalid input', async (): Promise<void> => {
        const name = mockMatchStat.player.name
        const tag = mockMatchStat.player.tag
        const mode = mockMatchStat.mode.toLowerCase()
        const page = 1
        const region = 'na'
        const url = `/profiles/${name}?mode=${mode}&page=${page}&region=${region}`
        const response = await request(app).get(url)

        expect(response.status).toBe(400)
        expect(retrieveProfileData).toHaveBeenCalledTimes(0)
        expect(createManyMatchStat).toHaveBeenCalledTimes(0)
    })
})

describe('testing GET /', (): void => {
    test('should return status 200 with a valid input', async (): Promise<void> => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
    })
})
