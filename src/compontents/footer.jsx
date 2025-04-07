import { Icon } from "@iconify-icon/solid"
import Aologo from "./aologo"
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
    <footer class="flex w-full justify-between h-fit lg:h-16 items-center px-4 flex-col md:flex-row">
      <div class="text-base-content/50 text-xs md:text-sm flex items-center gap-2">
        <span className="font-bold text-base-content">ar://aolotto</span>
        <span>- running permanently on</span>
        <a href="https://ao.arweave.dev/" class="text-base-content size-4 inline-flex items-center justify-center" target="_blank">
          <Aologo/>
        </a>
      </div>
      <div class="py-4 lg:py-0">
        <ul class="flex justify-end gap-1">
          {links.map((item)=><li><a href={item.url} target="_blank" className="btn btn-ghost btn-sm lg:btn-md btn-circle"><Icon icon={item.logo} /></a></li>)}
        </ul>
      </div>
    </footer>
  )
}




