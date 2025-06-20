import Dialog from "./dialog"
import Modal from "./modal"
import { Show, splitProps,onMount,createSignal, createEffect, onCleanup, Switch, Match } from "solid-js"
import { Ticket } from "./ticket"
import { shortStr, toBalanceValue } from "../lib/tools"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"

export default props => {
  let _ticket
  let _timer
  const [details, setDetails] = createSignal()
  const [ gaptime, setGaptime] = createSignal()
  const [ rewards,setRewards] = createSignal()
  const [split,setGplit] = createSignal()
  const [ref,others] = splitProps(props,["ref"])
  onMount(() => {
    props?.ref({
      open:(details)=>{
        console.log(details)
        setDetails(details)
        _ticket.open()
        if(!details?.diff_time){
          _timer = setInterval(()=>{
            const now = new Date().getTime()
            const diff = (now - details?.created || now) / 1000
            let day = Math.floor(diff / 60 / 60 / 24).toString().padStart(2, "0");
            let hour = Math.floor(diff / 60 / 60 % 24 ).toString().padStart(2, "0");
            let minute = Math.floor(diff / 60 % 60).toString().padStart(2, "0");
            let second = Math.floor(diff % 60).toString().padStart(2, "0");
            setGaptime(`${hour}:${minute}:${second}`)
            const rounds = Math.floor(diff / 600)
            console.log("rounds",rounds,details.mint?.unit)
            const unit = details.mint?.unit || 0;
            const n = rounds;
            const sum = n / 2 * (2 - (n - 1) * 0.0069) * unit;
            const total = Math.max(sum,0);
            setRewards(toBalanceValue(total,12,12))
          },1000)

        }
        
        
      },
      close:()=>{
        
        _ticket.close()
      },
    })
    onCleanup(()=>{
      clearInterval(_timer)
      setRewards(0)
      setGaptime("00:00:00")
    })
  })

  return(
    <Modal ref={_ticket} title="Ticket" {...others} closable>
      <div >

      
      <Show when={details()} fallback="empty">
        <div className="flex w-full items-center justify-center"><Ticket id={(details()?.id)} number={details()?.x_numbers?.split('') || [0,0,0]} quantity={details()?.count} round={details()?.round}/></div>
      </Show>
      <div className="w-full flex items-center justify-center p-2">
        <p className="text-center text-xs lg:text-sm p-4">
        <span className="text-current/50">Created by </span> <a href={`https://www.ao.link/#/entity/${details()?.player}`} target="_blank">{shortStr(details()?.player,6)}</a> <span className="text-current/50">on</span> <span>{new Date(details()?.created).toLocaleString()}</span>
        </p>
      </div>

      <div className=" p-4">

      {/* <div className=" flex justify-between items-center px-2 border-t border-base-300 py-4">
        <div className="flex flex-col w-1/2 items-center">
          <div className="stat-title">Bet2Mint</div>
          <div className="text-lg">{toBalanceValue(details()?.mint?.amount,12)} $ALT</div>
        </div>
        <div className="flex flex-col w-1/2 items-center">
          <div className="stat-title">Gap-Rewards</div>
          <div className="text-lg">{toBalanceValue(details()?.mint?.plus?.[0],12)} $ALT</div>
        </div>
      </div> */}

      <div>
        <p className="py-4 border-t border-current/20">Bet2Mint</p>
        <InfoItem label={<span className=" inline-flex items-center gap-2"><Icon icon="ph:arrow-elbow-down-right-light" className=" scale-90"/><span>Minted</span></span>} value={()=>toBalanceValue(details()?.mint?.total,12,12)+" $ALT"} className="text-sm"/>
        <InfoItem label={<span className=" inline-flex items-center gap-2"><Icon icon="ph:arrow-elbow-down-right-light" className=" scale-90"/><span>Buffed</span></span>}  value={()=>toBalanceValue(details()?.mint?.buff,12,12)+" $ALT"} className="text-sm"/>
        <InfoItem label={<span className=" inline-flex items-center gap-2"><Icon icon="ph:arrow-elbow-down-right-light" className=" scale-90"/><span>Looted</span></span>}  value={()=>toBalanceValue(details()?.mint?.killed,12,12)+" $ALT"} className="text-sm"/>
        <p className="py-4 border-t border-current/20 mt-4 flex items-center justify-between">
          <span>Gap-Rewards</span>
          <span>{details()?.isFirst? <Icon icon="eos-icons:hourglass" />:""}</span>
        </p>
        <Switch>
          <Match when={details()?.isFirst}>
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg">{gaptime()}</span>
              <span className="text-xs">~ {rewards()} $ALT</span>
            </div>
          </Match>
          <Match when={!details()?.isFirst}>
            <InfoItem label={<span className=" inline-flex items-center gap-2"><Icon icon="ph:arrow-elbow-down-right-light" className=" scale-90"/><span>Gap Time</span></span>} value={()=><span>{Math.floor(details()?.diff_time / 60 / 1000 || 0)} mins</span>} className="text-sm"/>
            <InfoItem label={<span className=" inline-flex items-center gap-2"><Icon icon="ph:arrow-elbow-down-right-light" className=" scale-90"/><span>Total Rewards</span></span>} value={()=>toBalanceValue(details()?.gap_rewards + details()?.bekilled,12,12) + " $ALT"}  className="text-sm"/>
            <InfoItem label={<span className=" inline-flex items-center gap-2"><Icon icon="ph:arrow-elbow-down-right-light" className=" scale-90"/><span>Split</span></span>}  value={()=>toBalanceValue(details()?.bekilled,12,12) + " $ALT"}   className="text-sm"/>
          </Match>
        </Switch>
        
        <p className="py-4 border-t border-current/20 mt-4 text-sm">A total of {()=>toBalanceValue(Number(details()?.mint?.total || 0) + (details()?.gap_rewards || 0),12,12)} $ALT were earned; after 20% tax, received {()=>toBalanceValue(Number((details()?.mint?.total || 0) + (details()?.gap_rewards || 0)) * 0.8,12,12)}  $ALT.</p>
      </div>
      

      </div>

      </div>
      
    </Modal>
  )
}