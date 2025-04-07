import Dialog from "./dialog"
import { Show, splitProps,onMount,createSignal, createEffect } from "solid-js"
import { Ticket } from "./ticket"

export default props => {
  let _ticket
  const [details, setDetails] = createSignal()
  const [ref,others] = splitProps(props,["ref"])
  onMount(() => {
    props?.ref({
      open:(details)=>{
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
        <div className="flex w-full items-center justify-center"><Ticket id="ejZ8g3bMvv8d7vdgweglEKPIxAKJ99qGdCPWpiaIygI" number={[0,1,1]} quantity="2" round="6"/></div>
      </Show>
      <div className="w-full flex items-center justify-center p-2">
        <p className="text-center text-xs lg:text-sm">
        <span className="text-current/50">Created by </span> <a>hR3Nup...VTcPBEs </a> <span className="text-current/50">on</span> <span>06/04/2025, 14:07:16</span>
        </p>
      </div>
      <div className="p-4">
        <div className="w-full flex items-center justify-between p-2 border-y border-base-content/10 box-border">
          <div>d</div>
          <div>d</div>
        </div>
      </div>
      
    </Dialog>
  )
}