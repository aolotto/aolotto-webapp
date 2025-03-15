import tooltip from "../../components/tooltip"
import { createEffect, For, Show, Suspense, createResource } from "solid-js"
import Empty from "../../components/empty"
import { setDictionarys,t } from "../../i18n"
import Spinner from "../../components/spinner"
import { protocols } from "../../data/info"
// import { ranks } from "../../signals/pool"
import Rankitem from "./rankitem"
import { fetchPoolRanks } from "../../api/pool"

export default props => {
  setDictionarys("en",{
    "top.bettings": "Top Bettings",
    "top.mintings": "Top Mintings",
    "top.winnings": "Top Winnings",
    "top.dividends": "Top Dividends",
  })
  setDictionarys("zh",{
    "top.bettings": "投注排行",
    "top.mintings": "鑄幣排行",
    "top.winnings": "獲獎排行",
    "top.dividends": "分紅排行",
  })

  const [ranks,{refetch:refetchPoolRanks}] = createResource(()=>protocols?.agent_id,fetchPoolRanks)

  return(
    <main class="container py-8">
      <div>
      <Suspense 
        fallback={<div className="w-full h-40 flex flex-col items-center justify-center"><Spinner/></div>}>
        <Show when={ranks()?.bettings?.length == 0 && ranks()?.mintings?.length == 0 && ranks()?.winnings?.length == 0 && ranks()?.dividends?.length == 0}>
          <Empty tips="No rankings yet."/>
        </Show>
        <Show when={ranks()?.winnings?.length > 0}>
          <section>
            <h2 class="col-span-full py-4 mt-4">
              <span class="size-6 inline-flex mr-6 ml-2">🏆</span> 
              <span class="text-current/50 uppercase">{t("top.winnings")}</span>
            </h2>
            <For each={ranks()?.winnings}>
              {(item,index)=>{
                const [i] = Object.entries(item)
                return(
                  <Rankitem 
                    index={index}
                    user={i[0]}
                    amount={i[1]}
                    token={protocols?.details[protocols.pay_id]}
                    key={index()}
                  />
                )
              }}
            </For>
          </section>
        </Show>
        <Show when={ranks()?.bettings?.length > 0}>
          <section>
            <h2 class="col-span-full py-4 mt-4">
              <span class="size-6 inline-flex mr-6 ml-2">🎲</span> 
              <span class="text-current/50 uppercase">{t("top.bettings")}</span>
            </h2>
            <For each={ranks()?.bettings}>
              {(item,index)=>{
                const [i] = Object.entries(item)
                return(
                  <Rankitem 
                    index={index}
                    user={i[0]}
                    amount={i[1]}
                    token={protocols?.details[protocols.pay_id]}
                    key={index()}
                  />
                )
              }}
            </For>
          </section>
        </Show>
        <Show when={ranks()?.mintings?.length > 0}>
          <section>
            <h2 class="col-span-full py-4 mt-4">
              <span class="size-6 inline-flex mr-6 ml-2">🪙</span> 
              <span class="text-current/50 uppercase">{t("top.mintings")}</span>
            </h2>
            <For each={ranks()?.mintings}>
              {(item,index)=>{
                const [i] = Object.entries(item)
                return(
                  <Rankitem 
                    index={index}
                    user={i[0]}
                    amount={i[1]}
                    token={protocols?.details[protocols.agent_id]}
                    key={index()}
                  />
                )
              }}
            </For>
          </section>
        </Show>
       
        <Show when={ranks()?.dividends?.length > 0}>
          <section>
            <h2 class="col-span-full py-4 mt-4">
              <span class="size-6 inline-flex mr-6 ml-2">💰</span> 
              <span class="text-current/50 uppercase">{t("top.dividends")}</span>
            </h2>
            <For each={ranks()?.dividends}>
              {(item,index)=>{
                const [i] = Object.entries(item)
                return(
                  <Rankitem 
                    index={index}
                    user={i[0]}
                    amount={i[1]}
                    token={protocols?.details[protocols.pay_id]}
                    key={index()}
                  />
                )
              }}
            </For>
          </section>
        </Show>
      </Suspense>
        
      </div>
      
    </main>
  )
}