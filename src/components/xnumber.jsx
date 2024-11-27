import ColorHash from 'color-hash'
import { createMemo } from 'solid-js';

export const Xnumbers = (props)=>{
  
  const bgcolor = createMemo(()=>{
    const colorHash = new ColorHash({lightness: 0.9});
    return colorHash.hex(props?.value?.split('*')[0]||"aolotto")
  })
  const textcolor = createMemo(()=>{
    const colorHash = new ColorHash({lightness: 0.2});
    return colorHash.hex(props?.value?.split('*')[0]||"aolotto")
  })
  return(
    <span class="number px-2" style={`background-color:${bgcolor()};color:${textcolor()}`} onClick={()=>{
      if(props?.onClick){
        props.onClick(props?.value?.split('*')[0].split(''))
      }
    }}>{props?.children || props?.value}</span>
  )
}