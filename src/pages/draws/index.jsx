import { InfoItem } from "../../components/infoitem"
import { shortStr } from "../../lib/tool"
import { ShareToSocial } from "../../components/share"
import { Icon } from "@iconify-icon/solid"
// import Draws from "./draws"
export default props => {
  return (
    <div class="container flex-col flex gap-12 py-16 min-h-lvh/2">
       
      <section class="response_cols">
        <div class="col-span-full lg:col-span-5 flex flex-col gap-4">
          <div>
              <InfoItem label={"Total Draws"}>1</InfoItem>
              <InfoItem label={"Total rewarded"}>10000.00 $usdc</InfoItem>
            </div>
        </div>

        <div class="col-span-full lg:col-span-4 lg:col-end-13">

          <div class="text-current/50">
            The lucky numbers are generated by a random algorithm, which is fair and transparent.
          </div>
        </div>
        
      </section>

      {/* <Draws/> */}

      <section class="response_cols border-y border-current/20 py-12 px-1">
        <div class="col-span-full lg:col-span-2">
          <span class="text-2xl">R2</span>
        </div>
        <div class="col-span-full lg:col-span-6 flex flex-col gap-4">
          <InfoItem label={"Lucky Numbers"}>
            <div class="flex items-center gap-2">
              <span class="inline-flex gap-2">
                <span class="ball ball-fill">1</span>
                <span class="ball ball-fill">2</span>
                <span class="ball ball-fill">3</span>
              </span>
              <span class="text-current/50">0 Matched</span>
            </div>
          </InfoItem>
          <InfoItem label={"Total Rewards"}><span>$23450.00</span> <span class="text-current/50">$USDC</span></InfoItem>
          <InfoItem label={"Winners"}>8 players</InfoItem>
          <InfoItem label={"Drawing Id"}>{shortStr("9FbwODwBT7M-Ym8GlZNXPMq4KHEYMn0ZGmjsrcuF7ho",6)} <Icon icon="ei:external-link"></Icon></InfoItem>
        </div>
        <div class="col-span-full lg:col-span-4">
          <div class="flex justify-between">
            <span class="text-current/50">2024/11/11 11:00:00</span>
            <ShareToSocial/>
          </div>
        </div>
      </section>

      <section>
        <div class="w-full flex items-center justify-between px-2">
        <iconify-icon icon="iconoir:arrow-left"></iconify-icon>
        <span>1 2 3</span>
        <iconify-icon icon="iconoir:arrow-right"></iconify-icon>
        </div>
      </section>

    </div>
  )
}