import Dialog from "./dialog"
import { Show, splitProps,onMount,createSignal, createEffect } from "solid-js"
import { Ticket } from "./ticket"
import { shortStr } from "../lib/tools"
import { Icon } from "@iconify-icon/solid"
import { InfoItem } from "./infoitem"

export default props => {
  let _ticket
  const [details, setDetails] = createSignal()
  const [ref,others] = splitProps(props,["ref"])
  onMount(() => {
    props?.ref({
      open:(details)=>{
        console.log(details)
        setDetails(details)
        _ticket.open()
      },
      close:()=>{
        _ticket.close()
      },
    })
  })
  createEffect(()=>{
    console.log(others)
  })
  return(
    <Dialog ref={_ticket} class="w-140" title="Ticket" {...others} fullscreen responsive>
      <Show when={details()} fallback="empty">
        <div className="flex w-full items-center justify-center"><Ticket id={(details()?.id)} number={details()?.x_numbers?.split('') || [0,0,0]} quantity={details()?.count} round={details()?.round}/></div>
      </Show>
      <div className="w-full flex items-center justify-center p-2">
        <p className="text-center text-xs lg:text-sm p-4">
        <span className="text-current/50">Created by </span> <a href={`https://www.ao.link/#/entity/${details()?.player}`} target="_blank">{shortStr(details()?.player,6)}</a> <span className="text-current/50">on</span> <span>{new Date(details()?.created).toLocaleString()}</span>
        </p>
      </div>
      <div className="p-4">
        <div className="w-full flex items-center justify-between p-2 border-y border-base-content/10 box-border">
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-current/50">Bet2Mint</span>
            <span>200000.000 $ALT</span>
          </div>
          <div className="w-[1em] flex items-center justify-center">+</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-current/50">Gap-Rewards</span>
            <span>200.000 $ALT</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-center gap-2">
        <button className="btn">Create a giveaway</button>
        <button className="btn">View on ao.link</button>
      </div>
      
    </Dialog>
  )
}