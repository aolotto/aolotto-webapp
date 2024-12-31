import Logo from "../../components/logo"
import Countdown from "../../components/countdown"
import { setDictionarys,t } from "../../i18n"
import Langpicker from "../../components/langpicker"
import { createSignal, onMount, onCleanup } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { A } from "@solidjs/router"



export default props => {
  const links = [{
    label: "github",
    url:"https://github.com/aolotto/aolotto",
    logo: "carbon:logo-github"
  },{
    label: "twitter",
    url:"https://x.com/aolotto_dao",
    logo: "carbon:logo-twitter"
  },{
    label: "discord",
    url:"https://discord.gg/BFhkUCRjmF",
    logo: "carbon:logo-discord"
  },{
    laber:"telegram",
    url:"https://t.me/aolotto",
    logo: "bxl:telegram"
  }]
  setDictionarys("en",{
    'upcoming.title': '$1 on-chain lottery only possible on AO',
    'upcoming.desc_1': ()=><span>The first $1 on-chain lottery will open for betting at <b>00:00:00</b> GMT on <b>January 1,2025</b></span>,
    "upcoming.desc_2": ()=><span>We support payments in <a href="" target="_blank">wUSDC</a>. You can <a href="https://aox.xyz/#/home" target="_blank">deposit</a> it into your <b>AR wallet</b> in advance through the AOX cross-chain bridge from CEX(Binance,OKX,etc.) or Ethereum wallets to seize the opportunity.</span>,
    "upcoming.desc_3": ()=><span>A total of 210 million <a href="https://docs.aolotto.com/en/usdalt" target="_blank">$ALT</a> will be minted through the <a href="https://docs.aolotto.com/en/usdalt#bet2mint" target="_blank">Bet2Mint</a> mechanism. Players can earn $ALT by betting $1, and holding $ALT can receive ongoing dividends from the protocol.</span>,
    "upcoming.desc_4": ()=> <span>21 million $ALT will be rewarded to early users as the <a href="https://docs.aolotto.com/en/usdalt#faucet" target="_blank">minting buffs</a> (ALTb), which can be claimed for free through the <a href="https://docs.aolotto.com/en/faucet" target="_blank">faucet</a>. The earlier you claim, the higher the amount.</span>
  })
  setDictionarys("zh",{
    'upcoming.title': '1美元链上彩票在AO上成为可能',
    'upcoming.desc_1': ()=><span>首个$1美元链上彩票将于<b>2025年1月1日</b>GMT <b>00:00:00</b>开放投注；</span>,
    "upcoming.desc_2": ()=><span>我们支持<a href="" target="_blank">wUSDC</a>支付，您可以通过AOX跨链桥从CEX（币安、OKX等）或以太坊钱包提前将其<a href="https://aox.xyz/#/home" target="_blank">跨链存入</a>您的<b>AR钱包</b>,抢占先机；</span>,
    "upcoming.desc_3": ()=><span>最大发行量为2.1亿的<a href="https://docs.aolotto.com/cn/usdalt" target="_blank">$ALT</a>通过<a href="https://docs.aolotto.com/cn/usdalt#bet2mint" target="_blank">Bet2Mint</a>机制发行，玩家通过$1美金投注就能获得$ALT奖励，持有$ALT可获得协议的持续分红;</span>,
    "upcoming.desc_4": ()=><span>2100万$ALT将通过<a href="https://docs.aolotto.com/cn/usdalt#shui-long-tou" target="_blank">铸币Buff</a>（ALTb）奖励给早期用户，通过<a href="https://docs.aolotto.com/cn/shui-long-tou" target="_blank">水龙头</a>免费领取ALTb，越早领取，额度越高;</span>
  })

  const Timer = props => {
    let timer
    let end = props.end || new Date().getTime()+86400000
    const [count,setCount] = createSignal()
    onMount(()=>{
      timer = setInterval(()=>{
        const now = new Date().getTime()
        const diff = (end - now) / 1000
        let day = Math.floor(diff / 60 / 60 / 24).toString().padStart(2, "0");
        let hour = Math.floor(diff / 60 / 60 % 24 ).toString().padStart(2, "0");
        let minute = Math.floor(diff / 60 % 60).toString().padStart(2, "0");
        let second = Math.floor(diff % 60).toString().padStart(2, "0");
        setCount({
          day:day,
          hour:hour,
          minute:minute,
          second:second
        })
      },1000)
    })
    onCleanup(()=>{
      clearInterval(timer)
    })
    
    return <div class="flex items-center justify-center gap-8 py-12">
      <div class="flex flex-col items-center"><span class="text-4xl sm:7xl lg:text-8xl">{count()?.day|| "00"}</span><span class="text-xl uppercase text-current/50">day</span></div>
      <div class="flex flex-col items-center"><span class="text-4xl sm:7xl lg:text-8xl">{count()?.hour|| "00"}</span><span class="text-xl uppercase text-current/50">hour</span></div>
      <div class="flex flex-col items-center"><span class="text-4xl sm:7xl lg:text-8xl">{count()?.minute|| "00"}</span><span class="text-xl uppercase text-current/50">minute</span></div>
      <div class="flex flex-col items-center"><span class="text-4xl sm:7xl lg:text-8xl">{count()?.second|| "00"}</span><span class="text-xl uppercase text-current/50">second</span></div>
    </div>
  }
    
  
  return(
    <div class="">
      <div class="container py-4 lg:py-8">

        <div class="w-full flex justify-between items-top py-8">
          <div class="w-[10em] pt-2">
          <A 
            href="/" 
            class="text-current"
          >
            <Logo/>
          </A>
          </div>
        
          <div class="flex-1 flex justify-end"> {t("upcoming.title")}</div>
        </div>
      
        <div class="py-4 lg:py-12">
          <div class="col-span-full border-y border-current/20 p-4">
            <Timer class="text-8xl" end={1735689601000}/>
          </div>
        </div>

        <div class="py-4 lg:py-12">
          <div class="col-span-full">
            <ol class="list-decimal pl-10">
              <li class="p-1">{t("upcoming.desc_1")}</li>
              <li class="p-1">{t("upcoming.desc_2")}</li>
              <li class="p-1">{t("upcoming.desc_3")}</li>
              <li class="p-1">{t("upcoming.desc_4")}</li>
            </ol>
          </div>
        </div>
      

      <div class="w-full flex justify-between items-center py-8">
        <Langpicker class="text-current/50"/>
        <div class="">
          <ul class="flex justify-end gap-4">
            {links.map((item)=><li><a href={item.url}><Icon icon={item.logo} /></a></li>)}
          </ul>
        </div>
      </div>
    </div>
  </div>

  )
}
