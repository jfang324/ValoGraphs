import { Offcanvas, Stack, Image } from 'react-bootstrap'

/**
 * matchDetails - An array of objects representing each unique players performance this match
 * imageMap - A dictionary that maps asset names to their links
 * sortMatchDetails - A generic function that sorts the players by a particular stat
 * showMatchDetails - A variable that determines the visiblity of this component
 * updateShowMatchDetails - A variable that toggles the visibility of this component
 */
interface MatchDetailsProps {
    matchDetails: { [playerName: string]: any }[]
    imageMap: { [id: string]: string }
    sortMatchDetails: (stat: string) => void
    showMatchDetails: boolean
    updateShowMatchDetails: (show: boolean) => void
}

export default function MatchDetails({
    matchDetails,
    imageMap,
    sortMatchDetails,
    showMatchDetails,
    updateShowMatchDetails,
}: MatchDetailsProps) {
    let map: string =
        matchDetails.length > 0 && Object.keys(matchDetails[0]).includes('map')
            ? matchDetails[0]['map']
            : 'No Map Specified'
    let mode: string =
        matchDetails.length > 0 && Object.keys(matchDetails[0]).includes('mode')
            ? matchDetails[0]['mode']
            : 'No Mode Specified'

    return (
        <>
            <Offcanvas
                className="vh-100 vw-100"
                placement="bottom"
                show={showMatchDetails}
                onHide={() => {
                    updateShowMatchDetails(false)
                }}
                data-bs-theme="dark"
                backdrop={false}
                style={{
                    fontFamily: 'Courier New, monospace',
                    color: 'white',
                    fontSize: '16px',
                }}
            >
                <Offcanvas.Header className="border border-secondary border-2" closeButton>
                    <Stack direction="horizontal" className="w-100 d-flex" style={{ fontSize: '18px' }} gap={5}>
                        <div className="fw-bold ps-2">
                            <div className="w-100">{map}</div>
                            <div className="w-100">{mode}</div>
                        </div>
                    </Stack>
                </Offcanvas.Header>
                <Offcanvas.Body className="border-start border-end border-secondary border-2 p-0">
                    <Stack
                        direction="horizontal"
                        className="d-flex flex-wrap bg-dark-subtle"
                        style={{
                            fontFamily: 'Courier New, monospace',
                            color: 'white',
                            fontSize: '13px',
                        }}
                    >
                        <Stack
                            className="flex-fill"
                            style={{ cursor: 'pointer', minWidth: '10%' }}
                            onClick={() => {
                                sortMatchDetails('name')
                            }}
                        >
                            <div className="px-2" style={{ marginLeft: 60 }}>
                                Name
                            </div>
                        </Stack>
                        <Stack
                            direction="horizontal"
                            className="my-auto text-center flex-fill"
                            style={{ minWidth: '90%' }}
                        >
                            <div
                                style={{ minWidth: '24%', cursor: 'pointer' }}
                                onClick={() => {
                                    sortMatchDetails('kda')
                                }}
                            >
                                K / D / A
                            </div>
                            <div
                                style={{ minWidth: '19%', cursor: 'pointer' }}
                                onClick={() => {
                                    sortMatchDetails('hs')
                                }}
                            >
                                HS %
                            </div>
                            <div
                                style={{ minWidth: '19%', cursor: 'pointer' }}
                                onClick={() => {
                                    sortMatchDetails('dd')
                                }}
                            >
                                DDΔ
                            </div>
                            <div
                                style={{ minWidth: '19%', cursor: 'pointer' }}
                                onClick={() => {
                                    sortMatchDetails('adr')
                                }}
                            >
                                ADR
                            </div>
                            <div
                                style={{ minWidth: '19%', cursor: 'pointer' }}
                                onClick={() => {
                                    sortMatchDetails('acs')
                                }}
                            >
                                ACS
                            </div>
                        </Stack>
                    </Stack>
                    <Stack className="border-bottom border-secondary border-2 d-flex">
                        {matchDetails.map((player: any) => {
                            return (
                                <Stack
                                    direction="horizontal"
                                    className="border-top border-secondary border-2 d-flex flex-wrap w-100"
                                    style={{
                                        fontFamily: 'Courier New, monospace',
                                        color: 'white',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                    key={player.player_id + player.match_id}
                                    onClick={() => {
                                        window.open(`/profile/${player.player.name}/${player.player.tag}`, '_blank')
                                    }}
                                >
                                    <Stack
                                        direction="horizontal"
                                        className="h-100 flex-fill"
                                        style={{ minWidth: '10%' }}
                                    >
                                        {player.won ? (
                                            <div className="vr p-1 text-bg-success"></div>
                                        ) : (
                                            <div className="vr p-1 text-bg-danger"></div>
                                        )}
                                        <Image rounded src={imageMap[player.agent]} height={60} className="p-1"></Image>
                                        <Stack className="h-100 my-auto">
                                            <div className="w-100">{player.player.name}</div>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        direction="horizontal"
                                        className="my-auto text-center flex-fill"
                                        style={{ minWidth: '90%' }}
                                    >
                                        <div style={{ minWidth: '24%' }}>
                                            {player.kills + ' / ' + player.deaths + ' / ' + player.assists}
                                        </div>
                                        <div style={{ minWidth: '19%' }}>{player.hs}</div>
                                        <div style={{ minWidth: '19%' }}>{player.dd}</div>
                                        <div style={{ minWidth: '19%' }}>{player.adr}</div>
                                        <div style={{ minWidth: '19%' }}>{player.acs}</div>
                                    </Stack>
                                </Stack>
                            )
                        })}
                    </Stack>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
