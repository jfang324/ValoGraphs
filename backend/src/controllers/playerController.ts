import { Request, Response } from 'express'
import { MatchStat } from '../entities/MatchStat'
import { saveManyMatchStat } from '../services/dataAccessService'
import { createManyMatchStat } from '../services/matchStatService'
import { retrievePlayerData } from '../services/valApiService'

const validRegions = ['na', 'eu', 'latam', 'br', 'ap', 'kr']
const validModes = ['unrated', 'competitive', 'teamdeathmatch']

export async function getPlayerData(req: Request, res: Response): Promise<void> {
    const { name } = req.params
    const { tag, mode, size, region } = req.query

    if (!tag || !mode || !size || !region) {
        res.status(400).json({ error: 'Invalid input' })
        return
    }

    const validMode = validModes.includes(mode as string) ? mode : 'competitive'
    const validSize = Number(size) <= 10 && Number(size) > 0 ? Number(size) : 5
    const validRegion = validRegions.includes(region as string) ? region : 'na'

    try {
        const data = await retrievePlayerData(
            name,
            tag as string,
            validMode as string,
            validSize,
            validRegion as string
        )
        const matchStats: MatchStat[] = createManyMatchStat(data.match_data)
        const puuid: string = data.searched_player_id

        const response: MatchStat[] = matchStats.filter((stat: MatchStat): boolean => stat.player.id === puuid)

        res.status(200).json(response)
        await saveManyMatchStat(matchStats)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
