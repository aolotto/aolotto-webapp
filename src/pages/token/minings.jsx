import { createMinings } from "../../signals/lotto"
import { agent,pool } from "../../signals/global"
import { createEffect, For, Show,createRoot } from "solid-js"
import Loadmore from "../../components/loadmore"

export default props => {

  const [minings,{loadMore,loadingMore,hasMore}] = createMinings(()=>({agent_id:agent.id,pool_id:pool.id}))

  return(
    <div>
      <For each={minings()} fallback={"no minings"}>
        {(item)=><div>- {item?.id}</div>}
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()}/>
      </Show>
    
    </div>
  )
}