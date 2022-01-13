/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import './App.css'
import { ethers } from 'ethers'
import { ClimbingBoxLoader } from 'react-spinners'
import contract from './utils/WavePortal.json'

export default function App (props) {
  const contractAddress = '0x8B970933594fD7aDCfe12D833FBFC50d055887a3'
  const contractABI = contract.abi
  const [currentAccount, setCurrentAccount] = useState('')
  const [isMining, setIsMining] = useState(false)
  // const [waveCount, setWaveCount] = useState(0)
  const [allWaves, setAllWaves] = useState([])
  const [message, setMessage] = useState('')

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
        getAllWaves()
      } else {
        console.log('No authorised account found')
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

        setIsMining(true)

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        // execute the actual wave from smart contract 
        const waveTxn = await wavePortalContract.wave(message)
        console.log('Mining...', waveTxn.hash)

        await waveTxn.wait()
        setIsMining(false)
        console.log('Mined --', waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
        // setWaveCount(allWaves.length)
      } else {
        alert('Get MetaMask!')
        return 
        // console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }  

  const getAllWaves = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        // call getAllWaves from smart contract
        const waves = await wavePortalContract.getAllWaves()

        // tidy waves array
        let wavesCleaned = []
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          })
        }) 
        // store our data in React state 
        setAllWaves(wavesCleaned)
      } else {
        console.log("Ethereum object doesn't exist!")
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
        
        {/* if we don't have connected wallet show this button */}
        <div className='buttonContainer'>
          {!currentAccount && (
            <button className='walletButton' onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>

        {isMining ? 
          <div className='buttonContainer'>
            <p className='bio'>mining in progres...</p>
            <br/>
            <br/>
            <ClimbingBoxLoader 
              color='orange' />
          </div> :
          <div className='buttonContainer'>
            <button className="waveButton" onClick={wave}>
            Wave at Me
            </button>
          </div>          
        }

        <form className='formContainer'>
          <label>Write message:{' '} 
            <input type='text' value={message} onChange={e => setMessage(e.target.value)} />
          </label>
          <input type='submit' value='submit' />
        </form>

        <div className='header'>
          <p>Total <span role='img' aria-label="emoji-wave">👋</span> : {allWaves.length} </p>
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className='messages'>
              <p><strong>Address:</strong> {wave.address} </p>
              <p><strong>Time:</strong> {wave.timestamp.toString()} </p>
              <p><strong>Message:</strong> {wave.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
