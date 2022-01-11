import React, { useEffect, useState } from 'react'
import './App.css'
import { ClimbingBoxLoader } from 'react-spinners'
import WaveButton from './WaveButton'

export default function App (props) {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isMining, setIsMining] = useState(false)
  const [waveCount, setWaveCount] = useState(0)

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
            <ClimbingBoxLoader 
              color='orange'
              css={{marginTop: '16px'}} />
            <br/>
            <br/>
            <p className='bio'>mining in progres...</p>
          </div> :
          <WaveButton setIsMining={setIsMining} waveCount={waveCount} setWaveCount={setWaveCount} />
        }
      </div>
    </div>
  )
}
