(() => {

    const messageElement =
        document.getElementById('routeMessage');
    const routeDetailsElement =
        document.getElementById('routeDetails');
    const routeSchedulesElement =
        document.getElementById('routeSchedules');
    const routeStopsElement =
        document.getElementById('routeStops');

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    async function request(url, options = {}) {
        const response =
            await fetch(url, options);
        const contentType =
            response.headers.get('content-type') || '';
        const result =
            contentType.includes('application/json')
                ? await response.json().catch(() => ({}))
                : await response.text();
        if (!response.ok) {
            const message =
                typeof result === 'object'
                    ? result.message
                    : result;
            throw new Error(
                message || 'Route data could not be loaded.');
        }
        return result;
    }

    function showMessage(text, type) {
        messageElement.textContent =
            text;
        messageElement.className =
            `message ${type}`;
    }

    function requireRouteNumber(value) {
        const routeNumber =
            Number(value);
        if (
            !Number.isInteger(routeNumber) ||
            routeNumber <= 0
        ) {
            throw new Error('Route number must be a positive whole number.');
        }
        return routeNumber;
    }

    function renderRoute(route) {
        routeDetailsElement.innerHTML = `
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
                            <th>Route ID</th>
                            <td>
                                ${escapeHtml(route.routeId)}
                            </td>
                        </tr>

                        <tr>
                            <th>Route number</th>
                            <td>
                                ${escapeHtml(route.routeNumber)}
                            </td>
                        </tr>

                        <tr>
                            <th>Route name</th>
                            <td>
                                ${escapeHtml(route.routeName)}
                            </td>
                        </tr>

                        <tr>
                            <th>Description</th>
                            <td>
                                ${escapeHtml(route.routeDescription || '-')}
                            </td>
                        </tr>

                        <tr>
                            <th>Colour</th>
                            <td>
                                ${escapeHtml(route.colour || '-')}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderSchedules(schedules) {
        if (!schedules.length) {
            routeSchedulesElement.innerHTML = `
                <p class="empty-state">
                    This route has no schedules.
                </p>
            `;
            return;
        }

        const rows =
            schedules.map(schedule => `
                <tr>
                    <td>${escapeHtml(schedule.startTime)}</td>
                    <td>${escapeHtml(schedule.endTime)}</td>
                    <td>${escapeHtml(schedule.dayType)}</td>
                    <td>${escapeHtml(schedule.frequency)}</td>
                </tr>
            `).join('');

        routeSchedulesElement.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Start time</th>
                            <th>End time</th>
                            <th>Day type</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderStops(stops) {

        if (!stops.length) {
            routeStopsElement.innerHTML = `
                <p class="empty-state">
                    This route has no stops.
                </p>
            `;
            return;
        }

        const rows =
            stops.map(stop => `
                <tr>
                    <td>${escapeHtml(stop.stopNumber)}</td>
                    <td>${escapeHtml(stop.stationId)}</td>
                    <td>${escapeHtml(stop.stationName)}</td>
                </tr>
            `).join('');

        routeStopsElement.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Stop number</th>
                            <th>Station ID</th>
                            <th>Station name</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    function showEmptyResults() {
        routeDetailsElement.innerHTML = `
            <p class="empty-state">
                Route information could not be loaded.
            </p>
        `;
        routeSchedulesElement.innerHTML = `
            <p class="empty-state">
                No schedules to display.
            </p>
        `;
        routeStopsElement.innerHTML = `
            <p class="empty-state">
                No stops to display.
            </p>
        `;
    }

    document
        .getElementById('findRouteForm')
        .addEventListener(
            'submit',
            async event => {
                event.preventDefault();
                try {
                    const routeNumber =
                        requireRouteNumber(
                            document
                                .getElementById('findRouteNumber')
                                .value
                        );

                    showMessage(
                        'Loading route information...',
                        'info'
                    );

                    const route =
                        await request(
                            `/route/${encodeURIComponent(routeNumber)}`
                        );

                    const [
                        schedules,
                        stops
                    ] = await Promise.all([
                        request(
                            `/route/${encodeURIComponent(routeNumber)}/schedules`),
                        request(
                            `/route/${encodeURIComponent(routeNumber)}/stops`)
                    ]);
                    renderRoute(route);

                    renderSchedules(
                        Array.isArray(schedules)
                            ? schedules
                            : []
                    );
                    renderStops(
                        Array.isArray(stops)
                            ? stops
                            : []
                    );
                    showMessage(
                        `Route ${routeNumber} loaded successfully.`,
                        'success'
                    );
                } catch (error) {
                    console.error(
                        'Error loading route:',
                        error);
                    showEmptyResults();

                    showMessage(
                        error.message,'error');
                }
            }
        );

})();
