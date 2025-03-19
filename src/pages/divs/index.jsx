import { setDictionarys,t } from "../../i18n"
import { protocols } from "../../data/info"
import { Icon } from "@iconify-icon/solid"
import { createEffect, createMemo, createSignal, Match, onMount, Show, Switch,createResource, Suspense } from "solid-js"
import { connected ,address, connecting, walletConnectionCheck,handleConnection } from "../../components/wallet"
import { getDateTimeString,shortStr,toBalanceValue} from "../../lib/tool"
import { ALT,refetchALT,refetchStake,stake } from "../../data/resouces"
import { createStore } from "solid-js/store"
import Spinner from "../../components/spinner"
import toast from "solid-toast"
import { createDividends } from "../../data/store"
import Locker from "../../components/locker"
import Unlock from "../../components/unlock"
import Boost from "../../components/boost"
import { fetchStaker } from "../../api/player"
import Empty from "../../components/empty"
import { pool } from "../../data/resouces"
import { Datetime, Moment } from "../../components/moment"






export default props => {
  let _locker
  let _unlock
  let _boost
  setDictionarys("en",{
    "s.title" : ()=><span className="text-balance">Stake <span class="inline-flex bg-primary/10 p-3 rounded-full items-center text-4xl gap-2 scale-110 font-bold text-primary border border-current/30"><image src={`https://arweave.net/${agent_i?.Logo}`} class="size-10 rounded-full inline-flex"/>$ALT</span> for daily dividends</span>,
    "s.desc" : "Stake $ALT for veALT and earn 20% of the protocol’s total sales revenue (equivalent to 50% of accumulated profits). The veALT amount decays linearly over the remaining lock period—the longer the lock, the more veALT you get.",
    "s.count" : (v)=><span><span className="text-base-content">{v.stakers}</span> stakers have locked a total of <span className="text-base-content">{v.amount}</span> $ALT</span>,
    "s.stake" : "Lock",
    "l.lock_amount" : "Locked Amount",
    "l.unlock_time" : "Unlock Time",
    "l.next_distribution" : "Next Distribution",
    "s.form_tip" : (v)=><span>Lock {v?.amount || 0} $ALT for {v.days} days</span>,
    "b.connect_first" : "Connect wallet first"
  })
  setDictionarys("zh",{
    "s.title" : ()=> <span className="leading-2">质押<span class="inline-flex bg-primary/10 p-3 rounded-full items-center text-4xl gap-2 scale-110 font-bold text-primary mx-4"><image src={`https://arweave.net/${agent_i?.Logo}`} class="size-10 rounded-full inline-flex"/>$ALT</span>获取协议的每日分红</span>,
    "s.desc" : "质押 $ALT 获得 veALT，并享受协议总销售收入的 20% 分红（相当于 50% 的累计利润）。veALT 数量会随锁仓剩余时间线性衰减，锁定时间越长，获得的 veALT 越多。",
    "s.count" : (v)=><span><span className="text-base-content">{v.stakers}</span> 位质押者累计锁定 <span className="text-base-content">{v.amount}</span> $ALT</span>,
    "s.stake" : "锁仓",
    "l.lock_amount" : "锁定金额",
    "l.unlock_time" : "解锁时间",
    "l.next_distribution" : "下一次分红",
    "s.form_tip" : (v)=><span>锁定 {v?.amount || 0} $ALT {v.days} 天</span>,
    "b.connect_first" : "链接钱包"
  })
  // const [stake,{refetch:refetchStakeState}] = createResource(()=>protocols?.stake_id,fetchStakeState)
  const [dividends,{hasMore,loadingMore}] = createDividends(()=>({pool_id:protocols?.pool_id,agent_id:protocols?.agent_id}))
  const [staker,{refetch:refetchStaker}] = createResource(()=>{
    if(connected()&&stake.state == "ready"){return {staker:address(),pid: stake()&&protocols?.stake_id}}
  },fetchStaker)
  const agent_i = protocols?.details[protocols.agent_id]
  const [now,setNow] = createSignal(Date.now())
  

  const [fields, setFields] = createStore();
  const [errors, setErrors] = createStore();

  const diffdays = createMemo(()=>fields?.date?Math.ceil((Date.parse(fields?.date) - now())/86400000): 0)
  const min_time_ts = createMemo(()=>{
    const min_dur = 604800000 // 7 * 24 * 60 * 60 * 1000
    let reslut
    if(staker()?.locked_time){
      reslut = Math.max(now()+min_dur, now() + staker().locked_time)
    }else{
      reslut = now()+min_dur
    }
    setFields("date",getDateTimeString(reslut))
    return reslut
  })

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

  // createEffect(()=>{
  //   if(min_time_ts()){
  //     setFields("date",min_time_ts())
  //   }
  // })

  onMount(()=>{
    console.log(agent_i)
    setNow(Date.now())
  })
  
  return (
    <>
      <main class="container flex flex-col min-h-lvh/2 overflow-visible py-10">
      
        <section class="response_cols py-10 overflow-visible ">
          
          <div class="col-span-7 flex flex-col justify-between">
            <div>
              <h1 class="text-6xl font-medium">{t("s.title")}</h1>
              <p class=" py-10">{t("s.desc")}<a href="https://docs.aolotto.com/en/staking" target="_blank" class="inline-flex pl-2 items-center">Learn more <Icon icon="ei:external-link"></Icon></a></p>
            </div>
            <div className="flex gap-12 items-center divide-base-300 divide-x ">
              <div class="pr-12">
                <p className="text-lg"><Show when={stake.state == "ready"} fallback="⋯">{toBalanceValue(stake()?.total_supply,12,12)}</Show></p>
                <label className="text-xs">veALT</label>
              </div>

              <div class="text-current/50">
              <Show when={stake.state == "ready"} fallback="⋯">{t("s.count",{stakers: stake()?.stakers, amount: toBalanceValue(stake()?.stake_amount?.[0],12,12)})}</Show>
              {/* <Show when={stake.state == "ready"} fallback="⋯">
                <span class="text-base-content">{stake()?.stakers}</span></Show> stakers have locked a total of <Show when={stake.state == "ready"} fallback="⋯"><span class="text-base-content">{toBalanceValue(stake()?.stake_amount?.[0],12,12)}</span></Show> $ALT */}
              </div>
            </div>
          </div>
          
          <div class="col-span-4 col-start-9">
            <div className="flex w-full justify-between pb-6 px-1 items-center">
              <p className="flex items-center text-current/50 text-sm gap-2 pt-2">
                <Icon icon="iconoir:profile-circle" />
                <Switch>
                  <Match when={connected()}><Show when={address()} fallback="connecting...">{shortStr(address(), 5)}</Show></Match>
                  <Match when={!connected()||!connecting()}><a role="button" className=" cursor-pointer" onClick={handleConnection}>{t("b.connect_first")}</a></Match>
                </Switch>
              </p>
              <p classList={{
                "text-current/50" : !staker()?.balance,
                "text-current" : Number(staker()?.balance) > 0
              }}>
                <Show when={staker.state == "ready"} fallback="⋯">
                  {toBalanceValue(Number(staker()?.balance) || 0,12,12)} <span class="text-xs">veALT</span>
                </Show>
              </p>
            </div>
            {/* form */}
            <fieldset className="w-full p-6 rounded-2xl bg-current/5 fieldset border border-base-300 flex flex-col gap-4">
              <div>
                  <div className="flex items-center gap-2 text-sm justify-between w-full pb-2">
                    <span class="font-bold text-current/50">{t("l.lock_amount")}</span>
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
                      type="number"
                      placeholder="0"
                      value={fields?.amount || null}
                      name="amount"
                      min={1}
                      max={ALT() / 1000000000000 || 0}
                      step={0.000000000001}
                      onChange={(e) => {
                        setFields(e.target.name, e.target.value)
                        setErrors(e.target.name, null)
                      }}
                    />
                    <span className="text-current/50">$ALT</span>
                  </label>
              </div>
              {/* input date */}
              <div>
                <div className="flex items-center gap-2 text-sm justify-between w-full pb-2">
                  <span class="font-bold text-current/50">{t("l.unlock_time")}</span>
                  <div className="flex gap-1 items-center">
                    <div className="tooltip" data-tip="1 week">
                      <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+604800000))} disabled={staker()?.locked_time > 604800000}>1W</button>
                    </div>
                    <div className="tooltip" data-tip="1 month">
                      <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+2592000000))} disabled={staker()?.locked_time > 2592000000}>1M</button>
                    </div>
                    <div className="tooltip" data-tip="1 year">
                      <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+31104000000))} disabled={staker()?.locked_time > 31104000000}>1Y</button>
                    </div>
                    <div className="tooltip" data-tip="4 years">
                      <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+124416000000))} disabled={staker()?.locked_time > 124416000000}>4Y</button>
                    </div>
                  </div>
                </div>
                <label
                  className="input w-full"
                  classList={{
                    "input-error": errors?.date
                  }}
                >
                  <input
                    type="datetime-local"
                    value={fields?.date || min_time_ts()&&getDateTimeString(min_time_ts())}
                    min={min_time_ts()&&getDateTimeString(min_time_ts())}
                    name="date"
                    onChange={(e) => setFields(e.target.name, e.target.value)}
                  />
                </label>
              </div>
              <div className="flex justify-between w-full items-center">
                <div class="text-current/50 text-xs">
                  {t("s.form_tip",{amount:fields?.amount,days:diffdays()})}
                </div>
                <button 
                  className="btn btn-primary"
                  disabled={!enable_stake()||!connected()}
                  use:walletConnectionCheck={()=>{
                    if(fields.amount * (10 ** 12) < 10 ** 6 ){
                      setErrors("amount","Amount must be greater than 1 $ALT")
                      toast.error(errors?.amount)
                      return
                    }
                    if(!fields.date){
                      setErrors("")
                      return
                    }
                    _locker.open({
                      amount : fields.amount * (10 ** 12) ,
                      duration : diffdays()* 24 * 60 * 60 * 1000,
                      staker : staker()
                    })
                  }}
                >
                  {t("s.stake")}
                </button>
              </div>
            </fieldset>
            {/* locking positon */}
            <div class="flex items-center justify-between pt-6">
              <div class="text-sm flex flex-col gap-2">
                <p class="text-current/50 inline-flex gap-2 items-center uppercase"><Icon icon="ph:arrow-elbow-down-right-light"/> <Icon icon="iconoir:lock" /> <Show when={staker.state != "unresolved"} fallback="..."><span class="text-base-content" classList={{"text-base-content/50" : !staker()?.amount }}>{toBalanceValue(staker()?.amount||0,12,12)} $ALT</span></Show></p>
                <p class="text-current/50 inline-flex gap-2 items-center uppercase">
                  <Icon icon="ph:arrow-elbow-down-right-light"/> <Icon icon="iconoir:timer" /> 
                  <Show>

                  </Show>
                  <Switch>
                    <Match when={!staker()}><span>--:--</span></Match>
                    <Match when={staker()}><span class="text-base-content"><Moment ts={staker()?.start_time + staker().locked_time}/></span></Match>
                  </Switch>
                </p>
              </div>
              <div class="flex min-w-16">
                <div className="tooltip" data-tip="Boost">
                  <button
                    className="btn btn-square rounded-full btn-ghost"
                    disabled={!staker()}
                    onClick={() => _boost.open()}
                  >
                    <Icon icon="iconoir:flash" />
                  </button>
                </div>
                <div className="dropdown dropdown-hover dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-square btn-ghost rounded-full" ><Icon icon="fluent:more-vertical-32-filled" /></div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-200 border border-base-300 rounded-box z-1 w-36 p-2 shadow-sm">
                    <li><a role="button" class=""  disabled={true} classList={{"text-current/30" : true}}>Unlock</a></li>
                    <li><a ole="button"  disabled={true} classList={{"text-current/30" : true}}>Detail</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          
   
        </section>

        
        {/* dividends */}
        <section class="response_cols py-10 overflow-visible border-t border-current/20">
          <div class="col-span-full">
            <div class="w-full text-center text-current/50"> {t("l.next_distribution")} : <span><Show when={pool.state == "ready"} fallback="...">{new Date(pool()?.ts_next_dividend).toLocaleString()}</Show></span></div>
          </div>

          <div class="col-span-full">
            <Suspense fallback = {<div className="w-full justify-center p-6 flex"><Spinner/></div>}>
              <div className="overflow-x-auto">
                <Switch>
                <Match when={dividends()&&dividends()?.length>0}>
                
                <table className="response_table w-full">
                  {/* head */}
                  <thead class="hover:bg-none">
                    <tr class="text-sm text-current/50 hover:bg-none">
                      <th>No</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th class="text-right">Addresses</th>
                      <th class="text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={dividends()}>
                      {item =>
                        <tr>
                          <th data-label="No" class="w-10 text-left">{item.ref}</th>
                          <td data-label="Date"><Datetime ts={item?.checkpoint ? Number(item?.checkpoint) : item.timestamp * 1000}/></td>
                          <td data-label="Amount">${toBalanceValue(item?.amount || 0, 6, 3)}</td>
                          <td data-label="Addressses" class="text-right">{item?.addresses}</td>
                          <td data-label="Details" class="text-right flex items-center gap-4 justify-end"><span class="text-current/50">{shortStr(item.id, 4)}</span> <a href={`https://www.ao.link/#/message/${item.id}`} target="_blank"><Icon icon="ei:external-link"></Icon></a></td>
                        </tr>
                      }
                    </For>
                  </tbody>
                </table>
                </Match>
                <Match when={!dividends()||dividends()?.length<=0}>
                  <Empty tips="No dividends yets"/>
                </Match>
                </Switch>
              </div>

            </Suspense>
            
          </div>
        </section>
    
      </main>
      <Locker
        staker={staker()}
        staking={stake()}
        onSubmited = {async()=>{
          await refetchStaker()
          await refetchStake()
          await refetchALT()
        }}
        ref={_locker}
      />
      <Unlock
        ref={_unlock}
        staker={staker()}
        staking={stake()}
        onSubmited = {async(msg)=>{
          await refetchStaker()
          await refetchStake()
          await refetchALT()
        }}
      />
      <Boost
        ref={_boost}
        staker={staker()}
        staking={stake()}
      />
    </>
    
  )
}