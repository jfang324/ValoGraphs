import PlayerEntry from '@/components/PlayerEntry'
import { validateNameTag } from '@/lib/utils'
import { useState } from 'react'
import { Stack } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'

/**
 * PlayerStack component props
 *
 * @params playerMap - A dictionary that maps player#tag to their visibility and region
 * @params handleAdd - A function that retrieves data for the player#tag in the text input
 * @params handleToggle - A generic function that toggles visibility of a player
 * @params handleDelete - A generic function that deletes a player
 */
interface PlayerStackProps {
    playerMap: { [nameTag: string]: { region: string; visible: boolean } }
    handleAddPlayer: (nameTag: string) => void
    handleToggle: (nameTag: string) => void
    handleDelete: (nameTag: string) => void
}

const PlayerStack = ({ playerMap, handleAddPlayer, handleToggle, handleDelete }: PlayerStackProps) => {
    const [nameTag, setNameTag] = useState('')

    //Validate the input has the correct format
    const validateInput = () => {
        if (!validateNameTag(nameTag)) {
            alert('Invalid Input')
            return false
        }
        if (nameTag in playerMap) {
            alert('Player is already graphed')
            return false
        }
        return true
    }

    return (
        <Stack
            className="border-top border-secondary border-2 h-100"
            style={{
                fontFamily: 'Courier New, monospace',
            }}
        >
            {Object.keys(playerMap).map((existingNameTag: string) => (
                <PlayerEntry
                    key={existingNameTag}
                    nameTag={existingNameTag}
                    handleToggle={() => handleToggle(existingNameTag)}
                    handleDelete={() => handleDelete(existingNameTag)}
                    handleSearch={() => {
                        let [name, tag] = existingNameTag.split('#')
                        window.open(
                            `/profile/${playerMap[existingNameTag].region.toLowerCase()}/${name}/${tag}`,
                            '_blank'
                        )
                    }}
                    visible={playerMap[existingNameTag].visible}
                />
            ))}
            <Stack direction="horizontal" className="p-2 border-bottom border-end border-secondary border-2" gap={2}>
                <FaPlus className="invisible"></FaPlus>
                <div className="vr text-light"></div>
                <input
                    className="bg-transparent flex-grow-1"
                    spellCheck="false"
                    autoComplete="off"
                    value={nameTag}
                    onChange={(e) => setNameTag(e.target.value)}
                    placeholder={
                        Object.keys(playerMap).length > 0 ? 'player name#tag' : 'player name#tag ex. SEN TenZ#81619'
                    }
                    style={{
                        border: 'none',
                        outline: 'none',
                        color: 'white',
                    }}
                    id="newPlayerInput"
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            if (validateInput()) {
                                await handleAddPlayer(nameTag.trim())
                                setNameTag('')
                            }
                        }
                    }}
                ></input>
            </Stack>
        </Stack>
    )
}
export default PlayerStack
