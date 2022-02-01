import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./Store"

import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { EtherStore, injected } from "../blockchain"
import {
  selectEthersAddress,
  selectEthersConnected,
  selectEthersResolved,
  setEthersAddress,
  setEthersResolved,
} from "./slices/EthersSlice"
import { ethers } from "ethers"

// Use throughout your store instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEthers = (contractName?: string) => {
  const dispatch = useAppDispatch()

  const ethers: EtherStore = new EtherStore()

  const connected = useAppSelector(selectEthersConnected)
  const address = useAppSelector(selectEthersAddress)
  const resolved = useAppSelector(selectEthersResolved)

  const [signer, setSigner] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)
  // const [publicKey, setPublicKey] = useState<any>(null);
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    const setupEthers = async () => {
      try {
        const signer = await ethers.getSigner()
        const signerAddress = await signer.getAddress()
        const provider = await ethers.getProvider()
        // const publicKey = await ethers.getPublicKey();

        dispatch(setEthersAddress(signerAddress))

        if (contractName !== undefined) {
          const contract = await ethers.getContract(contractName)
          setContract(contract)
          dispatch(setEthersResolved(true))
        }
        // setPublicKey(publicKey);
        setProvider(provider)
        setSigner(signer)
      } catch (error) {
        console.log(error)
      }
    }

    setupEthers().then()
  }, [])

  return [ethers, connected, address, contract, resolved, signer, provider] //, publicKey];
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on("connect", handleConnect)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("networkChanged", handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect)
          ethereum.removeListener("chainChanged", handleChainChanged)
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("networkChanged", handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}