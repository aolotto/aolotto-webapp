import Mintlevel from "../../compontents/mintlevel"
import { Icon } from '@iconify-icon/solid'
import { t,setDictionarys } from "../../i18n"
import { toBalanceValue } from "../../lib/tools"
import { Show, splitProps,createMemo } from "solid-js"
export default props => {
  setDictionarys("en",{
    "tooltop.bet2mint" : ()=>"$ALT (The Dividends Token) is minted in rounds via the Bet2Mint mechanism. At the start of each round, the minting reward is reset to (max supply - current supply) * 0.002. Users receive minting rewards based on their betting order, calculated as: current round’s Bet2Mint balance * minting speed [1] * reward ladder coefficient",
    "m.mint_tip" : (v)=><span class='leading-[0.5em]'>Remaining Bet2Mint rewards in this round: <b class="text-base-content">{v.balance}</b> / {v.total} $ALT. Rewards for each bet follow the ladder. If no new bets, the last bettor will gets <b class="text-base-content">~{v.auto_reward}</b> $ALT Gap-Reward every <span class="text-base-content">10m</span>, Bet NOW or watch the rewards vanish!</span>,
    "m.bet" : "Bet",
    "m.mint_speed" : "Mint Speed",
    "m.next_auto_mint" : "latest Gap-Reward",
    "m.count_auto_mint" : "Gap-Reward Count",
    "m.balance" : "Remains",
    "m.quota" : "Quota",
    "bet" : "Bet",
    "m.reward_ladder_1" : "L1: Bet amount between $1-9, reward coefficient = 0.0001, the actual amount is calculated based on the current Bet2Mint balance",
    "m.reward_ladder_2" : "L2: Bet amount between $10-49, reward coefficient = 0.0003, the actual amount is calculated based on the current Bet2Mint balance",
    "m.reward_ladder_3" : "L3: Bet amount between $50-99, reward coefficient = 0.0006, the actual amount is calculated based on the current Bet2Mint balance",
    "m.reward_ladder_4" : "L4: Bet amount at the maximum limit of $100, reward coefficient = 0.001, the actual amount is calculated based on the current Bet2Mint balance",
  })
  setDictionarys("zh",{
    "tooltop.bet2mint" : ()=>"$ALT (分红代币) 通过 Bet2Mint 机制进行铸造。在每轮开始时，铸造奖励重置为 (最大供应量 - 当前供应量) * 0.002。用户根据下注顺序获得铸造奖励，计算公式为：当前轮次的 Bet2Mint 余额 * 铸造速度 [1] * 奖励阶梯系数",
    "m.mint_tip" : (v)=><span>本轮Bet2Mint铸币奖励剩余 <b class="text-base-content">{v.balance}</b> / {v.total} $ALT, 单次投注获得的奖励参照奖励阶梯；没有新的投注追加时，协议将每<span class="text-base-content">10分钟</span>下发一次空当奖励 <span class="text-base-content">~{v.auto_reward}</span> $ALT给最后下注者,建议尽早下注，避免本轮铸币奖励被其它玩家耗光。</span>,
    "m.bet" : "投注",
    "m.mint_speed" : "铸币速度",
    "m.next_auto_mint" : "最近一次空当奖励",
    "m.count_auto_mint" : "空当奖励次数",
    "m.balance" : "余额",
    "m.quota" : "配额",
    "bet" : "下注",
    "m.reward_ladder_1" : "L1：投注金额位于 $1-9 区间，奖励系数为 0.0001,实际奖励金额基于当前Bet2Mint余额计算",
    "m.reward_ladder_2" : "L2：投注金额位于 $10-49 区间，奖励系数为 0.0003,实际奖励金额基于当前Bet2Mint余额计算",
    "m.reward_ladder_3" : "L3：投注金额位于 $50-99 区间，奖励系数为 0.0006,实际奖励金额基于当前Bet2Mint余额计算",
    "m.reward_ladder_4" : "L4：投注金额达到最高投注上限 $100，奖励系数为 0.001,实际奖励金额基于当前Bet2Mint余额计算",
  })
  const [{pool},others] = splitProps(props,["pool"])
  const minting = createMemo(()=>{
    if(pool.state == "ready"){
      const {max_mint,minted,quota} = pool()?.minting || {max_mint:0,minted:0,quota:0}
      const speed = (Number(max_mint) - Number(minted)) / Number(max_mint)
      const per_reward = quota[0] * 0.001 * speed
      return {quota,minted, max_mint,per_reward,speed}
    }
    
  })
  return (
    <section className="response_cols overflow-visible border-y border-current/20 py-6 px-2">
      <div className="col-span-full md:col-span-6 lg:col-span-7 h-full ">
        <div className="w-full h-full flex flex-col md:flex-row gap-4">
            <div className="md:w-[36%] h-full hidden lg:flex flex-col justify-between items-center md:items-start gap-4">
              <div>
                <span
                  class=" tooltip w-fit"
                >
                  <div className="tooltip-content">
                    <div className="text-sm text-left p-2">
                      <div>{t("tooltop.bet2mint")}</div>
                      <div class="pt-2 mt-2 border-t border-current/20">{t("tooltop.minting_speed")}</div>
                    </div>
                  </div>
                  <span className="inline-flex bg-accent text-accent-content px-2 uppercase rounded-full py-0.5 items-center gap-1 cursor-help w-fit mt-2">
                  Bet2Mint <Icon icon="carbon:information"></Icon>
                  </span>
                </span>
              </div>
              <div className="text-xs flex flex-col gap-2">
                <p><Icon icon="ph:arrow-elbow-down-right-light"/> <span className="text-current/50">{t("m.balance")}: </span> <span><Show when={pool?.state=="ready"} fallback={<span className="skeleton h-[1em] inline-block w-[4em]"></span>}>{toBalanceValue(pool()?.minting?.quota?.[0],12)} $ALT</Show></span></p>
                <p><Icon icon="ph:arrow-elbow-down-right-light"/> <span className="text-current/50">{t("m.quota")}: </span> <span><Show when={pool?.state=="ready"} fallback={<span className="skeleton h-[1em] inline-block w-[4em]"></span>}>{toBalanceValue(pool()?.minting?.quota?.[1],12)} $ALT</Show></span></p>
              </div>
            </div>
            <div className=" flex-1 flex flex-col items-center md:items-start justify-center">
              <span class="text-xs md:text-sm text-current/50">
                {t("m.mint_tip",{
                  balance: toBalanceValue(minting()?.quota?.[0],12),
                  total: toBalanceValue(minting()?.quota?.[1],12,3),
                  auto_reward: toBalanceValue(minting()?.per_reward * 1 * 0.1,12)
                })}
              </span>
            </div>
        </div>

      </div>
      <div className="col-span-full md:col-span-4 lg:col-start-9 ">
        <ul className="flex flex-col gap-2">
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip={t("m.reward_ladder_4")}>
            <Mintlevel level={4} />
          </span>
          <span>
            {t("bet")} <span class="text-base-content">$100</span> → <span class="text-base-content">~<Show when={pool.state =="ready"} fallback={<div class="skeleton h-[1em] w-[4em] inline-block"></div>}>{toBalanceValue(minting()?.per_reward * 100 * 1,12)}</Show></span> $ALT
          </span>
        </li>
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip={t("m.reward_ladder_3")}>
            <Mintlevel level={3} />
          </span>
          <span>
          {t("bet")} <span class="text-base-content">$50-99</span> → <span class="text-base-content">~<Show when={pool.state =="ready"} fallback={<div class="skeleton h-[1em] w-[4em] inline-block"></div>}>{toBalanceValue(minting()?.per_reward * 50 * 0.6,12)}-{toBalanceValue(minting()?.per_reward * 99 * 0.6,12)}</Show></span> $ALT
          </span>
        </li>
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip={t("m.reward_ladder_2")}>
            <Mintlevel level={2} />
          </span>
          <span>
          {t("bet")} <span class="text-base-content">$10-49</span> → <span class="text-base-content">~<Show when={pool.state =="ready"} fallback={<div class="skeleton h-[1em] w-[4em] inline-block"></div>}>{toBalanceValue(minting()?.per_reward * 10 * 0.3,12)}-{toBalanceValue(minting()?.per_reward * 49 * 0.3,12)}</Show></span> $ALT
          </span>
        </li>
        <li class="text-xs md:text-sm text-current/50 flex items-center gap-2">
          <span className="tooltip tooltip-bottom" data-tip={t("m.reward_ladder_1")}>
            <Mintlevel level={1} />
          </span>
          <span>
          {t("bet")} <span class="text-base-content">$1-9</span> → <span class="text-base-content">~<Show when={pool.state =="ready"} fallback={<div class="skeleton h-[1em] w-[4em] inline-block"></div>}>{toBalanceValue(minting()?.per_reward * 1 * 0.1,12)}-{toBalanceValue(minting()?.per_reward * 9 * 0.1,12)}</Show></span> $ALT
          </span>
        </li>
        </ul>
      </div>
    </section>
  )
}