import { MatchStat } from '@/types/matchstat'
import { Image, Offcanvas, Stack } from 'react-bootstrap'

/**
 * MatchDetails component props
 *
 * @params matchDetails - A list of MatchStat objects representing the match performance of a player
 * @params imageMap - A dictionary mapping an asset name to a link to its image
 * @params showMatchDetails - A boolean representing if the offcanvas is visible or not
 * @params region - The region of the player
 * @params sortMatchDetails - A function that sorts the match details
 * @params setShowMatchDetails - A function that sets the visibility of the offcanvas
 */
interface MatchDetailsProps {
    matchDetails: MatchStat[]
    imageMap: { [id: string]: string }
    showMatchDetails: boolean
    region: string
    sortMatchDetails: (stat: string) => void
    setShowMatchDetails: (show: boolean) => void
}

const MatchHeader = ({ matchDetails }: { matchDetails: MatchStat[] }) => (
    <Stack direction="horizontal" className="w-100 d-flex" style={{ fontSize: '18px' }} gap={5}>
        <div className="fw-bold ps-2">
            <div className="w-100">{matchDetails[0]?.map || 'No Map Specified'}</div>
            <div className="w-100">{matchDetails[0]?.mode || 'No Mode Specified'}</div>
        </div>
    </Stack>
)

const TableHeader = ({ sortMatchDetails }: { sortMatchDetails: (stat: string) => void }) => (
    <Stack direction="horizontal" className="bg-dark-subtle" style={{ fontSize: '13px' }}>
        <div className="vr p-1 invisible"></div>
        <Stack direction="horizontal" className="d-flex flex-wrap flex-fill">
            <Stack
                className="flex-fill"
                style={{ cursor: 'pointer', minWidth: '10%' }}
                onClick={() => sortMatchDetails('name')}
            >
                <div className="px-2 disappear" style={{ marginLeft: 60 }}>
                    Name
                </div>
            </Stack>
            <Stack direction="horizontal" className="my-auto text-center flex-fill" style={{ minWidth: '90%' }}>
                <div style={{ minWidth: '24%', cursor: 'pointer' }} onClick={() => sortMatchDetails('kda')}>
                    K / D / A
                </div>
                <div style={{ minWidth: '19%', cursor: 'pointer' }} onClick={() => sortMatchDetails('hs')}>
                    HS %
                </div>
                <div style={{ minWidth: '19%', cursor: 'pointer' }} onClick={() => sortMatchDetails('dd')}>
                    DD Δ
                </div>
                <div style={{ minWidth: '19%', cursor: 'pointer' }} onClick={() => sortMatchDetails('adr')}>
                    ADR
                </div>
                <div style={{ minWidth: '19%', cursor: 'pointer' }} onClick={() => sortMatchDetails('acs')}>
                    ACS
                </div>
            </Stack>
        </Stack>
    </Stack>
)

const PlayerRow = ({
    player,
    imageMap,
    region,
}: {
    player: MatchStat
    imageMap: { [id: string]: string }
    region: string
}) => (
    <Stack
        direction="horizontal"
        className="border-top border-secondary border-2"
        style={{ fontSize: '13px', cursor: 'pointer' }}
        onClick={() => window.open(`/profile/${region}/${player.player.name}/${player.player.tag}`, '_blank')}
    >
        <div className={`vr p-1 text-bg-${player.won ? 'success' : 'danger'}`}></div>
        <Stack direction="horizontal" className="d-flex flex-wrap flex-fill">
            <Stack direction="horizontal" className="flex-fill" style={{ minWidth: '10%' }}>
                <Image rounded src={imageMap[player.agent]} height={60} className="p-1"></Image>
                <div style={{ width: '100px' }}>{player.player.name}</div>
            </Stack>
            <Stack direction="horizontal" className="my-auto text-center flex-fill" style={{ minWidth: '90%' }}>
                <div className="text-nowrap" style={{ minWidth: '24%' }}>
                    {`${player.kills} / ${player.deaths} / ${player.assists}`}
                </div>
                <div style={{ minWidth: '19%' }}>{player.hs.toFixed(2)}</div>
                <div style={{ minWidth: '19%' }}>{player.dd.toFixed(2)}</div>
                <div style={{ minWidth: '19%' }}>{player.adr.toFixed(2)}</div>
                <div style={{ minWidth: '19%' }}>{player.acs.toFixed(2)}</div>
            </Stack>
        </Stack>
    </Stack>
)

export default function MatchDetails({
    matchDetails,
    imageMap,
    showMatchDetails,
    region,
    sortMatchDetails,
    setShowMatchDetails,
}: MatchDetailsProps) {
    return (
        <Offcanvas
            className="vh-100 vw-100"
            placement="bottom"
            show={showMatchDetails}
            onHide={() => setShowMatchDetails(false)}
            data-bs-theme="dark"
            backdrop={false}
            style={{ fontFamily: 'Courier New, monospace', color: 'white', fontSize: '16px' }}
        >
            <Offcanvas.Header className="border border-secondary border-2" closeButton>
                <MatchHeader matchDetails={matchDetails} />
            </Offcanvas.Header>
            <Offcanvas.Body className="border-start border-end border-secondary border-2 p-0">
                <TableHeader sortMatchDetails={sortMatchDetails} />
                <Stack className="border-bottom border-secondary border-2 d-flex">
                    {matchDetails.map((player: MatchStat) => (
                        <PlayerRow
                            key={player.player.id + player.match_id}
                            player={player}
                            imageMap={imageMap}
                            region={region}
                        />
                    ))}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
