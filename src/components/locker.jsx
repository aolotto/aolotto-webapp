import { createEffect, createSignal, Match, onMount, Switch, createMemo } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { setDictionarys,t } from "../i18n/index"
import { protocols } from "../data/info"
import Spinner from "./spinner"
import { connected, handleDisconnection ,address, connecting, wsdk, walletConnectionCheck } from "./wallet"
import { InfoItem } from "./infoitem"
import { createStore } from "solid-js/store"
import { shortStr, toBalanceValue } from "../lib/tool"
import { AO } from "../lib/ao"
import Vechart from "./vechart"
import Avatar from "./avatar"
// import {stake_state,refetchStakeState,refetchStaker, staker, balances } from "../data/resouces"
import { ALT,refetchALT } from "../data/resouces"

const submitStaking = ({
  agent_id,
  stake_id,
  quantity,
  duration,
}) => new Promise(async(resovle,reject)=>{
  try {
    if(!agent_id){
      reject(new Error("Missed agent id"))
    }
    const ao = new AO({wallet:wsdk()})
    const tags = {
      Action: "Transfer",
      Quantity: String(quantity),
      Recipient: stake_id || protocols.stake_id,
      ['X-Locked-Time']: String(duration),
      ['X-Transfer-Type'] : "Stake"
    }

    const msg =  await ao.message({
      process: agent_id || protocols.agent_id,
      tags
    })
    if(!msg){reject("Send message error")}
    const {Messages} = await ao.result({
      process: agent_id,
      message: msg
    })
    console.log(Messages)
    if(!Messages||Messages?.length<1){
      reject(new Error("Transaction error"))
    }else{
      console.log
      resovle(msg)
    }
  } catch (error) {
    reject(error)
  }
})

export default props => {
  let _locker
  const agent_i = protocols?.details[protocols.agent_id]
  const modes = [{
    key : "inputing",
    title : "ALT locker",
    closable : true
  },{
    key : "comfirming",
    title : "Lock information",
    closable : false
  }]
  const [fields, setFields] = createStore({days: props?.staker?.locked_time / 86400000});
  const [errors, setErrors] = createStore();
  const [mode,setMode] = createSignal(modes[0])
  // const [now,setNow] = createSignal(new Date().getTime())
  const enable_lock = createMemo(()=>fields?.amount)
  const ve_amount = createMemo(()=>Math.min((fields?.days||7) / 1440 , 1) * (fields?.amount||0))
  const [submission,setSubmission] = createSignal()
  const [submitting,setSubmitting] = createSignal(false)
  const [submited,setSubmited] = createSignal()
  
  onMount(()=>{
      props.ref({
        open:()=>{
          setMode(modes[0])
          // setNow(new Date().getTime())
          _locker.showModal()
        },
        close:()=>{
          setMode(modes[0])
          _locker.close()
        },
      })
      
    })
  createEffect(()=>console.log("staker()",props?.staker))
  return(
    <dialog
      id="locker"
      className="modal"
      onCancel={(e)=>{
        e.preventDefault()
        return
      }}
      ref={_locker}
    >
      <div className="modal-backdrop backdrop-blur-2xl"></div>
      <div className="modal-box rounded-2xl max-w-[400px]">
        {/* top */}
        <section className="modal-top	">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-circle btn-ghost absolute right-2 top-4"
              disabled={mode()?.closable == false}
            >
              <Icon icon="iconoir:cancel" class=" scale-150"></Icon>
            </button>
          </form>
          <h3 className="text-lg">{mode()?.title}</h3>
        </section>
        {/* main */}
        <div>
          <Switch>
            <Match when={mode()?.key == "inputing"}>
              <section className="px-1 py-6 w-full flex flex-col gap-4">
                <div className="text-current/50 text-xs">Locking 1 $ALT for ≥1440 days (4 years) yields 1 veALT, while the minimum lock time of 7 days yields 0.005 veALT. veALT decays as time decreases.</div>
                <div>
                  <div className="flex items-center gap-2 text-sm justify-between w-full pb-2">
                    <span class="font-bold text-current/50">Locked Amount</span>
                    <p class="text-current/50 flex items-center gap-2">
                      <span className="text-xs">
                        <Show when={connected() && ALT.state == "ready"} fallback="...">
                          {toBalanceValue(ALT() || 0, agent_i?.Denomination, agent_i?.Denomination)}
                        </Show>
                      </span>
                      <button
                        class="btn btn-xs"
                        disabled={ALT.loading || connecting()}
                        onClick={() => {
                          setFields("amount", ALT() / 1000000000000)
                        }}
                      >
                        MAX
                      </button>
                    </p>
                  </div>
                  <label
                    className="input input-md w-full"
                    classList={{
                      "input-error": errors?.amount
                    }}
                  >
                    <input
                      type="digit"
                      placeholder="0"
                      value={fields?.amount || null}
                      name="amount"
                      min={1}
                      max={ALT() / 1000000000000 || 0}
                      step={0.000000000001}
                      onChange={(e) => setFields(e.target.name, e.target.value)}
                    />
                    <span className="text-current/50">$ALT</span>
                  </label>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm justify-between w-full pb-2">
                    <span class="font-bold text-current/50">Unlock Time</span>
                    <p class="text-current/50 flex items-center gap-2">
                      <span className="text-xs">
                        <Show when={connected() && ALT.state == "ready"} fallback="...">
                          {toBalanceValue(ALT() || 0, agent_i?.Denomination, agent_i?.Denomination)}
                        </Show>
                      </span>
                      <button
                        class="btn btn-xs"
                        disabled={ALT.loading || connecting()}
                        onClick={() => {
                          setFields("amount", ALT() / 1000000000000)
                        }}
                      >
                        MAX
                      </button>
                    </p>
                  </div>
                  <label
                    className="input w-full"
                    classList={{
                      "input-error": errors?.amount
                    }}
                  >
                    <input
                      type="datetime-local"
                      placeholder="0"
                      value={fields?.date || null}
                      name="date"
                      onChange={(e) => setFields(e.target.name, e.target.value)}
                    />
                  </label>
                </div>

              </section>
            </Match>
            <Match when={mode()?.key =="comfirming"}>
              <div>
                condfsdssg
              </div>
            </Match>
          </Switch>

          
        </div>
        {/* bottom */}
        <section className="modal-action">
          <button className="btn btn-primary">Lock</button>
        </section>
      </div>
    </dialog>
  )
}