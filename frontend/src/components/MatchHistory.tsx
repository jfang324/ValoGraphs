import { Button, Form, Stack } from 'react-bootstrap'
import { LuRefreshCw } from 'react-icons/lu'
import MatchEntry from './MatchEntry'

/**
 * data - An array of objects representing individual matches
 * imageMap - A dictionary that maps asset names to their links
 * handleFilter - A function that updates the filter base on a text input
 * filter - The filter currently being used on the matches
 * handleShowMatchDetails - A function that retrieves data for a specific match and toggles the MatchDetails components
 * handleLoadMatches - A function that retrieves data for more match entries and updates the state
 * handleUpdateProfile - A function that retrieves the most recent matches and updates the state
 */
interface MatchHistoryProps {
    data: any
    imageMap: { [id: string]: string }
    handleFilter: () => void
    filter: string
    handleShowMatchDetails: (match_id: string) => void
    handleLoadMatches: () => void
    handleUpdateProfile: () => void
}

export default function MatchHistory({
    data,
    imageMap,
    handleFilter,
    filter,
    handleShowMatchDetails,
    handleLoadMatches,
    handleUpdateProfile,
}: MatchHistoryProps) {
    return (
        <>
            <Stack className="h-100 flex-fill d-flex py-3" gap={3}>
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
                            style={{
                                fontFamily: 'Courier New, monospace',
                                color: 'white',
                                fontSize: '15px',
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                }
                            }}
                            onChange={() => {
                                handleFilter()
                            }}
                        />
                    </Form>
                    <Button variant="outline-danger" onClick={handleUpdateProfile}>
                        Update Match History &nbsp;
                        <LuRefreshCw />
                    </Button>
                </Stack>
                <div className="border-bottom border-secondary border-2">
                    {data.map((match: any) => {
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
