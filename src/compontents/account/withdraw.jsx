import { Icon } from "@iconify-icon/solid"
import { onMount,createSignal,batch } from "solid-js"
import { toBalanceValue,shortStr } from "../../lib/tools"
import { t,setDictionarys} from "../../i18n"
import toast from "solid-toast"
import Spinner from "../spinner"
import Modal from "../modal"
import { useWallet } from "arwallet-solid-kit"
import { useApp } from "../../contexts"
import { cliamDividends } from "../../api" 


export default props => {
  let _whitdraw
  const {address,connected,wallet} = useWallet()
  const {info} = useApp()
  const [data,setData] = createSignal()
  const [claiming,setClaiming] = createSignal(false)
  const [error,setError] = createSignal(false)
  setDictionarys("en",{
    "wd.title" : "Unclaimed Divedends",
    "wd.desc" : "The minimum claim amount is 0.000001. Once confirmed, dividends will be automatically sent to your AR wallet below."
  })
  setDictionarys("zh",{
    "wd.title" : "待领取分红",
    "wd.desc" : "最小可领取金额为0.000001，确认领取后，分红将会自动下发到您下面的AR钱包中。"
  })
  const handleClaimDividends = ()=>{
    console.log("Cliam Dividends")
    setError(false)
    setClaiming(true)
    cliamDividends({agent_id: info.agent_process, wallet:wallet()})
    .then((msg)=>{
      setData({amount:0})
      _whitdraw.close()
      if(props?.onWithdrawn&&typeof(props?.onWithdrawn) == "function"){
        props.onWithdrawn(msg)
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
        _whitdraw.open()
      },
      close: () => {
        _whitdraw.close()
      },
    })
  })
  return (
    <div>
      <Modal ref={_whitdraw} className="w-[360px] max-[360px]">
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
            onClick={handleClaimDividends}
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