import Avatar from "../../components/avatar";
import Ticker from "../../components/ticker";
import { Icon } from "@iconify-icon/solid";
import { toBalanceValue } from "../../lib/tool";
import { app } from "../../signals/global";

export default props => {
  return(
    <div class=" col-span-full flex items-center justify-between gap-4 hover:bg-current/5 px-1 py-1 rounded-md overflow-visible">
      <div 
        class="text-current/50 size-6 text-sm rounded-full flex items-center justify-center overflow-visible mr-4"
        classList={{
          "text-primary": props?.index()==0,
          "text-secondary": props?.index()==1,
          "text-third": props?.index()==2
        }}
      >
        {props?.index()+1}
      </div>
      <div class="flex gap-8 items-center flex-1"><Avatar class="size-6" username={props?.user||"aolotto"}/> <span>{props?.user}</span> </div>
      <div class="w-96 flex items-center justify-between p-1">
        <span>{toBalanceValue(props?.amount||0,props?.token?.Denomination||6,4)} <Ticker class="text-current/50">{props?.token?.Ticker}</Ticker></span>
        <a href={app.ao_link_url+`/#/entity/`+props?.user} target="_blank"><Icon icon="ei:external-link"></Icon></a>
      </div>
    </div>
  )
}