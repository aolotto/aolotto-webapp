import { createDividends } from "../../signals/lotto"
import { agent,pool } from "../../signals/global"
import { createEffect, For } from "solid-js"

export default props => {
  const [dividends,{hasMore,loadingMore}] = createDividends(()=>({pool_id:pool.id,agent_id:agent.id}))
  
  return(
    <div>
      <For each={dividends()} fallback={"no dividends"}>
        {(item)=><div>- {item?.id}</div>}
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()}/>
      </Show>
    </div>
  )
}