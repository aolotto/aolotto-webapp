import { AO,findTagItemValues } from "../lib/ao"
import { wallet } from "../components/arwallet"
import { action } from "@solidjs/router"

export const claim =(pool_id,recipient) => new Promise(async(resovle,reject)=>{
  try {
    if(!pool_id){reject("Missed store id")}
    if(!recipient){reject("Missed pool id")}
    console.log(pool_id,recipient)
    const ao = new AO({wallet:wallet()})
    const msg =  await ao.message({
      process: pool_id,
      tags: {
        Action: "Claim",
        Recipient: recipient
      }
    })
    if(!msg){reject("Send message error")}
    const {Messages} = await ao.result({
      process: pool_id,
      message: msg
    })
    if(Messages?.length>=1){
      const [quantity,id,tax,recipient,amount,player] = findTagItemValues(["Quantity","X-Claim-Id","X-Tax","Recipient","X-Amount","X-Player"],Messages?.[0]?.Tags)
      resovle({
        id: id || msg,
        quantity,
        tax,
        recipient,
        amount,
        player
      })
    }else{
      reject("Read result error")
    }
    
  } catch (error) {
    reject(error)
  }
})