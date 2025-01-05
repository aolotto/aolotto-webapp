import { Icon } from "@iconify-icon/solid"
import { createEffect, createSignal, Match, Switch } from "solid-js"

export const Multiplier = props => {
  const [value,setValue] = createSignal(props?.value|| props?.min || 0)
  const step = props?.step || 1
  const min = props?.min || 0
  const max = props?.max || 9999999999

  const onChange = ()=>{
    if(props?.onChange){
      props.onChange(value())
    }
  }
  
  return(
    <div class="flex items-center rounded-md gap-3 ">
       <button
        class="btn btn-xs rounded-full uppercase"
        disabled={value()<=min||props?.disabled}
        onClick={()=>{
          setValue(min)
          onChange()
        }}
      >
        min
      </button>
      <button 
        class="btn btn-xs rounded-full btn-icon "
        disabled={value()<=min||props?.disabled}
        onClick={()=>{
          setValue((current)=>Math.max(current-step,min))
          onChange()
        }}
      > 
        <Icon icon="iconoir:minus"></Icon>
      </button>
       
      <span class="text-sm" classList={{"opacity-30":props?.disabled}}>{value()}</span>

      <button 
        class="btn btn-xs btn-icon rounded-full"
        disabled={value()>=max||props?.disabled}
        onClick={()=>{
          setValue((current)=>Math.min(current+step,max))
          onChange()
        }}
      >
        <Icon icon="iconoir:plus"></Icon>
      </button>
      <button 
        class="btn btn-xs rounded-full uppercase"
        disabled={value()==10||props?.disabled}
        onClick={()=>{
          setValue(10)
          onChange()
        }}
      >
          10
      </button>
      <button 
        class="btn btn-xs rounded-full uppercase"
        disabled={value()==50||props?.disabled}
        onClick={()=>{
          setValue(50)
          onChange()
        }}
      >
          50
      </button>
      <button
        class="btn btn-xs rounded-full uppercase"
        disabled={value()>=max||props?.disabled}
        onClick={()=>{
          setValue(max)
          onChange()
        }}
      >
        max
      </button>
    </div>
  )
}