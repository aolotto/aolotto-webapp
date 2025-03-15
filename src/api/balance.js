import { AO } from "../lib/ao"
let ao = new AO()

export async function fetchTokenBalance({address,token_id},{value,refetching}){
  if(!address||!token_id) return
  console.log("⏳ fetch [balance] from : " + token_id + " for " + address,refetching,value)
  let bal = value || 0
  if(!value || refetching){
    const {Messages} = await ao.dryrun({
      process: token_id,
      tags: { Action: "Balance", Recipient: address }
    })
    if(Messages&&Messages?.[0]){
      bal = Number(Messages?.[0].Data)
    }
  }
  return bal
}