import { Icon } from "@iconify-icon/solid"
import { onMount,createSignal,batch } from "solid-js"
import { toBalanceValue,shortStr } from "../../lib/tools"
import { t,setDictionarys} from "../../i18n"
import toast from "solid-toast"
import Spinner from "../spinner"
import Modal from "../modal"
import { useWallet } from "arwallet-solid-kit"
import { useApp } from "../../contexts"
import { cliamPrize } from "../../api" 


export default props => {
  let _claimer
  const {address,connected,wallet} = useWallet()
  const {info} = useApp()
  const [data,setData] = createSignal()
  const [claiming,setClaiming] = createSignal(false)
  const [error,setError] = createSignal(false)
  setDictionarys("en",{
    "wd.title" : "Unclaimed Prize",
    "wd.desc" : "The minimum claim amount is 0.000001. Once confirmed, dividends will be automatically sent to your AR wallet below."
  })
  setDictionarys("zh",{
    "wd.title" : "待领取奖金",
    "wd.desc" : "最小可领取金额为$0.000001，确认领取后，奖金将会在24小时内审批下发。"
  })
  const handleClaimPrize = ()=>{
    console.log("Cliam Prize")
    setError(false)
    setClaiming(true)
    cliamPrize({agent_id: info.agent_process, wallet:wallet()})
    .then((msg)=>{
      const key = `approve_prize_${info.agent_process}_${address()}`
      // Store the claim data in localStorage for future reference
      const claimData = {id: msg, amount: data()?.amount}
      const localClaimData = localStorage.getItem(key)
      const claimList = localClaimData ? JSON.parse(localClaimData) : []
      claimList.push(claimData)
      localStorage.setItem(key, JSON.stringify(claimList))
      setData({amount:0})
      _claimer.close()
      if(props?.onClaimed&&typeof(props?.onClaimed) == "function"){
        props.onClaimed(claimList)
      }
    })
    .catch((err)=>{
      console.log(err)
      setError(true)
    })
    .finally(()=>setClaiming(false))
  }
  onMount(() => {
    props.ref({
      open: (data) => {
        setData(data)
        _claimer.open()
      },
      close: () => {
        _claimer.close()
      },
    })
  })
  return (
    <div>
      <Modal ref={_claimer} className="w-[360px] max-[360px]">
        <div className="flex flex-col justify-center items-center gap-6  p-4">
          <p className="text-current/50">{t("wd.title")}</p>
          <p 
            className="text-2xl"
            classList = {{
              "text-current/50" : !data() || data()?.amount < 1
            }}
          >
            ${toBalanceValue(data()?.amount||0,6)}</p>
          <p className="text-current/50 text-sm text-center">{t("wd.desc")}</p>
          <Show when={error()}>
            <p className=" text-error text-sm text-center">Cliam Error</p>
          </Show>
          <p className="bg-base-300 text-xs rounded-full px-4 py-2">{shortStr(address(),6)}</p>
        </div>
        <div className="w-full flex flex-col gap-4 p-4">
          <button
            disabled={claiming()||!data() ||data()?.amount<1 || !connected()}
            className="btn btn-primary w-full"
            onClick={handleClaimPrize}
          >
            {claiming()?<Spinner/>:"Submit Claim Request"}
          </button>
          <button 
            disabled={claiming()}
            className="btn w-full" 
            onClick={()=>_claimer.close()}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
    // <dialog
    //   id="withdraw"
    //   className="modal"
    //   onCancel={(e) => {
    //     e.preventDefault()
    //     return
    //   }}
    //   ref={_whitdraw}
    // >
    //   <div className="modal-backdrop backdrop-blur-2xl"></div>
    //   <div className="modal-box rounded-2xl max-w-[320px]">
    //     {/* main */}
    //     <section>
    //       <div className="flex flex-col justify-center items-center gap-6">
    //         <p className="text-current/50">{t("wd.title")}</p>
    //         <p 
    //           className="text-2xl"
    //           classList = {{
    //             "text-current/50" : !data() || data()?.amount < 1
    //           }}
    //         >
    //           ${toBalanceValue(data()?.amount||0,6)}</p>
    //         <p className="text-current/50 text-sm text-center">{t("wd.desc")}</p>
    //         <p className="bg-base-300 text-xs rounded-full px-4 py-2">{shortStr(address(),6)}</p>
    //       </div>
    //       <div className="w-full flex flex-col gap-4 pt-6">
    //         <button
    //           disabled={claiming()||!data() ||data()?.amount<1 || !connected()}
    //           className="btn btn-primary w-full"
    //           onClick={()=>{
    //             setClaiming(true)
    //             withdraw(protocols?.agent_id)
    //             .then(async(msg)=>{
    //               _whitdraw.close()
    //               if(props?.onWithdrawn){
    //                 props.onWithdrawn(msg)
    //               }
    //               toast.success("Dividend withdrawn!")
    //             })
    //             .catch()
    //             .finally(()=>{
    //               setClaiming(false)
    //             })
    //           }}
    //         >
    //           {claiming()?<Spinner/>:"Claim"}
    //         </button>
    //         <button 
    //           disabled={claiming()}
    //           className="btn w-full" 
    //           onClick={()=>_whitdraw.close()}
    //         >
    //           Cancel
    //         </button>
    //       </div>
    //     </section>
    //   </div>
    // </dialog>
  )
}