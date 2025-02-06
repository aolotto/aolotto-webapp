import { Modal,ModalContainer } from "./popup"
import { createEffect, createMemo, createSignal, Match, onMount, Show, Switch } from "solid-js"
import { toBalanceValue,shortStr } from "../lib/tool"
import { Icon } from "@iconify-icon/solid"
import { address,walletConnectionCheck,connected } from "./wallet"
import tooltip from "./tooltip"
import { claim,queryCliamResult } from "../api/cliam"
import toast from "solid-toast"
import { protocols} from "../signals/global"
import Spinner from "./spinner"
import { InfoItem } from "./infoitem"


export const Claimer = props => {
  let _claimer
  const pay_i = protocols?.details[protocols.pay_id]
  const rewards = createMemo(()=>props?.rewards||0)
  const tax = createMemo(()=>props?.tax||0)
  const quantity = createMemo(()=>(props?.rewards||0)-(props?.tax||0))
  const user = createMemo(()=>props?.user||address())
  const [editing,setEditing] = createSignal(false)
  const [claiming,setClaiming] = createSignal(false)
  const [recipient,setRecipient] = createSignal()
  const [claimed,setClaimed] = createSignal(false)
  const [activeClaim,setActiveClaim] = createSignal()
  const [activeClaimState,setActiveClaimState] = createSignal(false)
  const [fetchClaimResult,setFetchClaimResult] = createSignal(false)

  onMount(()=>{
    props.ref({
      open:()=>{
        const cache = localStorage.getItem("ACTIVE_CLAIM_"+address())
        if(cache){
          const data = JSON.parse(cache)
          console.log(data)
          setActiveClaim(data)
          setClaimed(true)
          setFetchClaimResult(true)
          queryCliamResult({
            recipient : data.recipient,
            claim_id : data.id,
            token_id : protocols?.pay_id,
            pool_id : protocols?.agent_id
          })
          .then((res)=>{
            setActiveClaimState(true)
            localStorage.removeItem("ACTIVE_CLAIM_"+address())
          })
          .finally(()=>{
            setFetchClaimResult(false)
          })
        }
        _claimer.open()
      },
      close:()=>_claimer.close(),
    })
  })

  return (
    <Modal 
      ref={_claimer}
      id="claimer"
      mask
    >
      <div className="items-center flex flex-col w-80 m-h-48 p-6 gap-6">
        <div className="inline-flex gap-2">
          <Show when={claimed()} fallback={()=><div>
            <span >📥</span> <span className="text-current/50">Claim Your Rewards</span>
          </div>}><span >✅</span> <span className="text-current/50">Claim Submitted</span></Show>
        </div>
        <Switch>
          <Match when={!claimed()}>
            <div className="flex flex-col items-center w-full">
              <span className="text-3xl">{toBalanceValue(rewards()||0,6,3)}</span>
              <span className="text-current/50">${pay_i?.Ticker}</span>
            </div>
            <div className="text-sm text-center flex flex-col items-center gap-2">
              
              <div className="p-2 text-current/50">
                After a tax deduction of <span className="text-base-content">${toBalanceValue(tax()||0,6,3)}</span>, the actual amount received is <span className="text-base-content text-bold">${toBalanceValue(quantity()||0,6,3)}</span>.
              </div>
              
                
            </div>
            <div className="flex flex-col items-center w-[100%] gap-4">
              <Switch>
                <Match when={editing()}>
                  <div className="flex items-center gap-2">
                    <input type="text" value={recipient() || user()} onChange={(v)=>{setRecipient(v.currentTarget.value)}} />
                    <button
                      className="btn btn-primary btn-xs btn-circle"
                      onClick={()=>{
                      console.log("claiming to",recipient()||user())
                      setRecipient(recipient()||user())
                      setEditing(false)
                    }}>
                      <Icon icon="iconoir:check" />
                    </button>
                    <button
                      className="btn btn-xs btn-circle"
                      onClick={()=>setEditing(false)}>
                    <Icon icon="iconoir:cancel" />
                    </button>
                  </div>
                </Match>
                <Match when={!editing()}>
                  <div className="text-sm w-fit flex items-center justify-center text-center px-3 py-1 rounded-full gap-2 hover:bg-base-100">
                    <span className="text-current/50">Recipient:</span>
                    <span use:tooltip={["top",()=>recipient() || user()]}><Show when={connected()} fallback="-">{shortStr(recipient() || user(),4)}</Show></span>
                    <button 
                      className="btn btn-ghost btn-icon btn-xs" 
                      use:tooltip={["top",()=>"Edit Recipient"]}
                      disabled={claiming()||editing()}
                      onClick={()=>setEditing(true)}
                    >
                      <Icon icon="iconoir:edit-pencil" />
                    </button>
                  </div>
                </Match>
              </Switch>
              
              <button 
                className="btn btn-lg btn-primary w-full"
                disabled={claiming()||editing()}
                use:walletConnectionCheck={()=>{
                  setClaiming(true)
                  claim(protocols?.agent_id,recipient()||user())
                  .then(data=>{
                    if(data){
                      localStorage.setItem("ACTIVE_CLAIM_"+address(),JSON.stringify(data))
                      setActiveClaim(data)
                      setClaimed(true)
                      if(props?.onClaimed){
                        props?.onClaimed()
                      }
                    }
                  })
                  .catch(err=>console.log(err))
                  .finally(()=>{
                    setClaiming(false)
                  })
                }}
              >
                {claiming()?<Spinner>Claiming...</Spinner>:"Claim"}
              </button>
              <button 
                className="btn btn-lg w-full"
                onClick={()=>{
                  setClaiming(false)
                  _claimer.close()
                }}
                disabled = {claiming()||editing()}
              > 
                Cancel
              </button>
            </div>
        </Match>
        <Match when={claimed()}>
          <div className="flex flex-col items-center w-full text-balance text-center text-sm">
            <p>Claim applied successfully. The reward will be transferred to your wallet within 24 hours after approval.</p>
            <div className="divider"></div>
            <div className="w-full text-left">
              <InfoItem label={"Prize"} value={toBalanceValue(activeClaim()?.amount,6,6)} />
              <InfoItem label={"Tax"} value={toBalanceValue(activeClaim()?.tax,6,6)} />
              <InfoItem label={"Payable"} value={toBalanceValue(activeClaim()?.quantity,6,6)} />
              <InfoItem label={"Recipient"} value={shortStr(activeClaim()?.recipient,5)} />
              <InfoItem label={"Payment"} value={<Show when={!fetchClaimResult()} fallback={<Spinner/>}>{activeClaimState()?<span className="bg-success text-success-content uppercase inline-flex px-1 py-0.5">Paid</span>:<span className="bg-warning text-warning-content uppercase inline-flex px-1 py-0.5">in approval</span>}</Show>} />
            </div>
          </div>
          <div></div>
          <div  className="flex flex-col items-center w-full gap-2">
            <a className="btn w-full" href={`https://www.ao.link/#/message/${activeClaim()?.id}`} target="_blank">View on ao.link <Icon icon="ei:external-link"></Icon></a>
            <button className="btn w-full btn-primary" onClick={()=>_claimer.close()}>Yes,I know</button>
          </div>
        </Match>
        </Switch>
      </div>
    </Modal>
  )
}