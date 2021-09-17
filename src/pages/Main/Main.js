import React, { useState, useCallback } from 'react'
import logo from '../../assets/images/degenhamsters.png'
import background from '../../assets/images/bnner3.png'
import Button from '@mui/material/Button'
// import { useWallet } from 'use-wallet'
import { truncatedText } from '../../helpers';
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import degemHamstersAddress from '../../contracts/abi/secret.json'
import degemHamsters_abi from '../../contracts/abi/degemHamsters.abi.json'
import { adopt } from '../../contracts/degemHamsters'
import './Main.scss'

const maxMintCount = 20
const Win = window
Win.degemHamsters = {}

const Main = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [subCount, setSubCount] = useState(0)
  const [mintPrice, setMintPrice] = useState(0)
  const [mintCount, setMintCount] = useState(0)

  console.log(setSubCount, setMintPrice)

  const handleMintCountPlus = useCallback(() => {
    const newMintCount = Number(mintCount) + 1
    if (newMintCount <= maxMintCount) setMintCount(newMintCount)
  }, [mintCount])

  const handleMintCountMinus = useCallback(() => {
    const newMintCount = Number(mintCount) - 1
    if (newMintCount >= 0) setMintCount(newMintCount)
  }, [mintCount])

  const handleMintCountChange = useCallback((e) => {
    if (
      typeof Number(e.target.value) === 'number' &&
      Number(e.target.value) <= 20 &&
      Number(e.target.value) >= 0 
    ) {
      setMintCount(e.target.value)
    }
  }, [])

  const handleMint = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const result = await adopt(mintCount, signer)
    console.log(result)
  }, [mintCount])

  const handleSetMaxMintCount = useCallback(() => {
    setMintCount(maxMintCount)
  }, [])

  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: 'errorBtn',
    },
    buttonsStyling: false
  })


  async function getAccount(mode) {
    try {
      Win.degemHamsters.provider = new ethers.providers.Web3Provider(window.ethereum)
      
      let network = await Win.degemHamsters.provider.getNetwork()
      if (network.chainId !== 97) {
        try {
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: '0x61', rpcUrls: ['https://bsc-dataseed.binance.org/']}],
          });
        } catch (switchError) {
          return;
        }
      }          

      Win.degemHamsters.signer = await Win.degemHamsters.provider.getSigner();

      Win.degemHamsters.degemHamstersContractProvider = new ethers.Contract(degemHamstersAddress.DegenHamstersAddress, degemHamsters_abi, Win.degemHamsters.provider);

      Win.degemHamsters.degemHamstersContract = Win.degemHamsters.degemHamstersContractProvider.connect(Win.degemHamsters.signer);

      Win.degemHamsters.provider.on("network", (newNetwork, oldNetwork) => {
          if (oldNetwork) {
            window.location.reload();
          }
      });

      Win.degemHamsters.userAddress = await Win.degemHamsters.signer.getAddress()
      setIsConnected(true)
      setWalletAddress(Win.degemHamsters.userAddress)
    } catch(e) {
      if (mode !== "initialAttempt") {
        console.log(e)
        customSwal.fire({
          icon: 'error',
          title: 'Oops...',
          html: '<a target="_blank" href="https://metamask.io/download.html">Install MetaMask</a>',
        });
      }
    }
  }

  if(!Win.degemHamsters.connected)
    getAccount("initialAttempt");

  const Connect = async () => {
    try {
      window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(async () => {
          await getAccount("userConnection");
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
    } catch(e) {
      customSwal.fire({
        icon: 'error',
        title: 'Oops...',
        html: '<a target="_blank" href="https://metamask.io/download.html">Install MetaMask</a>',
      });
    }
  }

  return (
    <div className='main'>
      <div className='main__background'>
        <img src={background} alt='background' />
      </div>
      <div className='main__header'>
        <Button
          variant="outlined"
          color="error"
          className='connect'
          onClick={Connect}
        >
          {isConnected ? (
            <span>{truncatedText(walletAddress)}</span>
          ) : (
            <span>CONNECT WALLET</span>
          )}
        </Button>
      </div>

      <div className='main__body'>
        <h3 className='main__body-title'>Get Your DH</h3>
        <div className='main__body-total'>
          <span className='main__body-total-sub'>{`${subCount}/`}</span>
          <span className='main__body-total-all'>10,000</span>
        </div>
        <h4 className='main__body-sub-title'>MINTING OPEN</h4>
        <div className='main__body-mint'>
          <div className='main__body-mint-price'>
            <div className='title'>MINT PRICE</div>
            <div className='price'>{`${mintPrice} BNB`}</div>
          </div>
          <div className='main__body-mint-count'>
            <Button
              variant='contained'
              onClick={handleMintCountMinus}
              className='inc-dec'
            >-</Button>
            <input className='count' value={mintCount} onChange={handleMintCountChange}/>
            <Button
              variant='contained'
              onClick={handleMintCountPlus}
              className='inc-dec'
            >+</Button>
            <Button
              variant="text"
              onClick={handleSetMaxMintCount} 
              className='max'
            >MAX</Button>
          </div>
          <Button
            variant="contained"
            color="success"
            className="mint-btn"
            onClick={handleMint}
          >
            MINT NOW
          </Button>
        </div>
      </div>
      
      <div className='main__footer'>
        <div className='main__logo'>
          <img src={logo} alt='logo' />
        </div>
      </div>
    </div>
  )
};

export default Main;
