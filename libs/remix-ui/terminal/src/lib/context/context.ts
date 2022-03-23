import * as nearAPI from 'near-api-js'
const { WalletConnection } = nearAPI
import axios from 'axios'
const { NETWORK_ID } = process.env
const COMPILE_ENDPOINT = 'http://localhost:3000/deploy'
const WALLET_PREFIX = 'wallet'
const HASH_URL_DELIM = '/#'
const QUERY_PARAM_DELIM = '?'
const EMPTY_STR = ''
const SIGN_IN_REQUIRED_ERROR = 'Error this command requires sign in, continue by running near.signIn(accountId)'
  const KEY_DOES_NOT_EXIST_ERROR = 'Error authentication key required please run near.signIn(accountId)'

enum NetworkId {
  Test = 'testnet',
  Beta = 'betanet',
  Main = 'mainnet'
}

async function connection(networkId: NetworkId = NetworkId.Test): Promise<nearAPI.Near> {
  const { keyStores, connect } = nearAPI
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();
  const config = {
    networkId: networkId,
    keyStore,
    nodeUrl: `https://rpc.${networkId}.near.org`,
    walletUrl: `https://wallet.${networkId}.near.org`,
    helperUrl: `https://helper.${networkId}.near.org`,
    explorerUrl: `https://explorer.${networkId}.near.org`,
    headers: {}
  }
  return connect(config)
}
export async function deployCodeCommand(accountId: string, file: string, fileManager: any, cb: (error: any, output?: any)  => void) {
  try {
    if (await isSignedIn()) {
      const networkId =  NETWORK_ID != undefined ? NETWORK_ID : NetworkId.Test
      const key = localStorage.getItem(`near-api-js:keystore:${accountId}:${networkId}`)
      if (key) {
        try {
          const res = await deployCode(accountId, file, key, fileManager)
          cb(null, res)
        } catch (error) {
          cb(error.response.data.message)
        }
      } else {
        cb(KEY_DOES_NOT_EXIST_ERROR)
      }
    } else {
        cb(SIGN_IN_REQUIRED_ERROR)
    }
  } catch (error) {
    cb(error.messages)
  }
}

export async function loadAccountCommand(accountId: string, cb: (error: any, output?: any)  => void) {
  try {
    const account = await loadAccount(accountId)
    cb(null, account)
  } catch (error) {
    cb(error.message)
  }
}

export async function getAccountBalanceCommand(accountId: string, cb: (error: any, output?: any) => void) {
  const account = await loadAccount(accountId)
  const balance = await account.getAccountBalance()
  cb(null, balance)
}

export async function signInCommand(contractId: string, cb: (error?: any, output?: any) => void) {
  await signIn(contractId)
  cb()
}

export async function isSignedInCommand(cb: (error: any, output?: any) => void) {
  cb(null, await isSignedIn() ? "true" : "false")
}


export async function signOutCommand(cb: (error?: any, output?: any) => void) {
  await signOut()
  cb()
}

export async function callContractCommand(accountId: string, contractId: string, viewMethods: Array<string>, changeMethods: Array<string>, cb: any, cb2: (error?: any, output?: any) => void) {
  try {
    const result = await callContract(accountId, contractId, viewMethods, changeMethods, cb)
    cb2(null, result)
  } catch (error) {
    cb2(JSON.stringify(error.message))
  }
}

export function helpCommand(cb: (error?: any, output?: any) => void) {
  const commands = `The following commands can be used: loadAccount, getAccountBalance, deploy, signIn, isSignedIn, signOut. Ex: near.deploy("example.testnet","assembly/hello.ts")`
  cb(null, commands)
}

async function signIn(contractId: string) {
  const near = await connection(NetworkId[NETWORK_ID])
  var wallet = new WalletConnection(near, WALLET_PREFIX)
  await wallet.requestSignIn({ contractId: contractId })
}


async function signOut() {
  const near = await connection(NetworkId[NETWORK_ID])
  var wallet = new WalletConnection(near, WALLET_PREFIX)
  wallet.signOut()
}

async function deployCode(accountId: string, file: string, key: string, fileManager: any): Promise<any> {
  const content = await fileManager.readFile(file)
  const headers = {'Content-Type': 'text/plain', 'accountid': accountId, key: key}
  const result = await axios.post(COMPILE_ENDPOINT, content, { headers })
  return result
}

async function callContract(accountId: string, contractId: string, viewMethods: Array<string>, changeMethods: Array<string>, cb: any): Promise<any> {
  const account = await loadAccount(accountId)
  const contract = new nearAPI.Contract(
    account,
    contractId,
    {
      viewMethods: viewMethods,
      changeMethods: changeMethods,
    })
    const result = await cb(contract)
    return result
}



async function isSignedIn(pendingPrefix = 'near-api-js:keystore:pending_key'): Promise<boolean> {
  const near = await connection(NetworkId[NETWORK_ID])
  const wallet = new WalletConnection(near, WALLET_PREFIX)
  //TODO: FIXME this is a hack for sign in to query the url
  if (Object.keys(localStorage).filter((key) => key.indexOf(pendingPrefix) >= 0).length > 0) {
    const convertedUrl = window.location.href.replace(HASH_URL_DELIM, QUERY_PARAM_DELIM)
    window.history.pushState(EMPTY_STR, EMPTY_STR, convertedUrl)
    await wallet._completeSignInWithAccessKey()
  }
  return wallet.isSignedIn()
}

async function loadAccount(accountName: string): Promise<any> {
  const near = await connection(NetworkId[NETWORK_ID])
  return await near.account(accountName)
}
