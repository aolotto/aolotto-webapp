import { createEffect, createMemo, For, Match, Show, Suspense, Switch } from "solid-js"
import Avatar from "../../components/avatar"
import { Icon } from "@iconify-icon/solid"
import { ranks } from "../../signals/pool"
import { toBalanceValue } from "../../lib/tool"
import Ticker from "../../components/ticker"
import { app,protocols } from "../../signals/global"
import Empty from "../../components/empty"


export default props => {
  const pay_i = protocols?.details[protocols.pay_id]
  const bettings = createMemo(()=>ranks()?.bettings)
  return(
    <div class="response_cols gap-2 py-4">
      <Switch fallback={<span class="col-span-full"><Empty tips="No bettings yet."/></span>}>
        <Match when={bettings()?.length > 0}>
          <h2 class="text-current/50 uppercase col-span-full py-4 my-4"><span class="size-6 inline-flex mr-6">🎲</span> top Bettings</h2>
          <For each={bettings()} when={!ranks.loading} fallback="loading...">
            {(item,index)=>{
              const [i] = Object.entries(item)
              return(
                <div class=" col-span-full flex items-center justify-between gap-4 hover:bg-current/5 px-1 py-1 rounded-md overflow-visible">
                  <div 
                    class="text-current/50 size-6 text-sm rounded-full flex items-center justify-center -ml-2 overflow-visible mr-6"
                    classList={{
                      "text-primary": index()==0,
                      "text-secondary": index()==1,
                      "text-third": index()==2
                    }}
                  >
                    {index()+1}
                  </div>
                  <div class="flex gap-8 items-center flex-1"><Avatar class="size-6" username={i?.[0]||"aolotto"}/> <span class='text-current/50'>{i?.[0]}</span> </div>
                  <div class="w-80 flex items-center justify-between">
                    <span>{toBalanceValue(i?.[1]||0,pay_i?.Denomination||6,4)} <Ticker class="text-current/50">{pay_i?.Ticker}</Ticker></span>
                    <a href={app.ao_link_url+`/`+i?.[0]} target="_blank"><Icon icon="ei:external-link"></Icon></a>
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