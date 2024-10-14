import { MatchStat } from '@/types/matchstat'
import { AverageStat } from '@/types/misc'
/**
 * Convert a input string into a color
 *
 * @param str - The string to be converted
 * @returns The calculated colour code
 */
export function stringToColor(str: string): string {
    let hash: number = 0
    let color: string = '#'

    str.split('').forEach((char: string): void => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })

    for (let i: number = 0; i < 3; i++) {
        const value: number = (hash >> (i * 8)) & 0xff
        color += value.toString(16).padStart(2, '0')
    }

    return color
}

/**
 *  Validate the format of the player name and tag
 *
 * @param nameTag - The name and tag of the player in the format name#tag
 * @returns True if the format is valid, false otherwise
 */
export function validateNameTag(nameTag: string): boolean {
    if (
        !nameTag ||
        !nameTag.includes('#') ||
        nameTag.split('#').length !== 2 ||
        nameTag.split('#').filter((x) => x.length > 0).length !== 2
    ) {
        return false
    }
    return true
}

/**
 * Retrieves the latest match data for the player specified
 *
 * @param nameTag - The name and tag of the player in the format name#tag
 * @param mode - The mode that the matches
 * @param region - The region of the player
 * @returns A list of objects containing the player's data for recent matches
 */
export async function retrievePlayerData(nameTag: string, mode: string, region: string): Promise<MatchStat[]> {
    if (!nameTag || !mode || !region) {
        throw new Error('Missing required parameters')
    }
    if (!validateNameTag(nameTag)) {
        throw new Error('Invalid input format')
    }

    const [name, tag] = nameTag.split('#')
    const url = `${import.meta.env.VITE_PLAYER_API_URL}/${name}?tag=${tag}&mode=${mode.replace(
        ' ',
        ''
    )}&size=10&region=${region.toLowerCase()}`

    const response = await fetch(url, { method: 'GET' })

    if (response.status === 200) {
        return await response.json()
    } else {
        const errorBody = await response.json()
        throw new Error(`Error retrieving player data \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Opens a new window to the link /profile/:region/:name/:tag
 *
 * @param nameTag - The name and tag of the player in the format name#tag
 * @param region - The region of the player
 */
export function openPlayerProfile(nameTag: string, region: string) {
    if (!nameTag || !region) {
        throw new Error('Missing required parameters')
    }
    if (!validateNameTag(nameTag)) {
        throw new Error('Invalid input format')
    }

    const [name, tag] = nameTag.split('#')
    window.open(`/profile/${region.toLowerCase()}/${name}/${tag}`, '_blank')
}

/**
 * Handles the 'search' for a player's profile
 *
 * @param nameTag - The name and tag of the player in the format name#tag
 * @param region - The region of the player
 */
export function handleProfileSearch(nameTag: string, region: string) {
    if (!nameTag || !region) {
        alert('Missing required parameters')
        return
    }

    try {
        openPlayerProfile(nameTag, region)
    } catch (error) {
        alert(error)
    }
}

/**
 * Calculates the number of days between 2 dates
 *
 * @param date1 - The first day
 * @param date2 - The second day
 * @returns The number of days between the two days
 */
export function calculateDateDiff(date1: Date, date2: Date): number {
    if (!date1 || !date2) {
        throw new Error('Missing required parameters')
    }

    const oneDay: number = 24 * 60 * 60 * 1000

    return Math.round(Math.abs(((new Date(date1) as any) - (new Date(date2) as any)) / oneDay))
}

/**
 * Calculates the average stats given a data object
 *
 * @param data - A list of objects representing a players performance in a match the key is always a stat and the value is the value
 * @param filter - A string that represents how the matches will be filtered (agent or map matching with regex)
 * @param currentMode - The mode of which the data is for
 * @returns A list of objects with each one representing a unique stat and the average value of that stat
 */
export function calculateAverageStats(
    data: { [stat: string]: any }[],
    filter: string,
    currentMode: string
): AverageStat[] {
    let avgHS: number = 0
    let avgKDR: number = 0
    let avgKDA: number = 0
    let avgADR: number = 0
    let avgACS: number = 0
    let avgDD: number = 0
    let length: number = 0

    for (let match of data) {
        const agentRegex = new RegExp(filter, 'i')
        const mapRegex = new RegExp(filter, 'i')

        if (agentRegex.test(match.agent) || mapRegex.test(match.map)) {
            avgHS += match.hs
            avgKDR += match.kills / (match.deaths || 1)
            avgKDA += (match.kills + match.assists) / (match.deaths || 1)
            length += 1

            if (currentMode === 'team deathmatch') {
                avgADR += match.adr * (match.rounds_blue_won + match.rounds_red_won)
                avgACS += match.acs * (match.rounds_blue_won + match.rounds_red_won)
                avgDD += match.dd * (match.rounds_blue_won + match.rounds_red_won)
            } else {
                avgADR += match.adr
                avgACS += match.acs
                avgDD += match.dd
            }
        }
    }

    avgHS /= length || 1
    avgKDR /= length || 1
    avgKDA /= length || 1
    avgADR /= length || 1
    avgACS /= length || 1
    avgDD /= length || 1

    let averageStats: AverageStat[] = [
        {
            stat: 'HS%',
            value: avgHS.toFixed(2),
            relative: avgHS / 25 > 1.5 ? (1.5).toString() : (avgHS / 25).toFixed(2),
        },
        {
            stat: 'KDR',
            value: avgKDR.toFixed(2),
            relative: avgKDR / (17.05 / 15.67) > 1.5 ? (1.5).toString() : (avgKDR / (17.05 / 15.67)).toFixed(2),
        },
        {
            stat: 'KDA',
            value: avgKDA.toFixed(2),
            relative:
                avgKDA / ((17.05 + 3.53) / 15.67) > 1.5
                    ? (1.5).toString()
                    : (avgKDA / ((17.05 + 3.53) / 15.67)).toFixed(2),
        },
        {
            stat: 'ADR',
            value: avgADR.toFixed(2),
            relative:
                currentMode === 'team deathmatch'
                    ? avgADR / 4000 > 1.5
                        ? (1.5).toString()
                        : (avgADR / 4000).toFixed(2)
                    : avgADR / 130 > 1.5
                    ? (1.5).toString()
                    : (avgADR / 130).toFixed(2),
        },
        {
            stat: 'ACS',
            value: avgACS.toFixed(2),
            relative:
                currentMode === 'team deathmatch'
                    ? avgACS / 6000 > 1.5
                        ? (1.5).toString()
                        : (avgACS / 6000).toFixed(2)
                    : avgACS / 238 > 1.5
                    ? (1.5).toString()
                    : (avgACS / 238).toFixed(2),
        },
        {
            stat: 'DDΔ',
            value: avgDD.toFixed(2),
            relative:
                currentMode === 'team deathmatch'
                    ? avgDD / 500 > 1.5
                        ? (1.5).toString()
                        : avgDD < 0
                        ? '0'
                        : (avgDD / 500).toFixed(2)
                    : avgDD / 25 > 1.5
                    ? (1.5).toString()
                    : avgDD < 0
                    ? '0'
                    : (avgDD / 25).toFixed(2),
        },
    ]
    return averageStats
}

/**
 * Counts the number of matches played on each day
 *
 * @param data - A list of objects representing matches played
 * @param filter - A string that represents how the matches will be filtered (agent or map matching with regex)
 * @returns A list of objects representing unique dates an how many games were played on those days
 */
export function countMatchesPerDay(
    data: { [stat: string]: any }[],
    filter: string
): { date: string; 'games played': number }[] {
    let dates: {} = {}
    for (let match of data) {
        const agentRegex = new RegExp(filter, 'i')
        const mapRegex = new RegExp(filter, 'i')

        if (agentRegex.test(match.agent) || mapRegex.test(match.map)) {
            let time = new Date(match.date)
            let timeString = time.toLocaleDateString()
            if (Object.keys(dates).includes(timeString)) {
                ;(dates as any)[timeString] += 1
            } else {
                ;(dates as any)[timeString] = 1
            }
        }
    }

    let matchDates = Object.keys(dates).map((date: string) => {
        return { date: date, 'games played': (dates as any)[date] }
    })
    matchDates.sort((a, b): number => new Date(a['date']).getTime() - new Date(b['date']).getTime())

    return matchDates
}

/**
 * Retrieves the specified 'page' of stored match data for the player
 *
 * @param nameTag - The name and tag of the player you are retrieving data for in the format name#tag
 * @param mode - The mode that the matches will be of
 * @param region - The region that the data is from
 * @param page - The page of data (pages of size 10)
 * @returns
 */
export async function retrieveProfileData(
    nameTag: string,
    mode: string,
    region: string,
    page: number
): Promise<MatchStat[]> {
    if (!nameTag || !mode || !region) {
        throw new Error('Missing required parameters')
    }
    if (!validateNameTag(nameTag)) {
        throw new Error('Invalid input format')
    }

    const [name, tag] = nameTag.split('#')
    const url = `${import.meta.env.VITE_PROFILE_API_URL}/${name}?tag=${tag}&mode=${mode.replace(
        ' ',
        ''
    )}&page=${page}&region=${region.toLowerCase()}`

    const response = await fetch(url, { method: 'GET' })

    if (response.status === 200) {
        return await response.json()
    } else {
        const errorBody = await response.json()
        throw new Error(`Error retrieving profile data \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

export async function retrieveMatchData(match_id: string, region: string): Promise<MatchStat[]> {
    if (!match_id || !region) {
        throw new Error('Missing required parameters')
    }

    const url = `${import.meta.env.VITE_MATCH_API_URL}/${match_id}?region=${region.toLowerCase()}`

    const response = await fetch(url, { method: 'GET' })

    if (response.status === 200) {
        return await response.json()
    } else {
        const errorBody = await response.json()
        throw new Error(`Error retrieving match data \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}
