# COMP-4001 Assignment 4 Banking App

Sharef Islam's Docker deployment assignment at RRC Polytech. Adapted from
https://github.com/Feranmi-A/BankingApp
(upstream commit b4e82d7cace7c9eeafa1d55c828d1afc42de202a).

This starter is Node.js/Express with SQLite, bcrypt, and express-session.
The workbook's Python/Flask example is a separate example, not this starter.

## Container

The multi-stage Dockerfile installs locked production dependencies in a build
stage and runs Node.js 22 as the non-root node user in the runtime stage.
The application listens on port 5090. Its SQLite file is created at runtime
in the writable /app directory and is excluded from Git and the build context.
Runtime data is in the container writable layer; this classroom assignment
does not claim database durability across container replacement.

```sh
docker build -t bankingapp .
docker run -d --name bankingapp --network prf-network -p 5090:5090 bankingapp
```

Open http://192.168.56.53:5090 for manual deployment or
http://192.168.56.58:5090 for automated deployment.
Register a synthetic test account, then log in. Registration no longer displays
banking controls before a login session exists. Logout is connected to the
existing server route. The starter's stylesheet path has been corrected.

The session key comes from SESSION_SECRET if provided; otherwise a random
process-local key is generated and sessions expire on an application restart.
No secret or test database belongs in the repository.

The Sprint 1B welcome heading adds Auto Deploy. Compose supplies the shared
prf-network and waits for the image HTTP health checks to pass.

This is a classroom prototype, not a production banking system. Use synthetic
accounts and balances only. Persistence, HTTPS, input hardening, and production
session storage require a separate design.

## Submitted versions

The main branch and sprint-1b-auto tag contain the automated version.
The sprint-1a-manual tag preserves the manually tested source at 192.168.56.53.

