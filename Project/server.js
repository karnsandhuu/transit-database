const app = require('./app');
const { initializeConnectionPool } = require('./db/oracle');

const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

const PORT = envVariables.PORT || 65534;


async function startServer() {

    await initializeConnectionPool();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

}

startServer();

/*const express = require('express');
//const appController = require('./controllers/appController');
const appRoutes = require('./routes/appRoutes');
const { initializeConnectionPool } = require('./db/oracle');

// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads

// If you prefer some other file as default page other than 'index.html',
//      you can adjust and use the bellow line of code to
//      route to send 'DEFAULT_FILE_NAME.html' as default for root URL
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/DEFAULT_FILE_NAME.html');
// });


// mount the router
//app.use('/', appController);
app.use('/', appRoutes);

async function startServer() {

    await initializeConnectionPool();
    app.listen(PORT, () => {
        console.log("Server running");
    });

}

// ----------------------------------------------------------
// Starting the server
startServer();*/
