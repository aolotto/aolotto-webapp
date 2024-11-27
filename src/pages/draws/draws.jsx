import { For } from "solid-js"
import { Icon } from "@iconify-icon/solid"

const DrawItem = props => {
  return (
    <div class="response_cols px-2 hover:bg-current/5 rounded-b-md">
      <div class="col-span-full lg:col-span-4 flex items-center gap-4">
        <span class="inline-flex border rounded-full px-2">R1</span>
        <span class="text-current/50">-</span>
        <span class="inline-flex gap-2">
          <span class="ball ball-fill">1</span>
          <span class="ball ball-fill">2</span>
          <span class="ball ball-fill">3</span>
        </span>
        <span class="text-current/50">- 0 matched</span>
      </div>
      <div class="col-span-full lg:col-span-5 flex items-center gap-2">
      ✨ 2000.00 <span class="text-current/50">$USDC</span> <span class="text-current/50">rewarded</span> 1 <span class="text-current/50">player</span>
      </div>
      <div class="col-span-full lg:col-span-3 flex items-center justify-between">
        <span class="text-current/50">2024/12/16 11:00:00</span>
        <a>
            <Icon icon="ei:external-link"></Icon>
          </a>
      </div>
    </div>
  )
}

export default props => {
  return (
    <section class="flex flex-col gap-4 py-8 border-t border-current/20">
      <For each={[4,3,2,1]}>
        {item=>{
          return <DrawItem/>
        }}
      </For>
    </section>
  )
}