import { AO, tagsArrayToObject } from "../ao"
export const cliamDividends = ({
  agent_id,
  wallet
}) => new Promise(async(resovle,reject)=>{
  try {
    if(!agent_id){
      reject(new Error("Missed agent id"))
    }
    if(!wallet||typeof(wallet)!="object"){
      reject(new Error("Missed wallet signer or type error"))
    }
    const ao = new AO({wallet})
    const msg =  await ao.message(agent_id,{
      Action: "Claim-Dividends",
    })

    if(!msg){reject("Send message error")}
    const [checked,res] = await ao.checkMessage(
      [agent_id,msg],
      ({Messages})=>{
        console.log(Messages)
        const tags = tagsArrayToObject(Messages?.[0]?.Tags)
        console.log(tags)
        return tags?.['X-Distributed-ID'] == msg
      }
    )
    if(checked){
      resovle(msg)
    }else{
      throw new Error("Claim Error");
    }
  } catch (error) {
    reject(error)
  }
})