const pageScripts = {
    demotable: '/scripts/demotable.js',
    passenger: '/scripts/passenger.js',
    pass: '/scripts/pass.js',
    station: '/scripts/station.js',
    route: '/scripts/route.js',
    gate: '/scripts/gate.js',
    train: '/scripts/train.js',
    statistics: '/scripts/statistics.js'
};


// Check the database connection
async function checkDbConnection() {
    const statusElem =
        document.getElementById('dbStatus');

    const loadingGifElem =
        document.getElementById('loadingGif');

    try {
        const response = await fetch(
            '/database/check-db-connection',
            {
                method: 'GET'
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const text = await response.text();

        statusElem.textContent = text;

    } catch (error) {

        console.error(
            'Database connection check failed:',
            error
        );

        statusElem.textContent =
            'Connection failed';

    } finally {

        loadingGifElem.style.display = 'none';
        statusElem.style.display = 'inline';
    }
}


// Reset the database
async function resetDatabase() {

    try {

        const response = await fetch(
            '/database/reset-db',
            {
                method: 'POST'
            }
        );

        const responseData =
            await response.json();

        const messageElement =
            document.getElementById('dbResetResult');

        if (responseData.success) {

            messageElement.textContent =
                'Database initialized successfully!';

        } else {

            messageElement.textContent =
                'Error initializing database.';

        }

    } catch (error) {

        console.error(
            'Error resetting database:',
            error
        );

        document.getElementById(
            'dbResetResult'
        ).textContent =
            'Error initializing database.';
    }
}

async function clearDatabase() {

    try {

        const response = await fetch(
            '/database/clear-db',
            {
                method: 'POST'
            }
        );

        const responseData =
            await response.json();

        const messageElement =
            document.getElementById('dbClearResult');

        if (responseData.success) {

            messageElement.textContent =
                'Database cleared successfully!';

        } else {

            messageElement.textContent =
                'Error initializing database.';

        }

    } catch (error) {

        console.error(
            'Error resetting database:',
            error
        );

        document.getElementById(
            'dbClearResult'
        ).textContent =
            'Error clearing database.';
    }
}


async function dropDatabase() {

    try {

        const response = await fetch(
            '/database/drop-db',
            {
                method: 'POST'
            }
        );

        const responseData =
            await response.json();

        const messageElement =
            document.getElementById('dbDropResult');

        if (responseData.success) {

            messageElement.textContent =
                'Database tables dropped successfully!';

        } else {

            messageElement.textContent =
                'Error dropping database tables.';

        }

    } catch (error) {

        console.error(
            'Error dropping database tables',
            error
        );

        document.getElementById(
            'dbClearResult'
        ).textContent =
            'Error dropping database tables.';
    }
}


// Load a feature page
async function showPage(page) {

    try {

        const response = await fetch(
            `/pages/${page}.html`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load ${page} page`
            );
        }

        const html =
            await response.text();

        document.getElementById(
            'page-content'
        ).innerHTML = html;


        // Remove previous page script
        const oldScript =
            document.querySelector(
                'script[data-page-script]'
            );

        if (oldScript) {
            oldScript.remove();
        }


        // Load the new page's script
        if (pageScripts[page]) {

            const script =
                document.createElement('script');

            script.src =
                pageScripts[page];

            script.dataset.pageScript =
                'true';

            document.body.appendChild(script);
        }

    } catch (err) {

        console.error(err);

        document.getElementById(
            'page-content'
        ).innerHTML = `
            <div class="error-message">
                Failed to load ${page} page.
            </div>
        `;
    }
}


// Set up the application
document.addEventListener(
    'DOMContentLoaded',
    () => {

        checkDbConnection();

        showPage('demotable');

        document
            .getElementById('dbReset')
            .addEventListener(
                'click',
                resetDatabase
        );
        
        document
            .getElementById('dbClear')
            .addEventListener(
                'click',
                clearDatabase
        );
        
        document
            .getElementById('dbDrop')
            .addEventListener(
                'click',
                dropDatabase
            );
    }
);