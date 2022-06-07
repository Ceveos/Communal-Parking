This is the official Communal Parking website repo.
Communal Parking is a website solution to managing shared parking spaces in an apartment complex or small community.

## Getting Started

### First, install all the dependencies

```bash
yarn
```

### Second, ensure you have docker set up on your machine. You'll end up creating two containers

- (manually) Create a Postgres Database. This will be used while locally testing the website
- (automatically) The testing framework has a docker compose file that it spins up as part of its testing framework


### Third, set up your `.env` file

An `.env.example` file is provided for your convenience. you will need to generate a secure random string for some variables.
A command to generate the string is provided in the example.

### Last, start the local dev server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!