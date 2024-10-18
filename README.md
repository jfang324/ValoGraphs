<br />
<div align="center">
  <a href="https://Valographs.com">
    <img src='https://github.com/user-attachments/assets/b219ac30-3fce-459c-9fdc-8e027debbdc7' height='40' width='40'>
  </a>
  <h3 align="center">ValoGraphs</h3>
  <p align="center">
    A performance visualization platform for Valorant
    <br />
  </p>
</div>

## About The Project

While there are other platforms to track Valorant performance, I have yet to find one that lets you one-to-one compare with other players. I wanted to be able to easily compare my performance with others without the need to swap between multiple profile pages so I created ValoGraphs. Click the icon to check it out or visit [valographs.com](https://valographs.com)!

## Getting Started

To get a local version running follow these simple example steps:

### Prerequisites

-   Create a Postgres database locally or from a cloud provider like Amazon RDS
-   Get a HenrikDev API key for the unofficial Valorant API. Instruction can be found at https://github.com/Henrik-3/unofficial-valorant-api

### Installation

Now once the prerequisites are met there just follow the steps below.

1. Clone the repository

    ```sh
    git clone https://github.com/Jeffery-Fang/ValoGraphs.git
    ```

2. Install NPM packages in the frontend and backend directories

    ```sh
    npm install
    ```

3. Create a `.env` file in the backend directory with the following environment variables

    ```js
    PLAYER_URL_ROOT = 'https://api.henrikdev.xyz/valorant/v4/matches/na/pc'
    PROFILE_URL_ROOT = 'https://api.henrikdev.xyz/valorant/v1/stored-matches/na'
    MATCH_URL_ROOT = 'https://api.henrikdev.xyz/valorant/v4/match/na'
    ACCOUNT_URL_ROOT = 'https://api.henrikdev.xyz/valorant/v1/account/na'

    DB_HOST = 'YOUR DB HOST'
    DB_USERNAME = 'YOUR DB USERNAME'
    DB_PASSWORD = 'YOUR DB PASSWORD'
    DB_NAME = 'YOUR DB NAME'

    API_KEY = 'YOUR API KEY'
    ```

4. Create a `.env` file in the frontend directory with the following environment variables

    ```js
    VITE_PLAYER_API_URL = 'http://localhost:3000/players'
    VITE_MATCH_API_URL = 'http://localhost:3000/matches'
    VITE_PROFILE_API_URL = 'http://localhost:3000/profiles'

    VITE_PLAYER_CARD_URL = 'https://valorant-api.com/v1/playercards'
    VITE_AGENT_URL = 'https://valorant-api.com/v1/agents'
    ```

5. Go into the backend directory build and start the backend server

    ```sh
    npm run build
    npm run start
    ```

6. Go into the frontend directory and build and preview the frontend

    ```sh
    npm run build
    npm run preview
    ```

7. Open your browser and navigate to the link vite provides you (for me it was localhost:4173)

8. If you want to run the tests navigate to the backend directory and run:

    ```sh
    npm run test
    ```

## Gallery & Demonstrations

<img src='https://github.com/user-attachments/assets/1f284bd9-cb90-4b13-8087-dd85a4480df4'></img>
_Graph Page Desktop View_

<img src='https://github.com/user-attachments/assets/2eb82719-7463-4b22-9c37-7f76d6af804b'></img>
_Profile Page Desktop View_

<img src='https://github.com/user-attachments/assets/8e68be93-91ed-4c1e-a98e-ae2d1013db34' width="auto" height="500"></img>

_Graph Page Mobile View_

<img src='https://github.com/user-attachments/assets/65b598e8-e2cf-4312-ae90-edc61489301b' width="auto" height="500"></img>

_Profile Page Mobile View_

## Acknowledgements

-   [HenrikDev](https://github.com/Henrik-3/unofficial-valorant-api) for providing the API used in this project

## Contact

Jeffery Fang - JefferyFang324@gmail.com

## Tools & Technologies

-   Postgres
-   Express
-   React
-   Node
-   Jest
-   Vite
-   Bootstrap
-   AWS(Elastic Beanstalk, RDS, CloudFront, etc.)
