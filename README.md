# Interlinked.love


**Demo: [https://interlinked.love/](https://interlinked.love/)**

<details>
  <summary>Why did I make this?</summary>
  Because I need to organize the places I'm gonna visit and live with my partner so I wanted to make a simple app to do that.
</details>




Based on
[https://github.com/leerob/next-saas-starter/tree/main][Leerob Next saas starter]



## Getting Started

```bash
git clone https://github.com/leerob/next-saas-starter
cd next-saas-starter
pnpm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

- User2: `test2@test.com`
- Password: `admin123`

You can, of course, create new users as well through `/sign-up`.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

Optionally, you can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```