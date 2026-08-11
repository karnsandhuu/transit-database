(() => {

    const messageElement =
        document.getElementById('passengerMessage');

    const passengerDetailsElement =
        document.getElementById('passengerDetails');

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
                message || 'The passenger request could not be completed.'
            );
        }
        return result;
    }

    function showMessage(text, type) {

        messageElement.textContent =
            text;

        messageElement.className =
            `message ${type}`;

        messageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    function requirePassengerId(value) {

        const normalized =
            value.trim().toUpperCase();

        const pattern =
            /^P\d{9}$/;


        if (!pattern.test(normalized)) {

            throw new Error(
                'Passenger ID must contain P followed by 9 digits.'
            );
        }
        return normalized;
    }

    const passengerAttributes = [
        {
            name: 'passengerId',
            label: 'Passenger ID',
            checkboxId: 'showPassengerId',
            orderId: 'orderPassengerId'
        },
        {
            name: 'firstName',
            label: 'First name',
            checkboxId: 'showFirstName',
            orderId: 'orderFirstName'
        },
        {
            name: 'lastName',
            label: 'Last name',
            checkboxId: 'showLastName',
            orderId: 'orderLastName'
        },
        {
            name: 'passengerCategory',
            label: 'Passenger category',
            checkboxId: 'showPassengerCategory',
            orderId: 'orderPassengerCategory'
        }
    ];

    function getSelectedAttributes() {

        const selected =
            passengerAttributes
                .filter(attribute =>
                    document
                        .getElementById(attribute.checkboxId)
                        .checked
                )
                .map(attribute => ({
                    ...attribute,

                    order: Number(
                        document
                            .getElementById(attribute.orderId)
                            .value
                    )
                }));


        if (!selected.length) {

            throw new Error('Please select at least one passenger attribute.');
        }

        const orders =
            selected.map(attribute =>
                attribute.order
            );

        if (
            new Set(orders).size !==
            orders.length
        ) {

            throw new Error('Each selected attribute must have a different display order.');
        }

        selected.sort(
            (first, second) =>
                first.order - second.order
        );
        return selected;
    }

    function renderPassenger(
        passenger,
        selectedAttributes) {
        const rows =
            selectedAttributes
                .map(attribute => `
                    <tr>
                        <th>
                            ${escapeHtml(attribute.label)}
                        </th>
                        <td>
                            ${escapeHtml(
                                passenger[attribute.name] ?? '-'
                            )}
                        </td>
                    </tr>
                `)
                .join('');

        passengerDetailsElement.innerHTML = `
            <div class="table-scroll">

                <table>

                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Information</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>

                </table>

            </div>
        `;
    }

    document
        .getElementById('createPassengerForm')
        .addEventListener(
            'submit',
            async event => {

                event.preventDefault();

                try {
                    const firstName =
                        document
                            .getElementById('createFirstName')
                            .value
                            .trim();
                    const lastName =
                        document
                            .getElementById('createLastName')
                            .value
                            .trim();
                    const passengerType =
                        document
                            .getElementById('createPassengerType')
                            .value;

                    if (!firstName || !lastName) {
                        throw new Error('Please enter both a first and last name.');
                    }

                    const result =
                        await request(
                            '/passengers',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type':
                                        'application/json'},
                                body: JSON.stringify({
                                    firstName,
                                    lastName,
                                    passengerType})
                            }
                        );

                    event.target.reset();
                    document
                        .getElementById('findPassengerId')
                        .value =
                            result.passengerId;

                    showMessage(
                        `Passenger created successfully. New passenger ID: ${result.passengerId}`,
                        'success'
                    );

                } catch (error) {
                    showMessage(
                        error.message,'error');
                }
            }
        );

    document
        .getElementById('findPassengerForm')
        .addEventListener(
            'submit',
            async event => {
                event.preventDefault();
                try {
                    const passengerId =
                        requirePassengerId(
                            document
                                .getElementById('findPassengerId')
                                .value
                        );
                    const selectedAttributes =
                        getSelectedAttributes();
                    const attributes =
                        selectedAttributes
                            .map(attribute =>
                                attribute.name)
                            .join(',');
                    const passenger =
                        await request(
                            `/passengers/${encodeURIComponent(passengerId)}?attributes=${encodeURIComponent(attributes)}`
                        );
                    renderPassenger(
                        passenger,
                        selectedAttributes
                    );

                    showMessage(
                        `Passenger ${passengerId} loaded successfully.`,
                        'success'
                    );

                } catch (error) {

                    passengerDetailsElement.innerHTML = `
                        <p class="empty-state">
                            Passenger information could not be loaded.
                        </p>
                    `;
                    showMessage(
                        error.message,'error');
                }
            }
        );

    document
        .getElementById('updatePassengerForm')
        .addEventListener(
            'submit',
            async event => {
                event.preventDefault();
                try {
                    const passengerId =
                        requirePassengerId(
                            document
                                .getElementById('updatePassengerId')
                                .value
                        );
                    const passengerType =
                        document
                            .getElementById('updatePassengerType')
                            .value;
                    const result =
                        await request(
                            `/passengers/${encodeURIComponent(passengerId)}/type`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },
                                body: JSON.stringify({
                                    passengerType})
                            }
                        );
                    if (!result.success) {

                        throw new Error('Passenger category could not be updated.');
                    }
                    event.target.reset();

                    showMessage(
                        `Passenger ${passengerId} was updated to ${passengerType}.`,
                        'success'
                    );

                } catch (error) {

                    showMessage(
                        error.message,'error');
                }
            }
        );

})();
