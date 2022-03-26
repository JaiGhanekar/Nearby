import { test, expect, jest, describe } from '@jest/globals'
import axios from 'axios'
import * as nearAPI from 'near-api-js'
import { deployCodeCommand, loadAccountCommand, getAccountBalanceCommand, signInCommand, isSignedInCommand, signOutCommand, callContractCommand,
helpCommand } from '../src/lib/context/context'
jest.mock('axios')
jest.mock('near-api-js')

const ACCOUNT_ID = 'accountId'

/**
 * @jest-environment jsdom
 */
describe('Test command line functions for near', () => {
  afterEach(() => {
    jest.resetAllMocks()

  })
  test('Help command returns value', () => {
  const callBack = (_, message) => {
    expect(message.length).toBeGreaterThan(0)
  }
  helpCommand(callBack)
  })

  test('Load account command loads account', async () => {
    const mockAccount = {
       getAccountBalance: async () => '100'
    }
    nearAPI.connect.mockReturnValue({account: async (accountId) => mockAccount})
    const callBack = (error, account) => {
      expect(error).toEqual(null)
      expect(account).toEqual(mockAccount)
    }
    await loadAccountCommand(ACCOUNT_ID, callBack)
    })

  test('Load account balance returns correct balance', async () => {
    const mockAccount = {
       getAccountBalance: async () => '100'
    }

    nearAPI.connect.mockReturnValue({account: async (accountId) => mockAccount})
    const callBack = (error, balance) => {
      expect(error).toEqual(null)
      expect(balance).toEqual('100')
    }
    await getAccountBalanceCommand(ACCOUNT_ID, callBack)
    })

  test('Sign in requested when command is invoked', async() => {
    const callBack = () => {
      expect(nearAPI.connect).toHaveBeenCalled()
      const mockWalletInstance = nearAPI.WalletConnection.mock.instances[0]
      expect(mockWalletInstance.requestSignIn).toHaveBeenCalled()
    }
    await signInCommand(ACCOUNT_ID, callBack)
  })

/**
 * @jest-environment jsdom
 */
  test('Deploy code command makes request to deploy code to blockchain', async () => {
      nearAPI.WalletConnection.mockImplementation(() => ({
          isSignedIn: async () => true
      }))
      const mockFileContent = 'content'
      const mockReadFile = jest.fn().mockResolvedValue(mockFileContent)
      const mockFileManager = { readFile: mockReadFile}
      const key = 'near-api-js:keystore:accountId:testnet'
      window.localStorage.setItem(key, 'somedata')
        axios.post.mockResolvedValue('data')
      const callBack = (error, response) => {
        expect(mockReadFile).toHaveBeenCalled()
        expect(axios.post).toHaveBeenCalled()
      }
      await deployCodeCommand(ACCOUNT_ID, 'file', mockFileManager, callBack)
  })

  test('Is signed in completes sign in with query parms after after partial key exists', async () => {
    const windowSpy = jest.spyOn(window, "window", "get")
    const emptyString = ''
    const key = 'near-api-js:keystore:pending_key:zzz'
    window.localStorage.setItem(key, 'somedata')
    const baseUrl = 'https://website.com'
    const projectQueryUrl = `${baseUrl}?account_id=xyz`
    const mockPush = jest.fn()
    windowSpy.mockImplementation(() => ({
      location: {
        href: projectQueryUrl
      },
      history: {
        pushState: mockPush
      }
    }))
    const callBack = (_, res) => {
      expect(mockPush).toHaveBeenCalledWith(emptyString, emptyString, projectQueryUrl)

    }
    await isSignedInCommand(callBack)
    jest.resetAllMocks()
  })


  test('Sign out command invokes wallet signout', async () => {
    const callBack = () => {
      const mockWalletInstance = nearAPI.WalletConnection.mock.instances[0]
      expect(mockWalletInstance.signOut).toHaveBeenCalled()
    }
    await signOutCommand(callBack)
  })
  test('Call contract commands invokes callback', async () => {
    const mockAccount = {
       getAccountBalance: async () => '100'
    }
    nearAPI.connect.mockReturnValue({account: async (accountId) => mockAccount})
    const helloMessage = 'hello'
    nearAPI.Contract.mockImplementation(() => ({
        hello: () => helloMessage
    }))
    const callBack1 = (contract) => {
      return contract.hello()
    }

    const callBack2 = (_ ,result) => {
      expect(result).toEqual(helloMessage)
    }
    await callContractCommand(ACCOUNT_ID, ACCOUNT_ID, [], [], callBack1, callBack2)
  })
})
