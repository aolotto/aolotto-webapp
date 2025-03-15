import { InfoItem } from "../../components/infoitem"
import { shortStr } from "../../lib/tool"
import { ShareToSocial } from "../../components/share"
import { Icon } from "@iconify-icon/solid"
import { createEffect, Suspense,ErrorBoundary, Show } from "solid-js"
import Spinner from "../../components/spinner"
import Draws from "./draws"
import { stats } from "../../data/resouces"
import { protocols } from "../../data/info"
import { toBalanceValue } from "../../lib/tool"
import { setDictionarys,t } from "../../i18n"


export default props => {
  const pay_i = protocols?.details[protocols?.pay_id]
  setDictionarys("en",{
    "label.total_draws" : "Total Draws",
    "label.total_rewarded" : "Total Rewarded",
    "label.total_winners" : "Total Winners",
    "label.learn_more" : "Learn More",
    "desc" : "The winning number are generated on-chain by a random algorithm, which is fair and transparent."
  })
  setDictionarys("zh",{
    "label.total_draws" : "總抽獎次數",
    "label.total_rewarded" : "總獎勵",
    "label.total_winners" : "總中獎人數",
    "label.learn_more" : "了解更多",
    "desc" : "中獎號碼由链上隨機算法生成，公平透明。"
  })
  return (
    <div class="container flex-col flex gap-12 py-16 min-h-lvh/2">
       
      <section class="response_cols">
        <div class="col-span-full lg:col-span-5 flex flex-col">
          <InfoItem label={t("label.total_draws")}>{<Show when={!stats.loading} fallback="...">{stats()?.total_archived_round}</Show>} <span class="text-current/50">{stats()?.total_archived_round>1?"Rounds":"Round"}</span></InfoItem>
          <InfoItem label={t("label.total_rewarded")}>{<Show when={!stats.loading} fallback="...">{toBalanceValue(stats()?.total_reward_amount,6,2)}</Show>} <span class="text-current/50">${pay_i?.Ticker}</span></InfoItem>
          <InfoItem label={t("label.total_winners")}>{<Show when={!stats.loading} fallback="...">{stats()?.total_winners}</Show>} <span class="text-current/50">{stats()?.total_winners>1?"Players":"Player"}</span></InfoItem>
        </div>

        <div class="col-span-full lg:col-span-4 lg:col-end-13">

          <div class="text-current/50">
            {t("desc")} <a href="#" target="_blank" class="inline-flex items-center gap-2">Learn More<Icon icon="ei:external-link"></Icon></a>
          </div>
        </div>
        
      </section>
      <section class="border-t border-current/10">
        <Suspense fallback={
          <div >
            <Spinner className="w-full h-40 flex justify-center items-center"/>
          </div>
          
          }>
          <ErrorBoundary>
            <Draws archived={stats()?.total_archived_round}/>
          </ErrorBoundary>
        </Suspense>

      </section>
      
      


    </div>
  )
}