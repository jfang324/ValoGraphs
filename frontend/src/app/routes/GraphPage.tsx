import GraphContainer from '@/components/GraphContainer'
import Header from '@/components/Header'
import PlayerStack from '@/components/PlayerStack'
import { regions } from '@/lib/constants'
import { handleProfileSearch, retrievePlayerData } from '@/lib/utils'
import { MatchStat } from '@/types/matchstat'
import { PlayerMap } from '@/types/misc'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const GraphPage = () => {
    const [currentMode, setCurrentMode] = useState('competitive')
    const [currentRegion, setCurrentRegion] = useState('NA')
    const [playerMap, setPlayerMap] = useState<PlayerMap>({})

    /**
     * Handles the change of the game mode
     *
     * @param mode - The game mode to change to
     */
    const handleChangeMode = async (mode: string) => {
        if (currentMode === mode) return

        const newPlayerMap: { [nameTag: string]: { region: string; visible: boolean; data: MatchStat[] } } = {}

        try {
            await Promise.all(
                Object.keys(playerMap).map(async (player) => {
                    newPlayerMap[player] = {
                        visible: playerMap[player].visible,
                        region: playerMap[player].region,
                        data: [],
                    }

                    try {
                        const playerData = await retrievePlayerData(player, mode, playerMap[player].region)
                        newPlayerMap[player].data = playerData
                    } catch (error) {
                        console.log(error)
                    }
                })
            )

            setPlayerMap(newPlayerMap)
            setCurrentMode(mode)
        } catch (error) {
            alert(error)
        }
    }

    /**
     * Handles the change of the region
     *
     * @param region - The region to change to
     */
    const handleChangeRegion = (region: string) => setCurrentRegion(region)

    /**
     * Handles the addition of a player to the graphs
     *
     * @param nameTag - The name and tag of the player in the format name#tag
     */
    const handleAddPlayer = async (nameTag: string) => {
        try {
            const playerData = await retrievePlayerData(nameTag, currentMode, currentRegion)

            setPlayerMap((prev) => ({
                ...prev,
                [nameTag]: { visible: true, data: playerData, region: currentRegion },
            }))
        } catch (error) {
            setPlayerMap((prev) => ({
                ...prev,
                [nameTag]: { visible: true, data: [], region: currentRegion },
            }))

            alert(error)
        }
    }

    /**
     * Handles the deletion of a player from the graphs
     *
     * @param nameTag - The name and tag of the player in the format name#tag
     */
    const handleDelete = (nameTag: string) => {
        setPlayerMap((prev) => {
            const newMap = { ...prev }
            delete newMap[nameTag]
            return newMap
        })
    }

    /**
     * Handles the toggling of a player's visibility
     *
     * @param nameTag - The name and tag of the player in the format name#tag
     */
    const handleToggle = (nameTag: string) => {
        setPlayerMap((prev) => ({
            ...prev,
            [nameTag]: { ...prev[nameTag], visible: !prev[nameTag].visible },
        }))
    }

    return (
        <Container fluid className="p-0 vh-100 d-flex flex-column overflow-x-hidden">
            <Header
                currentRegion={currentRegion}
                regions={regions}
                handleProfileSearch={handleProfileSearch}
                handleChangeMode={handleChangeMode}
                handleChangeRegion={handleChangeRegion}
            />
            <Row className="flex-grow-1 m-0">
                <Col xs={12} lg="auto" className="p-0 player-stack-col" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="scrollable-content">
                        <PlayerStack
                            playerMap={playerMap}
                            handleAddPlayer={handleAddPlayer}
                            handleDelete={handleDelete}
                            handleToggle={handleToggle}
                        />
                    </div>
                </Col>
                <Col xs={12} lg className="p-0 graph-container-col">
                    <div className="scrollable-content">
                        <GraphContainer playerMap={playerMap} />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default GraphPage
