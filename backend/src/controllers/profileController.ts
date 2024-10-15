import { Request, Response } from 'express'
import { MatchStat } from '../entities/MatchStat'
import { createManyMatchStat } from '../services/matchStatService'
import { retrieveProfileData } from '../services/valApiService'

const validModes = ['unrated', 'competitive', 'teamdeathmatch']
const validRegions = ['na', 'eu', 'latam', 'br', 'ap', 'kr']

export async function getProfileData(req: Request, res: Response): Promise<void> {
    const { name } = req.params
    const { tag, mode, page, region } = req.query

    if (!tag || !mode || !page || !region) {
        res.status(400).json({ error: 'Invalid input' })
        return
    }

    const validMode = validModes.includes(mode as string) ? mode : 'competitive'
    const validPage = Number(page) > 0 ? Number(page) : 1
    const validRegion = validRegions.includes(region as string) ? region : 'na'

    try {
        const data = await retrieveProfileData(
            name,
            tag as string,
            validMode as string,
            validPage,
            validRegion as string
        )
        const matchStats: MatchStat[] = createManyMatchStat(data)

        res.status(200).json(matchStats)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
