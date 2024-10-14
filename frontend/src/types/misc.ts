import { MatchStat } from '@/types/matchstat'

export type PlayerMap = {
    [nameTag: string]: {
        region: string
        visible: boolean
        data: MatchStat[]
    }
}

export type AverageStat = {
    stat: string
    value: number
    relative: number
}
