import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import MatchDetails from '../../components/MatchDetails'
import MatchHistory from '../../components/MatchHistory'
import ProfileColumn from '../../components/ProfileColumn'
import {
    calculateAverageStats,
    countMatchsPerDay,
    handleProfileSearch,
    retrieveMatchData,
    retrievePlayerData,
    retrieveProfileData,
} from '../../utils/commonFunctions'

const gameModes: string[] = ['unrated', 'competitive', 'team deathmatch']

function ProfilePage() {
    /**
     *  region, name, tag - The name and tag and region  used to initialize the profile page
     *  currentMode - The current mode being displayed, when match data is retrieved it will for matches of this type
     *  data - An array of objects representing individual matches
     *  filter - The text that is going to be used to filter the matches via regex
     *  imageMap - A dictionary mapping an asset name to a link to its image
     *  matchDetails - An array of objects representing player performance for a particular match
     *  showMatchDetails - A variable keeping track of the visibility of the match details offcanvas element
     *  page - The page of matches that will next be retrieved
     */
    const { region, name, tag } = useParams()
    const [currentMode, setCurrentMode] = useState('competitive')
    const [data, setData] = useState<{ [stat: string]: any }[]>([])
    const [filter, setFilter] = useState('')
    const [imageMap, setImageMap] = useState<{ [id: string]: string }>({})
    const [matchDetails, setMatchDetails] = useState<{ [playerName: string]: any }[]>([])
    const [showMatchDetails, setShowMatchDetails] = useState(false)
    const [page, setPage] = useState(1)

    useEffect((): void => {
        init()
    }, [])

    /**
     * Initializes the page by retrieving match data for the player and all required assets
     */
    async function init(): Promise<void> {
        if (name && tag && region) {
            let response: any = await (
                await retrieveProfileData(name + '#' + tag, currentMode, page, region as string)
            ).json()
            let newImageMap: { [id: string]: string } = { ...imageMap }

            if (!Object.keys(newImageMap).includes('card')) {
                let assetData: any = await (
                    await fetch(`${import.meta.env.VITE_PLAYER_CARD_URL}/${response[0].card_id}`, { method: 'GET' })
                ).json()

                newImageMap['card'] = assetData['data']['wideArt']
            }

            for (let element of response) {
                if (!Object.keys(imageMap).includes(element.agent)) {
                    let assetData: any = await (
                        await fetch(`${import.meta.env.VITE_AGENT_URL}/${element.agent_id}`, { method: 'GET' })
                    ).json()

                    newImageMap[element.agent] = assetData['data']['displayIcon']
                }
            }

            setPage(page + 1)
            setImageMap(newImageMap)
            setData(response)
        } else {
            alert('Invalid name and tag')
        }
    }

    /**
     * Updates match data and asset information if the new mode is different from the current one
     *
     * @param mode - The mode that the new data will be associated with
     */
    async function handleChangeMode(mode: string): Promise<void> {
        if (mode !== currentMode) {
            let response: any = await (await retrieveProfileData(name + '#' + tag, mode, 1, region as string)).json()
            let newImageMap: { [id: string]: string } = { ...imageMap }

            if (!Object.keys(newImageMap).includes('card')) {
                let assetData: any = await (
                    await fetch(`${import.meta.env.VITE_PLAYER_CARD_URL}/${response[0].card_id}`, { method: 'GET' })
                ).json()

                newImageMap['card'] = assetData['data']['wideArt']
            }

            for (let element of response) {
                if (!Object.keys(imageMap).includes(element.agent)) {
                    let assetData: any = await (
                        await fetch(`${import.meta.env.VITE_AGENT_URL}/${element.agent_id}`, { method: 'GET' })
                    ).json()

                    newImageMap[element.agent] = assetData['data']['displayIcon']
                }
            }

            setPage(2)
            setImageMap(newImageMap)
            setData(response)
            setCurrentMode(mode)
        }
    }

    /**
     * Updates the filter for match entries
     */
    function handleFilter(): void {
        let input: HTMLInputElement = document.getElementById('agentSearchInput') as HTMLInputElement

        setFilter(input.value.trim())
    }

    /**
     * Retrieves all the players associated with a match_id and toggles a offcanvas element
     * to display them
     *
     * @param match_id - The match_id that players are being retrieved for
     */
    async function handleShowMatchDetails(match_id: string): Promise<void> {
        if (match_id) {
            let response: any = await (await retrieveMatchData(match_id, region as string)).json()
            let newImageMap: { [id: string]: string } = { ...imageMap }

            for (let element of response) {
                if (!Object.keys(imageMap).includes(element.agent)) {
                    let assetData: any = await (
                        await fetch(`${import.meta.env.VITE_AGENT_URL}/${element.agent_id}`, { method: 'GET' })
                    ).json()

                    newImageMap[element.agent] = assetData['data']['displayIcon']
                }
            }

            setImageMap(newImageMap)
            setMatchDetails(response)
            setShowMatchDetails(true)
        }
    }

    /**
     * Retrieves match data for the next page of matches and appends them to the data array
     */
    async function handleLoadMatches(): Promise<void> {
        let response: any = await (
            await retrieveProfileData(name + '#' + tag, currentMode, page, region as string)
        ).json()
        let newImageMap: { [id: string]: string } = { ...imageMap }
        let newData = [...data]

        for (let element of response) {
            if (!Object.keys(imageMap).includes(element.agent)) {
                let assetData: any = await (
                    await fetch(`${import.meta.env.VITE_AGENT_URL}/${element.agent_id}`, { method: 'GET' })
                ).json()

                newImageMap[element.agent] = assetData['data']['displayIcon']
            }
        }

        newData.push(...response)
        setPage(page + 1)
        setImageMap(newImageMap)
        setData(newData)
    }

    /**
     * Updates the most recent matches for the player and them retrieves the profile again with the most recent matches
     */
    async function handleUpdateProfile(): Promise<void> {
        if (name && tag) {
            await (await retrievePlayerData(name + '#' + tag, currentMode, region as string)).json()
            let response: any = await (
                await retrieveProfileData(name + '#' + tag, currentMode, 1, region as string)
            ).json()
            let newImageMap: { [id: string]: string } = { ...imageMap }

            if (!Object.keys(newImageMap).includes('card')) {
                let assetData: any = await (
                    await fetch(`${import.meta.env.VITE_PLAYER_CARD_URL}/${response[0].card_id}`, { method: 'GET' })
                ).json()

                newImageMap['card'] = assetData['data']['wideArt']
            }

            for (let element of response) {
                if (!Object.keys(imageMap).includes(element.agent)) {
                    let assetData: any = await (
                        await fetch(`${import.meta.env.VITE_AGENT_URL}/${element.agent_id}`, { method: 'GET' })
                    ).json()

                    newImageMap[element.agent] = assetData['data']['displayIcon']
                }
            }

            setPage(2)
            setImageMap(newImageMap)
            setData(response)
        } else {
            alert('Invalid name and tag')
        }
    }

    /**
     * Sorts the player entries in the match details page by some parameter
     *
     * @param stat - The stat that player entries will be sorted by
     */
    function sortMatchDetails(stat: string): void {
        let newMatchDetails = [...matchDetails]
        switch (stat) {
            case 'name':
                newMatchDetails.sort((a, b): number => {
                    return a['player']['name'].localeCompare(b['player']['name'])
                })
                break
            case 'kda':
                newMatchDetails.sort(
                    (a, b): number =>
                        (b['kills'] + b['assists']) / b['deaths'] - (a['kills'] + a['assists']) / a['deaths']
                )
                break
            case 'hs':
                newMatchDetails.sort((a, b): number => b['hs'] - a['hs'])
                break
            case 'dd':
                newMatchDetails.sort((a, b): number => b['dd'] - a['dd'])
                break
            case 'adr':
                newMatchDetails.sort((a, b): number => b['adr'] - a['adr'])
                break
            case 'acs':
                newMatchDetails.sort((a, b): number => b['acs'] - a['acs'])
                break
        }

        setMatchDetails(newMatchDetails)
    }

    //A javascript object that maps text to handlers, to be used by the Header component
    //to determine what option are available in the offcanvas
    const handlerMap: { [id: string]: any } = {
        'Back to Homepage': '/',
        'View Profile Page': handleProfileSearch,
        'Change Game Mode': handleChangeMode,
        'View GitHub Repository': import.meta.env.VITE_GITHUB_LINK,
    }

    return (
        <>
            <Container fluid className="p-0 vh-100 overflow-y-auto">
                <Header
                    handlerMap={handlerMap}
                    gameModes={gameModes}
                    regions={[]}
                    currentRegion={(region as string).toUpperCase()}
                    handleChangeRegion={(dummy: string) => {
                        dummy
                    }}
                ></Header>
                <Container fluid className="p-0 d-flex flex-wrap overflow-x-hidden">
                    <ProfileColumn
                        mode={currentMode}
                        nameAndTag={name + '#' + tag}
                        imageMap={imageMap}
                        averageStats={calculateAverageStats(data, filter, currentMode)}
                        matchDates={countMatchsPerDay(data, filter)}
                    ></ProfileColumn>
                    <div className="flex-fill" style={{ minWidth: '80%' }}>
                        <MatchHistory
                            data={data}
                            imageMap={imageMap}
                            handleFilter={handleFilter}
                            filter={filter}
                            handleShowMatchDetails={handleShowMatchDetails}
                            handleLoadMatches={handleLoadMatches}
                            handleUpdateProfile={handleUpdateProfile}
                        ></MatchHistory>
                        <MatchDetails
                            matchDetails={matchDetails}
                            imageMap={imageMap}
                            sortMatchDetails={sortMatchDetails}
                            showMatchDetails={showMatchDetails}
                            setShowMatchDetails={setShowMatchDetails}
                            region={region as string}
                        ></MatchDetails>
                    </div>
                </Container>
            </Container>
        </>
    )
}

export default ProfilePage
