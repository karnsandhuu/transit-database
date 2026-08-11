(() => {
    const messageElement =
        document.getElementById('trainMessage');

    const form =
        document.getElementById('findTrainForm');

    const trainDetails =
        document.getElementById('trainDetails');

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function showMessage(text, type) {
        messageElement.textContent = text;
        messageElement.className =
            `message ${type}`;
    }

    function displayTrain(train) {

        const routeNumbers =
            Array.isArray(train.routeNumbers)
                ? train.routeNumbers
                : [];

        const routes =
            routeNumbers.length > 0
                ? routeNumbers.join(', ')
                : 'Not registered to any routes';

        trainDetails.innerHTML = `
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Information</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>Vehicle ID</th>
                        <td>
                            ${escapeHtml(train.vehicleId)}
                        </td>
                    </tr>

                    <tr>
                        <th>Train-set Number</th>
                        <td>
                            ${escapeHtml(train.trainSetNumber)}
                        </td>
                    </tr>

                    <tr>
                        <th>Model</th>
                        <td>
                            ${escapeHtml(train.modelName)}
                        </td>
                    </tr>

                    <tr>
                        <th>Number of Cars</th>
                        <td>
                            ${escapeHtml(train.numberOfCars)}
                        </td>
                    </tr>

                    <tr>
                        <th>Manufacture Year</th>
                        <td>
                            ${escapeHtml(train.manufactureYear)}
                        </td>
                    </tr>

                    <tr>
                        <th>Capacity</th>
                        <td>
                            ${escapeHtml(train.capacity)}
                        </td>
                    </tr>

                    <tr>
                        <th>Wheelchair Accessible</th>
                        <td>
                            ${train.wheelchairAccessibility === 'Y'
                ? 'Yes'
                : 'No'}
                        </td>
                    </tr>

                    <tr>
                        <th>Routes</th>
                        <td>
                            ${escapeHtml(routes)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    }


    function showEmptyResult() {
        trainDetails.innerHTML = `
        <p class="empty-state">
            Enter a train-set number to view joined details.
        </p>
    `;
    }

    async function findTrain(event) {

        event.preventDefault();

        const trainSetNumber =
            document
                .getElementById('findTrainSetNumber')
                .value
                .trim();


        if (!trainSetNumber) {

            showMessage(
                'Please enter a train-set number.',
                'error'
            );

            return;
        }


        try {

            showMessage(
                'Searching for train...',
                'info'
            );


            const response =
                await fetch(
                    `/trains/${encodeURIComponent(trainSetNumber)}`
                );


            if (response.status === 404) {

                showEmptyResult();

                showMessage(
                    `No train found with train-set number "${trainSetNumber}".`,
                    'error'
                );

                return;
            }


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );
            }


            const train =
                await response.json();


            displayTrain(train);


            showMessage(
                'Train found successfully.',
                'success'
            );


        } catch (error) {

            console.error(
                'Error fetching train:',
                error
            );

            showEmptyResult();

            showMessage(
                'An error occurred while retrieving the train.',
                'error'
            );
        }
    }


    form.addEventListener(
        'submit',
        findTrain
    );

})();