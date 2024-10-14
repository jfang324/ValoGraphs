import { Container, Stack } from 'react-bootstrap'

const ErrorPage = () => {
    return (
        <Container
            fluid
            className="bg-black text-secondary vh-100 py-5"
            style={{ fontFamily: 'Courier New, monospace', fontSize: '15px' }}
        >
            <Stack className="text-center h-100" gap={3}>
                <div className="bg-primary px-3 py-2 mx-auto bg-secondary text-black h1">
                    <span>Error - 404</span>
                </div>
                <Stack gap={1}>
                    <div>The page you're looking for doesn't exist, return to homepage</div>
                    <a href="/" className="text-light text-decoration-none">
                        homepage
                    </a>
                </Stack>
            </Stack>
        </Container>
    )
}

export default ErrorPage
