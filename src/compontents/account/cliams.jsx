import { storeResource } from "../../store"
import { createPagination } from "../../lib/pagination"
import { fetchPlayerCliams } from "../../api"
import { useApp, useWallet } from "../../contexts"
import Loadmore from "../loadmore"
import { For, Suspense } from "solid-js"
import { Moment } from "../moment"
import { toBalanceValue } from "../../lib/tools"
import { Icon } from "@iconify-icon/solid"

export default function Claims(props) {
  const { info } = useApp()
  const { address } = useWallet()
  const [claims,{ hasMore, loadingMore, loadMore }] = storeResource(
      `claims_${info?.agent_process}_${address()}`,
      ()=>createPagination(
        ()=>({
          agent_id : info.agent_process,
          token_id : info.pay_process,
          player_id : address()
        }),
        fetchPlayerCliams,
        {size: 100}
      )
    )
  return(
    <div class = " divide-y divide-base-300">
      <For each={claims()}>
        {(claim) => (
          <div class=" flex items-center justify-between gap-4 px-2 py-4 ">
            <div className="flex items-center gap-4 flex-wrap">
              <p>{claim?.type == "Distributed" ? <span className="badge badge-ghost uppercase">dividends</span>:<span className="badge badge-ghost uppercase">prize</span>}</p>
              <p>${toBalanceValue(claim.quantity,6)}</p>
            </div>
            <div className="text-sm text-current/50 flex items-center gap-2">
              <Moment ts={claim?.timestamp * 1000}/>
              <a href={`${info.ao_link_url}/#/message/${claim?.id}`} target="_blank">
                <Icon icon="ei:external-link"/>
              </a>
            </div>
          </div>
        )}
      </For>
      <Show when={hasMore()}>
        <Loadmore loadMore={loadMore} loading={loadingMore()} />
      </Show> 
    </div>
  )
}