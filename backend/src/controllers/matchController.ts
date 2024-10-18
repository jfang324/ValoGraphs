import { Request, Response } from 'express'
import { getFromMatchId, saveManyMatchStat } from '../services/dataAccessService.js'
import { createManyMatchStat } from '../services/matchStatService.js'
import { retrieveMatchData } from '../services/valApiService.js'

const validRegions = ['na', 'eu', 'latam', 'br', 'ap', 'kr']

export async function getMatchById(req: Request, res: Response): Promise<void> {
    const { match_id } = req.params
    const region = (req.query.region as string) || 'na'

    if (!validRegions.includes(region)) {
        res.status(400).json({
            error: `${region} is not a valid region`,
        })
        return
    }

    try {
        const storedMatchStats = await getFromMatchId(match_id)

        if (storedMatchStats.length < 10) {
            const apiResponse = await retrieveMatchData(match_id, region)
            const matchStats = createManyMatchStat(apiResponse)

            res.status(200).json(matchStats)
            await saveManyMatchStat(matchStats)
        } else {
            res.status(200).json(storedMatchStats)
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
