import { AO } from "../ao";
import { storage } from "../../lib/storage";
let ao = new AO()

export async function fetchAccount({player,id},{refetching}){
  console.log("fetchAccount",id,player)
  if(!player||!id) return
  try {
    
    return await ao.dryrun(id,{ Action: "Get-Player", Player: player })
      .then(({ Messages,Errors }) => {
        if (Messages?.length >= 1&& Messages?.[0]?.Data) {
          const data = JSON.parse(Messages?.[0]?.Data)
          if(data){
            return data
          }else{
            return null
          }
        }
        if(Errors){
          throw new Error(Errors)
        }
      })
    
  } catch (error) {
    throw error
  }

  // try {
  //   if(!player||!id) return
  //   // console.log("⏳ fetch [ player ] from : " + id + " with address " + player)
  //   // let key ='player-'+id+"-"+player
  //   // let localData = storage.get(key,"sessionStorage")
  //   // if(!localData || refetching){
  //   //   return await ao.dryrun(id,{ Action: "Get-Player", Player: player })
  //   //   .then(({ Messages,Errors }) => {
  //   //     console.log("fetchPlayerAccount-Result",Messages,Errors)
  //   //     if (Messages?.length >= 1&& Messages?.[0]?.Data) {
  //   //       const data = JSON.parse(Messages?.[0]?.Data)
  //   //       if(data){
  //   //         storage.set(key,data,{type:"sessionStorage",ttl : 6000})
  //   //         return data
  //   //       }else{
  //   //         return null
  //   //       }
  //   //     }
  //   //     if(Errors){
  //   //       throw Error(Errors)
  //   //     }
  //   //   })
  //   //   .catch(err => {
  //   //     throw Error(err)
  //   //   })
  //   // }else{
  //   //   return localData
  //   // }
  //   return await ao.dryrun(id,{ Action: "Get-Player", Player: player })
  //     .then(({ Messages,Errors }) => {
  //       console.log("fetchPlayerAccount-Result",Messages,Errors)
  //       if (Messages?.length >= 1&& Messages?.[0]?.Data) {
  //         const data = JSON.parse(Messages?.[0]?.Data)
  //         if(data){
  //           storage.set(key,data,{type:"sessionStorage",ttl : 6000})
  //           return data
  //         }else{
  //           return null
  //         }
  //       }
  //       if(Errors){
  //         throw Error(Errors)
  //       }
  //     })
  // }
}