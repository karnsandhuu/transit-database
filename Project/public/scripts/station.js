(() => {
    const messageElement = document.getElementById('stationMessage');

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
            ? await response.json().catch(() => ([]))
            : await response.text();

        if (!response.ok) {
            const message = typeof result === 'object'
                ? result.message
                : result;
            throw new Error(message || 'Station data could not be loaded.');
        }

        return result;
    }

    function showMessage(text, type) {
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }

    function renderZones(zones) {
        const container = document.getElementById('zonesTable');

        if (!zones.length) {
            container.innerHTML = '<p class="empty-state">No zones are available.</p>';
            return;
        }

        const rows = zones.map(zone => `
            <tr>
                <td>${escapeHtml(zone.zoneNumber)}</td>
                <td>${escapeHtml(zone.zoneName)}</td>
                <td>${escapeHtml(zone.colour || '-')}</td>
                <td>${escapeHtml(zone.zoneDescription || '-')}</td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Zone number</th>
                            <th>Zone name</th>
                            <th>Colour</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    function renderStations(stations) {
        const container = document.getElementById('stationsTable');

        if (!stations.length) {
            container.innerHTML = '<p class="empty-state">No stations match this selection.</p>';
            return;
        }

        const rows = stations.map(station => `
            <tr>
                <td>${escapeHtml(station.stationId)}</td>
                <td>${escapeHtml(station.stationName)}</td>
                <td>${escapeHtml(station.zoneNumber)}</td>
                <td>${escapeHtml(station.address)}</td>
                <td>${station.wheelchairAccessibility === 'Y' ? 'Yes' : 'No'}</td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Station ID</th>
                            <th>Station name</th>
                            <th>Zone</th>
                            <th>Address</th>
                            <th>Wheelchair accessible</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    function populateZoneFilter(zones) {
        const filter = document.getElementById('stationZoneFilter');
        const stationZoneSelect = document.getElementById('newStationZoneNumber');
        const currentValue = filter.value;
        const currentStationZone = stationZoneSelect.value;
        filter.innerHTML = '<option value="">All zones</option>';
        stationZoneSelect.innerHTML = '';

        if (!zones.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Create a zone first';
            stationZoneSelect.appendChild(option);
            stationZoneSelect.disabled = true;
            return;
        }

        stationZoneSelect.disabled = false;

        zones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone.zoneNumber;
            option.textContent = `${zone.zoneNumber} - ${zone.zoneName}`;
            filter.appendChild(option);

            const stationOption = option.cloneNode(true);
            stationZoneSelect.appendChild(stationOption);
        });

        if ([...filter.options].some(option => option.value === currentValue)) {
            filter.value = currentValue;
        }
        if ([...stationZoneSelect.options].some(option => option.value === currentStationZone)) {
            stationZoneSelect.value = currentStationZone;
        }
    }

    async function loadZones() {
        const result = await request('/zones');
        const zones = Array.isArray(result) ? result : [];
        renderZones(zones);
        populateZoneFilter(zones);
    }

    async function loadStations(zoneNumber = '') {
        const url = zoneNumber
            ? `/zones/${encodeURIComponent(zoneNumber)}/stations`
            : '/stations';
        const result = await request(url);
        renderStations(Array.isArray(result) ? result : []);
    }

    async function refreshAll() {
        try {
            const selectedZone = document.getElementById('stationZoneFilter').value;
            await Promise.all([loadZones(), loadStations(selectedZone)]);
            showMessage('Zone and station data loaded.', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    }

    document.getElementById('stationZoneFilter').addEventListener('change', async event => {
        try {
            await loadStations(event.target.value);
            const label = event.target.value
                ? `zone ${event.target.value}`
                : 'all zones';
            showMessage(`Showing stations from ${label}.`, 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('createZoneForm').addEventListener('submit', async event => {
        event.preventDefault();

        const payload = {
            zoneNumber: Number(document.getElementById('newZoneNumber').value),
            zoneName: document.getElementById('newZoneName').value.trim(),
            colour: document.getElementById('newZoneColour').value.trim() || null,
            zoneDescription: document.getElementById('newZoneDescription').value.trim() || null
        };

        if (!Number.isInteger(payload.zoneNumber) || payload.zoneNumber <= 0) {
            showMessage('Zone number must be a positive whole number.', 'error');
            return;
        }

        try {
            const result = await request('/zones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            event.target.reset();
            await loadZones();
            showMessage(
                result.message || `Zone ${payload.zoneNumber} was created.`,
                'success'
            );
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('createStationForm').addEventListener('submit', async event => {
        event.preventDefault();

        const payload = {
            zoneNumber: Number(document.getElementById('newStationZoneNumber').value),
            stationName: document.getElementById('newStationName').value.trim(),
            address: document.getElementById('newStationAddress').value.trim(),
            wheelchairAccessibility: document.getElementById('newStationAccessibility').value
        };

        if (!Number.isInteger(payload.zoneNumber) || !payload.stationName || !payload.address) {
            showMessage('Choose a zone and enter both the station name and address.', 'error');
            return;
        }

        try {
            const result = await request('/stations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            event.target.reset();
            await loadStations(document.getElementById('stationZoneFilter').value);
            showMessage(
                result.message || `Station created with ID ${result.stationId}.`,
                'success'
            );
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('refreshStationDataButton').addEventListener('click', refreshAll);

    refreshAll();
})();
