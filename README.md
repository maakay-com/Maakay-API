# Guestbook

The API serves as an Oracle/Directory for users to attach cross-crypto currencies to their account.

This serves as a place to verify the address and validity of profiles when trading/exchanging crypto.

## Getting Started

Clone the repo.

Install Node.js and required packages: `npm install`

Run the server: `npm run dev`

## Running Project (Docker)

Pull and run mongodb

```
docker pull mongo
docker run -d -p 27017:27017 mongo:latest
```

Build the docker image using `docker build -t guestbook-api .`

Copy the contents of .env.template file to .env and update the environment variables.

Run the docker image using `docker run -p 3000:3000 --env-file=.env --network="host" guestbook-api`

The API docs are now available on `http://localhost:3000/api/v1/api-docs`.

Happy Coding.
