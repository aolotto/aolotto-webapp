import { Icon } from "@iconify-icon/solid"
import { createSocialShare, TWITTER } from "@solid-primitives/share";
export const ShareToSocial = (props)=>{
  const [share, close] = createSocialShare(() => ({
    title: "Aolotto",
    url: "https://aolotto.com",
    description: "Simple and well-behaved reactivity!"
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