import { createUserClaims } from "../../signals/player"
import { connected,address } from "../../components/arwallet"
import { agent, pool,app } from "../../signals/global"
import { createEffect, Match, Show, Switch } from "solid-js"
import { Xnumbers } from "../../components/xnumber"
import { shortStr, toBalanceValue } from "../../lib/tool"
import { Moment } from "../../components/moment"
import { Icon } from "@iconify-icon/solid"
import Ticker from "../../components/ticker"

export default props => {
  const [claims,{hasMore}] = createUserClaims(()=>connected()&&{player_id:address(),pool_id:pool.id,agent_id:agent.id,token_id:app.token_id})
  createEffect(()=>console.log(claims()))
  return(
    <section 
      class=" py-10 flex flex-col gap-4 "
      classList={props?.classList}
    >
      <For each={claims()} fallback="no rewards">
        {(item,index)=><div class="response_cols p-2 hover:bg-current/5 gap-y-1 border-b border-current/10 lg:border-none rounded-md">
          <div class="col-span-full lg:col-span-3">
          🏆 <span class="text-current/50">{shortStr(item.id,8)}</span>
          </div>
          <div class="col-span-full lg:col-span-9 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-current/50">Claimed</span> 
              <span>${toBalanceValue(item.amount,item?.denomination||6,2)}</span>
              <span class="text-current/50">, Received</span> 
              <span>${toBalanceValue(item.quantity,item?.denomination||6,2)}</span> 
              <span class="text-current/50">after a</span> 
              <span>${toBalanceValue(item.tax,item?.denomination||6,2)}</span> 
              <span class="text-current/50">tax</span></div>
            <div class="flex items-center gap-4">
              <span class="text-current/50"><Moment ts={Number(item.timestamp*1000)}/></span>
              <a href={`${app.ao_link_url}/#/message/${item?.id}`} target="_blank"><Icon icon="ei:external-link"></Icon></a>
            </div>
          </div>
        </div>}
      </For>
    </section>
  )
}