(() => {
    const messageElement = document.getElementById('passMessage');
    const passesTableElement = document.getElementById('passesTable');
    let displayedPassengerId = '';

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
            throw new Error(message || 'The request could not be completed.');
        }

        return result;
    }

    function showMessage(text, type) {
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function requireIdentifier(value, prefix, label) {
        const normalized = value.trim().toUpperCase();
        const pattern = new RegExp(`^${prefix}\\d{9}$`);

        if (!pattern.test(normalized)) {
            throw new Error(`${label} must contain ${prefix} followed by 9 digits.`);
        }

        return normalized;
    }

    function formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return '-';
        }
        return value;
    }

    function formatDate(value) {
        if (!value) {
            return '-';
        }

        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
    }

    function renderPasses(passes) {
        if (!passes.length) {
            passesTableElement.innerHTML = '<p class="empty-state">No passes were found for this passenger.</p>';
            return;
        }

        const rows = passes.map(pass => `
            <tr>
                <td>${escapeHtml(pass.ticketId)}</td>
                <td>${escapeHtml(pass.passType)}</td>
                <td>${escapeHtml(pass.timedPassType || '-')}</td>
                <td>${escapeHtml(formatValue(pass.numberOfValidZones))}</td>
                <td>$${escapeHtml(Number(pass.amountPaid).toFixed(2))}</td>
                <td>${escapeHtml(pass.travellingStatus)}</td>
                <td>${escapeHtml(formatDate(pass.purchaseTime))}</td>
                <td>${escapeHtml(formatDate(pass.endTime))}</td>
                <td>
                    <button class="danger-button compact-button" type="button" data-delete-ticket="${escapeHtml(pass.ticketId)}">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');

        passesTableElement.innerHTML = `
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Valid zones</th>
                            <th>Amount paid</th>
                            <th>Status</th>
                            <th>Purchased</th>
                            <th>Expires</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    async function loadPasses(passengerId) {
        const passes = await request(
            `/passengers/${encodeURIComponent(passengerId)}/passes`
        );
        displayedPassengerId = passengerId;
        renderPasses(Array.isArray(passes) ? passes : []);
    }

    function updatePurchaseFields() {
        const passType = document.getElementById('purchasePassType').value;
        const validZonesField = document.getElementById('validZonesField');
        const timedPassTypeField = document.getElementById('timedPassTypeField');
        const validZonesInput = document.getElementById('numberOfValidZones');
        const timedPassTypeInput = document.getElementById('timedPassType');

        const isZone = passType === 'Zone';
        validZonesField.hidden = !isZone;
        timedPassTypeField.hidden = isZone;
        validZonesInput.required = isZone;
        timedPassTypeInput.required = !isZone;
    }

    document.getElementById('purchasePassType').addEventListener('change', updatePurchaseFields);

    document.getElementById('purchasePassForm').addEventListener('submit', async event => {
        event.preventDefault();

        try {
            const passengerId = requireIdentifier(
                document.getElementById('purchasePassengerId').value,
                'P',
                'Passenger ID'
            );
            const passType = document.getElementById('purchasePassType').value;
            const payload = {
                passType,
                amountPaid: Number(document.getElementById('purchaseAmount').value),
                numberOfValidZones: passType === 'Zone'
                    ? Number(document.getElementById('numberOfValidZones').value)
                    : null,
                timedPassType: passType === 'Timed'
                    ? document.getElementById('timedPassType').value
                    : null
            };

            if (payload.amountPaid <= 0) {
                throw new Error('Amount paid must be greater than zero.');
            }
            if (passType === 'Zone' && !Number.isInteger(payload.numberOfValidZones)) {
                throw new Error('Number of valid zones must be a positive integer.');
            }

            const result = await request(
                `/passengers/${encodeURIComponent(passengerId)}/passes`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );

            document.getElementById('findPassesPassengerId').value = passengerId;
            await loadPasses(passengerId);
            event.target.reset();
            updatePurchaseFields();
            showMessage(
                `Pass purchased successfully. New ticket ID: ${result.ticketId}`,
                'success'
            );
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('topUpPassForm').addEventListener('submit', async event => {
        event.preventDefault();

        try {
            const ticketId = requireIdentifier(
                document.getElementById('topUpTicketId').value,
                'T',
                'Ticket ID'
            );
            const amountPaid = Number(document.getElementById('topUpAmount').value);
            const passType = document.getElementById('topUpPassType').value;

            if (amountPaid <= 0) {
                throw new Error('Additional amount must be greater than zero.');
            }

            await request(`/passes/${encodeURIComponent(ticketId)}/top-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amountPaid, passType })
            });

            if (displayedPassengerId) {
                await loadPasses(displayedPassengerId);
            }
            event.target.reset();
            showMessage(`Timed pass ${ticketId} was topped up successfully.`, 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    document.getElementById('findPassesForm').addEventListener('submit', async event => {
        event.preventDefault();

        try {
            const passengerId = requireIdentifier(
                document.getElementById('findPassesPassengerId').value,
                'P',
                'Passenger ID'
            );
            await loadPasses(passengerId);
            showMessage(`Passes loaded for ${passengerId}.`, 'success');
        } catch (error) {
            passesTableElement.innerHTML = '<p class="empty-state">Passes could not be loaded.</p>';
            showMessage(error.message, 'error');
        }
    });

    passesTableElement.addEventListener('click', async event => {
        const button = event.target.closest('[data-delete-ticket]');
        if (!button || !displayedPassengerId) {
            return;
        }

        const ticketId = button.dataset.deleteTicket;
        const confirmed = window.confirm(
            `Delete pass ${ticketId} belonging to ${displayedPassengerId}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await request(
                `/passengers/${encodeURIComponent(displayedPassengerId)}/passes/${encodeURIComponent(ticketId)}`,
                { method: 'DELETE' }
            );
            await loadPasses(displayedPassengerId);
            showMessage(`Pass ${ticketId} was deleted.`, 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    updatePurchaseFields();
})();
