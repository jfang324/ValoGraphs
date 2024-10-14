import { AverageStat, MatchFrequency } from '@/types/misc'
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

interface ProfileColumnProps {
    nameTag: string
    imageMap: { [id: string]: string }
    averageStats: AverageStat[]
    matchFrequencies: MatchFrequency[]
    mode: string
}

const ProfileColumn = ({ nameTag, imageMap, averageStats, matchFrequencies, mode }: ProfileColumnProps) => {
    const titleClasses = 'border-top border-bottom border-secondary border-2'
    const titleStyles = { fontSize: '17px' }

    const ProfileHeader = () => {
        return (
            <Stack className="pb-2">
                <div className={`py-3 h3 ${titleClasses}`}>{nameTag}</div>
                <Image rounded className="w-100 my-2" src={imageMap['card']}></Image>
                <div>
                    Last {mode === 'team deathmatch' ? 'team deathmatch played' : mode + ' match played'} :{' '}
                    {matchFrequencies && matchFrequencies.length > 0
                        ? matchFrequencies[matchFrequencies.length - 1].date
                        : 'N/A'}
                </div>
            </Stack>
        )
    }

    const StatsSection = () => {
        return (
            <Stack>
                <div className={`p-2 text-capitalize ${titleClasses}`} style={titleStyles}>
                    {`average ${mode} statistics`}
                </div>
                <Stack direction="horizontal" className="d-flex p-3">
                    <Stack>
                        <ResponsiveContainer width={200}>
                            <RadarChart data={averageStats}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="stat" />
                                <PolarRadiusAxis domain={[0, () => 1.5]} tick={false} tickCount={6} axisLine={false} />
                                <Radar dataKey="relative" stroke="#FF0000" fill="#FF0000" fillOpacity={0.5}></Radar>
                            </RadarChart>
                        </ResponsiveContainer>
                    </Stack>
                    <Stack className="my-auto text-start" gap={2}>
                        {averageStats.map((pair: AverageStat) => {
                            return <div key={pair.stat + ':' + pair.value}>{pair.stat + ': ' + pair.value}</div>
                        })}
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    const RecentGamesSection = () => {
        return (
            <Stack>
                <div className={`p-2 mb-3 ${titleClasses}`} style={titleStyles}>
                    Recent Games Played
                </div>
                <Container fluid className="p-0 border-bottom border-secondary border-2">
                    <ResponsiveContainer minHeight={200}>
                        <BarChart data={matchFrequencies} margin={{ top: 10, right: 30, left: 0 }}>
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
        )
    }

    return (
        <Stack
            className="text-center border-start border-end border-secondary border-2 d-block"
            style={{
                fontFamily: 'Courier New, monospace',
                color: 'white',
                fontSize: '14px',
            }}
        >
            <ProfileHeader />
            <StatsSection />
            <RecentGamesSection />
        </Stack>
    )
}

export default ProfileColumn
