import { ethers } from 'ethers';
import Degem_abi from './abi/degemHamsters.abi.json'
import degemSecret from './abi/secret.json'

export async function adopt(number, signer) {

  const Degem = new ethers.Contract(degemSecret.DegenHamstersAddress, Degem_abi, signer);

  Degem.adoptHamster(number);
  
  return new Promise((resolve, reject) => {
    Degem.on("Transfer", (from, to, tokenId) => {
        console.log("tokenId", tokenId)
      resolve(tokenId)
    });
  })
}