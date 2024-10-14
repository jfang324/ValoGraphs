import { Container, Image, Stack } from 'react-bootstrap'
import {
    Bar,
    BarChart,
    Label,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts'

/**
 * nameAndTag - The name and tag of the player in the format name#tag
 * imageMap - A dictionary that maps asset names to their links
 * averageStats - An array containing objects representing the average stats of a player
 * matchDates - An array containing the unique dates when games were played and the number played per day
 * mode - The mode of which all the data is associated with
 */
interface ProfileColumnProps {
    nameAndTag: string
    imageMap: { [id: string]: string }
    averageStats: { [statName: string]: string | number }[]
    matchDates: { [id: string]: any }[]
    mode: string
}

export default function ProfileColumn({ nameAndTag, imageMap, averageStats, matchDates, mode }: ProfileColumnProps) {
    return (
        <>
            <Stack
                className="text-center border-top border-start border-end border-secondary border-2 d-block"
                style={{
                    width: '20%',
                    minWidth: '200px',
                    fontFamily: 'Courier New, monospace',
                    color: 'white',
                    fontSize: '15px',
                }}
            >
                <Stack className="pb-2">
                    <div className="p-3 h3 border-bottom border-secondary border-2">{nameAndTag}</div>
                    <Image rounded className="w-100 mx-auto m-3" src={imageMap['card']}></Image>
                    <div>
                        Last {mode === 'team deathmatch' ? 'team deathmatch played' : mode + ' match played'} :{' '}
                        {matchDates && matchDates.length > 0 ? matchDates[matchDates.length - 1].date : 'N/A'}
                    </div>
                </Stack>
                <Stack>
                    <div
                        className="border-top border-bottom border-secondary border-2 p-2 text-capitalize"
                        style={{
                            fontSize: '17px',
                        }}
                    >
                        average {' ' + mode + ' '} statistics
                    </div>
                    <Stack direction="horizontal" className="d-flex p-3">
                        <Stack>
                            <ResponsiveContainer width={200}>
                                <RadarChart data={averageStats}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="statName" />
                                    <PolarRadiusAxis
                                        domain={[0, () => 1.5]}
                                        tick={false}
                                        tickCount={6}
                                        axisLine={false}
                                    />
                                    <Radar dataKey="relative" stroke="#FF0000" fill="#FF0000" fillOpacity={0.5}></Radar>
                                </RadarChart>
                            </ResponsiveContainer>
                        </Stack>
                        <Stack className="my-auto text-start" gap={2}>
                            {averageStats.map((pair: { [statName: string]: string | number }) => {
                                return (
                                    <div key={pair.statName + ':' + pair.value}>
                                        {pair.statName + ': ' + pair.value}
                                    </div>
                                )
                            })}
                        </Stack>
                    </Stack>
                </Stack>
                <Stack>
                    <div
                        className="border-top border-bottom border-secondary border-2 p-2 mb-3"
                        style={{
                            fontSize: '17px',
                        }}
                    >
                        Recent Games Played
                    </div>
                    <Container fluid className="p-0 border-bottom border-secondary border-2">
                        <ResponsiveContainer minHeight={200}>
                            <BarChart data={matchDates} margin={{ top: 10, right: 30, left: 0 }}>
                                <Bar type="monotone" dataKey="games played" stroke="#FF0000"></Bar>
                                <XAxis
                                    dataKey="date"
                                    stroke="grey"
                                    height={50}
                                    style={{
                                        fontSize: '10px',
                                    }}
                                >
                                    <Label
                                        position={'center'}
                                        style={{
                                            fontSize: '12px',
                                        }}
                                    >
                                        {'Date'}
                                    </Label>
                                </XAxis>
                                <YAxis
                                    stroke="grey"
                                    width={45}
                                    allowDecimals={false}
                                    style={{
                                        fontSize: '10px',
                                    }}
                                >
                                    <Label
                                        angle={-90}
                                        style={{
                                            fontSize: '12px',
                                        }}
                                    >
                                        Games Played
                                    </Label>
                                </YAxis>
                            </BarChart>
                        </ResponsiveContainer>
                    </Container>
                </Stack>
            </Stack>
        </>
    )
}
