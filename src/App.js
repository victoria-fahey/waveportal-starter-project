import * as React from "react"
import { ethers } from "ethers"
import './App.css'

export default function App() {

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
        I am Victoria and I'm a coral reef ecologist &amp; a software developer, trying to combine my passion for the two!
        <br/>
        <br/>
        Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  )
}
