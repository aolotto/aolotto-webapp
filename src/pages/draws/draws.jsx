import { createEffect, createMemo, For, splitProps } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { createDraws } from "../../signals/draws"
import { pool } from "../../signals/global"
import { toBalanceValue } from "../../lib/tool"
import { Datetime } from "../../components/moment"


const DrawItem = props => {
  const [{item:{round,lucky_number,matched,jackpot,created,winners}},rest] = splitProps(props,["item"])
  console.log(round,lucky_number)
  return (
    <div class="response_cols px-2 hover:bg-current/5 rounded-b-md">
      <div class="col-span-full lg:col-span-4 flex items-center gap-4">
        <span class="inline-flex border rounded-full px-2">R{props?.item?.round}</span>
        <span class="text-current/50">-</span>
        <span class="inline-flex gap-2">
          {lucky_number.split('').map((_,i)=>{
            return <span class="ball ball-fill">{_}</span>
          })}
        </span>
        <span class="text-current/50">- {matched} matched</span>
      </div>
      <div class="col-span-full lg:col-span-5 flex items-center gap-2">
      ✨ {toBalanceValue(jackpot,6,2)} <span class="text-current/50">$USDC</span> <span class="text-current/50">rewarded</span> {winners} <span class="text-current/50">player</span>
      </div>
      <div class="col-span-full lg:col-span-3 flex items-center justify-between">
        <span class="text-current/50"><Datetime ts={Number(created)}/></span>
        <a>
            <Icon icon="ei:external-link"></Icon>
          </a>
      </div>
    </div>
  )
}

export default props => {
  const [draws,{hasMore}] = createDraws(()=>({pool_id:pool?.id}))
  createEffect(()=>console.log("draws",draws()))
  return (
    <section class="flex flex-col gap-4 py-8 border-t border-current/20">
      <For each={draws()}>
        {item=>{
          return <DrawItem item={item}/>
        }}
      </For>
    </section>
  )
}