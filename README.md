# Exhibition Curator

Hello, and welcome to Exhibition Curator. The purpose of this website is for users to be able to create an account and save custom named exhibitions. From there, they can search for keywords ranging from types of items they want to see, ranging from various locations, languages and date ranges. This helps history enthusiasts build a collection of items for a range of purposes, such as:

- Historical Research
- Travel planning
- Hobbyist collection

## About the APIs

As it stands, the website is using the Europeana API, which is a continent wide partnership agreement with various museums to upload their digitized archives to a central point. This central point has made it significantly easier to see what historical items exist across Europe from a variety of periods.

In addition, if you're into Primary Source research, then we have offered the Oxford University Manuscript API, so anyone looking to see what historical documents written from a variety of ages still exist. This is perfect for students looking for items that may help them with their period research.

> **Note:** You also don't need to sign up to use the app. You can simply browse the third party APIs mentioned above and populate results. However, you cannot save exhibits and items to them without signing up. All accounts are secured safely on a PostgreSQL server hosted on Railway, and all passwords are encrypted ten times over to ensure safety of your passwords.

<div align="center">
  <img src="./public/exhibition-curator-logged-in.png" alt="Picture of the retrieved items while logged in" width="45%" />
  <img src="./public/exhibition-curator-not-logged-in.png" alt="Picture of the retrieved items not logged in" width="45%" />
</div>

## Features

### Current Features

At the time of writing, the app features the following:

- Login and create account
- Custom exhibits
- Third party API search
- Ability to save items to your created exhibits
- Renaissance period design
- Accessibility features supported, but still a work in progress

### Planned Features

While the app's MVP is achieved, there are still some design and UX features I would love to add to the project:

- Save an exhibit thumbnail
- Item Card size consistency with scrollable text for longer than usual titles or descriptions
- Dark Mode
- Find other user exhibits
- Public and private exhibits
- Proper functioning account details, such as email integration, change password

## Live Demo

The website is live at: https://european-exhibits-maker.up.railway.app/

## Local Installation

### Prerequisites

- Node.js and npm
- PostgreSQL
- Code editor of your choice

### Frontend Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/Fandasuba/exhibition-curator
   cd exhibition-curator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the root of the app with the following variables:
   ```env
   # Generate this using the command below
   SECRET_SESSION=your-generated-secret-key
   
   # Backend API URL (will be localhost:8000 for local development)
   NEXT_DOCKER_API_URL="http://localhost:8000"
   
   # Get your API key from Europeana API docs
   EUROPEANA_API_KEY=your_europeana_api_key
   ```

4. **Generate your SECRET_SESSION key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as your `SECRET_SESSION` value.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Your application should now be running on `localhost:3000` (or another available port). This will give you access to at least the third party API functions in the browse collection web page. You will still need to setup the backend repository to get the saved users and exhibits functionality working.

### Backend Setup

1. **Install PostgreSQL:**
   Download and install PostgreSQL from: https://www.postgresql.org/

2. **Clone the backend repository:**
   ```bash
   git clone https://github.com/Fandasuba/exhibition-curator-be
   cd exhibition-curator-be
   npm install
   ```

### Database Setup

1. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres
   ```
   Enter the password you set during installation. If PostgreSQL made you create another username, feel free to use that instead.

2. **Seed the database:**
   When you have successfully installed the backend repo from the previous installation guide, you will need to run:
   ```bash
   npm run seed
   ```
   
   This command runs the file in that repo called `run-seed`. This will begin creating a database called `exhibition_curator`, along with tables called `users` and `exhibitions`.

3. **Test the database setup:**
   ```bash
   psql -U "your_psql_username" -d exhibition_curator
   ```
   
   Once you see the psql message appear in the terminal, run:
   ```sql
   SELECT * FROM users;
   ```
   
   This should show you a list of premade user names created from the run-seed command. This will tell you what has been populated and show that it works and is ready to take requests and responses.

### Backend Environment Setup

Create a `.env` file in the backend repository with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/exhibition_curator"

# Individual Database Components
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exhibition_curator
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Session Secret (use the same one as frontend)
SECRET_SESSION=your-generated-secret-key

# Server Configuration
PORT=8000
NODE_ENV=development
```

**Important Notes:**
- Change the `username` to the PostgreSQL username you set up, or `postgres` by default
- The `password` should be whatever password you set in PostgreSQL setup
- The `5432` should be the port that PostgreSQL defaults to on installation or whatever you changed it to

These environment variables are important as the PostgreSQL server is technically a third server. The backend repository's job is to manage what information is being sent from the client side you setup earlier, translate it into database ready information, and then use the above secrets to access the PostgreSQL server hosted on your machine.

### Start the Backend Server

```bash
npm run dev
```

Your Express server should now be running on `http://localhost:8000`.

## Testing the Full Setup

Once both frontend and backend are setup, you should be able to test that your client side can:
- Create an account
- Login
- Save exhibits
- Save items to those exhibits

## Repository Links

- **Frontend:** https://github.com/Fandasuba/exhibition-curator
- **Backend:** https://github.com/Fandasuba/exhibition-curator-be

## API Documentation

- **Europeana API:** Get your API key from the Europeana API documentation
- **Oxford University Manuscript API:** Available for primary source research