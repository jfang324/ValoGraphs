import { Image, Offcanvas, Stack } from 'react-bootstrap'

interface MatchDetailsProps {
    matchDetails: { [playerName: string]: any }[]
    imageMap: { [id: string]: string }
    showMatchDetails: boolean
    region: string
    sortMatchDetails: (stat: string) => void
    setShowMatchDetails: (show: boolean) => void
}

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
            onHide={() => {
                setShowMatchDetails(false)
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
                        <div className="w-100">
                            {matchDetails.length > 0 ? matchDetails[0]['map'] : 'No Map Specified'}
                        </div>
                        <div className="w-100">
                            {matchDetails.length > 0 ? matchDetails[0]['mode'] : 'No Mode Specified'}
                        </div>
                    </div>
                </Stack>
            </Offcanvas.Header>
            <Offcanvas.Body className="border-start border-end border-secondary border-2 p-0">
                <Stack
                    direction="horizontal"
                    className="bg-dark-subtle"
                    style={{
                        fontSize: '13px',
                    }}
                >
                    <div className="vr p-1 invisible"></div>
                    <Stack direction="horizontal" className="d-flex flex-wrap flex-fill">
                        <Stack
                            className="flex-fill"
                            style={{ cursor: 'pointer', minWidth: '10%' }}
                            onClick={() => {
                                sortMatchDetails('name')
                            }}
                        >
                            <div className="px-2 disappear" style={{ marginLeft: 60 }}>
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
                                DD Δ
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
                </Stack>
                <Stack className="border-bottom border-secondary border-2 d-flex">
                    {matchDetails.map((player: any) => {
                        return (
                            <Stack
                                direction="horizontal"
                                className="border-top border-secondary border-2"
                                style={{
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                                key={player.player.id + player.match_id}
                                onClick={() => {
                                    window.open(
                                        `/profile/${region}/${player.player.name}/${player.player.tag}`,
                                        '_blank'
                                    )
                                }}
                            >
                                {player.won ? (
                                    <div className="vr p-1 text-bg-success"></div>
                                ) : (
                                    <div className="vr p-1 text-bg-danger"></div>
                                )}
                                <Stack direction="horizontal" className="d-flex flex-wrap flex-fill">
                                    <Stack direction="horizontal" className="flex-fill" style={{ minWidth: '10%' }}>
                                        <Image rounded src={imageMap[player.agent]} height={60} className="p-1"></Image>
                                        <div style={{ width: '100px' }}>{player.player.name}</div>
                                    </Stack>
                                    <Stack
                                        direction="horizontal"
                                        className="my-auto text-center flex-fill"
                                        style={{ minWidth: '90%' }}
                                    >
                                        <div className="text-nowrap" style={{ minWidth: '24%' }}>
                                            {player.kills + ' / ' + player.deaths + ' / ' + player.assists}
                                        </div>
                                        <div style={{ minWidth: '19%' }}>{player.hs}</div>
                                        <div style={{ minWidth: '19%' }}>{player.dd}</div>
                                        <div style={{ minWidth: '19%' }}>{player.adr}</div>
                                        <div style={{ minWidth: '19%' }}>{player.acs}</div>
                                    </Stack>
                                </Stack>
                            </Stack>
                        )
                    })}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
