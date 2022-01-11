import React from 'react'
import './App.css'
import { ethers } from 'ethers'
import contract from './utils/WavePortal.json'

function WaveButton (props) {
    const contractAddress = '0x845D21831fbBC055C1aEAf8B7b3d5f0DB05eB82A'
    const contractABI = contract.abi
    const { setIsMining } = props
    const { waveCount } = props
    const { setWaveCount} = props

    const wave = async () => {
        setIsMining(true)
    
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
            setIsMining(false)
            console.log('Mined --', waveTxn.hash)

            count = await wavePortalContract.getTotalWaves()
            console.log('Retrieved total wave count...', count.toNumber())

            setWaveCount(count.toNumber())
          } else {
            console.log("Ethereum object doesn't exist")
          }
        } catch (error) {
          console.log(error)
        }
      }

  return (
    <>
    <div className="buttonContainer">
      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>
    </div>
    
    <div className='header'>
      <p>Total <span role='img' aria-label="emoji-wave">👋</span> : {waveCount} </p>
    </div>
    </>
    )
}

export default WaveButton