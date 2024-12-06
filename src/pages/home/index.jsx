import { Icon } from "@iconify-icon/solid"
import { A } from "@solidjs/router"
import { shortStr } from "../../lib/tool"
import { createEffect, createMemo, Show } from "solid-js"
import { pool,app } from "../../signals/global"
import tooltip from "../../components/tooltip"
import { state,stats } from "../../signals/pool"
import { toBalanceValue } from "../../lib/tool"
import Balls from "../../components/balls"
import Aox from "./partners/aox"
import Everpay from "./partners/everpay"
import Aolink from "./partners/aolink"
import Typr from "./partners/typr"
import Seagull from "./partners/seagull"
import Pattern from "../../components/pattern"




export default props => {

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
    <main class="container relative z-0 overflow-visible">
      
      {/* <Balls class="w-full fixed z-0 too-0 float"/> */}
      <section class="py-18 response_cols">
        
        <div class="col-span-full flex items-center justify-center">
          <span class="text-6xl text-center text-balance leading-18 w-[70%]">The first decentralized <b>lottery</b> game built on AO</span>
        </div>
        <div class="col-span-full flex flex-col gap-8 items-center justify-center">
          <div class="flex flex-col justify-center items-center gap-2">
            <span class="text-current/50 uppercase">Progressive Jackpot</span>
            <span class="text-4xl text-third font-bold">
              <Show when={!state.loading} fallback="...">${toBalanceValue(state()?.jackpot, pool.denomination||6,2)}</Show>
            </span>
          </div>
          <div class="flex flex-col items-center justify-center gap-4">
            <A class="btn btn-primary btn-xl w-fit rounded-full" href="/bets">Start betting to WIN <iconify-icon icon="iconoir:arrow-right"></iconify-icon></A>
            <Show when={!state.loading} fallback="...">
              <span class="text-current/50">Round-{state()?.round || 1} is ongoing</span>
            </Show>
          </div>
        </div>
        <div class="col-span-full flex items-center justify-center gap-2 pt-8">
          <Aox class="opacity-50 h-8"/>
          <Everpay class="opacity-50 h-8"/>
          <Aolink class="opacity-50 h-8"/>
          <Typr class="opacity-50 h-8"/>
          <Seagull class="opacity-50 h-8"/>
        </div>


      </section>

      <section class="py-16 border-y border-current/10 response_cols  px-2">
        <div class="col-span-full lg:col-span-4">
          <div class="uppercase text-current/50">total sold</div>
          <div class="text-3xl"><Show when={!stats.loading} fallback="...">${toBalanceValue(stats()?.total_sales_amount,pool.denomination || 6,2)}</Show></div>
          <div class="pt-4">
            <div class="flex items-center gap-2 h-8"><Icon icon="ph:arrow-elbow-down-right-light"></Icon><span class="text-current/50">Realized Revenue:</span> <span>${toBalanceValue(stats()?.taxation?.[1]+state()?.balance * 0.1,pool.denomination || 6,2)}</span></div>
            <div class="flex items-center gap-2 h-8"><Icon icon="ph:arrow-elbow-down-right-light"></Icon><span class="text-current/50">Distributed:</span> <span>${toBalanceValue(stats()?.taxation?.[2],pool.denomination || 6,2)}</span></div>
            <div class="flex items-center gap-2 h-8"><Icon icon="ph:arrow-elbow-down-right-light"></Icon><span class="text-current/50">Total</span><span>2</span><span class="text-current/50">$ALT holders</span></div>
          </div>
          
        </div>
        <div class="col-span-full lg:col-span-7 lg:col-end-13">
          <div class="text-current/50 uppercase">#Bet2Earn</div>
          <h2 class="text-3xl pb-6 text-balance leading-10">Sharing profits by holding $ALT</h2>
          <p class="text-sm text-current/50">The jackpot is taxed, and all tax revenue is regularly distributed to the community. Holding $ALT allows you to continuously share in the profits. 70% of the total supply of 210 million will be earned for free through the #Bet2Earn mechanism.</p>
        </div>
      </section>

  
      <section class="py-16 response_cols px-2 ">
        <div class="col-span-full px-16 text-center flex flex-col justify-center items-center gap-4">
          <div class="flex items-center gap-2">
          <Show when={pool?.id}>
          <Icon icon="iconoir:component" />
              <a 
                class="inline-flex items-center text-base-content/50" 
                use:tooltip={["top-overlap",()=>pool.id]}
                target="_blank"
                href={`${app.ao_link_url}/#/entity/${pool.id}`}
              >
                {shortStr(pool.id,6)} <Icon icon="ei:external-link"></Icon>
              </a>
            </Show>
          </div>
          
          <div class="text-3xl leading-12 ">$1 On-chain betting and drawing without human control, Simple, Permissionless and Transparent.</div>
        </div>

        <div class="col-span-full flex items-center justify-center pt-12">
          <div class="max-w-[60em] w-full gap-4 flex flex-col">
          <For each={faq()}>
            {({title,content},index)=>(
              <div class="w-full bg-current/2 hover:bg-current/5 p-2 rounded-lg border-current/5 border">
                <div class="w-full flex justify-between gap-4 items-center cursor-pointer">
                  <span class="rounded-full size-6 inline-flex justify-center items-center text-current/50">{index()+1}</span>
                  <span class="flex-1">{title}</span>
                  <span class="text-current/50"><Icon icon="iconoir:arrow-separate-vertical"></Icon></span>
                </div>
                <p class="hidden">
                  {content}
                </p>
              </div>
            )}
          </For>
          <div class="inline-flex justify-center items-center p-2 gap-2 mt-2">
            <a href="dd" class="inline-flex items-center">Online Support<Icon icon="ei:external-link"></Icon></a>
            <span class="text-current/50">or</span>
            <a href="dd" class="inline-flex items-center">Learn More<Icon icon="ei:external-link"></Icon></a>
          </div>
          </div>
        
        </div>
        
      </section>

      <section class="flex justify-center flex-col items-center gap-8  p-16  text-center ">
      <p class="text-2xl ">More than just a lottery, It's a gambling ecosystem driven by the $ALT community and running permanently.</p>
      <button class="btn btn-xl rounded-full w-fit gap-4 items-center btn-third"><Icon icon="iconoir:app-store" />Let's build together</button>
      <p class="text-current/50">Developers are welcome to join us in creating more games and applications based on $ALT. With its dividend feature, $ALT allows developers to enjoy continuous and sustainable profits.</p>
      </section>

      <div class="absolute bottom-0 scale-105 left-0 w-full -z-1">
        <Pattern class="w-full"/>
        </div>
      <div class="absolute top-0 left-0 w-full -z-1">
      <Balls class="w-full"/>
      </div>
    </main>
  )
}