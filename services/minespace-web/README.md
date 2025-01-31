# MineSpace

The project uses a [Node.js (v14)](https://nodejs.org/en/) runtime environment and [React.js](https://reactjs.org/) library for the frontend.

## Module and Library dependencies

The application requires a whole suite of npm modules for building/testing/running the application. All the required modules can be found under package.json file.

### Building

- [webpack](https://webpack.js.org/) : Project building and asset compilation.
- [babel](https://babeljs.io/) : Adds support for older browsers
- [sass](https://sass-lang.com/guide) : Clean CSS files

### Testing

- [jest](https://jestjs.io/) : Mocking and writing tests
- [enzyme](https://github.com/airbnb/enzyme) : Assert, manipulate and traverse react components

Contributors to this codebase are expected to follow the testing standards set out and determined by the team.

**Which includes:**

- Maintaining 80% coverage throughout the frontend

**Create new test suites for:**

- New Components
- New ActionCreators
- New reducers switch statements
- New selectors
- Every new function stored under `/utils/**`

_If coverage is lower than before writing a new feature, the tests **need** to be updated, and the feature is considered **incomplete**_

**Setup Cypress test**
Add the following cypress related environment variables from env-example.

CYPRESS_TEST_USER
CYPRESS_TEST_PASSWORD
CYPRESS_MINESPACE_WEB_TEST_URL
CYPRESS_BACKEND
CYPRESS_API_URL
CYPRESS_KEYCLOAK_URL
CYPRESS_ENVIRONMENT
CYPRESS_DOC_MAN_URL
CYPRESS_MATOMO_URL
CYPRESS_KEYCLOAK_CLIENT_ID
CYPRESS_KEYCLOAK_RESOURCE
CYPRESS_KEYCLOAK_IDP_HINT
CYPRESS_FILE_SYSTEM_PROVIDER_URL

run the command `docker-compose up -d keycloak`

Navigate to `http://localhost:8080` to check if keycloak was successfully installed.

**Run Cypress test**
To run your cypress tests with a browser, type the command `yarn run cypress open`.
To run your cypress tests in headless mode, type the command `yarn cypress run`.

### Running

- [react](https://reactjs.org/) : JS library to build single page apps
- [redux](https://github.com/reduxjs/react-redux) : State management
- [prop-types](https://www.npmjs.com/package/prop-types) : Runtime object type check
- [axios](https://github.com/axios/axios) : Library to manage network calls

## Directory/Naming convention

The SASS/CSS files naming convention is based off of [BEM](http://getbem.com/introduction/) and [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/).

The application is structured as follows:

```
|-- public
    |-- Assets that are accessible by everyone on the internet.

|-- src (Source code of the application)
    |-- actionsCreators (Axios calls for retrieving data from an external source)
    |-- actions (JSON objects that are dispatched to the redux store)
    |-- assets (Static images, icons, fonts etc)
    |-- components (React components for the application)
    |-- constants (Global constants i.e. URLs, Keys etc.)
    |-- HOC (Higher order React components to be re-used)
    |-- reducers (Redux functions for handling data sets)
    |-- routes (React page routes)
    |-- selectors (Functions to retrieve data from the redux store)
    |-- store (Redux store with required middleware configurations)
    |-- styles (SCSS files for styling)
    |-- tests (Unit/Integration tests)
    |-- utils (Commonly used helper functions)
```

## Pre-requisites and Installation

The application assumes you already have a working python backend running.

Follow the `.env-example` template to create an `.env` file with valid values before running the application.

A. OS Level Installation

- [Node.js 14](https://nodejs.org/en/download/)

1. Install package dependencies

```
yarn
```

2. Run the application from the `services/minespace-web` directory

```
yarn serve
```

## Authentication

This application requires a test BCeID in order to login and contribute locally.

NOTE: MineSpace is using the same Keycloak client as CORE, thus if the user is currently authenticated through CORE with an IDIR, the session will persist on MineSpace.

This is a known issue, knowing that Ministry staff will not be interacting with MineSpace and Proponents will not be interacting with CORE, it has been de-prioritized as it only affects the Dev team.

To avoid having permission issues:

- Do not have test CORE and test MineSpace authenticated on the same browser
- Open MineSpace in an incognito window, or clear the browser cashe.

## Code Contribution Standards

Contributors to this codebase are expected to follow the formatting and style
standards, as enforced by the Prettier and ESLint rules.

The linting rules are built on the Airbnb configuration. Contributors should
ensure that they are not introducing linting errors into the codebase with
their changes. Modern text editors, such as VS Code, will indicate errors.
See the usage guide below for more information on the linting CLI options.

Lint all files

```
npm run lint
```

Lint one file

```
npm run lint:file ./filepath
```

Apply linting rules to all files

```
npm run lint -- --fix
```

Apply linting rules to one file

```
npm run lint:file ./filepath -- --fix
```

Developers are encouraged to install the Prettier plugin appropriate for their
editor. This ensures that all committed code is properly formatted. VS Code is
commonly used by MDS contributors, so it will be used as an example for setting
up formatting on-save:

1. Install the VS Code Prettier [plugin](https://github.com/prettier/prettier-vscode)
2. Set `"editor.formatOnSave": true` in your editor config
3. Ensure that no conflicting code formatting tools are enabled (ex. Beautify)

Any developer who is unable or unwilling to apply the formatting on-save is
asked to either use the provided npm scripts to format their code before each
commit or to ensure that the git hooks are running. The provided git hooks will
automatically lint and format on-commit. They will also run the relevant tests
on-push.

See the usage guide below for more information on manual formatting.

Check one file

```
npm run format:check ./filepath
```

Check all files matching a pattern

```
npm run format:check ./*.json
```

Format one file

```
npm run format:write ./filepath
```

Format all files matching a pattern

```
npm run format:write ./*.json
```

Check all files

```
npm run format:check-all
```

Format all files

```
npm run format:write-all
```
