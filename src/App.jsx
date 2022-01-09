import React, { useEffect } from 'react'
// import { ethers } from "ethers"
import './App.css'

export default function App () {
    // makes sure we have access to window.ethereum
    const checkIfWalletIsConnected = () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log("Make sure you have metamask!")
    } else {
      console.log("We have the ethereum object", ethereum)
    }
  }

  // runs our function when the page loads 
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const wave = () => {

  }

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
      </div>
    </div>
  )
}
