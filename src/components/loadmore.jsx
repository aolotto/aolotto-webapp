import { Icon } from "@iconify-icon/solid"
import tooltip from "./tooltip"
import Spinner from "./spinner"
export default props => {
  return(
    <div class="w-full h-16 justify-end items-center rounded-2xl flex">
      <button 
        class="btn btn-icon rounded-full" 
        use:tooltip={["left",()=>"Load More"]}
        disabled = {props?.loading}
        onClick={()=>{
          if(props?.loadMore){
            props?.loadMore()
          }
        }}
      >
        {props?.loading?<Spinner size="sm"/>:<Icon icon="weui:more-filled" />}
      
      </button>
    </div>
  )
}