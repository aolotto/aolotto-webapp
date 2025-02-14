import { Icon } from "@iconify-icon/solid"
import Aologo from "./aologo"
import label from "daisyui/components/label"
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
    url:"https://discord.com/invite/BFhkUCRjmF",
    logo: "carbon:logo-discord"
  },{
    label:"telegram",
    url:"https://t.me/aolotto",
    logo: "bxl:telegram"
  },{
    label:"youtube",
    url:"https://www.youtube.com/@aolotto",
    logo:"mdi:youtube"
  }]
  return(
    <footer class="flex w-full justify-between h-16 items-center px-4 flex-col md:flex-row">
      <div class="text-base-content/40 text-sm flex items-center gap-2">
        <span>ar://aolotto</span>
        <span>- Running permanently on</span>
        <a href="https://ao.arweave.dev/" class="text-base-content size-4 inline-flex items-center justify-center" target="_blank">
          <Aologo/>
        </a>
      </div>
      <div class="">
        <ul class="flex justify-end gap-4">
          {links.map((item)=><li><a href={item.url}><Icon icon={item.logo} /></a></li>)}
        </ul>
      </div>
    </footer>
  )
}




