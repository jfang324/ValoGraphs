import { MatchStat } from '@/types/matchstat'
import { AverageStat } from '@/types/misc'

/**
 * Convert a input string into a color
 *
 * @param str - The string to be converted
 * @returns The calculated color code
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
 * @returns A list MatchStat objects for the most recent matches
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
        throw new Error(
            `Error retrieving player data for ${nameTag} \n${errorBody.error} \nStatus Code: ${response.status}`
        )
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

    const oneDay = 24 * 60 * 60 * 1000
    return Math.round(Math.abs(date1.getTime() - date2.getTime()) / oneDay)
}

/**
 * Calculates the average stats given a data object
 *
 * @param data - A list of MatchStat objects representing a players performance
 * @param filter - A string that represents how the matches will be filtered (agent or map matching with regex)
 * @param currentMode - The mode of which the data is for
 * @returns A list of objects with each one representing a unique stat and the average value of that stat
 */
export function calculateAverageStats(data: MatchStat[], filter: string, currentMode: string): AverageStat[] {
    const calculateRelative = (value: number, baseline: number, max = 1.5): string => {
        const relative = value / baseline
        return relative > max ? max.toString() : relative.toFixed(2)
    }
    const filterRegex = new RegExp(filter, 'i')
    const filteredData = data.filter((match) => filterRegex.test(match.agent) || filterRegex.test(match.map))

    if (filteredData.length === 0) {
        return []
    }

    const isTDM = currentMode === 'team deathmatch'
    const totalRounds = (match: MatchStat) => match.rounds_blue_won + match.rounds_red_won

    const sums = filteredData.reduce(
        (acc, match) => ({
            hs: acc.hs + match.hs,
            kdr: acc.kdr + match.kills / (match.deaths || 1),
            kda: acc.kda + (match.kills + match.assists) / (match.deaths || 1),
            adr: acc.adr + (isTDM ? match.adr * totalRounds(match) : match.adr),
            acs: acc.acs + (isTDM ? match.acs * totalRounds(match) : match.acs),
            dd: acc.dd + (isTDM ? match.dd * totalRounds(match) : match.dd),
        }),
        { hs: 0, kdr: 0, kda: 0, adr: 0, acs: 0, dd: 0 }
    )

    const averages = Object.entries(sums).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value / filteredData.length,
        }),
        {} as Record<string, number>
    )

    return [
        {
            stat: 'HS%',
            value: averages.hs.toFixed(2),
            relative: calculateRelative(averages.hs, 25),
        },
        {
            stat: 'KDR',
            value: averages.kdr.toFixed(2),
            relative: calculateRelative(averages.kdr, 17.05 / 15.67),
        },
        {
            stat: 'KDA',
            value: averages.kda.toFixed(2),
            relative: calculateRelative(averages.kda, (17.05 + 3.53) / 15.67),
        },
        {
            stat: 'ADR',
            value: averages.adr.toFixed(2),
            relative: calculateRelative(averages.adr, isTDM ? 4000 : 130),
        },
        {
            stat: 'ACS',
            value: averages.acs.toFixed(2),
            relative: calculateRelative(averages.acs, isTDM ? 6000 : 238),
        },
        {
            stat: 'DDΔ',
            value: averages.dd.toFixed(2),
            relative: averages.dd < 0 ? '0' : calculateRelative(averages.dd, isTDM ? 500 : 25),
        },
    ]
}

/**
 * Counts the number of matches played on each day
 *
 * @param data - A list of objects representing matches played
 * @param filter - A string that represents how the matches will be filtered (agent or map matching with regex)
 * @returns A list of objects representing unique dates an how many games were played on those days
 */
export function countMatchesPerDay(data: MatchStat[], filter: string): { date: string; 'games played': number }[] {
    const dates: { [key: string]: number } = {}

    for (const match of data) {
        const agentRegex = new RegExp(filter, 'i')
        const mapRegex = new RegExp(filter, 'i')

        if (agentRegex.test(match.agent) || mapRegex.test(match.map)) {
            const timeString = new Date(match.date).toLocaleDateString()

            if (dates[timeString]) {
                dates[timeString] += 1
            } else {
                dates[timeString] = 1
            }
        }
    }

    const matchDates = Object.keys(dates).map((date) => ({
        date,
        'games played': dates[date],
    }))

    matchDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return matchDates
}

/**
 * Retrieves the specified 'page' of stored match data for the player
 *
 * @param nameTag - The name and tag of the player you are retrieving data for in the format name#tag
 * @param mode - The mode that the matches will be of
 * @param region - The region that the data is from
 * @param page - The page of data (pages of size 10)
 * @returns A list of 10 MatchStat objects that are cached on the HenrikAPI server
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

/**
 * Retrieves the MatchStat object for all players that participated in a specific match
 *
 * @param nameTag - The name and tag of the player you are retrieving data for in the format name#tag
 * @param mode - The mode that the matches will be of
 * @param region - The region that the data is from
 * @param page - The page of data (pages of size 10)
 * @returns A list of objects all players performance in a specific match
 */
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
