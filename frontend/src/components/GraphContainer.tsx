import Graph from '@/components/Graph'
import { stringToColor } from '@/lib/utils'
import { PlayerMap } from '@/types/misc'
import { Col, Row } from 'react-bootstrap'

/**
 * GraphContainer component props
 *
 * @params playerMap - A dictionary that maps player#tag to their match data & visibility
 */
interface GraphContainerProps {
    playerMap: PlayerMap
}

const GraphContainer = ({ playerMap }: GraphContainerProps) => {
    const graphData = [
        { title: 'Headshot Percentage', unit: 'HS %', reference: 20, dataKey: 'hs' },
        { title: 'Kill Death Ratio', unit: 'KDR', reference: 0.9, dataKey: 'kd' },
        { title: 'Kills, Deaths and Assists', unit: 'KDA', reference: 1.25, dataKey: 'kda' },
        { title: 'Average Damage per Round', unit: 'ADR', reference: 130, dataKey: 'adr' },
        { title: 'Average Contribution Score', unit: 'ACS', reference: 200, dataKey: 'acs' },
        { title: 'Difference between damage dealt and received per round', unit: 'DD Δ', reference: 0, dataKey: 'dd' },
    ]

    //split the data into a dictionary mapping name to color and a list of objects where each object represents a match
    const prepareData = (dataKey: string) => {
        const matchData: { [nameTag: string]: number }[] = []
        const playersColors: { [nameTag: string]: string } = {}

        Object.entries(playerMap).forEach(([nameTag, playerData]) => {
            if (!playerData.visible) return

            playersColors[nameTag] = stringToColor(nameTag)
            playerData.data.forEach((match: any, i: number) => {
                if (i >= matchData.length) {
                    matchData.push({ matchNum: i + 1 })
                }
                let value
                switch (dataKey) {
                    case 'hs':
                        value = match.hs
                        break
                    case 'kd':
                        value = match.kills / (match.deaths || 1)
                        break
                    case 'kda':
                        value = (match.kills + match.assists) / (match.deaths || 1)
                        break
                    case 'adr':
                        value = match.adr
                        break
                    case 'acs':
                        value = match.acs
                        break
                    case 'dd':
                        value = match.dd
                        break
                    default:
                        value = 0
                }
                matchData[i][nameTag] = Math.round(value * 100) / 100
            })
        })

        return { matchData, playersColors }
    }

    return (
        <Row className="g-2 px-2 py-4 mx-0 graph-row">
            {graphData.map((graph, index) => {
                const { matchData, playersColors } = prepareData(graph.dataKey)
                return (
                    <Col key={index} xs={12} md={6} className="px-2 graph-col">
                        <Graph
                            playerColors={playersColors}
                            matchData={matchData}
                            yAxisUnit={graph.unit}
                            title={graph.title}
                            reference={graph.reference}
                        />
                    </Col>
                )
            })}
        </Row>
    )
}

export default GraphContainer
