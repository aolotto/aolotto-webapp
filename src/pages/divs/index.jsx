import { createResource,createSignal,createMemo, createEffect, ErrorBoundary, Suspense, Show, batch,Match } from "solid-js"
import { useApp, useWallet,useUser } from "../../contexts"
import { t,setDictionarys } from "../../i18n"
import { Icon } from "@iconify-icon/solid"
import { shortStr,toBalanceValue,getDateTimeString } from "../../lib/tools"
import { createStore,unwrap,reconcile } from "solid-js/store"
import Distrubutions from "./distrubutions"
import { fetchState,fetchStaker } from "../../api"
import { Moment } from "../../compontents/moment"
import { storeResource } from "../../store"
import Skeleton from "../../compontents/skeleton"
import Locker from "../../compontents/locker"
import Unlocker from "../../compontents/unlocker"
import Booster from "../../compontents/booster"
import Spinner from "../../compontents/spinner"


export default props => {
  let _locker
  let _unlock
  let _booster
  const {notify,agentProcess,info,altProcess} = useApp()
  const {address,connected,showConnector,connecting,walletConnectionCheck} = useWallet()
  const {altBalance, refetchAltBalance,refetchVeAltBalance,refetchPlayer } = useUser()

  
  setDictionarys("en",{
    "s.title" : (v)=><span className="text-balance">Stake <span class="inline-flex bg-primary/10 p-2 lg:p-4 rounded-full items-center gap-2 font-bold text-primary border border-current/30 text-[0.8em]"><image src={`https://arweave.net/${v?.Logo}`} class="size-[1em] rounded-full inline-flex"/>$ALT</span> for daily dividends</span>,
    "s.desc" : "Stake $ALT for veALT and earn 20% of the protocol’s total sales revenue (equivalent to 50% of accumulated profits). The veALT amount decays linearly over the remaining lock period—the longer the lock, the more veALT you get.",
    "s.count" : (v)=><span><span className="text-base-content">{v.stakers}</span> stakers have locked a total of <span className="text-base-content">{v.amount}</span> $ALT</span>,
    "s.stake" : "Lock",
    "s.lock_amount" : "Locked Amount",
    "s.unlock_time" : "Unlock Time",
    "s.next_distribution" : "Next Distribution",
    "s.form_tip" : (v)=><span>Lock {v?.amount || 0} $ALT for {v.days} days</span>,
    "s.connect_first" : "Connect wallet first"
  })
  setDictionarys("zh",{
    "s.title" : (v)=> <span className="leading-2">质押 <span class="inline-flex bg-primary/10 p-2 lg:p-4 rounded-full items-center gap-2 font-bold text-primary border border-current/30 text-[0.8em]"><image src={`https://arweave.net/${v?.Logo}`} class="size-[1em] rounded-full inline-flex"/>$ALT</span> 获取协议的每日分红</span>,
    "s.desc" : "质押 $ALT 获得 veALT，并享受协议总销售收入的 20% 分红（相当于 50% 的累计利润）。veALT 数量会随锁仓剩余时间线性衰减，锁定时间越长，获得的 veALT 越多。",
    "s.count" : (v)=><span><span className="text-base-content">{v.stakers}</span> 位质押者累计锁定 <span className="text-base-content">{v.amount}</span> $ALT</span>,
    "s.stake" : "锁仓",
    "s.lock_amount" : "锁定金额",
    "s.unlock_time" : "解锁时间",
    "s.next_distribution" : "下一次分红",
    "s.form_tip" : (v)=><span>锁定 {v?.amount || 0} $ALT {v.days} 天</span>,
    "s.connect_first" : "链接钱包"
  })
  const [stake,{refetch:refetchStake}] =storeResource("stake",()=>createResource(()=>info.stake_process,fetchState)) 
  const [staker,{refetch:refetchStaker}] = storeResource("stake_"+address(),()=>createResource(()=>({pid : info.stake_process, staker : address()}),fetchStaker)) 
 
  const [now,setNow] = createSignal(Date.now())



  const Heading = props => {
    return (
      <div className="text-center md:text-left">
        <h1 class=" text-4xl md:text-5xl lg:text-6xl font-medium text-balance">{t("s.title", { Logo: altProcess()?.Logo })}</h1>
        <p class=" py-10">{t("s.desc")}<a href="https://docs.aolotto.com/en/staking" target="_blank" class="inline-flex pl-2 items-center">Learn more <Icon icon="ei:external-link"></Icon></a></p>
      </div>
    )
  }

  const Stakebar = props => {
    return (
      <div className="flex flex-col md:flex-row gap-4  md:gap-12 items-center md:divide-base-300 md:divide-x ">
        <div class="pr-0 md:pr-12 flex flex-col items-center md:items-start justify-center">
          <p className="text-lg"><Show when={stake.state == "ready"} fallback={<Skeleton w={6} h={1}/>}>{toBalanceValue(stake()?.total_supply, 12)}</Show></p>
          <p className="text-xs">veALT</p>
        </div>

        <div class="text-current/50 text-center">
          <Show when={stake.state == "ready"} fallback={<div className="flex flex-col items-center md:items-start gap-1"><Skeleton w={15} h={1}/><Skeleton w={6} h={1}/></div>}>{t("s.count", { stakers: stake()?.stakers, amount: toBalanceValue(stake()?.stake_amount?.[0], 12) })}</Show>
        </div>
      </div>
    )
  }

  const Userbar = props => {
    return (
      <div className="flex w-full justify-between pb-6 px-1 items-center">
        <p className="flex items-center text-current/50 text-sm gap-2 pt-2">
          <Icon icon="iconoir:profile-circle" />
          <Switch>
            <Match when={connected()}><Show when={address()} fallback="connecting...">{shortStr(address(), 5)}</Show></Match>
            <Match when={!connected() || !connecting()}><a role="button" className=" cursor-pointer" onClick={showConnector}>{t("s.connect_first")}</a></Match>
          </Switch>
        </p>
        <Show when={staker.state == "ready"} fallback={<Skeleton w={6} h={1} />}>
          <p classList={{
            "text-current/50": !staker()?.balance,
            "text-current": Number(staker()?.balance) > 0
          }}>
            {toBalanceValue(Number(staker()?.balance) || 0, 12)} <span class="text-xs">veALT</span>
          </p>
        </Show>
      </div>
    )
  }

  const StakeForm = props => {
    const [fields,setFields] = createStore();
    const [errors, setErrors] = createStore();
    const diffdays = createMemo(()=>fields?.date?Math.ceil((Date.parse(fields?.date) - now())/86400000): 0)
    const min_time_ts = createMemo(()=>{
      const min_dur = 604800000 // 7 * 24 * 60 * 60 * 1000
      let reslut
      if(staker.state == "ready" && staker()?.locked_time){
        reslut = Math.max(now()+min_dur, now() + staker()?.locked_time)
      }else{
        reslut = now()+min_dur
      }
      setFields("date",getDateTimeString(reslut))
      return reslut
    })
  
    const enable_stake = createMemo(()=>fields?.date&&fields?.amount&&staker.state=="ready")
    return(
      <fieldset className="w-full p-6 rounded-2xl bg-current/5 fieldset border border-base-300 flex flex-col gap-4">
        <div>
            <div className="flex items-center gap-2 text-sm justify-between w-full pb-2">
              <span class="font-bold text-current/50">{t("s.lock_amount")}</span>
              <p class="text-current/50 flex items-center gap-2">
                <span className="text-xs">
                  <Show when={connected() && altBalance.state == "ready"} fallback={<Skeleton w={4} h={1} />}>
                    {toBalanceValue(altBalance() || 0, altProcess()?.Denomination, altProcess()?.Denomination)}
                  </Show>
                </span>
                <button
                  class="btn btn-xs"
                  disabled={altBalance.loading || connecting()}
                  onClick={() => {
                    setFields("amount", altBalance.state == "ready" && (altBalance() / 1000000000000))
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
                max={altBalance.state == "ready" && (altBalance() / 1000000000000) || 0}
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
            <span class="font-bold text-current/50">{t("s.unlock_time")}</span>
            <div className="flex gap-1 items-center">
              <div className="tooltip" data-tip="1 week">
                <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+604800000))} disabled={staker.loading || staker()?.locked_time > 604800000}>1W</button>
              </div>
              <div className="tooltip" data-tip="1 month">
                <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+2592000000))} disabled={staker.loading || staker()?.locked_time > 2592000000}>1M</button>
              </div>
              <div className="tooltip" data-tip="1 year">
                <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+31104000000))} disabled={staker.loading || staker()?.locked_time > 31104000000}>1Y</button>
              </div>
              <div className="tooltip" data-tip="4 years">
                <button class="btn btn-xs  uppercase " onClick={()=>setFields("date", getDateTimeString(now()+124416000000))} disabled={staker.loading || staker()?.locked_time > 124416000000}>4Y</button>
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
    )
  }

  const Position = props => {
    return(
      
      <div class="flex items-center justify-between pt-6">
      <div class="text-sm flex flex-col gap-2">
        <p class="text-current/50 inline-flex gap-2 items-center uppercase"><Icon icon="ph:arrow-elbow-down-right-light"/> <Icon icon="iconoir:lock" /> <Show when={staker.state == "ready"} fallback={<Skeleton w={6} h={1} />}><span class="text-base-content" classList={{"text-base-content/50" : !staker()?.amount }}>{toBalanceValue(staker()?.amount||0,12)} $ALT</span></Show></p>
        <p class="text-current/50 inline-flex gap-2 items-center uppercase">
          <Icon icon="ph:arrow-elbow-down-right-light"/> <Icon icon="iconoir:timer" /> 
          <Show when={staker.state == "ready"} fallback={<Skeleton w={6} h={1} />}>          
            <Switch>
              <Match when={!staker()}><span>--:--</span></Match>
              <Match when={staker()}><span class="text-base-content"><Moment ts={staker()?.start_time + staker().locked_time}/></span></Match>
            </Switch>
          </Show>
        </p>
      </div>
      <div class="flex min-w-16">
        <div className="tooltip" data-tip="Boost">
          <button
            className="btn btn-circle btn-ghost"
            disabled={staker.loading || !staker()}
            onClick={() => _booster?.open()}
          >
            {staker()?.boosted>1?<Icon icon="iconoir:flash-solid" />:<Icon icon="iconoir:flash" /> }  
          </button>
        </div>
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-circle btn-ghost" 
            disabled={staker.loading || !staker()}
          >
            <Icon icon="fluent:more-vertical-32-filled" />
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-200 border border-base-300 rounded-box z-1 w-36 p-2 shadow-sm">
            <li><a 
              role="button"
              onClick={() => _unlock?.open()}
              disabled={staker.loading || staker()?.amount < 1||!staker()||!address()}
              classList={{"text-current/30" : staker.loading || staker()?.amount < 1||!staker()||!address()}}
            >
              Unlock
              </a>
            </li>
            <li><a role="button"  disabled={true} classList={{"text-current/30" : true}}>Detail</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    )
  }
  return(
    <>
    <main class="container flex flex-col min-h-lvh/2 overflow-visible py-4 md:py-6 lg:py-10">
      
      <ErrorBoundary fallback={(err,reset)=><div>{err.message}</div>}>
      <Suspense fallback={<Spinner/>}>
      {/* top */}
        <section class="response_cols overflow-visible py-6">
          <div class="col-span-full md:col-span-6 lg:col-span-7 flex flex-col justify-between">
            <Heading/>
            <Stakebar/>
          </div>
          {/* top-right */}
          <div class="col-span-full md:col-span-4 md:col-start-8 lg:col-start-9">
            {/* user */}
            <Userbar/>
            {/* form */}
            <StakeForm/>
            <Position/>
          </div>

          
        </section>
        <section className="w-full border-t border-base-300 py-4">
          <Distrubutions/>
        </section>

        
          <Locker ref={_locker} onSubmited={(res)=>{
            notify("Locked","success")
            batch(()=>{
              refetchStaker()
              refetchStake()
              refetchAltBalance()
              refetchVeAltBalance()
              refetchPlayer()
            })
          }}/>
          <Unlocker 
            ref={_unlock} 
            staker={staker()}
            onSubmited={(res)=>{
              notify("UnLocked","success")
              batch(()=>{
                refetchStaker()
                refetchStake()
                refetchAltBalance()
                refetchVeAltBalance()
                refetchPlayer()
              })
            }}
          />
          <Booster 
            ref={_booster}
            staker={staker()}
            onSubmit={()=>{
              notify("Your account has been boosted.","success")
              batch(()=>{
                refetchStaker()
                refetchStake()
                refetchAltBalance()
                refetchVeAltBalance()
                refetchPlayer()
              })
            }}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
    </>
   
  )
}