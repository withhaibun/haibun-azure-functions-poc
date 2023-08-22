# haibun-azure-functions-mqtt-poc
proof of concept for using azure functions and mqtt for generalized task distribution

Variables are sourced from env.sh and start with CF_.

# Documentation

https://dev.to/wolksoftware/getting-started-with-azure-functions-v4-nodejs-typescript-439e

# Run locally

Clone the repo, `npm i`. Then, in separate terminal windows:

* `npm run start-testserver` to start the local test http server
* `npm run start-azureite` to start the local storage emulator
* `npm start` to start the Durable Functions orchestrator.

Then visit http://localhost:7071/api/orchestrators/haibunFunctionPocOrchestrator to trigger it.

# Deploying to Azure

`¯\_(ツ)_/¯`

A tentative azure-pipelines file is provided. 



