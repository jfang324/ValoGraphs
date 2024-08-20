import { Stack } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import PlayerEntry from './PlayerEntry'

interface PlayerStackProps {
    playerMap: { [playerName: string]: any }
    handleAdd: () => void
    handleToggle: (name: string) => void
    handleDelete: (name: string) => void
}

export default function PlayerStack({ playerMap, handleAdd, handleToggle, handleDelete }: PlayerStackProps) {
    return (
        <>
            <Stack
                className="bg-dark border-top border-secondary border-2"
                style={{
                    height: '100%',
                    minWidth: '20%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                {Object.keys(playerMap).map((player: string) => {
                    return (
                        <PlayerEntry
                            nameAndTag={player}
                            handleToggle={() => handleToggle(player)}
                            handleDelete={() => handleDelete(player)}
                            visible={playerMap[player].visible}
                            key={player}
                        ></PlayerEntry>
                    )
                })}
                <Stack direction="horizontal" className="p-2 border-bottom border-secondary border-2" gap={2}>
                    <FaPlus className="invisible"></FaPlus>
                    <div className="vr text-light"></div>
                    <input
                        className="bg-dark"
                        spellCheck="false"
                        autoComplete="off"
                        style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontFamily: 'Courier New, monospace',
                            fontSize: '16px',
                            color: 'white',
                        }}
                        id="newPlayerInput"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAdd()
                            }
                        }}
                    ></input>
                </Stack>
            </Stack>
        </>
    )
}
