(() => {
    const messageElement =
        document.getElementById('gateMessage');

    const gatesTableElement =
        document.getElementById('gatesTable');

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

            throw new Error(message || 'The gate request could not be completed.');
        }

        return result;
    }

    function showMessage(text, type) {
        messageElement.textContent = text;

        messageElement.className =
            `message ${type}`;

        messageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    function requireIdentifier(value, prefix, label) {
        const normalized =
            value.trim().toUpperCase();

        const pattern =
            new RegExp(`^${prefix}\\d{9}$`);

        if (!pattern.test(normalized)) {
            throw new Error(`${label} must contain ${prefix} followed by 9 digits.`);
        }

        return normalized;
    }


    function renderGates(gates) {
        if (!gates.length) {
            gatesTableElement.innerHTML = `
                <p class="empty-state">
                    No gates were found for this station.
                </p>
            `;

            return;
        }

        const rows =
            gates.map(gate => `
                <tr>
                    <td>${escapeHtml(gate.gateId)}</td>
                    <td>${escapeHtml(gate.stationId)}</td>
                    <td>${escapeHtml(gate.activationStatus)}</td>
                    <td>${escapeHtml(gate.enterOrExit)}</td>
                    <td>${escapeHtml(gate.totalEnterExitCount)}</td>
                </tr>
            `).join('');

        gatesTableElement.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Gate ID</th>
                            <th>Station ID</th>
                            <th>Activation Status</th>
                            <th>Gate Type</th>
                            <th>Total Uses</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows} </tbody>
                </table>
            </div>
        `;
    }

    async function loadGates(stationId) {
        const gates =
            await request(
                `/stations/${encodeURIComponent(stationId)}/gates`
            );

        renderGates(
            Array.isArray(gates)
                ? gates
                : []
        );
    }
    document
        .getElementById('findGatesForm')
        .addEventListener(
            'submit',
            async event => {
                event.preventDefault();

                try {
                    const stationId =
                        requireIdentifier(
                            document
                                .getElementById('findGatesStationId')
                                .value,
                            'S',
                            'Station ID'
                        );

                    await loadGates(stationId);

                    showMessage(
                        `Gates loaded for station ${stationId}.`,
                        'success'
                    );

                } catch (error) {
                    gatesTableElement.innerHTML = `
                        <p class="empty-state">
                            Gates could not be loaded.
                        </p>
                    `;

                    showMessage(
                        error.message,
                        'error'
                    );
                }
            }
        );


    document
        .getElementById('enterGateForm')
        .addEventListener(
            'submit',
            async event => {
                event.preventDefault();

                try {
                    const gateId =
                        requireIdentifier(
                            document
                                .getElementById('enterGateId')
                                .value,
                            'G',
                            'Gate ID'
                        );

                    const ticketId =
                        requireIdentifier(
                            document
                                .getElementById('enterTicketId')
                                .value,
                            'T',
                            'Ticket ID'
                        );


                    const result =
                        await request(
                            `/gates/${encodeURIComponent(gateId)}/enter`,
                            {
                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify({
                                    ticketId
                                })
                            }
                        );


                    if (!result.success) {
                        throw new Error('Entry was denied.');
                    }
                    event.target.reset();

                    showMessage(
                        `Ticket ${ticketId} entered successfully through gate ${gateId}.`,
                        'success'
                    );

                } catch (error) {
                    showMessage(
                        error.message,
                        'error'
                    );
                }
            }
        );

    document
        .getElementById('exitGateForm')
        .addEventListener(
            'submit',
            async event => {
                event.preventDefault();

                try {
                    const gateId =
                        requireIdentifier(
                            document
                                .getElementById('exitGateId')
                                .value,
                            'G',
                            'Gate ID'
                        );

                    const ticketId =
                        requireIdentifier(
                            document
                                .getElementById('exitTicketId')
                                .value,
                            'T',
                            'Ticket ID'
                        );

                    const result =
                        await request(
                            `/gates/${encodeURIComponent(gateId)}/exit`,
                            {
                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },
                                body: JSON.stringify({
                                    ticketId
                                })
                            }
                        );

                    if (!result.success) {
                        throw new Error(
                            'Exit was denied.'
                        );
                    }

                    event.target.reset();

                    showMessage(
                        `Ticket ${ticketId} exited successfully through gate ${gateId}.`,
                        'success'
                    );
                } catch (error) {
                    showMessage(
                        error.message,
                        'error'
                    );
                }
            }
        );

})();
