import { createEffect, createMemo, For, splitProps } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { createDraws } from "../../signals/draws"
import { app, pool } from "../../signals/global"
import { toBalanceValue } from "../../lib/tool"
import { Datetime } from "../../components/moment"
import { InfoItem } from "../../components/infoitem"
import { shortStr } from "../../lib/tool"
import { ShareToSocial } from "../../components/share"
import Loadmore from "../../components/loadmore"
import Winners from "../../components/winners"
import { fetchDrawsDetail } from "../../api/draws"


// const DrawItem = props => {
//   const [{item:{round,lucky_number,matched,jackpot,created,winners,taxation,id,ticker,denomination,bet}},rest] = splitProps(props,["item"])

//   return (
//     <section class="response_cols py-8  px-8 ">
//         <div class="col-span-full lg:col-span-2">
//           <div class="text-current/50 uppercase pt-1">Round</div>
//           <div class="text-3xl">{round}</div>
//         </div>
//         <div class="col-span-full lg:col-span-6 flex flex-col gap-2">
//           <InfoItem label={"Winning Numbers"}>
//             <div class="flex items-center gap-2">
//               <span class="inline-flex gap-2">
//                 <For each={lucky_number?.split('')||["*","*","*"]}>
//                   {(num)=><span class="ball ball-fill">{num}</span>}
//                 </For>
//               </span>
//               <button class="btn btn-icon btn-ghost btn-primary rounded-full btn-sm"><Icon icon="iconamoon:shield-yes-light" /></button>
//             </div>
//           </InfoItem>
//           <InfoItem label={"Matched Bets"}><span classList={{
//             "text-current/50" : matched<=0,
//             "text-current" : matched>0
//           }}>{matched}</span> <span class="text-current/50">/ {bet?.[0] || 0}</span></InfoItem>
//           <InfoItem label={"Drawing Time"}><Datetime ts={Number(created)}/></InfoItem>
//           <InfoItem label={"Taxation / Rate"}>{toBalanceValue(taxation,denomination||6,2)} <span class="text-current/50">${ticker}</span> / {taxation/jackpot}</InfoItem>
//           <InfoItem label={"Drawing Id"}><a href={app.ao_link_url+"#/message/"+id} target="_blank" class="inline-flex items-center gap-2">{shortStr(id,6)} <Icon icon="ei:external-link"></Icon></a></InfoItem>
//         </div>
//         <div class="col-span-full lg:col-span-4 flex flex-col justify-between items-end">
//           <div class="flex flex-col gap-4 w-full">
            
//             <div>
//               <div class ="text-current/50 uppercase">The Prize</div>
//               <div class="flex items-center"><span>🏆 <span class="text-2xl">{toBalanceValue(jackpot,denomination||6,2)}</span></span> <span class="text-current/50">${ticker}</span></div>
//             </div>
//             <div class="px-1 inline-flex gap-2 items-center">
//               <Icon icon="ph:arrow-elbow-down-right-light"></Icon> 
//               <button
//                 onClick={()=>{
//                   if(props?.onClickWinner){
//                     props.onClickWinner(id)
//                   }
//                 }}
//                 class="inline-flex py-1 px-3 btn-third btn rounded-full gap-2">
//                 <span>{winners} </span><span class="text-current/50">{winners>1?"Winners shared":"Winner takes"}</span>
//               </button>  
//             </div>
//             {/* <div class="flex gap-2 px-1">
//               <Icon icon="proicons:info" />
//               <span class="text-xs text-current/50">No matching bets this round, the last bettor takes the entire prize.</span>
//             </div> */}
//           </div>
//           <ShareToSocial/>
//         </div>
//       </section>
//   )
// }

const DrawItem = props => {
  const [{item:{round,lucky_number,matched,jackpot,created,winners,taxation,id,ticker,denomination,bet,block_height}},rest] = splitProps(props,["item"])
  return(
    <section class="response_cols border-b border-current/10 py-12 px-2">
      <div class="col-span-full lg:col-span-3 flex flex-col justify-between gap-4">
        <div>
          <div class="text-current/50 uppercase">Round</div>
          <div class="text-2xl">{round}</div>
        </div>
        <div>
          <div class="inline-flex gap-2">
            <For each={lucky_number?.split('')||["*","*","*"]}>
              {(num)=><span class="ball ball-fill">{num}</span>}
            </For>
          </div>
          <div class="text-xs pt-4">
            <span class="text-current/50">The lucky number was generated at block-Height </span><span>{block_height}</span><span class="text-current/50">,it can be verifiable.</span> <a>Proof of Generation</a>
          </div>
        </div>
      </div>
      <div class="col-span-full lg:col-span-6 lg:col-start-5 flex flex-col gap-4">
        <div>
          <div class="text-current/50 uppercase">The Prize</div>
          <div class="text-2xl text-secondary">${toBalanceValue(jackpot,denomination||6,2)}</div>
        </div>
        <div>
          <InfoItem label={"Matched Bets"}><span classList={{
            "text-current/50" : matched<=0,
            "text-current" : matched>0
          }}>{matched}</span> <span class="text-current/50">/ {bet?.[0] || 0}</span></InfoItem>
          <InfoItem label={"Drawing Time"}><Datetime ts={Number(created)}/></InfoItem>
          <InfoItem label={"Taxation / Rate"}>${toBalanceValue(taxation,denomination||6,2)} / {taxation/jackpot}</InfoItem>
          <InfoItem label={"Drawing Id"}><a href={app.ao_link_url+"#/message/"+id} target="_blank" class="inline-flex items-center gap-2">{shortStr(id,6)} <Icon icon="ei:external-link"></Icon></a></InfoItem>
          
        </div>
      </div>
      <div class="col-span-full lg:col-span-2 flex flex-col justify-between">
        <div>
          <div class="text-current/50 uppercase">Winners</div>
          <div class="">
            <button 
              class="btn rounded-full btn-sm gap-1 px-4 mt-1"
              onClick={()=>{
                if(props?.onClickWinner){
                  props.onClickWinner(id)
                }
              }}
            > 🏆 {winners}
            </button>
          </div>
        </div>
        <div class='flex justify-end items-center'>
        <ShareToSocial/>
        </div>
      </div>
    </section>
  )
}

export default props => {
  let _winner
  const [draws,{hasMore,loadingMore,loadMore}] = createDraws(()=>({pool_id:pool?.id}))
  createEffect(()=>console.log("draws",draws()))
  return (
    <>
      <section class="flex flex-col  border-t border-current/10">
        <For each={draws()}>
          {item=>{
            return <DrawItem item={item} onClickWinner={(id)=>{
              console.log("open winner")
              _winner.open(id)
            }}/>
          }}
        </For>
        <Show when={hasMore()}>
            <Loadmore loadMore={loadMore} loading={loadingMore()}/>
          </Show>
      </section>
      <Winners ref={_winner}/>
    </>
  )
}