import React, { useEffect, useState } from 'react'
import { ethers } from "ethers"
import './App.css'
import contract from './utils/WavePortal.json'

export default function App () {
  const [currentAccount, setCurrentAccount] = useState('')
  const contractAddress = '0x845D21831fbBC055C1aEAf8B7b3d5f0DB05eB82A'
  const contractABI = contract.abi

  // makes sure we have access to window.ethereum
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        console.log("Make sure you have metamask!")
      } else {
        console.log("We have the ethereum object", ethereum)
      }
      // check if we're authorised to access user's wallet 
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorised account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorised accound found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return 
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window 
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        // execute the actual wave from smart contract 
        const waveTxn = await wavePortalContract.wave()
        console.log('Mining...', waveTxn.hash)
        await waveTxn.wait()
        console.log('Mined --', waveTxn.hash)
        count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // runs our function when the page loads 
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role='img' aria-label="emoji-wave">👋</span> Hey there!
        </div>

        <img src="profile_pic.png" alt="profile"/>

        <div className="bio">
        I am Victoria and I&apos;m a coral reef ecologist &amp; a software developer, trying to combine my passion for the two, while delving into the world of web3!
          <br/>
          <br/>
        Connect your Ethereum wallet and wave at me!
        </div>

        <div className="buttonContainer">
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        </div>
        
        {/* if we don't have connected wallet show this button */}
        <div className='buttonContainer'>
          {!currentAccount && (
            <button className='waveButton' onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
