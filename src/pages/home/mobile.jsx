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
    url:"",
    logo: "bxl:telegram"
  }]
  setDictionarys("en",{
    'upcoming.title': '$1 on-chain lottery only possible on AO',
    'mb.h2': "Aolotto is now live!",
    "mb.p":"For now, we recommend using desktop browsers like Chrome or Edge for the best experience, as the platform is not fully optimized for mobile devices yet. Rest assured, a mobile-friendly version is on its way. Thank you for your continued support!"
  })
  setDictionarys("zh",{
    'upcoming.title': '1美元链上彩票在AO上成为可能',
    'mb.h2': "Aolotto现已上线！",
    "mb.p":"目前，我们建议使用Chrome或Edge等桌面浏览器以获得最佳体验，因为平台针对移动设备的优化工作尚未完成。请放心，我们正在完善移动端的使用体验并很快上线。感谢您一直以来的支持！"
  })


    

    
  
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
          <div class="col-span-full border-y border-current/20 px-4 py-12">
          <h2 class="text-lg flex items-center gap-4 pb-6">
            <span>🔔</span>
           <span class="font-bold text-primary">{t("mb.h2")}</span>
          </h2>
          
          <p>{t("mb.p")}</p>

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
