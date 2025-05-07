import { storeResource } from "../../store"
import { createPagination } from "../../lib/pagination"
import { fetchPlayerDividends } from "../../api"
import { useApp, useWallet } from "../../contexts"
import Spinner from "../spinner"
import { For, Suspense } from "solid-js"

export default function Mintings(props) {
  const { info } = useApp()
  const { address } = useWallet()
  const [divs,{ hasMore, loadingMore, loadMore }] = storeResource(
      `divs_${info?.pool_process}_${address()}`,
      ()=>createPagination(
        ()=>({
          pool_id : info.pool_process, 
          agent_id : info.agent_process,
          token : info.pay_process,
          player_id : address()
        }),
        fetchPlayerDividends,
        {size: 100}
      )
    )
  return(
    <div>
      <Suspense fallback={<Spinner className="w-full py-10"/>}>
      {divs()?.length}
      </Suspense>
    </div>
  )
}