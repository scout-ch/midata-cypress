# MiData Cypress
[![Cypress Dashboard](https://img.shields.io/badge/cypress-dashboard-brightgreen.svg)](https://dashboard.cypress.io/#/projects/hd1whh/runs)[![E2E tests](https://github.com/scout-ch/midata-cypress/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/scout-ch/midata-cypress/actions/workflows/e2e-tests.yml)

> :warning: This project relies heavily on https://github.com/hitobito/development, so you might start there and get it working before checking out this repo.

## Quickstart

```bash
git clone https://github.com/scout-ch/midata-cypress.git
cd midata-cypress
git clone https://github.com/hitobito/development.git
cd development/app
git clone https://github.com/hitobito/hitobito.git
git clone https://github.com/hitobito/hitobito_youth.git
git clone https://github.com/hitobito/hitobito_pbs.git
cd ../..
docker-compose pull
docker volume create hitobito_bundle
docker volume create hitobito_yarn_cache
docker-compose run --rm cypress
# edit tests and continue…
# when finished:
docker-compose down
```

Generally check the docs:
 - [CypressOnRails](https://github.com/shakacode/cypress-on-rails#cypressonrails)
 - [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)

### Run tests in Docker

```bash
docker-compose run --rm cypress
# edit tests and continue…
# when finished:
docker-compose down
```

If you want to run the tests against a running dev server:

```bash
docker-compose run --rm --no-deps -e CYPRESS_BASE_URL=http://rails:3000 cypress
```

_Note: You can only connect to servers running inside docker-compose. If you need to connect to servers outside (aka you only wan't to run cypress in docker), check [here](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)._

### Using GUI
 1. `docker-compose up -d rails worker`
 2. Install [yarn](https://yarnpkg.com/en/docs/install)
 4. Install the testing dependencies (might take a while): `yarn install --frozen-lockfile`
 5. `yarn run ci:wait && yarn run cypress:open`
 6. Start adding tests, they get rerun automatically when open!

### Using GUI in Docker

#### Linux
 1. Run `xhost local:root` to allow the root user from the Docker container to send messages to the X server
 2. `docker-compose run cypress-gui` This will run hitobito with Cypress (if it is not already running), wait for the seeding to finish and then open the Cypress GUI.

#### Mac

_It is probably easier, faster and cleaner to use cypress directly (check above)._

 1. Install the XQuartz X11 server (`brew cask install xquartz`) and restart your machine
 2. Open XQuartz, go to settings and "Allow connections from network clients" (further reference [here](https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/#run-xquartz)) 
 3. In the project directory, run `IP=$(ipconfig getifaddr en0)`. (You might want to adjust the  `en0` to your network interface of choice…)
 4. Run `xhost + $IP` to allow the Docker container to send messages to the X server
 5. Run `DISPLAY=$IP:0 docker-compose run cypress-gui`

 #### Windows

 _ Not yet tested_

https://dev.to/darksmile92/run-gui-app-in-linux-docker-container-on-windows-host-4kde

When you have set everything up, you should be able to start the same as on the mac…
 
 ## Options

 ### Different port/base url

 If you don't want to run the test server on port 3000 or on another host you can either edit the baseURL in `.docker/cypress/spec/cypress.json` or set an env var before starting: `export CYPRESS_BASE_URL=http://localhost:8080`