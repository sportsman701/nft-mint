import { ethers, BigNumber } from 'ethers';
import Degem_abi from './abi/degemHamsters.abi.json'
import degemSecret from './abi/secret.json'

export async function adopt(number, signer) {

  const Degem = new ethers.Contract(degemSecret.DegenHamstersAddress, Degem_abi, signer);

  await Degem.adoptHamster(number, {value: BigNumber.from("300000000000000000")});
  
  return new Promise((resolve, reject) => {
    Degem.on("Transfer", (from, to, tokenId) => {
      console.log("tokenId", tokenId)
      resolve(tokenId)
    });
  })
}