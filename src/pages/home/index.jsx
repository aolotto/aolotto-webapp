
import { useApp } from "../../contexts";
import Modal from "../../compontents/modal";
import { Icon } from "@iconify-icon/solid";
import { createEffect,createResource, from, Show,createMemo } from "solid-js";
import { fetchState } from "../../api";
import { storeResource } from "../../store";
import { toBalanceValue } from "../../lib/tools";
import Spinner from "../../compontents/spinner";
import Skeleton from "../../compontents/skeleton";
import { A } from "@solidjs/router";
import { shortStr } from "../../lib/tools";
import { t,setDictionarys} from "../../i18n"
import { Datetime } from "../../compontents/moment";

export default props => {
  const {agentStats,info} = useApp()
  setDictionarys("en",{
    "top.title": "$1 on-chain lottery",
    "s.start" : "Start at ",
    "top.slogan": "The first decentralized lottery protocol on AO.",
    "top.jackpot_title": "Progressive Jackpot",
    "top.button_bet": "Let's bet to WIN!",
    "top.round": "Round-{{round}}",
    "top.win_tip": "Last bet, higher win rate!",
    "second.title": "100% profit return through $ALT-powered community governance",
    "second.desc": "The total supply of 210 million $ALT is fully issued through the Bet2Mint mechanism. Users can earn it for free by participating in bets. All profits from the Aolotto protocol and ecosystem are 100% returned to the community through dividends and buybacks.",
    "second.label_sold":"Total sold",
    "second.label_profit":"Profits",
    "second.label_dividends":"Dividends",
    "second.label_buyback":"Buyback",
    "third.title": "Simple, Permissionless and Transparent",
    "third.second_title": "Beyond a lottery — a thriving LottoFi ecosystem powered by the $ALT community",
    "third.second_desc": "LottoFi is an ecosystem of apps, games, and content publishing driven by $ALT staking. By staking $ALT, users unlock free tools or skills, while creators or developers earn dividend rewards. We aim to return profits monopolized by traditional lottery issuers to the community, fostering quality content creation and strengthening community consensus.",
    "third.build_btn" : "Build together",
    "learn_more": "Learn More",
    "faq.what_t": "What is Aolotto?",
    "faq.what_c": ()=><>
      <p>Aolotto is a simple lottery game where players bet $1 to select a three-digit number (000-999). A draw occurs at the end of each round, with a lucky number generated by an algorithm. Bets that match the number win.</p>
      <p>Winners share the progressive jackpot based on the proportion of their bet amounts. If no matching bets are placed, the last player wins the entire jackpot.</p>
      <p>The progressive jackpot is made up of 50% of the total pool balance, while the remaining 50% is carried over as the base prize for the next round.</p>
      <p>Aolotto’s draw time is dynamic. Each new bet extends the draw by 24 hours from the time it’s placed, until the target bet volume is reached. When the draw time arrives, the game moves to the next round and triggers the drawing for the current round.</p>
    </>,
    "faq.diff_t": "What is the difference between aolotto and traditional lottery?",
    "faq.diff_c": "Decentralized lotteries offer transparency, fairness, and global accessibility. Blockchain records ensure tamper-proof draws, while smart contracts eliminate fraud and intermediaries, reducing costs. Participants can bet and claim prizes anonymously, protecting their privacy. Unlike traditional lotteries, decentralized systems are open to everyone with internet access and a crypto wallet.",
    "faq.why_t": "Why do we build on Arweave AO?",
    "faq.why_c": "The lottery is a mass-market product, allowing everyone to experience the thrill of turning small bets into big rewards. After evaluating various blockchains, we found that Arweave's AO framework provides a Web 2.0-like user experience, with key advantages like high concurrency and low transaction costs. While Ethereum charges $10-$12 per transaction, AO allows you to bet for just $1.<br/><br/>Arweave is a decentralized, permanent network. We’ve deployed both the smart contracts (backend) and the frontend on Permaweb, ensuring they remain accessible forever through hundreds of global Arweave gateways, enhancing accessibility.",
    "faq.safe_t": "Are the betting funds in the prize pool safe?",
    "faq.safe_c":()=><span>Funds are 100% secure. All funds used for lottery purchasing are managed by an AO process (smart contract) and never go to a private wallet. The funds are automatically transferred via the contract algorithm. As this is on-chain betting, every transaction is recorded on the blockchain, making it traceable, queryable, and immutable. You can <a href={`https://www.ao.link/#/entity/${info?.agent_process}`} target="_blank">click here</a> to inspect the balance status of the Aolotto protocol.</span> ,
    "faq.fair_t": "How to ensure the fairness and transparency of the lottery?",
    "faq.fair_c":()=><>
      <p>At the end of each lottery round, a three-digit lucky number (000-999) is generated using the HMAC random algorithm. The result of the algorithm is fixed once the seed is determined. To ensure the unpredictability of the seed, it is composed of four factors:</p>
      <ol class="pt-4 pl-8">
        <li class="list-decimal"><b>ArchivedID</b>: A hash digest from the round's bet snapshot, signed with the CU's private key to prevent prediction.</li>
        <li class="list-decimal"><b>Block-Hash</b>: The block hash at the draw trigger is based on blockchain transaction data, which cannot be predicted when a bet is placed.</li>
        <li class="list-decimal"><b>The Last Bet Transaction ID</b>: Generated when the final bet is placed. After payment, the token contract sends a "Credit-Notice" to the Aolotto protocol, with the transaction ID included as part of the seed.</li>
        <li class="list-decimal"><b>TimeStamp</b>: The Aolotto protocol triggers the lottery draw within 1 minute after the round ends. The timestamp of the draw (in milliseconds) is not accurately predictable, ensuring the randomness of the lottery.</li>
      </ol>
      <p>The random factors mentioned above are combined into a lottery seed. When the seed remains unchanged, the random number generated by our algorithm will also remain the same, meaning anyone can verify the legitimacy of the random number using these four factors.</p>
    </>,
    "faq.alt_t": "What is $ALT, and what benefits does it offer?",
    "faq.alt_c": ()=><>
      <p>$ALT (Ao Lotto Token) is a community-distributed token with a total supply of 210 million. It shares 100% of Aolotto protocol's profits with $ALT holders and offers several benefits:</p>
      <ol class="pt-4 pl-8">
        <li class="list-decimal"><b>Community Governance</b>: Vote on proposals and influence development.</li>
        <li class="list-decimal"><b>Ecosystem Currency</b>: Use $ALT to pay in the LottoFi ecosystem, such as purchasing game props.</li>
        <li class="list-decimal"><b>Charity Participation</b>: Stake $ALT to support charitable causes and earn NFT badges.</li>
        <li class="list-decimal"><b>Discover More Value</b>: Explore additional exciting use cases over time.</li>
      </ol>
      <p class="pt-4">$ALT is based on the AO standard, with partnerships like PermaSwap. It will soon be listed on DEXs. With its limited supply, $ALT is worth exploring further</p>
    </>,
     "ft.support": ()=><a href="https://discord.gg/ce9CqZfx" target="_blank" class="inline-flex items-center">Online support <Icon icon="ei:external-link"></Icon></a>,
     "ft.helpcenter": ()=><a href="https://docs.aolotto.com/cn/" target="_blank" class="inline-flex items-center">Learn more <Icon icon="ei:external-link"></Icon></a>,
  })

  setDictionarys("zh",{
    "top.title": "$1美元鏈上彩票",
    "s.start" : "開始於 ",
    "top.slogan": "首款基于AO构建的去中心化彩票协议",
    "top.jackpot_title": "当前累計大獎",
    "top.button_bet": "立即投注中大獎!",
    "top.round": "回合-{{round}}",
    "top.win_tip": "最後下注，贏率更高!",
    "second.title":"由$ALT驱动的社區治理實現100%利潤回報",
    "second.desc": "$ALT 總供應量 2.1 億，全部透過 Bet2Mint 機制發行。用戶可以參與投注即可免費賺取它。 Aolotto協議和生態系統的所有利潤通过分红和回購的方式100%回馈社區。",
    "second.label_sold":"累計銷售",
    "third.title": "簡單, 無許可且公平透明",
    "third.second_title": "不只是彩票，一個繁榮的LottoFi生態將在$ALT社區的支持下持續發展",
    "third.second_desc": "LottoFi 是一個由 $ALT 質押驅動的App、遊戲和內容生態系統。透過質押ALT，用戶可以解鎖免費工具或技能，而創作者或開發者則可以獲得分紅獎勵。我們的目標是將傳統彩券發行機構壟斷的利潤回饋社区，培育優質內容創作，凝聚社區共識。",
    "third.build_btn" : "让我们一同构建",
    "second.label_profit":"利潤",
    "second.label_dividends":"分紅",
    "second.label_buyback":"回购",
    "learn_more": "了解更多",
    "faq.what_t": "什么是Aolotto?",
    "faq.what_c": ()=><>
      <p>Aolotto是一款简单的乐透游戏，玩家仅需花费1美元选择三位数（000-999）即可下注。每轮结束时进行抽奖，由算法生成幸运数字，匹配数字的下注者获胜。</p>
      <p>获胜者按照下注金额的比例分享累积奖池。如果没有匹配的下注，最后一个玩家将独揽大奖。</p>
      <p>累积奖池由50%的奖池余额组成，剩余的50%作为下一轮的基础奖金。</p>
      <p>Aolotto的抽奖时间是动态的。每次新的下注都会将抽奖时间延长24小时，直到达到目标下注量。当抽奖时间到达时，触发抽奖，游戏将进入下一轮。</p>
    </>,
    "faq.diff_t": "Aolotto与传统彩票有何不同?",
    "faq.diff_c": "去中心化彩票提供透明度、公平性和全球可及性。區塊鏈記錄可防止开奖记录被篡改，而智慧合約則消除詐欺和中介機構，從而降低成本。參與者可以匿名下注和領取奖金，有效保護隱私。與傳統彩票不同，只要拥有一个加密錢包无论你在世界的哪一个角落都可以参与。",
    "faq.why_t": "为什么我们选择在Arweave AO上构建?",
    "faq.why_c": "我们认为彩票是一种大众化产品，我们要打造$1美金的链上下注体验，让每个人使用非常小的金额也能获得大奖的惊喜。我们对比主流区块链网络，我们发现Arweave的AO框架提供了媲美Web 2.0的用户体验，具有高并发和低交易成本等关键优势。相比以太坊每笔交易收取10-12美元的手续费，AO上只需要花费1美元就能下注。Arweave是一个去中心化的永久的网络，我们不仅将智能合约（后端）和部署在AO之上，前端也完全部署在基于Arweave构建的permaweb上，意味着用户通过数百个去中心化网关实现永久的可访问性。",
    "faq.safe_t": "投注资金是否安全?",
    "faq.safe_c": ()=><span>资金100%安全。所有用于购买彩票的资金由AO进程（智能合约）管理，从不进入私人钱包。资金通过合约算法自动转账。由于这是链上投注，每笔交易都记录在区块链上，使其可追踪、可查询和不可变。您可以<a href={`https://www.ao.link/#/entity/${info?.agent_process}`} target="_blank">点击这里</a>监督Aolotto协议的流水和余额状态。</span>,
    "faq.fair_t": "如何确保开奖的公平性和透明性?",
    "faq.fair_c": ()=><>
      <p>每轮抽奖结束时，都会使用 HMAC 随机算法生成一个三位数的幸运数字（000-999），HMAC随机算法在种子确定的情况下结果是确定的，为了确保种子的不可预测性，种子由四个无法预测的因素组成：</p>
      <ol class="pt-4 pl-8">
        <li class="list-decimal"><b>ArchivedID</b>：基于每一轮的下注状态快照生成的哈希摘要，饼使用CU的私钥签名以防止预测。</li>
        <li class="list-decimal"><b>Block-Hash</b>：触发抽奖时的区块哈希，区块链的哈希基于区块链交易数据生成，没人在下注时能够预测这个区块中会包含什么样的交易信息。</li>
        <li class="list-decimal"><b>最后一笔下注交易ID</b>：在最后一笔下注时生成。支付后，代币合约向Aolotto协议发送“Credit-Notice”，这笔交易的ID也是种子的一部分。</li>
        <li class="list-decimal"><b>TimeStamp</b>：Aolotto协议在轮结束后的1分钟内触发彩票抽奖。抽奖的时间戳（以毫秒为单位）无法精准预测，确保开奖的随机性。</li>
      </ol>
      <p>上述随机因素组合成开奖种子，当种子保持不变时，我们算法生成的随机数字也将保持不变，这意味着任何人都可以使用这四个因素验证随机数字的合法性。</p>
    </>,
    "faq.alt_t": "什么是$ALT，它有什么好处?",
    "faq.alt_c": ()=><>
      <p>$ALT（Ao Lotto Token）是一个总供应量为2.1亿,100%分发给社区的代币。Aolotto协议的利润100%分享给$ALT持有者，并提供以下几方面好处：</p>
      <ol class="pt-4 pl-8">
        <li class="list-decimal"><b>社区治理</b>：投票提案，影响生态发展。</li>
        <li class="list-decimal"><b>生态货币</b>：在LottoFi生态中使用$ALT支付，例如购买游戏道具等。</li>
        <li class="list-decimal"><b>慈善参与</b>：质押$ALT支持慈善，赚取专属NFT徽章。</li>
        <li class="list-decimal"><b>发现更多价值</b>：随着时间的推移，探索更多令人兴奋的用例。</li>
      </ol>
      <p class="pt-4">$ALT是一款遵循AO标准的代币，已和PermaSwap达成战略合作。它将很快在DEX上市。由于供应量有限，$ALT值得拥有。</p>
    </>,
    "ft.support": ()=><a href="https://discord.gg/ce9CqZfx" target="_blank" class="inline-flex items-center">在线支持 <Icon icon="ei:external-link"></Icon></a>,
    "ft.helpcenter": ()=><a href="https://docs.aolotto.com/cn/" target="_blank" class="inline-flex items-center">了解更多 <Icon icon="ei:external-link"></Icon></a>,
  })
  
  const [pool,{refetch:refetchPool,mutate:mutatePool}]  = storeResource("pool_state",()=>createResource(()=>info?.pool_process,fetchState))
  const faq = createMemo(()=>([{
    title: t("faq.what_t"),
    content: <div class="flex flex-col gap-4">{t("faq.what_c")}</div>
  },
    {
      title:t("faq.diff_t"),
      content:<div class="flex flex-col gap-4">{t("faq.diff_c")}</div>
    },{
      title:t("faq.why_t"),
      content: <div class="flex flex-col gap-4">{t("faq.why_c")}</div>
    },{
      title: t("faq.safe_t"),
      content: <div class="flex flex-col gap-4">{t("faq.safe_c")}</div>
    },{
      title: t("faq.fair_t"),
      content: <div class="flex flex-col gap-4">{t("faq.fair_c")}</div>
    },{
      title: t("faq.alt_t"),
      content: <div class="flex flex-col gap-4">{t("faq.alt_c")}</div>
    }
  ]))

  createEffect(()=>console.log(agentStats(),pool()))
  return (
    <>
    <section className="hero min-w-screen h-[60vh] max-h-[540px]">
      <div className="hero-overlay bg-transparent"></div>
      <div className="hero-content text-center flex flex-col items-center justify-center">
      <div class="flex items-center gap-2">
        <Show when={info?.agent_process}>
        <Icon icon="iconoir:component" />
            <a 
              class="inline-flex items-center text-base-content/50" 
              target="_blank"
              href={`${info.ao_link_url}/#/entity/${info?.agent_process}`}
            >
              {shortStr(info?.agent_process,6)} <Icon icon="ei:external-link"></Icon>
            </a>
          </Show>
        </div>
        <h1 className="text-6xl lg:text-8xl block max-w-[80vw] font-bold uppercase">{t("top.title")}</h1>
        <p>{t("top.slogan")}</p>

      </div>
    </section>
    
    <section className="container">
      <div className="flex w-full items-center justify-between  py-6 lg:py-8 px-1">
        <div className="flex gap-4 justify-between lg:justify-start items-center ">
          <div className="px-[0.8em] py-[0.4em] rounded-full text-xl border font-bold">
            <Show when={pool.state == "ready"} fallback={<Spinner size="sm"/>}>R{pool()?.round}</Show>
          </div>
          {/* <div className=" text-xl">Round-7 , </div> */}
          {/* <div className=" font-bold text-xl text-accent">$2300.00</div> */}
          <div className=" text-current/50 hidden lg:block">
          <Show when={!pool.loading} fallback={<Skeleton w="10" h="1"/>}>
            <Switch>
              <Match when={pool()?.ts_round_start<=0}>NOT STARTED</Match>
              <Match  when={pool()?.ts_round_start>0}>{t("s.start")} <Datetime ts={pool()?.ts_round_start} display={"date"}/></Match>
            </Switch>
          </Show>
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <div className=" font-bold text-2xl text-accent py-6 md:py-0">
            <Show when={pool.state == "ready"} fallback={<Skeleton w={5} h={1}/>}>${toBalanceValue(pool()?.jackpot,6)}</Show>
          </div>
          <A href="/bets" className="btn btn-primary btn-lg btn-circle"><Icon icon="iconoir:arrow-right" /></A>
        </div>
      </div>
    </section>

    <section className="container py-16 border-y border-base-300">
      <div className="text-center text-3xl leading-12  px-8 lg:px-10 ">{t("second.title")}</div>
      <div className="p-8 lg:p-10 text-center">{t("second.desc")}</div>
      <div className=" flex items-center justify-center flex-col md:flex-row divide-base-300 divide-y divide-x-0 md:divide-x md:divide-y-0">

        <div className="w-full md:w-[14em] flex flex-col items-center justify-center p-4">
          <p className="text-sm text-current/50">Realized Profit</p>
          <p className="text-2xl font-bold"><Show when={agentStats.state == "ready"} fallback={<Skeleton w={6} h={1}/>}>${toBalanceValue(agentStats()?.total_sales_amount*0.4,6)}</Show></p>
        </div>
        <div className="w-full md:w-[14em] flex flex-col items-center justify-center p-4">
          <p className="text-sm text-current/50">Dividends distributed</p>
          <p className="text-2xl font-bold"><Show when={agentStats.state == "ready"} fallback={<Skeleton w={6} h={1}/>}>${toBalanceValue(agentStats()?.dividends?.[2],6)}</Show></p>
        </div>
        <div className="w-full md:w-[14em] flex flex-col items-center justify-center p-4">
          <p className="text-sm text-current/50">Used for buyback</p>
          <p className="text-2xl font-bold"><Show when={agentStats.state == "ready"} fallback={<Skeleton w={6} h={1}/>}>${toBalanceValue(agentStats()?.buybacks?.[2],6)}</Show></p>
        </div>
      
      {/* <div className="stats stats-vertical lg:stats-horizontal ">
        <div className="stat min-w-[10em] flex ">
          <div className="stat-title">Total Sales</div>
          <div className="stat-value">31K</div>
        </div>

        <div className="stat min-w-[10em]">
          <div className="stat-title">Dividends</div>
          <div className="stat-value">4,200</div>
        </div>

        <div className="stat min-w-[10em]">
          <div className="stat-title">Buybucks</div>
          <div className="stat-value">1,200</div>
        </div>

      </div> */}
      </div>
    </section>

    <section class="py-10 md:py-12 lg:py-16 response_cols px-2 container">
      <div class="col-span-full px-16 text-center flex flex-col justify-center items-center gap-4">        
        <div class="text-3xl leading-12 ">{t("third.title")}</div>
      </div>

      <div class="col-span-full flex items-center justify-center pt-12">
        <div class="max-w-[60em] w-full gap-4 flex flex-col">
        <For each={faq()}>
          {({title,content},index)=>(
            <details class="w-full bg-current/2 hover:bg-current/5 rounded-lg border-current/5 border ">
              <summary class="w-full flex justify-between gap-4 p-4 items-center cursor-pointer">
                <span class="rounded-full size-6 inline-flex justify-center items-center text-current/50">{index()+1}</span>
                <span class="flex-1 text-current">{title}</span>
                <span class="text-current/50"><Icon icon="iconoir:arrow-separate-vertical"></Icon></span>
              </summary>
              <div class="px-6">
              <div class="py-4 border-t border-current/10">{content}</div> 
              </div>
            </details>
          )}
        </For>
        <div class="inline-flex justify-center items-center p-2 gap-2 mt-2">
          {t("ft.support")}
          <span class="text-current/50">or</span>
          {t("ft.helpcenter")}
        </div>
        </div>
      
      </div>
      
    </section>

    <section class="flex justify-center flex-col items-center gap-8  p-8 md:p-10 lg:p-16  text-center container">
              <p class="flex items-center gap-2">
              <Icon icon="arcticons:apps" />
              <Icon icon="arcticons:games-2" />
              <Icon icon="arcticons:bookshelf" />
              <Icon icon="arcticons:leafpic" />
              </p>
              <p class="text-3xl leading-12">{t("third.second_title")}</p>
              <a href="https://docs.aolotto.com/en/lottofi" target="_blank" class="btn btn-xl rounded-full w-fit gap-4 items-center btn-accent"><Icon icon="iconoir:app-store" />{t("third.build_btn")}</a>
              <p class="text-current/50">{t("third.second_desc")}</p>
           
            </section>

  
    </>
  );
}