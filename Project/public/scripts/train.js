(() => {
    const messageElement = document.getElementById('trainMessage');
    const currentYear = new Date().getFullYear();

    document.getElementById('manufactureYear').max = currentYear;

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    async function request(url, options = {}) {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type') || '';
        const result = contentType.includes('application/json')
            ? await response.json().catch(() => ({}))
            : await response.text();

        if (!response.ok) {
            const message = typeof result === 'object'
                ? result.message
                : result;
            throw new Error(message || 'The train request could not be completed.');
        }

        return result;
    }

    function showMessage(text, type) {
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }

    function renderTable(containerId, rows, columns, emptyMessage) {
        const container = document.getElementById(containerId);

        if (!rows.length) {
            container.innerHTML = `<p class="empty-state">${escapeHtml(emptyMessage)}</p>`;
            return;
        }

        const headings = columns
            .map(column => `<th>${escapeHtml(column.label)}</th>`)
            .join('');
        const body = rows.map(row => {
            const cells = columns.map(column => {
                const rawValue = typeof column.value === 'function'
                    ? column.value(row)
                    : row[column.value];
                const value = rawValue === null || rawValue === undefined || rawValue === ''
                    ? '-'
                    : rawValue;
                return `<td>${escapeHtml(value)}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        container.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead><tr>${headings}</tr></thead>
                    <tbody>${body}</tbody>
                </table>
            </div>
        `;
    }

    function fillSelect(selectId, rows, valueKey, labelFunction, emptyText) {
        const select = document.getElementById(selectId);
        select.innerHTML = '';

        if (!rows.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = emptyText;
            select.appendChild(option);
            select.disabled = true;
            return;
        }

        select.disabled = false;
        rows.forEach(row => {
            const option = document.createElement('option');
            option.value = row[valueKey];
            option.textContent = labelFunction(row);
            select.appendChild(option);
        });
    }

    async function loadModels() {
        const result = await request('/train-models');
        const models = Array.isArray(result) ? result : [];

        renderTable(
            'trainModelsTable',
            models,
            [
                { label: 'Model name', value: 'modelName' },
                { label: 'Number of cars', value: 'numberOfCars' }
            ],
            'No train models are available.'
        );
        fillSelect(
            'subwayTrainModelName',
            models,
            'modelName',
            model => `${model.modelName} (${model.numberOfCars} cars)`,
            'Create a train model first'
        );
    }

    async function loadTrains() {
        const result = await request('/trains');
        const trains = Array.isArray(result) ? result : [];

        renderTable(
            'trainsTable',
            trains,
            [
                { label: 'Vehicle ID', value: 'vehicleId' },
                { label: 'Train-set number', value: 'trainSetNumber' },
                { label: 'Model', value: 'modelName' },
                { label: 'Cars', value: 'numberOfCars' },
                { label: 'Year', value: 'manufactureYear' },
                { label: 'Capacity', value: 'capacity' },
                {
                    label: 'Wheelchair accessible',
                    value: train => train.wheelchairAccessibility === 'Y' ? 'Yes' : 'No'
                }
            ],
            'No subway trains are available.'
        );
        fillSelect(
            'registrationVehicleId',
            trains,
            'vehicleId',
            train => `${train.trainSetNumber} (${train.vehicleId})`,
            'Create a subway train first'
        );
    }

    async function loadRoutes() {
        const result = await request('/routes');
        const routes = Array.isArray(result) ? result : [];

        fillSelect(
            'registrationRouteId',
            routes,
            'routeId',
            route => `${route.routeNumber} - ${route.routeName} (${route.routeId})`,
            'No routes are available'
        );
    }

    async function refreshTrainData() {
        const results = await Promise.allSettled([
            loadModels(),
            loadTrains(),
            loadRoutes()
        ]);
        const failures = results.filter(result => result.status === 'rejected');

        if (failures.length) {
            showMessage(
                'Some train lists could not load. The required list endpoints may not have been added to the backend yet.',
                'error'
            );
            return;
        }

        showMessage('Train, model, and route data loaded.', 'success');
    }

    document.getElementById('refreshTrainDataButton').addEventListener('click', refreshTrainData);

    document.getElementById('createTrainModelForm').addEventListener('submit', async event => {
        event.preventDefault();

        const modelName = document.getElementById('trainModelNameInput').value.trim();
        const numberOfCars = Number(document.getElementById('numberOfCars').value);

        if (!modelName || !Number.isInteger(numberOfCars) || numberOfCars <= 0) {
            showMessage('Enter a model name and a positive whole number of cars.', 'error');
            return;
        }

        try {
            const result = await request('/train-models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modelName, numberOfCars })
            });
            event.target.reset();
            await loadModels();
            showMessage(
                result.message || `Train model ${modelName} was created.`,
                'success'
            );
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('createTrainForm').addEventListener('submit', async event => {
        event.preventDefault();

        const payload = {
            trainSetNumber: document.getElementById('trainSetNumber').value.trim().toUpperCase(),
            modelName: document.getElementById('subwayTrainModelName').value,
            manufactureYear: Number(document.getElementById('manufactureYear').value),
            capacity: Number(document.getElementById('trainCapacity').value),
            wheelchairAccessibility: document.getElementById('trainAccessibility').value
        };

        if (!/^[A-Z0-9-]+$/.test(payload.trainSetNumber)) {
            showMessage('Train-set number may contain only capital letters, numbers, and hyphens.', 'error');
            return;
        }
        if (!payload.modelName) {
            showMessage('Choose an existing train model.', 'error');
            return;
        }
        if (
            !Number.isInteger(payload.manufactureYear) ||
            payload.manufactureYear < 1900 ||
            payload.manufactureYear > currentYear
        ) {
            showMessage(`Manufacture year must be from 1900 to ${currentYear}.`, 'error');
            return;
        }
        if (!Number.isInteger(payload.capacity) || payload.capacity <= 0) {
            showMessage('Capacity must be a positive whole number.', 'error');
            return;
        }

        try {
            const result = await request('/trains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            event.target.reset();
            document.getElementById('manufactureYear').max = currentYear;
            await loadTrains();
            showMessage(
                result.message || `Subway train created with vehicle ID ${result.vehicleId}.`,
                'success'
            );
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('registerTrainForm').addEventListener('submit', async event => {
        event.preventDefault();

        const vehicleId = document.getElementById('registrationVehicleId').value;
        const routeId = document.getElementById('registrationRouteId').value;

        if (!vehicleId || !routeId) {
            showMessage('Choose both an existing train and an existing route.', 'error');
            return;
        }

        try {
            const result = await request(
                `/trains/${encodeURIComponent(vehicleId)}/routes/${encodeURIComponent(routeId)}`,
                { method: 'POST' }
            );
            showMessage(
                result.message || 'Train registered on the route successfully.',
                'success'
            );
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('findTrainForm').addEventListener('submit', async event => {
        event.preventDefault();
        const trainSetNumber = document.getElementById('findTrainSetNumber').value.trim().toUpperCase();

        if (!trainSetNumber) {
            showMessage('Enter a train-set number.', 'error');
            return;
        }

        try {
            const train = await request(
                `/trains/${encodeURIComponent(trainSetNumber)}`
            );
            renderTable(
                'trainDetails',
                [train],
                [
                    { label: 'Vehicle ID', value: 'vehicleId' },
                    { label: 'Train-set number', value: 'trainSetNumber' },
                    { label: 'Model', value: 'modelName' },
                    { label: 'Cars', value: 'numberOfCars' },
                    { label: 'Year', value: 'manufactureYear' },
                    { label: 'Capacity', value: 'capacity' },
                    {
                        label: 'Wheelchair accessible',
                        value: row => row.wheelchairAccessibility === 'Y' ? 'Yes' : 'No'
                    },
                    {
                        label: 'Registered routes',
                        value: row => Array.isArray(row.routeNumbers) && row.routeNumbers.length
                            ? row.routeNumbers.join(', ')
                            : 'None'
                    }
                ],
                'Train not found.'
            );
            showMessage('Joined train information loaded.', 'success');
        } catch (error) {
            document.getElementById('trainDetails').innerHTML = '<p class="empty-state">No train details are available.</p>';
            showMessage(error.message, 'error');
        }
    });

    refreshTrainData();
})();
