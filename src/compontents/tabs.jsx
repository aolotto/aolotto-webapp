
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
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
    console.log("scrollTo",overflow())
    _outter.scrollTo({
      top: 0,
      left: index * (overflow()/(props?.items?.length-index)),
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
    console.log("_outter",_outter?.getBoundingClientRect()?.width,_inner?.getBoundingClientRect()?.width)
    setOverflow(Math.max(_inner?.getBoundingClientRect()?.width - _outter?.getBoundingClientRect()?.width,0))
  })
  return(
    <div className={mergeClasses("w-full overflow-scroll hide-scorllbar shadow-[inset_0_-1px_0px_0] shadow-current/10",props?.className || props?.class)} ref={_outter}>
      <ul
        ref={_inner}
        className=" flex-nowrap gap-[1em] pr-3 flex flex-row items-center justify-start w-fit"
        classList={{
          "text-lg" : props?.size == "lg",
          "text-xl" : props?.size == "xl",
          "text-md" : props?.size == "md" || !props?.size,
          "text-sm" : props?.size == "sm",
          "text-xs" : props?.size == "xs"
        }}
      >
        <For each={props?.items}>
          {(item,index)=>(
            <li id={item.key}>
              <a 
                className="px-[0.6em] py-[0.5em] ring-0 hover:text-base-content text-base-content/70 cursor-pointer transition-all duration-300 w-fit text-nowrap" 
                classList={{
                  "text-base-content/70 border-b-1 border-b-base-content/0": selectedItem()?.key !== item.key,
                  "text-base-content text-bold border-b-1 border-b-base-content border-box": selectedItem()?.key == item.key,
                }}
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