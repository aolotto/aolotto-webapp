import { AO,findTagItemValues } from "../lib/ao"
import { wsdk } from "../components/wallet"

export const claim =(pool_id,recipient) => new Promise(async(resovle,reject)=>{
  try {
    if(!pool_id){reject("Missed store id")}
    if(!recipient){reject("Missed pool id")}
    console.log(pool_id,recipient)
    const ao = new AO({wallet:wsdk()})
    const msg =  await ao.message({
      process: pool_id,
      tags: {
        Action: "Claim",
        Recipient: recipient
      }
    })
    if(!msg){reject("Send message error")}
    const {Messages,...rest} = await ao.result({
      process: pool_id,
      message: msg
    })
    if(Messages?.length>=1){
      console.log(Messages)
      resovle(JSON.parse(Messages?.[0].Data))
    }else{
      console.log(rest)
      reject("Read result error")
    }
    
  } catch (error) {
    reject(error)
  }
})

export const queryCliamResult = ({pool_id,claim_id,recipient,token_id}) => new Promise(async(resovle,reject)=>{
  try {
    if(!claim_id){reject("Missed claim id")}
    if(!recipient){reject("Missed recipient")}
    if(!pool_id){reject("Missed pool_id")}
    const query_str =  `
      query{
        transactions(
          recipients: ["${recipient}"],
          tags: [{
              name: "Data-Protocol",
              values: ["ao"]
            },{
              name: "Variant",
              values: ["ao.TN.1"]
            },{
              name: "Type", 
              values: ["Message"]
            },{
              name: "From-Process",
              values: ["${token_id}"]
            },{
              name: "Sender",
              values: ["${pool_id}"]
            },{
              name: "Action",
              values: ["Credit-Notice"]
            },{
              name: "X-Claim-Id",
              values: ["${claim_id}"]
            },{
              name: "X-Transfer-Type",
              values: ["Claim-Notice"]
            }]
        ) {
          edges {
            cursor
            node {
              id
              tags {
                name,
                value
              }
              block {
                timestamp,
                height
              }
            }
          }
        }
      }
    `

    console.log(query_str)
    const ao = new AO()
    const res = await ao.query(query_str)
    console.log("奖金转账结果",res)
    if(res.length>0){
      resovle(res)
    }else{
      reject("no transfer result for the claim")
    }
    
  } catch (error) {
    reject(error)
  }
})