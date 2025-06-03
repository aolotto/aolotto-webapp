
import { AO } from "../ao"

export const submitStaking = ({
  alt_id,
  stake_id,
  quantity,
  duration,
  wallet
}) => new Promise(async(resovle,reject)=>{
  try {
    if(!alt_id){
      reject(new Error("Missed alt id"))
    }
    const ao = new AO({wallet:wallet})
    const tags = {
      Action: "Transfer",
      Quantity: String(quantity),
      Recipient: stake_id || protocols.stake_id,
      ['X-Locked-Time']: String(duration),
      ['X-Transfer-Type'] : "Stake"
    }

    const msg =  await ao.message(alt_id,tags)
    if(!msg){reject("Send message error")}
    const {Messages} = await ao.result({
      process: alt_id,
      message: msg
    })
    console.log(Messages)
    if(!Messages||Messages?.length<1){
      reject(new Error("Transaction error"))
    }else{
      console.log
      resovle(msg)
    }
  } catch (error) {
    reject(error)
  }
})