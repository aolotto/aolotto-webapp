
import { createSignal, onMount,createEffect } from "solid-js";

let _nav;

export const Tabs = (props) => {
  
  const [selectedItem,setSelectedItem] = createSignal()

  const handleClick = (item,index) => {
    if(item === selectedItem()){
      return
    }
    setSelectedItem(item)
    if (props.onSelected) {
      // console.log("selected",item)
      props.onSelected({index:index,item:item});
    }
  };

  createEffect(()=>{
    if(props.current){
      setSelectedItem(props.current)
    }
  })

  onMount(()=>{
    const outter = document.querySelector('.outter');
    console.log("outter",outter.clientWidth)
    const inner = document.querySelector('.inner')
    console.log("inner",inner.clientWidth)
  })

  return (
    <div 
      ref={_nav}
      class="flex w-full shadow-[inset_0_-1px_0px_0] shadow-current/10 gap-[1.6em] items-center justify-between overflow-x-auto outter"
      classList={{
        "text-sm": props?.size === "sm",
        "text-xs": props?.size === "xs",
        "text-lg": props?.size === "lg",
      }}
    >
      <Show when={props?.before}><div>{props.before}</div></Show>
      <div class="flex flex-1 gap-[1.6em] items-center justify-start inner">
      <Index each={props.items}>
        {(item, index) => (
          <button 
            className="text-base-content/70 hover:text-base-content h-[3em] flex items-center justify-center px-[0.4em] cursor-pointer text-lg transition-all" 
            classList={{
              "text-base-content/70 border-b-1 border-b-base-content/0": item() !== selectedItem(),
              "text-base-content text-bold border-b-1 border-b-base-content border-box": item() === selectedItem(),
            }}
            onClick={() => handleClick(item(),index)}
          >
            {item()?.label}
          </button>
        )}
      </Index>
      </div>
      <Show when={props?.after}><div>{props.after}</div></Show>
    </div>
  )
}


/* Rectangle 3 */

// position: absolute;
// width: 986px;
// height: 55px;
// left: 101px;
// top: 651px;

// background: #FFFFFF;
// box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.25);
