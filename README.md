# `api` #

## Task-Board ##

- [ ] Establish a Refresh Schema
    - [User Guide & Reference(s)](https://www.bezkoder.com/jwt-refresh-token-node-js-mongodb/)

## Setup ##

1. Create a `.env` File
    - *Example*: [`.env.example`](./.env.example)
2. Install Dependencies:
    ```bash
    npm install
    ```
3. Link System Executable (Optional):
    ```bash
    npm link
    ```

## Usage ##

A few different options exist to get the server up and running.

### Development ###

**NPM**:

```bash
npm run development
```

**Executable**:

```bash
api-ts-dev
```

### Production ###

**NPM**

```bash
npm run start
```

**Executable**:

```bash
api-ts
```

---

## References ##

- https://express-validator.github.io/docs/index.html
- https://www.bezkoder.com/node-js-mongodb-auth-jwt/
- https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
- https://www.bezkoder.com/jwt-refresh-token-node-js-mongodb/

- `node-pty`
- `mongodb`
- `mongoose`
- `winston`
- `express-ws`
- `ocktokit`
- `body-parser`
- `chalk`
- `@types/body-parser`
- `@types/ws`
- `@types/express-ws`
- `bcrypt`
- `bcryptjs`
- `@types/bcrypt`
- `@types/bcryptjs`
- `ts-node-dev`
- `tsc-watch`

---

## Logging ##

Runtime Categories

- `Validation`
- `Configuration`
- `Initialization`
- `Runtime`
- `Termination`