const pageScripts = {
    demotable: '/scripts/demotable.js',
    //passenger: '/scripts/passenger.js',
    //pass: '/scripts/pass.js',
    //gate: '/scripts/gate.js',
    //train: '/scripts/train.js',
    //statistics: '/scripts/statistics.js'
};

// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}


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

        const html = await response.text();

        document.getElementById('page-content').innerHTML = html;

        // Load page-specific JavaScript
        if (pageScripts[page]) {
            const oldScript =
                document.querySelector(
                    'script[data-page-script]'
                );
            if (oldScript) {
                oldScript.remove();
            }
            const script = document.createElement('script');

            script.src = pageScripts[page];
            script.dataset.pageScript = 'true';

            document.body.appendChild(script);
        }

    } catch (err) {

        console.error(err);

        document.getElementById('page-content').innerHTML = `
            <div class="error-message">
                Failed to load page.
            </div>
        `;
    }
}

// Load a default page when the application starts
showPage('demotable');