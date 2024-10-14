import { Stack } from 'react-bootstrap'
import {
    CartesianGrid,
    Label,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

/**
 * Graph component props
 *
 * @params playerColors - A dictionary mapping player#tag to colors
 * @params matchData - A list of objects representing 'matches'. Each object maps player#tag to their stat value for that match
 * @params unit - The unit of the stat
 * @params title - The title of the graph
 * @params reference - A reference value to compare against
 */
interface GraphProps {
    playerColors: { [nameTag: string]: string }
    matchData: { [nameTag: string]: number }[]
    yAxisUnit: string
    title: string
    reference: number
}

const Graph = ({ playerColors, matchData, yAxisUnit, title, reference }: GraphProps) => {
    return (
        <Stack style={{ fontFamily: 'Courier New, monospace', color: 'grey' }}>
            <div className="text-center p-2 graph-title">{title}</div>
            <ResponsiveContainer className="pe-4" minWidth={400} aspect={3.4}>
                <LineChart
                    title={title}
                    data={matchData}
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                    style={{
                        fontSize: '12px',
                    }}
                >
                    {Object.keys(playerColors).map((nameTag: string) => {
                        return (
                            <Line
                                name={nameTag}
                                type="linear"
                                dot={false}
                                dataKey={nameTag}
                                stroke={playerColors[nameTag]}
                                strokeWidth={1}
                                key={nameTag}
                            />
                        )
                    })}
                    <ReferenceLine
                        y={reference}
                        stroke="red"
                        strokeWidth={0.5}
                        ifOverflow="extendDomain"
                    ></ReferenceLine>
                    <CartesianGrid strokeDasharray="3 3" stroke="grey" />
                    <XAxis stroke="grey" height={50} strokeWidth={2} allowDecimals={false}>
                        <Label position={'center'}>{'Recent Matchs (matches ago)'}</Label>
                    </XAxis>
                    <YAxis stroke="grey" width={70} strokeWidth={2} allowDecimals={false}>
                        <Label angle={-90}>{yAxisUnit}</Label>
                    </YAxis>
                    {matchData.length !== 0 ? (
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#2A2A2A',
                                padding: '10px',
                                border: 'none',
                            }}
                            itemStyle={{
                                color: '#E0E0E0',
                                margin: '0px',
                                textAlign: 'left',
                                fontSize: '12px',
                            }}
                            labelStyle={{
                                display: 'none',
                            }}
                        ></Tooltip>
                    ) : (
                        <></>
                    )}
                </LineChart>
            </ResponsiveContainer>
        </Stack>
    )
}

export default Graph
