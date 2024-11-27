import { createPlayerTickets } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { pool } from "../../signals/global"
import { createEffect, Match, Switch } from "solid-js"
import Spinner from "../../components/spinner"

export default props => {
  const [tickets,{hasMore}] = createPlayerTickets(()=>connected()&&{player_id:address(),pool_id:pool.id})
  
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <Suspense fallback={<Spinner/>}>
          <For each={tickets()}>
            {(item,index)=><div>{index()}-{item.ticket}</div>}
          </For>
       {/* <Match>
        <Switch when={!tickets()||tickets()?.length>=0}>
          <div>no tickets</div>
        </Switch>
        <Switch when={tickets()?.length>0}>
          <For each={tickets()}>
            {(item,index)=><div>{index()}</div>}
          </For>
        </Switch>
       </Match> */}
      </Suspense>
    </section>
  )
}