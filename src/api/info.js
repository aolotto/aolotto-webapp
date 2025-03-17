import { AO } from "../lib/ao"
let ao = new AO()

export async function fetchProcessInfo(pid,{value,refetching}){
  if(!pid) return
  console.log("⏳ fetch [Info] from : " + pid ,refetching,value)
  const key = "PROCESS_INFO_"+pid
  const session = sessionStorage.getItem(key)&&JSON.parse(sessionStorage.getItem(key))
  let info = {}
  if(!session || refetching){
    const {Messages} = await ao.dryrun({
      process: pid,
      tags: { Action: "Info" }
    })
    if(Messages&&Messages?.[0]){
      sessionStorage.setItem(key,JSON.stringify(Messages[0]))
      for (const {name,value} of Messages[0].Tags) {
        info[name] = value
      }
    }
  }else{
    for (const {name,value} of session.Tags) {
      info[name] = value
    }
  }
  return info
}