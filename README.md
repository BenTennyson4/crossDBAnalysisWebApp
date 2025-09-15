This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cross Database Analysis Web App
This project is a full-stack web app that aggregates and analyzes data. 

What the app does: It allows users to upload excel files with specific column headers contianing data from a separate databases and aggregates this data in a single database. The app allows the user to search for information in the database through a search bar, and specific reports of data can be generated and exported in csv format. 

Purpose: The project was developed to determine and track user system access to enhance security, ensure compliance, and monitor proper role-based access.

## Getting Started

To use this application, you need to download and install Node.js and npm. Follow this tutorial to do so [`Download and install Node.js and npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Once you have installed npm, you can run a local development server in your web browser, which runs the app in your browser and allows you to see the results of changes to the code in real-time.

Run the development server:

```bash or powershell or cmd
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application needs to be connected to a database to function properly. You will need to set up a MySQL database and then connect it to the app. A create.sql file is provided containing the necessary SQL code to set up the database schema for the app. Ensure that MysQL is installed locally. I would suggest using [`MySQL Workbench`](https://dev.mysql.com/downloads/workbench/) as it provides a graphical interface to view the data and database schema. 
Steps:
1. Install MySQL and MySQL Workbench
2. Make a new database in MySQL Workbench for the app to use:
   a. Open MySQL Workbench and create a new database connection for a local MySQL server.
   b. Open the database connection and in the Navigator panel, right-click on Schemas and select "Create Schema..."
   c. Enter a name for your database (e.g., uni_verse_db) and click Apply, then Apply again in the review window.
   d. Once created, make sure to set this schema as the default by right-clicking on it and choosing "Set as Default Schema".
   e. Open the provided create.sql file in MySQL Workbench and execute it to create all the necessary tables and relationships. 
3. Configure the app to connect to the database:
   a. Open the .env.local file
   b. Update the host, username, password, and database name to match your local MySQL setup. 
   
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
