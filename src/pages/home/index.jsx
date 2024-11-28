import { Icon } from "@iconify-icon/solid"
import { A } from "@solidjs/router"
import { shortStr } from "../../lib/tool"
import { createEffect, createMemo, Show } from "solid-js"
import { pool,app } from "../../signals/global"
import tooltip from "../../components/tooltip"
import { state,stats } from "../../signals/pool"
import { toBalanceValue } from "../../lib/tool"

export default props => {

  createEffect(()=>console.log(pool))
  // const taxRate = createMemo(()=>{
  //   let rate = 0.1
  //   let rates = JSON.parse(pool?.tax)
  // })
  const faq = createMemo(()=>([
    {
      title:"What is the difference between aolotto and traditional lottery?",
      content: "ddddd"
    },{
      title:"Why do we build on Arweave AO?",
      content: "ddddd"
    },{
      title: "Are the betting funds in the prize pool safe?",
      content:"dddddd"
    },{
      title: "How to ensure the fairness and transparency of the lottery?",
      content: "ffffff"
    }
  ]))
  return (
    <main class="container">
      <section class="py-16 response_cols">
        <div class="col-span-full lg:col-span-8 flex flex-col">
          <span class="text-6xl text-balance leading-18">1st decentralized <b>lottery</b> pool built on TheAoComputer</span>
        </div>
        <div class="col-span-full lg:col-span-4 lg:col-end-13  rounded-2xl flex flex-col justify-between gap-4">
          <div class="flex flex-col gap-2">
            <span class="text-current/50 uppercase">Progressive Jackpot</span>
            <span class="text-4xl">
              <Show when={!state.loading} fallback="...">${toBalanceValue(state()?.jackpot, pool.denomination||6,2)}</Show>
            </span>
          </div>
          
          <div class="flex flex-col gap-4">
            <A class="btn btn-primary btn-xl w-fit rounded-full" href="/bets">Start betting to win <iconify-icon icon="iconoir:arrow-right"></iconify-icon></A>
            <span class="text-current/50">
            <Show when={!state.loading} fallback="..."></Show>
              Round-{state()?.round || 1} is ongoing...
            </span>
          </div>
        </div>

      </section>

      <section class="py-16 response_cols border-t border-current/20 px-2">
        <div class="col-span-full lg:col-span-4">
          <div class="uppercase text-current/50">total sold</div>
          <div class="text-3xl"><Show when={!stats.loading} fallback="...">${toBalanceValue(stats()?.total_sales_amount,pool.denomination || 6,2)}</Show></div>
          <div class="pt-4">
            <div class="flex items-center gap-2 h-8"><Icon icon="ph:arrow-elbow-down-right-light"></Icon><span class="text-current/50">Realized Revenue:</span> <span>${toBalanceValue(stats()?.taxation?.[1]+state()?.balance * 0.1,pool.denomination || 6,2)}</span></div>
            <div class="flex items-center gap-2 h-8"><Icon icon="ph:arrow-elbow-down-right-light"></Icon><span class="text-current/50">Distributed:</span> <span>${toBalanceValue(stats()?.taxation?.[2]*0.1,pool.denomination || 6,2)}</span></div>
            <div class="flex items-center gap-2 h-8"><Icon icon="ph:arrow-elbow-down-right-light"></Icon><span class="text-current/50">Total</span><span>2</span><span class="text-current/50">$LOTTO holders</span></div>
          </div>
          
        </div>
        <div class="col-span-full lg:col-span-7 lg:col-end-13">
          <h2 class="text-3xl pb-6 text-balance leading-10">Base on the community, Sharing profits by holding $LOTTO</h2>
          <p class="text-sm text-current/50">The jackpot is taxed, and all tax revenue is regularly distributed to the community. Holding $LOTTO allows you to continuously share in the profits. 70% of the total supply of 21 million will be earned for free through the #Bet2Earn mechanism.</p>
        </div>
      </section>

      <section class="py-16 response_cols border-t border-current/20 px-2">
        <div class=" col-span-full lg:col-span-4 flex flex-col justify-between gap-4">
          <span class="text-3xl text-balance leading-10">On-chain betting and drawing without human control, Simple, Open and Transparent.</span>
          <span>
            <span class="text-current/50">The contract: </span>
            <Show when={pool?.id}>
              <a 
                class="inline-flex items-center" 
                use:tooltip={["top-overlap",()=>pool.id]}
                target="_blank"
                href={`${app.ao_link_url}/#/entity/${pool.id}`}
              >
                {shortStr(pool.id,6)} <Icon icon="ei:external-link"></Icon>
              </a>
            </Show>
            
          </span>
          
        </div>
        <div class="col-span-full lg:col-span-7 lg:col-end-13 flex flex-col gap-1">
          <For each={faq()}>
            {({title,content},index)=>(
              <div class="w-full hover:bg-current/5 p-2 rounded-2xl">
                <div class="w-full flex justify-between gap-2 items-center cursor-pointer">
                  <span class="border rounded-full size-6 inline-flex justify-center items-center">{index()+1}</span>
                  <span class="flex-1">{title}</span>
                  <Icon icon="iconoir:arrow-separate-vertical"></Icon>
                </div>
                <p class="hidden">
                  {content}
                </p>
              </div>
            )}
          </For>
          
          <div class="inline-flex justify-end items-center p-2 gap-2 mt-2">
            <a href="dd" class="inline-flex items-center">Online support<Icon icon="ei:external-link"></Icon></a>
            <span class="text-current/50">or</span>
            <a href="dd" class="inline-flex items-center">Learn More<Icon icon="ei:external-link"></Icon></a>
          </div>
          
        </div>
      </section>
    </main>
  )
}