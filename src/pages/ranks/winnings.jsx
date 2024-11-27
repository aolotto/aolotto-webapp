import { For } from "solid-js"
import Avatar from "../../components/avatar"
import { Icon } from "@iconify-icon/solid"


export default props => {
  
  return(
    <div class="response_cols gap-2 py-8">
      <For each={new Array(20)}>
        {(item,index)=>{
          return(
            <div class=" col-span-full flex items-center justify-between gap-4 hover:bg-current/5 p-1 rounded-md">
              <div 
                class="text-current/50 size-6 text-sm rounded-full flex items-center justify-center"
                classList={{
                  "text-primary": index()==0,
                  "text-secondary": index()==1,
                  "text-third": index()==2
                }}
              >
                {index()+1}
              </div>
              <div class="flex gap-2 items-center flex-1"><Avatar class="size-6" username="TrnCnIGq1tx8TV8NA7L2ejJJmrywtwRfq9Q7yNV6g2A"/> TrnCnIGq1tx8TV8NA7L2ejJJmrywtwRfq9Q7yNV6g2A <span class="text-current/50">- 20 tickets</span></div>
              <div class="w-80 flex items-center justify-between">
                <span>23.000 <span class="text-current/50">$USDC</span></span>
                <Icon icon="ei:external-link"></Icon>
              </div>
            </div>
          )
        }}
      </For>
    </div>
  )
}