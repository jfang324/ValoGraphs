import { stringToColor } from '@/lib/utils'
import { CloseButton, Stack } from 'react-bootstrap'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'

/**
 * Player Entry component props
 *
 * @params visible - A variable determining if the eye icon is crossed out or not
 * @params nameTag - The player name and tag in the format name#tag
 * @params handleToggle - A function that toggles the visible variable in the state of the application
 * @params handleDelete - A function that deletes this entry in the state of the application
 * @params handleSearch - A function that opens the profile page for this player in a new tab
 */
interface PlayerEntryProps {
    visible: boolean
    nameTag: string
    handleToggle: () => void
    handleDelete: () => void
    handleSearch: () => void
}

const PlayerEntry = ({ visible, nameTag, handleToggle, handleDelete, handleSearch }: PlayerEntryProps) => {
    return (
        <>
            <Stack direction="horizontal" className="p-2 border-bottom border-end border-secondary border-2" gap={2}>
                {visible ? (
                    <FaRegEye className="float-start text-secondary" onClick={handleToggle}></FaRegEye>
                ) : (
                    <FaEyeSlash className="float-start text-secondary" onClick={handleToggle}></FaEyeSlash>
                )}
                <div className="vr text-light"></div>
                <div
                    style={{
                        color: stringToColor(nameTag),
                        cursor: 'pointer',
                    }}
                    onClick={handleSearch}
                >
                    {nameTag}
                </div>
                <CloseButton className="ms-auto" variant="white" onClick={handleDelete}></CloseButton>
            </Stack>
        </>
    )
}

export default PlayerEntry
