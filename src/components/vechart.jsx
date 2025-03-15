import { createSignal } from "solid-js"
import { toBalanceValue } from "../lib/tool"

export default props => {
  const [position,setPosition] = createSignal()
  return (
    <div 
      class="w-full aspect-[3/1] bg-linear-[18.5deg] from-primary to-50% from-50% to-base-200 flex justify-end relative"
      onMouseMove={(e)=>{
        let x = Math.max(e.layerX,0)
        if(e.layerX>e.currentTarget.offsetWidth){
          x=Math.min(e.layerX,e.currentTarget.offsetWidth)
        }
        setPosition([x,1-x / e.currentTarget.offsetWidth])
      }}
    >
      <div className=" absolute h-full top-0 bg-accent" style={{width:"2px", left: `${position()?.[0]||0}px`}}></div>
      <p className="text-right flex flex-col justify-start py-3 px-4 items-end">
        <b>{toBalanceValue(1000000000000*(position()?.[1]||1),12,12)}</b>
        <span className="text-sm">veALT</span>
      </p>
    </div>
  )
}