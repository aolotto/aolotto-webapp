import { Modal,ModalContainer,ModalHeader } from "./popup"
import { createEffect, createMemo, createResource, createSignal, onMount, Show,For } from "solid-js"
import { fetchDrawsDetail } from "../api/draws"
import Spinner from "./spinner"
import { shortStr, toBalanceValue } from "../lib/tool"
import Avatar from "./avatar"
import { Icon } from "@iconify-icon/solid"
import tooltip from "./tooltip"
import { app } from "../signals/global"

export default props => {
  let _winner

  const [drawid,setDrawid] = createSignal()
  const [detail,{refetch}] = createResource(()=>drawid(),fetchDrawsDetail)
  const rewards = createMemo(()=>detail()?Object.entries(detail()?.rewards):[])
  const token = createMemo(()=>detail()?.token)
  const jackpot =  createMemo(()=>detail()?.jackpot)
  const type =  createMemo(()=>detail()?.reward_type)

  createEffect(()=>console.log(rewards()))

  onMount(()=>{
    props.ref({
      open:(id)=>{
        if(id){
          setDrawid(id)
        }
        _winner.open()
      },
      close:()=>{
        setDrawid(null)
        _winner.close()
      },
    })
  })

  return (
    <Modal ref={_winner} mask={true}>
      <ModalHeader title="🏆 Rewards Detail"/>
      <ModalContainer class="w-96">
        
        <div class="p-4">
          <Show when={detail.state == "ready"} fallback={<Spinner/>}>
            <div class="flex justify-center items-center flex-col">
              <span class="text-2xl">{toBalanceValue(jackpot()||0,token()?.denomination||6,2)}</span>
              <span class="text-current/50">${token()?.ticker}</span>
            </div>
            <div class="py-4">

              <For each={rewards()}>
                {(item,index)=>(
                  <div class="flex items-center justify-between border-t border-current/10 p-2 last:border-b">
                    <div class="flex items-center gap-4" use:tooltip={["top",item?.[0]]}>
                      <span class="text-current/50">{index()+1}</span>
                      <Avatar class="size-6" username={item?.[0]}/>
                      <a href={app.ao_link_url+"/#/entity/"+item?.[0]} target="_blank" class="inline-flex items-center gap-2 text-base-content/50">{shortStr(item?.[0],4)}<Icon icon="ei:external-link"></Icon></a>
                    </div>
                    <span>${toBalanceValue(item?.[1]||0,token()?.denomination||6,2)}</span>
                  </div>
                )}
              </For>
            </div>
            <div class="text-sm text-current/50 py-4 flex gap-4 px-1">
              <Icon icon="proicons:info" />
              <p>No matching bets this round, the last bettor takes the entire prize.</p>
            </div>
          </Show>
        </div>
      </ModalContainer>
    </Modal>
  )
}