'use strict'

const helloWorld = `
export function hello(): string {
  return "Hello, World!";
}`


const greeting = `
/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, storage } from 'near-sdk-as'

const DEFAULT_MESSAGE = 'Hello'

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw storage.get, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
  const accountId = Context.sender
  storage.set(accountId, message)
}
`

const counter = `
import { storage, logging } from "near-sdk-as";

// --- contract code goes below

export function incrementCounter(value: i32): void {
  const newCounter = storage.getPrimitive<i32>("counter", 0) + value;
  storage.set<i32>("counter", newCounter);
  logging.log("Counter is now: " + newCounter.toString());
}

export function decrementCounter(value: i32): void {
  const newCounter = storage.getPrimitive<i32>("counter", 0) - value;
  storage.set<i32>("counter", newCounter);
  logging.log("Counter is now: " + newCounter.toString());
}

export function getCounter(): i32 {
  return storage.getPrimitive<i32>("counter", 0);
}

export function resetCounter(): void {
  storage.set<i32>("counter", 0);
  logging.log("Counter is reset!");
}
`


const readme = `NEARBY EXAMPLE PROJECT

Nearby has the following example projects on the initial load inside the assembly directory:

1. 'hello': A basic near contract https://docs.near.org/docs/develop/contracts/as/intro#contracts.
2. 'greeting': A simple near contract example which interacts with the near blockchain storage to set and get a greeting.
3. 'counter': A simple near contract to interact with a counter object.


SCRIPTS
 'near.loadAccount(accountId)': 'Displays account data',
 'near.getAccountBalance(accountId)' : 'Get balance for account'
 'near.deploy(accountId, filePath)' : 'Build and deploy typescript file to the near blockchain using assembly script build',
 'near.signIn(accountId)': 'Sign in to the near wallet'
 'near.isSignedIn()': 'Determines if there is an active session'},
 'near.callContract(accountId, contractId, viewMethods, changeMethods, cb)' : 'Calls a smart contract that has been previously deployed to the near blockchain. See near-api-js call contract method.',
 'near.signOut()' : 'Terminates existing session',
 'near.help()': 'Show the available commands'

EXAMPLES:
Before interacting with any of the smart contracts we must sign in. This can be achieved by the 'near.signIn(accountId)' ex. accountname.testnet
After signing in we can call the following command to build and deploy an example contract
'near.deploy(accountId, filepath)' ex. near.deploy("accountname.testnet", "assembly/hello.ts")
Once a contract is deployed to an account we can proceed to invoke the contract methods:

Use near.callContract(accountId, contractId, viewMethods, changeMethods, cb) to invoke a contract on the near blockchain

For example:
near.callContract("example.testnet", "example.testnet", ["getGreeting"], ["setGreeting"], (contract) => contract.getGreeting({"accountId": "example.testnet"}))

near.callContract("example.testnet", "example.testnet", ["getGreeting"], ["setGreeting"], (contract) => contract.setGreeting({"message": "Wow Nearby is so easy to use!!"}))


Output from script will appear in the terminal.
`

export const examples = {
  helloWorld: {name: 'assembly/hello.ts', content: helloWorld},
  greeting: {name: 'assembly/greeting.ts', content: greeting},
  counter: {name: 'assembly/counter.ts', content: counter},
  readme: { name: 'README.txt', content: readme }
}
