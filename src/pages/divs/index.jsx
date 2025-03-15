import { setDictionarys,t } from "../../i18n"
import { protocols } from "../../data/info"
import { InfoItem } from "../../components/infoitem"
import { Icon } from "@iconify-icon/solid"
import { createEffect, createMemo, createSignal, Match, onMount, Show, Switch,createResource } from "solid-js"
import { connected, handleDisconnection ,address, connecting, wsdk,walletConnectionCheck } from "../../components/wallet"
import { getDateString,shortStr,toBalanceValue} from "../../lib/tool"
import { ALT,refetchALT,stake } from "../../data/resouces"
import { createStore } from "solid-js/store"
import Spinner from "../../components/spinner"
import toast from "solid-toast"
import { createDividends } from "../../data/store"
import Vechart from "../../components/vechart"
import Locker from "../../components/locker"
import { fetchStaker } from "../../api/player"






export default props => {
  let _staking_confirmation
  let _date_force_choose
  let _locker
  setDictionarys("en",{
    "s.title" : ()=><span className="text-balance">Stake <span class="inline-flex bg-primary/10 p-3 rounded-full items-center text-4xl gap-2 scale-110 font-bold text-primary"><image src={`https://arweave.net/${agent_i?.Logo}`} class="size-10 rounded-full inline-flex"/>$ALT</span> for daily dividends</span>,
    "s.desc" : "Stake $ALT for veALT to earn 20% of protocol profits. The veALT amount decays linearly over the selected lock period. Longer lock periods yield more veALT.",
    "s.stake" : "Stake for dividends"
  })
  setDictionarys("zh",{
    "s.title" : ()=> <span className="leading-2">质押<span class="inline-flex bg-primary/10 p-3 rounded-full items-center text-4xl gap-2 scale-110 font-bold text-primary mx-4"><image src={`https://arweave.net/${agent_i?.Logo}`} class="size-10 rounded-full inline-flex"/>$ALT</span>获取协议的每日分红</span>,
    "s.desc" : "质押ALT为VeALT获得协议20%的营收分红，VeALT的数量会随着时间线性衰减，质押周期越长VeALT数量越高。",
    "s.stake" : "质押获取分红"
  })
  // const [stake,{refetch:refetchStakeState}] = createResource(()=>protocols?.stake_id,fetchStakeState)
  const [dividends,{hasMore,loadingMore}] = createDividends(()=>({pool_id:protocols?.pool_id,agent_id:protocols?.agent_id}))
  const [staker,{refetch:refetchStaker}] = createResource(()=>{
    if(connected()&&stake.state == "ready"){return {staker:address(),pid: stake()&&protocols?.stake_id}}
  },fetchStaker)
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
    console.log("stake",stake())
  })

  onMount(()=>{
    console.log(agent_i)
  })
  
  return (
    <>
      <main class="container flex flex-col min-h-lvh/2 overflow-visible py-10">
      
        <section class="response_cols py-10 overflow-visible ">
          
          <div class="col-span-7">
            <h1 class="text-6xl font-medium">{t("s.title")}</h1>
            <p class=" py-10">{t("s.desc")}<a href="">Learn more</a></p>
            {/* <p>
              <button use:walletConnectionCheck={()=>_locker.open()}>show locker</button>
            </p> */}
          </div>
          
          <div class="col-span-4 col-start-9 ">
            <div className="text-sm px-1 flex items-center justify-between">
              <span className=" text-current/50 inline-flex gap-2 items-center"><Show when={connected()} fallback="connecting..."><Icon icon="iconoir:user" />{shortStr(address(),5)}</Show></span>
              <span className="text-current/50 text-xs">200 $ALT</span>
            </div>
            <div class="mt-4 pt-6 border-t px-1 border-current/10 flex justify-between items-start">
              {/* <p className="text-sm text-current/50">Total veALT</p> */}
              <p 
                className="text-2xl font-medium flex gap-2"
                classList = {{
                  "text-current" : staker()?.balance > 0,
                  "text-current/50" : !staker()?.balance ||staker()?.balance <= 0
                }}
              >
                <Show when={stake.state == "ready"} fallback="...">
                  {toBalanceValue(staker()?.balance||0, agent_i.Denomination , agent_i.Denomination)} 
                </Show>
                <span className="text-current/50 text-xs">veALT</span>
              </p>
              <p className="text-current/50 text-sm"><button className="btn btn-square btn-ghost rounded-full text-primary"><Icon icon="fluent:more-vertical-32-filled" /></button></p>
            </div>
            <div class="py-4 px-1 flex items-center justify-center">
              <button 
                className="btn w-full btn-primary btn-xl"
                use:walletConnectionCheck={_locker.open()}
              > 
              <Icon icon="iconoir:lock" />  <span className="text-lg"> Stake ALT for veALT</span>
              </button>
            </div>
            <div className="text-sm flex items-start gap-2 justify-between">
              <p className="text-current/50 pl-1">  <span className="text-base-content">
              200.00000000000</span> $ALT locked until <span className="text-base-content">09/08/2029 11:00</span>
              </p>
              
            </div>
         
          </div>
   
        </section>

        <section class="response_cols py-8 px-1 overflow-visible border-y border-current/10">
          <div class="col-span-7">
            <InfoItem label="Locking balance" value={<Show when={stake.state == "ready"} fallback="...."><span>{toBalanceValue(stake()?.total_supply||0, agent_i.Denomination , agent_i.Denomination)} <span class="inline-flex text-current/50">veALT</span></span></Show>}/>
            <InfoItem label="Locked ALT" value={<Show when={stake.state == "ready"} fallback="..."><span>{toBalanceValue(stake()?.amount||0, agent_i.Denomination , agent_i.Denomination)} <span class="inline-flex text-current/50">$ALT</span></span></Show>} />
            <InfoItem label="Total stakers" value="456" />
          </div>
          <div class="col-span-4 col-start-9">
            <p className="mb-2 text-2xl">💵</p>
            <p className="text-current/50">A total of <span className="text-base-content">$2,000</span> in dividends has been distributed.</p>
          </div>
        </section>

        <section class="response_cols py-10 overflow-visible ">
          <div class="col-span-full">
            <div class="w-full text-center text-current/50"> Next Distribution : <span>Wed,16,2025 00:00:00 GMT</span></div>
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
      <Locker
        staker={staker()}
        staking={stake()}
        ref={_locker}
      />
    </>
    
  )
}