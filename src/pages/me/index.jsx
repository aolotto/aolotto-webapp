import { useWallet } from "arwallet-solid-kit"
import { Show, Switch } from "solid-js"
import Welcome from "./welcome"
import Avatar from "../../compontents/avatar"
import { shortStr } from "../../lib/tools"
import { t,setDictionarys } from "../../i18n"
import { Icon } from "@iconify-icon/solid"
export default props => {
  const {connected, disconnect,address} = useWallet()
  setDictionarys("en",{
    "label.tickets" : "Tickets",
    "label.bet": "Bet",
    "label.win": "Win",
    "label.mint": "Mint",
    "label.dividends": "Dividend",
    "label.staking": "Stake",
    "action.claim": "Claim",
    "action.disconnect": "Disconnect",
    "action.deposit": "Deposit",
    "action.swap": "Swap",
    "m.bets": "Bets",
    "m.mints": "Mintings",
    "m.wins": "Wins",
    "m.dividends": "Dividends",
    "m.claims": "Claims",
    "m.get": "Add",
    "m.getted": "Added"
  })
  setDictionarys("zh",{
    "label.tickets" : "彩券",
    "label.bet": "累計投注",
    "label.win": "累計獲獎",
    "label.mint": "累計鑄幣",
    "label.dividends": "分紅",
    "label.staking": "质押",
    "action.claim": "領獎",
    "action.disconnect": "斷開",
    "action.deposit": "儲值",
    "action.swap": "兌換",
    "m.bets": "投注",
    "m.mints": "鑄幣",
    "m.wins": "獲獎",
    "m.dividends": "分紅",
    "m.claims": "領獎",
    "m.get": "添加",
    "m.getted": "已添加"
  })
  return(
    <>
    <div>ddddddd</div>
    <div className="container">
      <Show when={connected()} fallback="loading">
        <section  className="flex justify-between items-center py-4 lg:py-8">
          <div className="flex items-center gap-4">
            <Avatar username={address()} />
            <span>{shortStr(address(),6)}</span>
          </div>
          <div class="flex gap-4 items-center">
            <span className="text-current/50 hidden lg:block">{t("action.disconnect")}</span>
            <button className="btn btn-circle btn-ghost"><Icon icon="solar:logout-outline"/></button>
          </div>
        </section>
        <section className="response_cols border-y py-4 border-current/20 px-2">
          <div className="col-span-full md:col-span-6 lg:col-span-7 flex items-center justify-around">
            <div className="flex-1 flex flex-col gap-2">
              <div className="text-current/50 text-sm uppercase">Unclaim Prize</div>
              <div className="text-xl">$23.00</div>
              <button className="btn btn-sm w-fit">Claim</button>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="text-current/50 text-sm uppercase">Unclaim Prize</div>
              <div className="text-xl">$23.00</div>
              <button className="btn btn-sm w-fit">Claim</button>
            </div>
          </div>
          <div className="col-span-full md:col-span-4 lg:col-start-9 ">2</div>
        </section>

      </Show>

    </div>
    </>
  )
}