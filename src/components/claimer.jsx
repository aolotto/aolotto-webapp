import { Modal,ModalContainer } from "./popup"
import { createEffect, createMemo, createSignal, Match, onMount, Show, Switch } from "solid-js"
import { currency } from "../signals/global"
import { toBalanceValue,shortStr } from "../lib/tool"
import { Icon } from "@iconify-icon/solid"
import { address,walletConnectionCheck,connected } from "./arwallet"
import tooltip from "./tooltip"
import { claim } from "../api/cliam"
import toast from "solid-toast"
import { pool } from "../signals/global"
import Spinner from "./spinner"



export const Claimer = props => {
  let _claimer
  
  const rewards = createMemo(()=>props?.rewards||0)
  const tax = createMemo(()=>props?.tax||0)
  const quantity = createMemo(()=>(props?.rewards||0)-(props?.tax||0))
  const user = createMemo(()=>props?.user||address())
  const [editing,setEditing] = createSignal(false)
  const [claiming,setClaiming] = createSignal(false)
  const [recipient,setRecipient] = createSignal()

  onMount(()=>{
    props.ref({
      open:()=>_claimer.open(),
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
        <div className="text-current/50">📥 Claim your reward</div>
        <div className="flex flex-col items-center w-full">
          <span className="text-3xl">{toBalanceValue(rewards()||0,6,3)}</span>
          <span className="text-current/50">${currency.ticker}</span>
        </div>
        <div className="text-sm text-center flex flex-col items-center gap-2">
          
          <div className="p-2 text-current/50">
            After a tax deduction of <span className="text-base-content">${toBalanceValue(tax()||0,6,3)}</span>, the actual amount received is <span className="text-base-content text-bold">${toBalanceValue(quantity()||0,6,3)}</span>.
          </div>
          
            
        </div>
        <div className="flex flex-col items-center w-[100%] gap-4">
          <Switch>
            <Match when={editing()}>
              <div>
                <input type="text" value={user()} />
                <button>yes</button>
                <button onClick={()=>setEditing(false)}>no</button>
              </div>
            </Match>
            <Match when={!editing()}>
              <div className="text-sm w-fit flex items-center justify-center text-center px-3 py-1 rounded-full gap-2 hover:bg-base-100">
                <span className="text-current/50">Recipient:</span>
                <span use:tooltip={["top",()=>user()]}><Show when={connected()} fallback="-">{shortStr(user(),4)}</Show></span>
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
              claim(pool.id,recipient()||user())
              .then(res=>{
                console.log(res)
                _claimer.close()
                if(props?.onClaimed){
                  props.onClaimed(res)
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
      </div>
    </Modal>
  )
}