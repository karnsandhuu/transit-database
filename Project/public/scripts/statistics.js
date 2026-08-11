function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);

    errorElement.textContent = message;
    errorElement.style.display = "block";
}
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);

    errorElement.textContent = "";
    errorElement.style.display = "none";
}

async function getAverageSpendingByCategory() {
    console.log("getting average...");
    clearError("averageSpendingError");
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
        showError(
            "averageSpendingError",
            "Unable to retrieve average spending information. Please refresh the DB and try again."
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

async function getStationsMoreThan300Events() {
    console.log("Getting stations with more than 300 events...");
    clearError("stationsMoreThan300Error");


    try {
        const response = await fetch(
            "/statistics/stations-more-than-300-events"
    );

    if (!response.ok) {
        throw new Error(
            `HTTP error: ${ response.status } `
        );
    }

    const data = await response.json();

    displayStationsMoreThan300Events(data);

    } catch (error) {
        console.error(
            "Error fetching stations with more than 300 events:",
            error
        );

    showError(
        "stationsMoreThan300Error",
        "Unable to retrieve station information. Please refresh the DB and try again."
    );
}


}

function displayStationsMoreThan300Events(data) {
    const table =
        document.getElementById(
            "stationsMoreThan300Table"
        );

    const tableBody =
        document.getElementById(
            "stationsMoreThan300TableBody"
        );

    tableBody.innerHTML = "";

    data.forEach(row => {

        const tableRow =
            document.createElement("tr");

        tableRow.innerHTML = `
            <td> ${ row.stationId }</td >
            <td>${row.enterOrExit}</td>
            <td>${row.totalEnterExitCount}</td>
        `;

        tableBody.appendChild(tableRow);
    });

    table.style.display = "table";
}


async function getStationsMoreThanAverage() {
    clearError("stationsMoreThanAverageError");
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

        showError(
            "stationsMoreThanAverageError",
            "Unable to retrieve station information. Please refresh the DB and try again."
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
    clearError("passengersWithAllPassTypesError");
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
        showError(
            "passengersWithAllPassTypesError",
            "Unable to retrieve the passenger count. Please refresh the DB and try again."
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
    document.getElementById("averageSpendingButton").addEventListener("click", getAverageSpendingByCategory);
    document.getElementById("stationsMoreThan300Button").addEventListener("click", getStationsMoreThan300Events);
    document.getElementById("stationsMoreThanAverageButton").addEventListener("click", getStationsMoreThanAverage);
    document.getElementById("passengersWithAllPassTypesButton").addEventListener("click",getPassengersWithAllPassTypes);
}

initializePage();