import { Icon } from "@iconify-icon/solid"
import { createSocialShare, TWITTER } from "@solid-primitives/share";
export const ShareToSocial = (props)=>{
  const [share, close] = createSocialShare(() => ({
    title: props?.title || "🏆$1 to win $2000! Last bettor takes at least 50% extra odds. #Aolotto Round-5 is about to draw!",
    url: props?.url || "https://aolotto.com/#/bets",
  }));


  return (
    <div>
      <button 
        className="btn btn-icon btn-ghost rounded-full btn-sm"
        onClick={()=>{
          share(TWITTER)
        }}
      >
        <Icon icon="iconoir:share-android"></Icon>
      </button>
    </div>
  )
}