import { setDictionarys,t } from "../../i18n"
import { protocols } from "../../signals/global"
import { InfoItem } from "../../components/infoitem"
import { Icon } from "@iconify-icon/solid"
import { createEffect, createMemo, createSignal, Match, onMount, Show, Switch } from "solid-js"
import { connected, handleDisconnection ,address, connecting, wsdk } from "../../components/wallet"
import { getDateString,shortStr,toBalanceValue} from "../../lib/tool"
import { balances,refetchUserBalances,player,refetchPlayer } from "../../signals/player"
import { createStore } from "solid-js/store"
import { AO } from "../../lib/ao"
import Spinner from "../../components/spinner"
import toast from "solid-toast"
import { createDividends } from "../../signals/alt"
import { stake_state,refetchStakeState } from "../../signals/stake"
import Vechart from "../../components/vechart"


const ErrorMessage = (props) => <span class="text-xs text-error">{props.error}</span>;

const submitStaking = ({
  agent_id,
  stake_id,
  quantity,
  duration,
  unlock_time
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
    if(!Messages||Messages?.length<1){
      reject(new Error("Transaction error"))
    }else{
      resovle(msg)
    }
  } catch (error) {
    reject(error)
  }
})



export default props => {
  let _staking_confirmation
  let _date_force_choose
  setDictionarys("en",{
    "s.title" : ()=><span className="text-balance">Stake <span class="inline-flex bg-primary/10 p-3 rounded-full items-center text-4xl gap-2 scale-110 font-black text-primary"><image src={`https://arweave.net/${agent_i?.Logo}`} class="size-10 rounded-full inline-flex"/>$ALT</span> for daily dividends</span>,
    "s.desc" : "Stake $ALT for veALT to earn 20% of protocol profits. The veALT amount decays linearly over the selected lock period. Longer lock periods yield more veALT.",
    "s.stake" : "Stake for dividends"
  })
  setDictionarys("zh",{
    "s.title" : ()=> <span className="leading-2">质押<span class="inline-flex bg-primary/10 p-3 rounded-full items-center text-4xl gap-2 scale-110 font-black text-primary mx-4"><image src={`https://arweave.net/${agent_i?.Logo}`} class="size-10 rounded-full inline-flex"/>$ALT</span>获取协议的每日分红</span>,
    "s.desc" : "质押ALT为VeALT获得协议20%的营收分红，VeALT的数量会随着时间线性衰减，质押周期越长VeALT数量越高。",
    "s.stake" : "质押获取分红"
  })
  const [dividends,{hasMore,loadingMore}] = createDividends(()=>({pool_id:protocols?.stake_id,agent_id:protocols?.agent_id}))
  const agent_i = protocols?.details[protocols.agent_id]
  const now = new Date().getTime()

  const [fields, setFields] = createStore();
  const [errors, setErrors] = createStore();
  const [days,setDays] = createSignal("7")
  const rate = createMemo(()=>{
    return (Number(days())/1440*1).toFixed(4)
  })
  const [submition,setSubmition] = createSignal()
  const [locking,setLocking] = createSignal(false)

  const diffdays = createMemo(()=>fields?.date?Math.ceil((Date.parse(fields?.date + " 00:00:00") - now)/86400000): "0")
  const ve_amount = createMemo(()=>(diffdays()/1440)*(fields?.amount||0))
  const enable_stake = createMemo(()=>fields?.date&&fields?.amount)

  const validateForm = (el,accessor) => {
    el.addEventListener("click",(e)=>{
      const {amount,date} = fields
      if(!amount||Number(amount)<1){
        setErrors("amount","Amount must be greater than 1 $ALT")
      }
      if(!errors.amount&&!errors.date){
        accessor()?.()
      }else{
        e.preventDefault()
      }
    })
  }

  createEffect(()=>{
    console.log("stake_state",stake_state())
  })

  onMount(()=>{
    console.log(agent_i)
  })
  
  return (
    <>
      <main class="container flex flex-col min-h-lvh/2 overflow-visible py-10">
      
        <section class="response_cols py-10 overflow-visible ">
          
          <div class="col-span-7">
            <h1 class="text-6xl ">{t("s.title")}</h1>
            <p class=" py-10">{t("s.desc")}<a href="">Learn more</a></p>
          </div>
          <from 
            id="stake_from" 
            class="col-span-4 col-start-9 flex flex-col gap-4"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend flex items-center gap-2 text-sm justify-between w-full pb-2">
                <span class="font-bold text-current/50">Staking Amount</span>
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
              </legend>
              <label
                className="input input-lg w-full"
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
              {errors?.amount && <ErrorMessage error={errors.amount} />}
              {/* <p className="validator-hint text-xs uppercase">Must be between 1 to 10</p> */}
              {/* <p className="fieldset-label">$ALT balance : 20.00</p> */}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend flex items-center gap-2 text-sm justify-between w-full pb-2">
                <span class="font-bold text-current/50">Unlock Date</span>
                <div className="flex gap-1 items-center">
                  <div className="tooltip" data-tip="1 week">
                    <button class="btn btn-xs  uppercase " onClick={()=>setFields("date",getDateString(now+7*24*60*60*1000))}>1W</button>
                  </div>
                  <div className="tooltip" data-tip="1 month">
                    <button class="btn btn-xs  uppercase " onClick={()=>setFields("date",getDateString(now+10*24*60*60*1000))}>1M</button>
                  </div>
                  <div className="tooltip" data-tip="1 year">
                    <button class="btn btn-xs  uppercase " onClick={()=>setFields("date",getDateString(now+360*24*60*60*1000))}>1Y</button>
                  </div>
                  <div className="tooltip" data-tip="4 years">
                    <button class="btn btn-xs  uppercase " onClick={()=>setFields("date",getDateString(now+1440*24*60*60*1000))}>4Y</button>
                  </div>
                  <button class="btn btn-xs btn-square" popovertarget="popover-1" style="anchor-name:--anchor-1"><Icon icon="iconoir:arrow-separate-vertical" width="24" height="24" /></button>
          

                  <div ref={_date_force_choose} className="dropdown menu w-80 p-4 rounded-2xl bg-base-100 shadow-lg border border-base-300 -left-70 flex flex-col gap-2" popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */ }>
                    {/* <For each={[{
                      name: "1 week",
                      rate: "0.0001",
                      value: 7*24*60*60*1000
                    },{
                      name: "1 month",
                      rate: "0.001",
                      value: 30*24*60*60*1000
                    },{
                      name: "3 months",
                      rate: "0.003",
                      value: 30*24*60*60*1000
                    },{
                      name: "4 years",
                      rate: "1",
                      value: 1440*24*60*60*1000
                    }]}>
                      {item=><li>
                        <button className="btn w-full flex justify-between items-center" onClick={()=>_date_force_choose.hidePopover()}>
                          <span>{item.name}</span>
                          <span>{item.rate}</span>
                        </button>
                      </li>}
                    </For> */}
                    {/* <div className="text-md">Select staking period</div> */}
                    <div className="pt-4 pb-1">
                      <div class="text-xs uppercase flex justify-between items-center border-x mx-3 box-content px-2 text-current/50 border-current/50 pb-2">
                        <span>7 days</span>
                        <span>4 years</span>
                      </div>
                      <input type="range" min="7" max="1440" value="40" step="1" className="range w-full" onInput={(e)=>{setDays(e.target.value)}} />
                    </div>
                    
                    <div>

                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div className="text-md flex flex-col">
                        <p>{days()} <span className="text-current/50">days</span></p>
                        <p>1 <span className="text-current/50">$ALT = </span> {rate()||0} <span className="text-current/50">veALT</span> </p>
                      </div>
                      {/* <button class="btn btn-sm">Cancel</button> */}
                      <button 
                        class="btn btn-primary btn-square rounded-full"
                        onClick={(e)=>{
                          const ts = now + Number(days())*24*60*60*1000
                          setFields("date",getDateString(ts))
                          _date_force_choose.hidePopover()
                          e.preventDefault()
                        }}
                      >
                        <Icon icon="iconoir:check" width="24" height="24" />
                      </button>
                    </div>
                  </div>
   
                </div>
              </legend>
              <input 
                type="date" 
                required 
                className="input w-full input-lg" 
                name="date" 
                value={fields.date} 
                min={getDateString(now+7*24*60*60*1000)} 
                max={getDateString(now+1440*24*60*60*1000)} 
                onChange={(e) => setFields(e.target.name, e.target.value)}
              />
              {/* <p className="fieldset-label">Optional</p> */}
              
            </fieldset>
            <div class="text-xs text-current/50">
              Lock <Show when={fields?.amount} fallback="0">{()=>Number(fields?.amount||0).toFixed(6)}</Show> $ALT for {diffdays()} days = {ve_amount()?.toFixed(6)} veALT
            </div>
            <div class="w-full flex items-center justify-between">
              <Show when={connected()} fallback={<button class="btn btn-primary btn-lg w-full" onClick={handleDisconnection} disabled={connecting()}>{connecting()?"Connecting...":"Connect Wallet"}</button>}>
                <button 
                  class="btn btn-primary btn-lg w-full"
                  type="submit"
                  disabled={!enable_stake()}
                  use:validateForm={(e)=>{
                    const start_time = Date.now()
                    const duration = diffdays()*24*60*60*1000
                    setSubmition({
                      amount: fields?.amount,
                      start_time : start_time,
                      unlock_time: duration + start_time,
                      duration: duration,
                      staker : address(),
                    })
                    _staking_confirmation.showModal()
                  }}
                >
                  Stake for dividends
                </button>
              </Show>
            </div>
          </from>
          
        </section>

        {/* <section class="response_cols py-10 overflow-visible border-y border-current/10">
          <div class="col-span-6 flex items-center gap-4">
            
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Staking Amount</legend>
              <label className="input">
                <input type="number" className="grow" placeholder="0" />
                <span className="text-current/50">$ALT</span>
              </label>
              <p className="fieldset-label">$ALT balance : 20.00</p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Unlock Date?</legend>
              <input type="date" className="input" placeholder="Type here" />
              <p className="fieldset-label">Optional</p>
            </fieldset>
            <button class="btn btn-primary">Stake</button>
          </div>
         
          <div class="col-span-6">
          </div>
        </section> */}

        <section class="response_cols py-10 overflow-visible border-y border-current/10">
          <div class="col-span-7">
            <div class="mb-4">
              <p className="text-sm text-current/50">Total Locked ALT (veALT)</p>
              <p className="text-3xl"><Show when={stake_state.state == "ready"} fallback="...">{toBalanceValue(stake_state()?.total_supply||0, agent_i.Denomination , agent_i.Denomination)} </Show></p>
            </div>
            <InfoItem label="Total Staking" value={<Show when={stake_state.state == "ready"} fallback="..."><span>{toBalanceValue(stake_state()?.staking||0, agent_i.Denomination , agent_i.Denomination)} <span class="inline-flex text-current/50">$ALT</span></span></Show>} />
            <InfoItem label="Total Stakers" value={<Show when={stake_state.state == "ready"} fallback="...">{stake_state()?.staker}</Show>} />
            <InfoItem label="Divs Distributed" value="$20000000.00" />
          </div>
          <div class="col-span-4 col-start-9">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm">Your VeALT</p>
                <p className="text-2xl">{<Show when={balances.state == "ready"} fallback="...">{toBalanceValue(balances()?.[protocols.stake_id],agent_i.Denomination , agent_i.Denomination)}</Show>}</p>
              </div>
              
              <div>
                <button className="btn rounded-full btn-outline btn-primary"><Icon icon="iconoir:priority-up" width="24" height="24" />Boost</button>
              </div>
            </div>
            <InfoItem className="text-sm" label="Staked ALT" value={<span>20000000.00 <span class="inline-flex text-current/50">$ALT</span></span>} />
            <InfoItem className="text-sm" label="Stakings" value="200" />
            <InfoItem className="text-sm" label="Dividends" value="$20000000.00" />
          </div>
        </section>

        <section class="response_cols py-10 overflow-visible ">
          <div class="col-span-full">
            <div class="w-full text-center"> Next Distribution : Wed,16,2025 00:00:00 GMT</div>
          </div>

          <div class="col-span-full">
            <div className="overflow-x-auto">
              <table className="response_table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Dividends</th>
                    <th class="text-right">Distribute To</th>
                    <th class="text-right">More</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={dividends()} fallback="loading...">
                    {item=>
                     <tr>
                     <th class="w-4">{item.ref}</th>
                     <td data-label="Name">{new Date(item?.checkpoint?Number(item?.checkpoint):item.timestamp*1000).toLocaleDateString()}</td>
                     <td data-label="Job">${toBalanceValue(item?.amount||0,6,3)}</td>
                     <td data-label="Favorite Color" class="text-right">{item?.addresses}</td>
                     <td data-label="Favorite Color" class="text-right flex items-center gap-2 justify-end">{shortStr(item.id,4)} <a harf=""><Icon icon="ei:external-link"></Icon></a></td>
                   </tr>
                    }
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <dialog id="staking_confirmation" className="modal" ref={_staking_confirmation}>
        <div className="modal-box rounded-2xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-circle btn-ghost absolute right-2 top-3"
              disabled={locking()}
            >
              <Icon icon="iconoir:cancel" class=" scale-150"></Icon>
            </button>
          </form>
          <h3 className="font-bold text-lg pb-2">Lock $ALT to veALT</h3>
          <div className="w-full flex flex-col gap-4">
            <div class=" my-4">
              <Vechart/>
            </div>
            
            <div>Once $ALT is locked, it can only be unlocked after the unlock date.</div>
            <div>
              <InfoItem label="Staker" value={()=>shortStr(submition()?.staker || "",6)}/>
              <InfoItem label="Amount" value={()=>Number(submition()?.amount || 0).toFixed(12)+ " $ALT" }/>
              <InfoItem label="Period" value={()=>Math.ceil(Number(submition()?.duration || 0) / 86400000) + " days"}/>
              <InfoItem label="Unlock Date" value={()=>submition()?.start_time}/>
              <InfoItem label="Unlock Date" value={()=>submition()?.unlock_time}/>
            </div>

          </div>
          
          
          <div className="modal-action">
          <button 
            className="btn"
            disabled={locking()}
            onClick={()=>_staking_confirmation.close()}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            disabled={locking()}
            onClick={(e)=>{
              setLocking(true)
              const params = {
                agent_id : protocols.agent_id,
                stake_id : protocols.stake_id,
                quantity : Math.floor(Number(submition()?.amount || 0) * 1000000000000),
                duration : submition().duration
              }
              console.log("lock",params)
              submitStaking(params)
              .then(msgid=>{
                console.log(msgid)
                _staking_confirmation.close()
                toast.success("Staked!")
                refetchUserBalances()
              })
              .catch((e)=>{
                console.log(e)
              })
              .finally(()=>{
                setLocking(false)
              })

              e.preventDefault()
            }}
          >
            {locking()?<span className=" inline-flex items-center"><Spinner/>Locking...</span>:"Lock $ALT"}
          </button>
          </div>
        </div>
      </dialog>
      </main>
    </>
    
  )
}