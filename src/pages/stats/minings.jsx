import { createEffect, createMemo, For, Match, Show, Suspense, Switch } from "solid-js"
import Avatar from "../../components/avatar"
import { Icon } from "@iconify-icon/solid"
import { ranks } from "../../signals/pool"
import { agent } from "../../signals/global"
import { toBalanceValue } from "../../lib/tool"
import Ticker from "../../components/ticker"
import Empty from "../../components/empty"

export default props => {
  const minings = createMemo(()=>ranks()?.mintings)
  return(
    <div class="response_cols gap-2 py-8">
      <Switch fallback={<span class="col-span-full"><Empty tips="No mintings yet."/></span>}>
        <Match when={minings()?.length > 0}>
          <For each={minings()} when={!ranks.loading} fallback="loading...">
            {(item,index)=>{
              const [i] = Object.entries(item)
              return(
                <div class=" col-span-full flex items-center justify-between gap-4 hover:bg-current/5 p-2 rounded-md">
                  <div 
                    class="text-current/50 size-6 text-sm rounded-full flex items-center justify-center"
                    classList={{
                      "text-primary": index()==0,
                      "text-secondary": index()==1,
                      "text-third": index()==2
                    }}
                  >
                    {index()+1}
                  </div>
                  <div class="flex gap-8 items-center flex-1"><Avatar class="size-6" username={i?.[0]||"aolotto"}/> {i?.[0]} </div>
                  <div class="w-80 flex items-center justify-between">
                    <span>{toBalanceValue(i?.[1]||0,agent.denomination||12,4)} <Ticker class="text-current/50">{agent.ticker}</Ticker></span>
                    <Icon icon="ei:external-link"></Icon>
                  </div>
                </div>
              )
            }}
          </For>
        </Match>
      </Switch>
      
    </div>
  )
}