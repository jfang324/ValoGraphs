import { Player } from '@/types/player'

export type MatchStat = {
    player: Player
    match_id: string
    acs: number
    kills: number
    deaths: number
    assists: number
    dd: number
    adr: number
    hs: number
    agent: string
    agent_id: string
    map: string
    mode: string
    rounds_blue_won: number
    rounds_red_won: number
    won: boolean
    side: string
    date: Date
    card_id: string
}
