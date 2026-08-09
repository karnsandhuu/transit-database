# Frontend Structure

## Overview

The frontend is organized as a single-page application structure. The main `index.html` file provides the shared application layout, while individual features are separated into their own HTML and JavaScript files.

This structure allows multiple group members to work on different features without needing to modify the same large HTML or JavaScript file.

The frontend is organized as follows:

```text
public/
│
├── index.html
│
├── loading_100px.gif
│
├── pages/
│   ├── demotable.html
│   ├── passenger.html
│   ├── pass.html
│   ├── gate.html
│   ├── train.html
│   └── statistics.html
│
├── scripts/
│   ├── main.js
│   ├── demotable.js
│   ├── passenger.js
│   ├── pass.js
│   ├── gate.js
│   ├── train.js
│   └── statistics.js
│
└── styles/
    └── main.css
```

---

# `index.html`

`index.html` is the main application shell.

It contains functionality and UI elements that are shared across the entire application rather than belonging to a specific feature.

### Responsibilities

- Display the application title.
- Display the database connection status.
- Display the navigation bar.
- Provide the main container where feature pages are displayed.
- Load the shared `main.js` file.
- Load the shared stylesheet.

The main content area is:

```html
<main id="page-content"></main>
```

Individual feature pages are loaded into this container.

### Database Connection Status

The database connection status remains in `index.html` because it applies to the entire application.

```html
<h1>
    Database Connection Status:
    <span id="dbStatus"></span>

    <img
        id="loadingGif"
        class="loading-gif"
        src="/loading_100px.gif"
        alt="Loading..."
    >
</h1>
```

The status is updated by the database connection checking function in `main.js`.

---

# `pages/`

The `pages/` directory contains the HTML for individual application features.

Each feature has its own HTML file.

For example:

```text
pages/
├── passenger.html
├── pass.html
├── gate.html
├── train.html
└── statistics.html
```

Each file contains only the UI elements belonging to that feature.

### Example

`passenger.html` contains the passenger-related interface, such as:

- Creating a passenger.
- Searching for a passenger.
- Updating passenger information.
- Displaying passenger information.

Similarly, `statistics.html` contains the interface for executing the project's statistical queries.

The feature HTML files do not contain the overall navigation bar or database connection status because these are provided by `index.html`.

---

# `scripts/`

The `scripts/` directory contains the JavaScript functionality for the application.

## `main.js`

`main.js` contains functionality shared by the entire application.

Its responsibilities include:

- Checking the database connection.
- Loading feature pages.
- Switching between pages.
- Loading the JavaScript associated with the selected page.

For example, the page loader uses a mapping such as:

```javascript
const pageScripts = {
    passenger: '/scripts/passenger.js',
    pass: '/scripts/pass.js',
    gate: '/scripts/gate.js',
    train: '/scripts/train.js',
    statistics: '/scripts/statistics.js'
};
```

When the user selects a feature from the navigation bar, `main.js` loads the corresponding HTML and JavaScript.

---

## Feature JavaScript Files

Each feature has its own JavaScript file.

### `passenger.js`

Handles frontend functionality related to passengers.

Examples include:

- Sending passenger creation requests.
- Retrieving passengers.
- Updating passenger categories.
- Displaying passenger information.

### `pass.js`

Handles frontend functionality related to passes.

Examples include:

- Purchasing passes.
- Retrieving a passenger's passes.
- Topping up timed passes.
- Deleting passes.

### `gate.js`

Handles frontend functionality related to gates.

Examples include:

- Retrieving gates at a station.
- Entering through a gate.
- Exiting through a gate.

### `train.js`

Handles frontend functionality related to train services.

Examples include:

- Adding train models.
- Adding subway trains.
- Searching for trains.
- Registering trains on routes.

### `statistics.js`

Handles frontend functionality for the project's statistical queries.

Examples include:

- Average spending by passenger category.
- Gates with more than 100 events.
- Stations served by more than the average number of routes.
- Passengers with all pass types.

---

# `demotable.html` and `demotable.js`

The original DemoTable provided by the project template has been separated from the main application.

`demotable.html` contains the DemoTable UI, while `demotable.js` contains its JavaScript functionality.

These files are kept primarily as the original project demonstration and can be removed or retained depending on the project's final requirements.

---

# `styles/`

The `styles/` directory contains the application's shared CSS.

Currently, the application uses:

```text
styles/
└── main.css
```

The shared stylesheet defines the common appearance of all application pages.

This includes:

- Navigation
- Buttons
- Forms
- Tables
- Headings
- Input fields
- Spacing
- Error messages
- Success messages
- Page layout

All feature pages use the same stylesheet to maintain a consistent appearance throughout the application.

Feature-specific CSS files can be added later if a particular page requires unique styling.

---

# Page Loading

The application uses `index.html` as a shared shell.

When the user selects a page from the navigation bar, `main.js` loads the corresponding HTML file into:

```html
<main id="page-content"></main>
```

For example, selecting **Passengers** loads:

```text
pages/passenger.html
```

and its functionality is provided by:

```text
scripts/passenger.js
```

The resulting structure is conceptually:

```text
index.html
│
├── Header
│   └── Database Connection Status
│
├── Navigation
│
└── page-content
    │
    └── passenger.html
        │
        └── passenger.js
```

If the user switches to Statistics:

```text
index.html
│
├── Header
│   └── Database Connection Status
│
├── Navigation
│
└── page-content
    │
    └── statistics.html
        │
        └── statistics.js
```

The application therefore behaves as a single webpage while keeping each feature's code separated.

---

# Development and Version Control

The frontend structure is designed to support collaborative development.

Group members can primarily work on separate feature files instead of modifying a single large `index.html` or `scripts.js`.

For example:

| Feature | HTML | JavaScript |
|---|---|---|
| Passenger | `passenger.html` | `passenger.js` |
| Pass | `pass.html` | `pass.js` |
| Gate | `gate.html` | `gate.js` |
| Train | `train.html` | `train.js` |
| Statistics | `statistics.html` | `statistics.js` |

The shared files should be modified less frequently:

```text
index.html
main.js
main.css
```

This reduces the likelihood of Git merge conflicts when multiple group members work simultaneously.

---

# Design Principles

The frontend follows several basic design principles:

### Separation of Concerns

HTML defines the page structure, JavaScript handles functionality, and CSS controls presentation.

```text
HTML → Structure
CSS  → Appearance
JS   → Behaviour
```

### Shared Application Shell

Common elements such as navigation and database status are kept in `index.html`.

### Feature Separation

Each major application feature has its own HTML and JavaScript files.

### Consistent Styling

All pages use the shared `main.css` stylesheet to maintain a consistent user interface.

### Collaborative Development

Feature-specific files allow group members to work independently while minimizing conflicts in shared files.