import MatchEntry from '@/components/MatchEntry'
import { MatchStat } from '@/types/matchstat'
import { Button, Form, Stack } from 'react-bootstrap'
import { LuRefreshCw } from 'react-icons/lu'

/**
 *  MatchHistory component props
 *
 * @params matchData - A list of MatchStat objects representing the match performance of a player
 * @params imageMap - A dictionary mapping an asset name to a link to its image
 * @params filter - The text that is going to be used to filter the matches via regex
 * @params handleFilter - A function that changes the filter
 * @params handleShowMatchDetails - A function that opens the match details offcanvas
 * @params handleLoadMatches - A function that loads more matches
 * @params handleUpdateProfile - A function that updates the profile
 */
interface MatchHistoryProps {
    matchData: MatchStat[]
    imageMap: { [id: string]: string }
    filter: string
    handleFilter: (filter: string) => void
    handleShowMatchDetails: (match_id: string) => void
    handleLoadMatches: () => void
    handleUpdateProfile: () => void
}

export default function MatchHistory({
    matchData,
    imageMap,
    filter,
    handleFilter,
    handleShowMatchDetails,
    handleLoadMatches,
    handleUpdateProfile,
}: MatchHistoryProps) {
    return (
        <>
            <Stack
                className="d-flex py-3"
                gap={3}
                style={{
                    fontFamily: 'Courier New, monospace',
                    color: 'white',
                    fontSize: '15px',
                }}
            >
                <Stack direction="horizontal" className="px-3 d-flex flex-wrap justify-content-center" gap={3}>
                    <Form className="w-75 flex-fill">
                        <Form.Control
                            type="search"
                            spellCheck="false"
                            autoComplete="off"
                            placeholder="Filter by agent or map name"
                            className="border-secondary"
                            aria-label="Search"
                            id="agentSearchInput"
                            data-bs-theme="dark"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                }
                            }}
                            onChange={(e) => {
                                handleFilter(e.target.value)
                            }}
                        />
                    </Form>
                    <Button variant="outline-danger" onClick={handleUpdateProfile}>
                        Update Match History <LuRefreshCw />
                    </Button>
                </Stack>
                <div className="border-bottom border-secondary border-2">
                    {matchData.map((match: MatchStat) => {
                        const agentRegex = new RegExp(filter, 'i')
                        const mapRegex = new RegExp(filter, 'i')

                        if (agentRegex.test(match.agent) || mapRegex.test(match.map)) {
                            return (
                                <MatchEntry
                                    agentLink={imageMap[match.agent]}
                                    map={match.map}
                                    kills={match.kills}
                                    deaths={match.deaths}
                                    assists={match.assists}
                                    hs={match.hs}
                                    dd={
                                        match.mode === 'Team Deathmatch'
                                            ? Math.round(match.dd * (match.rounds_blue_won + match.rounds_red_won))
                                            : match.dd
                                    }
                                    adr={
                                        match.mode === 'Team Deathmatch'
                                            ? Math.round(match.adr * (match.rounds_blue_won + match.rounds_red_won))
                                            : match.adr
                                    }
                                    acs={
                                        match.mode === 'Team Deathmatch'
                                            ? Math.round(match.acs * (match.rounds_blue_won + match.rounds_red_won))
                                            : match.acs
                                    }
                                    date={match.date}
                                    mode={match.mode}
                                    won={match.won}
                                    rounds_blue_won={match.rounds_blue_won}
                                    rounds_red_won={match.rounds_red_won}
                                    side={match.side}
                                    match_id={match.match_id}
                                    handleShowMatchDetails={() => {
                                        handleShowMatchDetails(match.match_id)
                                    }}
                                    key={match.match_id + match.player.id}
                                ></MatchEntry>
                            )
                        }
                    })}
                </div>
                <Button variant="outline-secondary" className="mx-auto" onClick={handleLoadMatches}>
                    Load More Matches
                </Button>
            </Stack>
        </>
    )
}
