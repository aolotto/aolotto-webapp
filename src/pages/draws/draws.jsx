import { createEffect, createMemo, For, splitProps } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { createDraws } from "../../signals/draws"
import { pool } from "../../signals/global"
import { toBalanceValue } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { InfoItem } from "../../components/infoitem"
import { shortStr } from "../../lib/tool"
import { ShareToSocial } from "../../components/share"
import Loadmore from "../../components/loadmore"



const DrawItem = props => {
  const [{item:{round,lucky_number,matched,jackpot,created,winners,taxation,id,ticker,denomination}},rest] = splitProps(props,["item"])

  return (
    <section class="response_cols border-b border-current/20 first:border-t py-10  px-4 hover:bg-current/2">
        <div class="col-span-full lg:col-span-2">
          <span class="text-2xl">Round-{round}</span>
        </div>
        <div class="col-span-full lg:col-span-6 flex flex-col gap-2">
          <InfoItem label={"Winning Numbers"}>
            <div class="flex items-center gap-2">
              <span class="inline-flex gap-2">
                <For each={lucky_number?.split('')||["*","*","*"]}>
                  {(num)=><span class="ball ball-fill">{num}</span>}
                </For>
              </span>
              {/* <span class="text-current/50">0 Matched bet</span> */}
            </div>
          </InfoItem>
          <InfoItem label={"Matched Bets"}><span classList={{
            "text-current/50" : matched<=0,
            "text-current" : matched>0
          }}>{matched}</span></InfoItem>
          <InfoItem label={"Drawing Time"}><Datetime ts={Number(created)}/></InfoItem>
          <InfoItem label={"Taxation / Rate"}>{toBalanceValue(taxation,denomination||6,2)} <span class="text-current/50">${ticker}</span> / 0.1</InfoItem>
          <InfoItem label={"Drawing Id"}><span class="inline-flex items-center gap-2">{shortStr(id,6)} <Icon icon="ei:external-link"></Icon></span></InfoItem>
        </div>
        <div class="col-span-full lg:col-span-4 flex flex-col justify-between items-end">
          <div class="flex flex-col gap-4 w-full">
            
            <div>
              <div class ="text-current/50 uppercase">The Prize</div>
              <div class="flex items-center"><span>🏆 <span class="text-2xl">{toBalanceValue(jackpot,denomination||6,2)}</span></span> <span class="text-current/50">${ticker}</span></div>
            </div>
            <div class="px-1 inline-flex gap-2 items-center"><Icon icon="ph:arrow-elbow-down-right-light"></Icon> <div class="inline-flex py-1 px-3 bg-third text-third-content rounded-full gap-2"><span>{winners} </span><span class="text-current/50">{winners>1?"Winners shared":"Winner takes"}</span></div>  </div>
            <div class="flex gap-2 px-1">
              <Icon icon="proicons:info" />
              <span class="text-xs text-current/50">No matching bets this round, the last bettor takes the entire prize.</span>
            </div>
          </div>
          <ShareToSocial/>
        </div>
      </section>
  )
}

export default props => {
  const [draws,{hasMore,loadingMore,loadMore}] = createDraws(()=>({pool_id:pool?.id}))
  createEffect(()=>console.log("draws",draws()))
  return (
    <section class="flex flex-col py-8 ">
      <For each={draws()}>
        {item=>{
          return <DrawItem item={item}/>
        }}
      </For>
      <Show when={hasMore()}>
          <Loadmore loadMore={loadMore} loading={loadingMore()}/>
        </Show>
    </section>
    
  )
}