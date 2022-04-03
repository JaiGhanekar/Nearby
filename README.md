# Nearby Project

**Nearby** is a setup wizard for near contracts. Users will be able to access a user interface that will dynamically provide them with a starter template code for different types of Near contract definitions.

# Demo

[![Nearby in action](https://img.youtube.com/vi/nge-spbixWg/hqdefault.jpg
)](https://youtu.be/nge-spbixWg)

# Deployments
Start developing using Nearby on browser, visit: [https://nearby.onrender.com](https://nearby.onrender.com)

Start developing using Nearby on browser for testnet, visit: [https://nearby-testnet.onrender.com](https://nearby-testnet.onrender.com)


# How to use
NEARBY EXAMPLE PROJECT

Nearby has the following example projects on the initial load inside the assembly directory:

1. 'hello': A basic near contract https://docs.near.org/docs/develop/contracts/as/intro#contracts.
2. 'greeting': A simple near contract example which interacts with the near blockchain storage to set and get a greeting.
3. 'counter': A simple near contract to interact with a counter object.

SCRIPTS
```
 'near.loadAccount(accountId)': 'Displays account data',
 'near.getAccountBalance(accountId)' : 'Get balance for account'
 'near.deploy(accountId, filePath)' : 'Build and deploy typescript file to the near blockchain using assembly script build',
 'near.signIn(accountId)': 'Sign in to the near wallet'
 'near.isSignedIn()': 'Determines if there is an active session'},
 'near.callContract(accountId, contractId, viewMethods, changeMethods, cb)' : 'Calls a smart contract that has been previously deployed to the near blockchain. See near-api-js call contract method.',
 'near.signOut()' : 'Terminates existing session',
 'near.help()': 'Show the available commands'
```
EXAMPLES:
Before interacting with any of the smart contracts we must sign in. This can be achieved by the 'near.signIn(accountId)' ex. accountname.testnet
After signing in we can call the following command to build and deploy an example contract
'near.deploy(accountId, filepath)' ex. near.deploy("accountname.testnet", "assembly/hello.ts")
Once a contract is deployed to an account we can proceed to invoke the contract methods:

Use near.callContract(accountId, contractId, viewMethods, changeMethods, cb) to invoke a contract on the near blockchain

For example:
```near.callContract("example.testnet", "example.testnet", ["getGreeting"], ["setGreeting"], (contract) => contract.getGreeting({"accountId": "example.testnet"}))```

```near.callContract("example.testnet", "example.testnet", ["getGreeting"], ["setGreeting"], (contract) => contract.setGreeting({"message": "Wow Nearby is so easy to use!!"}))```


Output from script will appear in the terminal.

## Setup

* Install **NPM** and **Node.js**. See [Guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) <br/>
*Supported versions:*
```bash
"engines": {
    "node": "^14.17.6",
    "npm": "^6.14.15"
  }
```
* Install [Nx CLI](https://nx.dev/react/cli/overview) globally to enable running **nx executable commands**.
```bash
npm install -g @nrwl/cli
```
* Clone the github repository (`wget` need to be installed first):

```bash
git clone https://github.com/ethereum/remix-project.git
```
* Build `remix-project`:
```bash
cd remix-project
npm install
npm run build:libs // Build remix libs
nx build
nx serve
```

Open `http://127.0.0.1:8080` in your browser to load Remix IDE locally.

Go to your `text editor` and start developing. Browser will automatically refresh when files are saved.

## Production Build
To generate react production builds for remix-project.
```bash
npm run build:production
```
Build can be found in `remix-project/dist/apps/remix-ide` directory.

```bash
npm run serve:production
```
Production build will be served by default to `http://localhost:8080/` or `http://127.0.0.1:8080/`

## Docker:

Prerequisites:
* Docker (https://docs.docker.com/desktop/)
* Docker Compose (https://docs.docker.com/compose/install/)

### Run with docker

If you want to run latest changes that are merged into master branch then run:

```
docker pull remixproject/remix-ide:latest
docker run -p 8080:80 remixproject/remix-ide:latest
```

If you want to run latest remix-live release run.
```
docker pull remixproject/remix-ide:remix_live
docker run -p 8080:80 remixproject/remix-ide:remix_live
```

### Run with docker-compose:

To run locally without building you only need docker-compose.yaml file and you can run:

```
docker-compose pull
docker-compose up -d
```

Then go to http://localhost:8080 and you can use you Remix instance.

To fetch docker-compose file without cloning this repo run:
```
curl https://raw.githubusercontent.com/ethereum/remix-project/master/docker-compose.yaml > docker-compose.yaml
```

### Troubleshooting

If you have trouble building the project, make sure that you have the correct version of `node`, `npm` and `nvm`. Also ensure [Nx CLI](https://nx.dev/react/cli/overview) is installed globally.

Run:

```bash
node --version
npm --version
nvm --version
```

In Debian based OS such as Ubuntu 14.04LTS you may need to run `apt-get install build-essential`. After installing `build-essential`, run `npm rebuild`.

## Unit Testing

Run the unit tests using library name like: `nx test <project-name>`

For example, to run unit tests of `remix-analyzer`, use `nx test remix-analyzer`

## Browser Testing

To run the Selenium tests via Nightwatch:

 - Install Selenium for first time: `npm run selenium-install`
 - Run a selenium server: `npm run selenium`
 - Build & Serve Remix: `nx serve`
 - Run all the end-to-end tests:

    for Firefox: `npm run nightwatch_local_firefox`, or

    for Google Chrome: `npm run nightwatch_local_chrome`
 - Run a specific test case instead, use one of following commands:

		- npm run nightwatch_local_ballot

        - npm run nightwatch_local_usingWorker

		- npm run nightwatch_local_libraryDeployment

		- npm run nightwatch_local_solidityImport

		- npm run nightwatch_local_recorder

		- npm run nightwatch_local_transactionExecution

		- npm run nightwatch_local_staticAnalysis

		- npm run nightwatch_local_signingMessage

        - npm run nightwatch_local_specialFunctions

        - npm run nightwatch_local_solidityUnitTests

        - npm run nightwatch_local_remixd # remixd needs to be run

		- npm run nightwatch_local_terminal

        - npm run nightwatch_local_gist

        - npm run nightwatch_local_workspace

        - npm run nightwatch_local_defaultLayout

        - npm run nightwatch_local_pluginManager

        - npm run nightwatch_local_publishContract

        - npm run nightwatch_local_generalSettings

        - npm run nightwatch_local_fileExplorer

        - npm run nightwatch_local_debugger

        - npm run nightwatch_local_editor

        - npm run nightwatch_local_compiler

        - npm run nightwatch_local_txListener

        - npm run nightwatch_local_fileManager

        - npm run nightwatch_local_runAndDeploy


**NOTE:**

- **The `ballot` tests suite** requires to run `ganache-cli` locally.

- **The `remixd` tests suite** requires to run `remixd` locally.

- **The `gist` tests suite** requires specifying a github access token in **.env file**.
```
    gist_token = <token> // token should have permission to create a gist
```
