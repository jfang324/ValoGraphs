import Header from '@/components/Header'
import MatchDetails from '@/components/MatchDetails'
import MatchHistory from '@/components/MatchHistory'
import ProfileColumn from '@/components/ProfileColumn'
import {
    calculateAverageStats,
    countMatchesPerDay,
    handleProfileSearch,
    retrieveMatchData,
    retrievePlayerData,
    retrieveProfileData,
} from '@/lib/utils'
import { MatchStat } from '@/types/matchstat'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const ProfilePage = () => {
    /**
     *  region, name, tag - The name and tag and region used to initialize the profile page
     *  currentMode - The current game mode being displayed
     *  data - An array of objects representing individual matches
     *  filter - The text that is going to be used to filter the matches via regex
     *  imageMap - A dictionary mapping an asset name to a link to its image
     *  matchDetails - An array of objects representing player performance for a particular match
     *  showMatchDetails - A variable keeping track of the visibility of the match details offcanvas element
     *  page - The page of matches that will next be retrieved
     */
    const { region, name, tag } = useParams()
    const [currentMode, setCurrentMode] = useState('competitive')
    const [matchData, setMatchData] = useState<MatchStat[]>([])
    const [filter, setFilter] = useState('')
    const [imageMap, setImageMap] = useState<{ [id: string]: string }>({})
    const [matchDetails, setMatchDetails] = useState<MatchStat[]>([])
    const [showMatchDetails, setShowMatchDetails] = useState(false)
    const [page, setPage] = useState(1)

    //Updates the image map with any new assets
    const updateImageMap = async (matches: MatchStat[], newImageMap: { [id: string]: string }) => {
        if (!matches || !matches.length) return

        try {
            await Promise.all(
                matches.map(async (match: MatchStat) => {
                    if (match.agent in imageMap) return

                    try {
                        const assetData = await (
                            await fetch(`${import.meta.env.VITE_AGENT_URL}/${match.agent_id}`, { method: 'GET' })
                        ).json()

                        newImageMap[match.agent] = assetData['data']['displayIcon']
                    } catch (error) {
                        console.log(error)
                        alert(`Failed to retrieve asset data for ${match.agent}`)
                    }
                })
            )
        } catch (error) {
            console.log(error)
            alert('There was an error retrieving asset data')
        }
    }

    //Initializes the profile page
    useEffect(() => {
        const init = async () => {
            if (!name || !tag || !region) {
                alert('Required state is undefined')
                return
            }

            try {
                const profileData = await retrieveProfileData(`${name}#${tag}`, currentMode, region as string, page)
                const newImageMap: { [id: string]: string } = { ...imageMap }

                if (!Object.keys(newImageMap).includes('card')) {
                    const assetData = await (
                        await fetch(`${import.meta.env.VITE_PLAYER_CARD_URL}/${profileData[0].card_id}`, {
                            method: 'GET',
                        })
                    ).json()

                    newImageMap['card'] = assetData['data']['wideArt']
                }

                await updateImageMap(profileData, newImageMap)

                setPage(page + 1)
                setImageMap(newImageMap)
                setMatchData(profileData)
            } catch (error) {
                alert(error)
            }
        }

        init()
    }, [])

    //Handles the change of the game mode
    const handleChangeMode = async (mode: string) => {
        if (mode === currentMode) return

        try {
            const profileData = await retrieveProfileData(`${name}#${tag}`, mode, region as string, 1)
            const newImageMap: { [id: string]: string } = { ...imageMap }

            if (!Object.keys(newImageMap).includes('card')) {
                const assetData = await (
                    await fetch(`${import.meta.env.VITE_PLAYER_CARD_URL}/${profileData[0].card_id}`, {
                        method: 'GET',
                    })
                ).json()

                newImageMap['card'] = assetData['data']['wideArt']
            }

            await updateImageMap(profileData, newImageMap)

            setPage(2)
            setImageMap(newImageMap)
            setMatchData(profileData)
            setCurrentMode(mode)
        } catch (error) {
            alert(error)
        }
    }

    //Handles the change of the filter
    const handleFilter = (filterValue: string) => setFilter(filterValue.trim())

    //Handles the opening of the match details offcanvas
    const handleShowMatchDetails = async (match_id: string) => {
        if (!match_id) {
            alert('Invalid match_id')
        }

        try {
            const allMatchPlayerData = await retrieveMatchData(match_id, region as string)
            const newImageMap: { [id: string]: string } = { ...imageMap }

            await updateImageMap(allMatchPlayerData, newImageMap)

            setImageMap(newImageMap)
            setMatchDetails(allMatchPlayerData)
            setShowMatchDetails(true)
        } catch (error) {
            alert(error)
        }
    }

    //Handles the loading of more matches
    const handleLoadMatches = async () => {
        try {
            const newData = await retrieveProfileData(`${name}#${tag}`, currentMode, region as string, page)
            const newImageMap: { [id: string]: string } = { ...imageMap }
            const newMatchData = [...matchData]

            await updateImageMap(newData, newImageMap)

            newMatchData.push(...newData)
            setPage(page + 1)
            setImageMap(newImageMap)
            setMatchData(newMatchData)
        } catch (error) {
            alert(error)
        }
    }

    //Handles the updating of the profile
    const handleUpdateProfile = async () => {
        if (!name || !tag) {
            alert('Invalid name and tag')
        }

        try {
            await retrievePlayerData(`${name}#${tag}`, currentMode, region as string)
            const profileData = await retrieveProfileData(`${name}#${tag}`, currentMode, region as string, 1)
            const newImageMap: { [id: string]: string } = { ...imageMap }

            if (!Object.keys(newImageMap).includes('card')) {
                const assetData = await (
                    await fetch(`${import.meta.env.VITE_PLAYER_CARD_URL}/${profileData[0].card_id}`, {
                        method: 'GET',
                    })
                ).json()

                newImageMap['card'] = assetData['data']['wideArt']
            }

            await updateImageMap(profileData, newImageMap)

            setPage(2)
            setImageMap(newImageMap)
            setMatchData(profileData)
        } catch (error) {
            alert(error)
        }
    }

    //Sorts the match details by a specific stat
    const sortMatchDetails = (stat: string): void => {
        const newMatchDetails = [...matchDetails]
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

    return (
        <Container fluid className="p-0 vh-100 d-flex flex-column overflow-x-hidden">
            <Header
                currentRegion={(region as string).toUpperCase()}
                regions={[]}
                handleProfileSearch={handleProfileSearch}
                handleChangeMode={handleChangeMode}
                handleChangeRegion={() => {}}
            />
            <Row className="flex-grow-1 m-0">
                <Col xs={12} lg="auto" className="p-0 player-stack-col" style={{ width: '100%', maxWidth: '400px' }}>
                    <ProfileColumn
                        nameTag={`${name}#${tag}`}
                        imageMap={imageMap}
                        averageStats={calculateAverageStats(matchData, filter, currentMode)}
                        matchFrequencies={countMatchesPerDay(matchData, filter)}
                        mode={currentMode}
                    />
                </Col>
                <Col xs={12} lg className="p-0 border-secondary border-2">
                    <MatchHistory
                        matchData={matchData}
                        imageMap={imageMap}
                        filter={filter}
                        handleFilter={handleFilter}
                        handleShowMatchDetails={handleShowMatchDetails}
                        handleLoadMatches={handleLoadMatches}
                        handleUpdateProfile={handleUpdateProfile}
                    />
                    <MatchDetails
                        matchDetails={matchDetails}
                        imageMap={imageMap}
                        sortMatchDetails={sortMatchDetails}
                        showMatchDetails={showMatchDetails}
                        setShowMatchDetails={setShowMatchDetails}
                        region={region as string}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default ProfilePage
