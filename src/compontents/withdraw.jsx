import { Icon } from "@iconify-icon/solid"
import { onMount,createSignal, from } from "solid-js"
// import { address,walletConnectionCheck,connected,wsdk } from "./wallet"
import { toBalanceValue,shortStr } from "../lib/tool"
import { t,setDictionarys} from "../i18n"
import { protocols } from "../data/info"
import toast from "solid-toast"
import { AO } from "../lib/ao"
import Spinner from "./spinner"
import { useApp,useWallet } from "../contexts"



// const withdraw =(agent_id) => new Promise(async(resovle,reject)=>{
//   try {
//     if(!agent_id){reject("Missed agent id")}
//     const ao = new AO({wallet:wsdk()})
//     const msg =  await ao.message({
//       process: agent_id,
//       tags: {
//         Action: "Claim-Dividends",
//       }
//     })
//     if(!msg){reject("Send message error")}
//     const {Messages,...rest} = await ao.result({
//       process: agent_id,
//       message: msg
//     })
//     if(Messages?.length>=1){
//       console.log(Messages)
//       resovle(msg)
//     }else{
//       reject("Read result error")
//     }
    
//   } catch (error) {
//     reject(error)
//   }
// })

export default props => {
  let _whitdraw
  const [data,setData] = createSignal()
  const [claiming,setClaiming] = createSignal(false)
  
  setDictionarys("en",{
    "wd.title" : "Unclaimed Divedends",
    "wd.desc" : "The minimum claim amount is 0.000001. Once confirmed, dividends will be automatically sent to your AR wallet below."
  })
  setDictionarys("zh",{
    "wd.title" : "待领取分红",
    "wd.desc" : "最小可领取金额为0.000001，确认领取后，分红将会自动下发到您下面的AR钱包中。"
  })
  onMount(() => {
    props.ref({
      open: (data) => {
        setData(data)
        _whitdraw.showModal()
      },
      close: () => {
        _whitdraw.close()
      },
    })
  })
  return (
    <dialog
      id="withdraw"
      className="modal"
      onCancel={(e) => {
        e.preventDefault()
        return
      }}
      ref={_whitdraw}
    >
      <div className="modal-backdrop backdrop-blur-2xl"></div>
      <div className="modal-box rounded-2xl max-w-[320px]">
        {/* main */}
        <section>
          <div className="flex flex-col justify-center items-center gap-6">
            <p className="text-current/50">{t("wd.title")}</p>
            <p 
              className="text-2xl"
              classList = {{
                "text-current/50" : !data() || data()?.amount < 1
              }}
            >
              ${toBalanceValue(data()?.amount||0,6)}</p>
            <p className="text-current/50 text-sm text-center">{t("wd.desc")}</p>
            <p className="bg-base-300 text-xs rounded-full px-4 py-2">{shortStr(address(),6)}</p>
          </div>
          <div className="w-full flex flex-col gap-4 pt-6">
            <button
              disabled={claiming()||!data() ||data()?.amount<1 || !connected()}
              className="btn btn-primary w-full"
              onClick={()=>{
                setClaiming(true)
                withdraw(protocols?.agent_id)
                .then(async(msg)=>{
                  _whitdraw.close()
                  if(props?.onWithdrawn){
                    props.onWithdrawn(msg)
                  }
                  toast.success("Dividend withdrawn!")
                })
                .catch()
                .finally(()=>{
                  setClaiming(false)
                })
              }}
            >
              {claiming()?<Spinner/>:"Claim"}
            </button>
            <button 
              disabled={claiming()}
              className="btn w-full" 
              onClick={()=>_whitdraw.close()}
            >
              Cancel
            </button>
          </div>
        </section>
      </div>
    </dialog>
  )
}