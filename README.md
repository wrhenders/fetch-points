# Points Tracker

Can be seen [on Vercel](https://fetch-points-fanx.vercel.app/)

![Image](https://i.ibb.co/wgDsDTZ/Screenshot-2022-09-29-at-08-17-16-Points-Tracker.png)

Points Tracker Web App tracks a users total reward points and allows them to be spent

- Keeps a log of points trasactions sorted by timestamp
- Allows insertion of new transactions
- User can spend points and a balance of their points and payers remain

Leverages Next.js to build and interactive Web App

## Getting Started

#### Prerequisites

To get the app running locally, you will need Node installed.

After installing [Node](https://nodejs.org/en/), run

```bash
npm install
```

#### Development Server

To run a development server at http://localhost:3000 use

```bash
npm run dev
```

The URL for the server is stored in a .env.local file. 
To the main directory, you will need to add 
.env.local
with the line of text
NEXT_PUBLIC_SERVER_URL = http://localhost:3000


Open [http://localhost:3000](http://localhost:3000) with your browser.

## Application Architecture

- This app follows a mostly typical Next.js app structure, using /pages directory to create the structure and URL routing of the project

  - I chose Next.js to use their server side rendering functionality to allow quick loads and functional API structure

  - The main page shows the balance and payer totals from the api/balance endpoint

  - The Layout component is used to create the navigation bar and structure of each page

  - For a New Transaction, the frontend first checks that any data entry fits the necessary write parameters, then sends the data through the api/new enpoint to the repo component which adds to the transaction log and sorts at write, so that reads can happen faster

  - For a Spend, the balance is confirmed available before calling the repo component to walk the logs to determine the order of the spend. It creates a hashmap to log which payers will be used until the spend balance is met. It then updates the balances remaining from each payer, converts the hashmap to an array and returns the spend array to the console and shows remaining balance on the main screen

  - The database is stored locally in a db.json file for testing, but on the saveData function has been commented out so that vercel can run in memory as it doesn't allow writes to hosted JSON files
