import { Icon } from "@iconify-icon/solid"
import Spinner from "./spinner"
export default props => {
  return(
    <div className="tooltip tooltip-top md:tooltip-left w-full md:w-fit" data-tip="Load more">
      <button 
        className="btn w-full md:w-fit rounded-full" 
        disabled = {props?.loading || props?.disabled}
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

