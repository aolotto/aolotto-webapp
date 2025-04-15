
import { createSignal,onMount,createEffect,For} from "solid-js"


export default props => {
  let _outter
  let _inner

  const [selectedItem,setSelectedItem] = createSignal()
  const [overflow,setOverflow] = createSignal(0)
  
  const handleClick = (item,index,e) => {
    if(item === selectedItem()){
      return
    }
    setSelectedItem(item)
    // console.log(e)
    _outter.scrollTo({
      top: 0,
      left: index * (overflow()/(props?.items?.length-1)),
      behavior: "smooth",
    });
    if (props?.onSelected) {
      props.onSelected({index:index,item:item});
    }
  };
  
  onMount(()=>{
    if(props?.current){
      setSelectedItem(props.current)
    }else{
      setSelectedItem(props?.items[0])
    }
    // console.log("_outter",_outter?.getBoundingClientRect()?.width,_inner?.getBoundingClientRect()?.width)
    setOverflow(Math.max(_inner?.getBoundingClientRect()?.width - _outter?.getBoundingClientRect()?.width,0))
  })
  return(
    <div className="w-full overflow-scroll hide-scorllbar" ref={_outter}>
      <ul
        ref={_inner}
        className=" menu menu-horizontal flex-nowrap gap-1 "
        classList={{
          "menu-lg" : props?.size == "lg",
          "menu-xl" : props?.size == "xl",
          "menu-md" : props?.size == "md",
          "menu-sm" : props?.size == "sm",
          "menu-xs" : props?.size == "xs"
        }}
      >
        <For each={props?.items}>
          {(item,index)=>(
            <li id={item.key}>
              <a 
                className="px-[0.8em] py-[0.2em] ring-0 rounded-full" 
                classList={{" bg-base-300 text-base-content" : selectedItem()?.key == item.key }} 
                role="button"
                onClick={(e) => handleClick(item,index(),e)}
              >
                {item.label}
              </a>
            </li>
          )}
        </For>
      </ul>
  </div>
  )
}