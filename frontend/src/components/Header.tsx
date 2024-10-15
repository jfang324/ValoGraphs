import { gameModes } from '@/lib/constants'
import { Button, Container, Dropdown, Form, Nav, Navbar, NavDropdown, Offcanvas, Stack } from 'react-bootstrap'
import { SiValorant } from 'react-icons/si'

/**
 * Header component props
 *
 * @params currentRegion - The current region
 * @params regions - A list of regions
 * @params handleProfileSearch - A function that opens the profile page for a player
 * @params handleChangeMode - A function that changes the game mode
 * @params handleChangeRegion - A function that changes the region
 */
interface HeaderProps {
    currentRegion: string
    regions: string[]
    handleProfileSearch: (nameTag: string, region: string) => void
    handleChangeMode: (mode: string) => void
    handleChangeRegion: (region: string) => void
}

const HomePageWidget = () => (
    <Nav.Link href="/" key={'home page'}>
        Back to Homepage
    </Nav.Link>
)

const ProfileSearchWidget = ({
    handleProfileSearch,
    currentRegion,
}: Pick<HeaderProps, 'handleProfileSearch' | 'currentRegion'>) => (
    <NavDropdown title={'View Profile Page'} key={'profile search'}>
        <Form
            className="d-flex px-2 "
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const nameTag = formData.get('nametag') as string
                handleProfileSearch(nameTag, currentRegion)
            }}
        >
            <Form.Control
                name="nametag"
                type="search"
                spellCheck="false"
                placeholder="player name#tag"
                className="me-2"
                aria-label="Search"
            />
            <Button variant="outline-danger" type="submit">
                Search
            </Button>
        </Form>
    </NavDropdown>
)

const GameModeWidget = ({ handleChangeMode }: Pick<HeaderProps, 'handleChangeMode'>) => (
    <NavDropdown title={'Change Game Mode'} id={`offcanvasNavbarDropdown-expand-${false}`} key={'change mode'}>
        {gameModes.map((mode: string, index: number) => {
            return (
                <NavDropdown.Item
                    key={index}
                    onClick={() => {
                        handleChangeMode(mode)
                    }}
                >
                    {mode}
                </NavDropdown.Item>
            )
        })}
    </NavDropdown>
)

const GitHubWidget = () => (
    <Nav.Link href={import.meta.env.VITE_GITHUB_LINK || 'https://github.com/jfang324/ValoGraphs'} key={'github'}>
        View GitHub Repository
    </Nav.Link>
)

const Header = ({ currentRegion, regions, handleProfileSearch, handleChangeMode, handleChangeRegion }: HeaderProps) => {
    return (
        <Navbar expand={false} variant="dark" bg="black">
            <Container fluid style={{ fontFamily: 'Courier New, monospace', color: 'white' }}>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
                <Navbar.Brand className="mx-auto">
                    <Stack direction="horizontal" gap={1}>
                        <SiValorant size={45} style={{ fill: '#FF4655' }} />
                        <h1 className="my-auto ps-2">ValoGraphs</h1>
                    </Stack>
                </Navbar.Brand>
                {regions.length > 0 ? (
                    <Dropdown>
                        <Dropdown.Toggle className="bg-black border border-dark" id="dropdown-basic">
                            {currentRegion === 'LATAM' ? 'LT' : currentRegion}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="bg-black border border-dark" align={'end'}>
                            {regions.map((region: string, index: number) => {
                                return (
                                    <Dropdown.Item
                                        key={index}
                                        className="text-secondary"
                                        onClick={() => {
                                            handleChangeRegion(region)
                                        }}
                                    >
                                        {region}
                                    </Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Dropdown className="invisible px-1">
                        <Dropdown.Toggle className="bg-black border border-dark" id="dropdown-basic"></Dropdown.Toggle>
                    </Dropdown>
                )}
            </Container>
            <Navbar.Offcanvas
                className="p-2"
                style={{
                    fontFamily: 'Courier New, monospace',
                }}
                id={`offcanvasNavbar-expand-${false}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
                placement="start"
                data-bs-theme="dark"
            >
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body className="pt-0">
                    <Nav>
                        <HomePageWidget />
                        <ProfileSearchWidget handleProfileSearch={handleProfileSearch} currentRegion={currentRegion} />
                        <GameModeWidget handleChangeMode={handleChangeMode} />
                        <GitHubWidget />
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Navbar>
    )
}

export default Header
