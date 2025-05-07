import { InfoItem } from "../infoitem"
import { useUser } from "../../contexts"
import { t,setDictionarys} from "../../i18n"
import { createEffect } from "solid-js"
import { toBalanceValue } from "../../lib/tools"
import Skeleton from "../skeleton"
export default props => {
  const {player} = useUser()
  setDictionarys("en",{
    "ac_ow.bet" : "Bet",
    "ac_ow.win" : "Win",
    "ac_ow.mint" : "Mint",
    "ac_ow.stake" : "Stake",
    "ac_ow.divs" : "Dividends",
  })
  setDictionarys("zh",{
    "ac_ow.bet" : "投注",
    "ac_ow.win" : "获胜",
    "ac_ow.mint" : "铸币",
    "ac_ow.stake" : "质押",
    "ac_ow.divs" : "分红",
  })
  createEffect(()=>console.log("player=>",player()))
  return (
    <div className="px-2 py-4 divide-y divide-base-300 flex flex-col w-full">
      <InfoItem label={t("ac_ow.bet")} className="py-4 px-1">
        <div className="flex flex-col">
          <div>
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[4em] h-[1em] skeleton"></span>}>${toBalanceValue(player()?.bet?.[1],6)}</Show>
          </div>
          <div className="text-xs text-current/50">
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[10em] h-[1em] skeleton"></span>}>A total of {player()?.bet?.[2] || 0} tickets</Show>
          </div>
        </div>
      </InfoItem>
      <InfoItem label={t("ac_ow.win")} className="py-4 px-1">
        <div className="flex flex-col">
          <div>
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[4em] h-[1em] skeleton"></span>}>${toBalanceValue(player()?.win?.[1],6)}</Show>
          </div>
          <div className="text-xs text-current/50">
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[10em] h-[1em] skeleton"></span>}>Won a total of {player()?.win?.[2] || 0} times</Show>
          </div>
        </div>
      </InfoItem>
      <InfoItem label={t("ac_ow.mint")} className="py-4 px-1">
        <div className="flex flex-col">
          <div>
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[6em] h-[1em] skeleton"></span>}>
              {toBalanceValue(player()?.mint || 0 ,12)} $ALT
            </Show>
          </div>
        </div>
      </InfoItem>
      <InfoItem label={t("ac_ow.stake")} className="py-4 px-1">
        <div className="flex flex-col">
          <div>
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[6em] h-[1em] skeleton"></span>}>
              {toBalanceValue(player()?.stake?.[0] || 0 ,12)} $ALT
            </Show>
          </div>
        </div>
      </InfoItem>
      <InfoItem label={t("ac_ow.divs")} className="py-4 px-1">
        <div className="flex flex-col">
        <div>
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[4em] h-[1em] skeleton"></span>}>${toBalanceValue(player()?.div?.[1],6)}</Show>
          </div>
          <div className="text-xs text-current/50">
            <Show when={player.state == "ready"} fallback={<span className="inline-block w-[10em] h-[1em] skeleton"></span>}>${toBalanceValue(player()?.div?.[0],6)} unclaimed</Show>
          </div>
        </div></InfoItem>
      <InfoItem label="ALTb" className="py-4 px-1"><div className="flex flex-col">
        <div>
          <Show when={player.state == "ready"} fallback={<Skeleton w={6} h={1}/>}>Remaining {toBalanceValue(player()?.faucet?.[0],12)}</Show>
        </div>
        <div className="text-xs text-current/50">
          <Show when={player.state == "ready"} fallback={<Skeleton w={10} h={1}/>}>Added {toBalanceValue(player()?.faucet?.[1],12)}</Show>
        </div>
      </div></InfoItem>
    </div>
  )
}