import { AO } from "../lib/ao"

let ao = new AO()



export const fetchStakeState = async(id,{refetch}) => {
  console.log("⏳ fetch [stake] from :" + id)
  if(!id) {
    return
  }
  const { Messages } = await ao.dryrun({
    process: id,
    tags: {Action:"State"}
  })
  if(Messages?.length>0&&Messages[0]){
    console.log("✅ [stake] ")
    return JSON.parse(Messages[0]?.Data)
  }
}


// export async function fetchDividends([{stake_id,agent_id},{size,cursor}],{refetching}){
//   console.log("fetchLottoDividends",agent_id)

//   if(!pool_id||!agent_id) return null

//   try {
//     const query_str =  `
//       query{
//         transactions(
//           recipients: ["${stake_id}"],
//           first: ${size||100},
//           after: "${cursor?cursor:''}",
//           tags: [{
//               name: "Data-Protocol",
//               values: ["ao"]
//             },{
//               name: "Variant",
//               values: ["ao.TN.1"]
//             },{
//               name: "Type", 
//               values: ["Message"]
//             },{
//               name: "From-Process",
//               values: ["${agent_id}"]
//             },{
//               name: "Action",
//               values: ["Distributed-Dividends"]
//             }]
//         ) {
//           edges {
//             cursor
//             node {
//               id
//               tags {
//                 name,
//                 value
//               }
//               block {
//                 timestamp
//               }
//             }
//           }
//         }
//       }
//     `

//     const res = await ao.query(query_str)
//     let dividends
//     if(res?.length > 0){
//       dividends = res.map(({node,cursor})=>{
//         const tags = {}
//         for (const {name,value} of node.tags) {
//           tags[name] = value
//         }
//         return({
//           id: node.id,
//           amount: tags?.Amount,
//           addresses: tags?.Addresses,
//           ref: tags?.['Distribution-No'],
//           supply: tags?.Supply,
//           timestamp: node?.block?.timestamp,
//           cursor
//         })
//       })
//     }
//     // console.log(bets)
//     return dividends
//   } catch (error) {
//     console.error("fetch minings faild.", error)
//     return null
//   }
// }



