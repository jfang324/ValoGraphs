import { calculateDateDiff } from '@/lib/utils'
import { Image, Stack } from 'react-bootstrap'

/**
 * MatchEntry component props
 *
 * @params agentLink - The link to the agent's portrait
 * @params map - The map the match was played on
 * @params kills - The number of kills
 * @params deaths - The number of deaths
 * @params assists - The number of assists
 * @params hs - The headshot percentage
 * @params dd - The damage dealt
 * @params adr - The average damage received
 * @params acs - The average contribution score
 * @params date - The date the match was played
 * @params mode - The mode the match was played in
 * @params won - A boolean representing if the player won the match
 * @params rounds_blue_won - The number of rounds the blue team won
 * @params rounds_red_won - The number of rounds the red team won
 * @params side - The side the match was played on
 * @params match_id - The match id
 * @params handleShowMatchDetails - A function that opens the match details offcanvas
 */
interface MatchEntryProps {
    agentLink: string
    map: string
    kills: number
    deaths: number
    assists: number
    hs: number
    dd: number
    adr: number
    acs: number
    date: Date
    mode: string
    won: boolean
    rounds_blue_won: number
    rounds_red_won: number
    side: string
    match_id: string
    handleShowMatchDetails: () => void
}

const formatDate = (date: Date) => {
    const diff = calculateDateDiff(new Date(), new Date(date))
    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day ago'
    return `${diff} days ago`
}

const StatDisplay = ({ label, value }: { label: string; value: number | string }) => {
    return (
        <Stack direction="vertical" gap={1} style={statStyle}>
            <div className="w-100">{label}</div>
            <div className="w-100">{value}</div>
        </Stack>
    )
}

const statStyle = { width: '10%' }

export default function MatchEntry({
    agentLink,
    map,
    kills,
    deaths,
    assists,
    hs,
    dd,
    adr,
    acs,
    date,
    mode,
    won,
    rounds_blue_won,
    rounds_red_won,
    side,
    handleShowMatchDetails,
}: MatchEntryProps) {
    return (
        <Stack
            direction="horizontal"
            className="border-top border-secondary border-2"
            style={{
                fontFamily: 'Courier New, monospace',
                color: 'white',
                fontSize: '13px',
                cursor: 'pointer',
            }}
            onClick={handleShowMatchDetails}
        >
            <div className={`vr p-1 ${won ? 'text-bg-success' : 'text-bg-danger'}`}></div>
            <Stack direction="horizontal" className="d-flex flex-wrap flex-fill">
                <Stack direction="horizontal" className="flex-fill">
                    <Image rounded src={agentLink} height={60} className="p-2"></Image>
                    <Stack className="my-auto" gap={1}>
                        <div>{mode}</div>
                        <div>{map}</div>
                    </Stack>
                </Stack>
                <Stack className="flex-fill" style={{ minWidth: '100px', maxWidth: '100px' }}>
                    <div className="my-auto mx-auto">
                        {side === 'Blue'
                            ? rounds_blue_won + ' : ' + rounds_red_won
                            : rounds_red_won + ' : ' + rounds_blue_won}
                    </div>
                </Stack>
                <Stack direction="horizontal" className="my-auto text-center flex-fill" style={{ minWidth: '80%' }}>
                    <Stack direction="vertical" gap={1} style={{ minWidth: '20%' }}>
                        <div className="w-100">K / D / A</div>
                        <div className="w-100">{`${kills} / ${deaths} / ${assists}`}</div>
                    </Stack>
                    <StatDisplay label="HS %" value={hs} />
                    <StatDisplay label="DD Δ" value={Math.round(dd)} />
                    <StatDisplay label="ADR" value={Math.round(adr)} />
                    <StatDisplay label="ACS" value={Math.round(acs)} />
                    <Stack direction="vertical" className="my-auto" gap={1} style={{ width: '15%' }}>
                        {formatDate(date)}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
