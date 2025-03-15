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
import {stake_state,refetchStakeState,refetchStaker, staker, balances } from "../data/resouces"

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
    key : "initial",
    title : "Lock ALT to veALT",
    closable : true
  },{
    key : "locking",
    title : "Increase Locking",
    closable : false
  },{
    key : "unlocking",
    title : "Unlocking...",
    closable : false
  }]
  const [fields, setFields] = createStore({days: staker()?.locked_time / 86400000});
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
  createEffect(()=>console.log("staker()",staker()))
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
      <div className="modal-box rounded-2xl max-w-[420px]">
        <div className="modal-top	">
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
        </div>
        <Switch>
          <Match when={mode()?.key == "initial"}>
          <div className="pt-6 mt-6 pb-2 flex items-center gap-2 px-1 border-t border-current/10">
            <Avatar username="1244" class="size-4"/>
            <span className="text-xs text-current/50"><Show when={address()} fallback="...">{shortStr(address(),4)}</Show></span> 
          </div>
          <div className="w-full flex justify-between pb-6 px-1">

            <div className="">
    
                <div className="flex items-center gap-2"><span className="text-xl font-bold"><Show when={staker.state == "ready"} fallback="...">{toBalanceValue(staker()?.balance,agent_i.Denomination , agent_i.Denomination)}</Show></span> <span className=" text-current/50 text-sm">veALT</span></div>
                <div className="text-xs mt-2">
                  <span className=""><Show when={staker.state == "ready"} fallback="...">{toBalanceValue(staker()?.amount,agent_i.Denomination , agent_i.Denomination)}</Show></span> <span className="text-current/50">$ALT locked until </span> <span><Show when={staker.state == "ready"} fallback="...">{new Date(staker()?.start_time + staker()?.locked_time).toLocaleString()}</Show></span></div>
          
            </div>
            <div>
    
              <div className="dropdown dropdown-hover dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-square btn-sm rounded-full"><Icon icon="iconoir:more-vert" /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
                  <li><a>Unlock</a></li>
                  <li><a>Detail</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-bottom">
            <from class=" flex w-full flex-col gap-2">
              <fieldset className="fieldset p-4 rounded-lg bg-base-200">
                {/* <legend class="fieldset-legend text-sm">Increase</legend> */}
                

                <section>
                  <div className="flex items-center gap-2 text-sm justify-between w-full pb-2">
                    <span class="font-bold text-current/50">Locked Amount</span>
                    <p class="text-current/50 flex items-center gap-2">
                      <span className="text-xs">
                        <Show when={connected()&&balances.state=="ready"} fallback="...">
                          {toBalanceValue(balances()?.[agent_i?.Id]||0,agent_i?.Denomination,agent_i?.Denomination)}
                        </Show>
                      </span>
                      <button
                        class="btn btn-xs"
                        disabled={balances.loading||connecting()}
                        onClick={()=>{
                          setFields("amount",balances()?.[agent_i?.Id] / 1000000000000)
                        }}
                      >
                        MAX
                      </button>
                    </p>
                  </div>
                  <label
                    className="input input-md w-full"
                    classList = {{
                      "input-error" : errors?.amount
                    }}
                  >
                    <input 
                      type="digit" 
                      placeholder="0" 
                      value={fields?.amount || null} 
                      name="amount" 
                      min={1} 
                      max={balances()?.[agent_i?.Id] / 1000000000000 || 0} 
                      step ={0.000000000001} 
                      onChange={(e) => setFields(e.target.name, e.target.value)}
                    />
                    <span className="text-current/50">$ALT</span>
                  </label>

                </section>

                <section>
                  <div className=" flex items-center gap-2 text-sm justify-between w-full py-2">
                    <span class="font-bold text-current/50">locked days</span>
                    <div className="flex gap-1 items-center">
                      <div className="tooltip" data-tip="1 week">
                        <button class="btn btn-xs  uppercase " onClick={()=>setFields("days",7)}>1W</button>
                      </div>
                      <div className="tooltip" data-tip="1 month">
                        <button class="btn btn-xs  uppercase " onClick={()=>setFields("days",30)}>1M</button>
                      </div>
                      <div className="tooltip" data-tip="1 year">
                        <button class="btn btn-xs  uppercase " onClick={()=>setFields("days",360)}>1Y</button>
                      </div>
                      <div className="tooltip" data-tip="4 years">
                        <button class="btn btn-xs  uppercase " onClick={()=>setFields("days",1440)}>4Y</button>
                      </div>
                    </div>
                  </div>
                  {/* <label
                    className="input input-md w-full"
                    classList = {{
                      "input-error" : errors?.date
                    }}
                  >
                    <input 
                      type="datetime-local" 
                      placeholder="0" 
                      value={fields?.date || null}
                      name="date"
                      min={getDateTimeString(new Date().getTime()+7*24*60*60*1000)} 
                      onChange={(e) => {
                        console.log("onChange",new Date(e.target.value))
                        setFields(e.target.name, e.target.value)
                        setFields("duration",Date.parse(e.target.value)-new Date().getTime())
                      }}
                    />
                  </label> */}
                  <input 
                    type="range" 
                    min={7} 
                    max={1440}
                    value={fields?.days || 7}
                    className="range w-full"
                    onInput={e=>setFields("days",e.target.value)}
                  />

                </section>
                <section class="mt-2 flex items-center justify-between">
                  <div>
                    <input 
                      type="number" 
                      className="text-xs w-fit text-center px-0 border bg-base-100 border-base-300 p-1 rounded-sm mr-1 max-w-12" 
                      value={fields?.days || 7}
                      onChange={e=>setFields("days",e.target.value)}
                      min={7}
                      max={1440}
                    /> 
                    <span className="text-xs">days = {(ve_amount()||0).toFixed(3)} veALT</span>
                  </div>
                  
                  <button
                    class="btn btn-primary"
                    onClick={()=>{
                      setMode(modes[1])
                      setSubmission({
                        amount : fields.amount * 1000000000000,
                        days : fields.days,
                        duration : fields.days * 24 * 60 * 60 * 1000,
                        unlock_time : fields.days * 24 * 60 * 60 * 1000 + Date.now(),
                        ve_amount : ve_amount() * 1000000000000
                      })
                    }}
                    disabled={!enable_lock()}
                  >
                    <Icon icon="gg:lock" />lock
                  </button>
                </section>
              
              </fieldset>

                
            </from>
          </div>
          <div className="modal-action justify-between text-xs">
            <span className="text-current/50">Increasing your stake will update the lock-up time to your latest selection. <a>learn more</a></span>
          </div>
          </Match>
          <Match when={mode()?.key == "locking"}>
     
            <div className="modal-middle mt-6">
              <p className="mb-4 text-sm">Lock {toBalanceValue(submission()?.amount,12,3)} ALT until {new Date(submission()?.unlock_time).toLocaleString()}. The lock-up period is {submission()?.days} days, and you will receive 20 veALT, which will linearly decay to 0.</p>
              <Vechart/>
            
            </div>
            <div className="modal-action">
            <button className="btn" onClick={()=>setMode(modes[0])}>cancel</button>
            <button 
              className="btn btn-primary"
              disabled = {submitting()}
              use:walletConnectionCheck={()=>{
                setSubmitting(true)
                submitStaking({
                  agent_id : protocols.agent_id,
                  stake_id : protocols.stake_id,
                  quantity : Math.floor(submission()?.amount),
                  duration : Math.floor(submission()?.duration),
                })
                .then(res=>{
                  refetchStaker()
                  refetchStakeState()
                  console.log(res)
                  setMode(modes[0])
                })
                .catch(err=>{
                  console.error(err)
                })
                .finally(()=>setSubmitting(false))
              }}
            >
                {submitting()?<Spinner/>:"submit"}
            </button>
            </div>
          </Match>
          <Match when={mode()?.key == "unlocking"}>
          <div>unlocking</div>
          <div className="modal-action">
            <button className="btn" onClick={()=>setMode(modes[0])}>cancel</button>
            <button 
              className="btn btn-primary"
              disabled = {submitting()}
              use:walletConnectionCheck={()=>{
                setSubmitting(true)
                submitStaking({
                  agent_id : protocols.agent_id,
                  stake_id : protocols.agent_id,
                  quantity : Math.floor(submission()?.amount),
                  duration : Math.floor(submission()?.duration),
                })
                .then(res=>{
                  console.log(res)
                })
                .catch(err=>{
                  console.error(err)
                })
                .finally(()=>setSubmitting(false))
              }}
            >
                {submitting()?<Spinner/>:"submit"}
            </button>
          </div>
          </Match>
        </Switch>
        
      </div>
      
    </dialog>
  )
}