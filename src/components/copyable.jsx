import { Icon } from '@iconify-icon/solid';
import { createSignal, Show } from 'solid-js';

export function Copyable({value,children}){
  const [copied,setCopied] = createSignal(false)
  return(
    <span 
      class="inline-flex items-center gap-2 group"
      
    >
      <Show 
        when={children} 
        fallback={<span>{value}</span>}
      >
        {children}
      </Show>
      <button 
        class="group-hover:visible invisible cursor-pointer tooltip"
        data-tip={copied()?"Copied":"Copy"}
        onMouseLeave={()=>setCopied(false)}
        onClick={async ()=>{
          await navigator.clipboard.writeText(value)
          setCopied(true)
        }}
      >
        <Show when={copied()} fallback={<Icon icon="carbon:copy"></Icon>}>
          <Icon icon="iconoir:check"></Icon>
        </Show>
        
      </button>
      
    </span>
  )
}