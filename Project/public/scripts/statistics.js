async function getAverageSpendingByCategory() {
    console.log("getting average...");
    try {
        const response = await fetch(
            "/statistics/average-spending-by-category"
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        displayAverageSpendingByCategory(data);

    } catch (error) {

        console.error(
            "Error fetching average spending:",
            error
        );
    }
}


function displayAverageSpendingByCategory(data) {

    const table =
        document.getElementById(
            "averageSpendingTable"
        );

    const tableBody =
        document.getElementById(
            "averageSpendingTableBody"
        );

    tableBody.innerHTML = "";

    data.forEach(row => {

        const tableRow =
            document.createElement("tr");

        tableRow.innerHTML = `
            <td>${row.passengerCategory}</td>
            <td>${row.passengerCount}</td>
            <td>
                ${Number(row.averageAmountSpent).toFixed(2)}
            </td>
        `;

        tableBody.appendChild(tableRow);
    });

    table.style.display = "table";
}

async function getGatesMoreThan100Events() {
    console.log("Getting gates with more than 100 events...");

    try {
        const response = await fetch(
            "/statistics/gates-more-than-100-events"
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        displayGatesMoreThan100Events(data);

    } catch (error) {
        console.error(
            "Error fetching gates with more than 100 events:",
            error
        );
    }
}


function displayGatesMoreThan100Events(data) {

    const table =
        document.getElementById(
            "gatesMoreThan100Table"
        );

    const tableBody =
        document.getElementById(
            "gatesMoreThan100TableBody"
        );

    tableBody.innerHTML = "";

    data.forEach(row => {

        const tableRow =
            document.createElement("tr");

        tableRow.innerHTML = `
            <td>${row.gateId}</td>
            <td>${row.stationId}</td>
            <td>${row.enterOrExit}</td>
            <td>${row.totalEnterExitCount}</td>
        `;

        tableBody.appendChild(tableRow);
    });

    table.style.display = "table";
}
async function getStationsMoreThanAverage() {
    console.log(
        "Getting stations served by more than average routes..."
    );

    try {
        const response = await fetch(
            "/statistics/stations-more-than-average-routes"
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        displayStationsMoreThanAverage(data);

    } catch (error) {

        console.error(
            "Error fetching stations:",
            error
        );
    }
}

function displayStationsMoreThanAverage(data) {

    const table =
        document.getElementById(
            "stationsMoreThanAverageTable"
        );

    const tableBody =
        document.getElementById(
            "stationsMoreThanAverageTableBody"
        );

    // Remove existing rows
    tableBody.innerHTML = "";

    data.forEach(row => {

        const tableRow =
            document.createElement("tr");

        tableRow.innerHTML = `
            <td>${row.stationId}</td>
            <td>${row.stationName}</td>
            <td>${row.routeCount}</td>
        `;

        tableBody.appendChild(tableRow);
    });

    // Show the table
    table.style.display = "table";
}
async function getPassengersWithAllPassTypes() {
    console.log(
        "Getting passengers with all pass types..."
    );
    try {

        const response = await fetch(
            "/statistics/passengers-with-all-pass-types"
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        displayPassengersWithAllPassTypes(data);

    } catch (error) {

        console.error(
            "Error fetching passenger count:",
            error
        );
    }
}

function displayPassengersWithAllPassTypes(data) {

    const result =
        document.getElementById(
            "passengersWithAllPassTypesResult"
        );

    const count =
        document.getElementById(
            "passengersWithAllPassTypesCount"
        );

    count.textContent = data.passengerCount;

    result.style.display = "block";
}

function initializePage() {
    console.log("!!! NEW STATISTICS.JS LOADED !!!");
    console.log("initializing stats page");
    document.getElementById("averageSpendingButton").addEventListener("click", getAverageSpendingByCategory);
    document.getElementById("gatesMoreThan100Button").addEventListener("click", getGatesMoreThan100Events);
    document.getElementById("stationsMoreThanAverageButton").addEventListener("click", getStationsMoreThanAverage);
    //document.getElementById("getPassengersAllPassTypes").addEventListener("click",getPassengersWithAllPassTypes);

    const button = document.getElementById("passengersWithAllPassTypesButton");

    console.log("All pass types button:", button);

    if (button) {
        button.addEventListener(
            "click",
            getPassengersWithAllPassTypes
        );

        console.log("Listener added!");
    }
}

initializePage();