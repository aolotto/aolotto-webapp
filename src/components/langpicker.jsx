
import { Icon } from "@iconify-icon/solid";
import { setLocale,locales,locale } from "../i18n";
import { Modal,ModalHeader,ModalContainer } from "./popup";
import { createEffect, For } from "solid-js";
export default props => {
  let _lang_picker
  return (
    <div>
    <button 
      class="btn btn-ghost px-2"
      onClick={()=>_lang_picker.open()}
    >
      <Icon icon="iconoir:language"></Icon>
      <Icon icon="carbon:chevron-sort"></Icon>
    </button>
    <Modal 
      ref={_lang_picker}
      onClose={()=>console.log("13444")}
      mask={true}
      closable={true}
      class="w-full max-w-[240px]"
    >
      <ModalHeader title="Switch Language"></ModalHeader>
      <ModalContainer class="w-full">
        <div class=" m-[1em] flex flex-col gap-2">
          <For each={Object.keys(locales)}>
            {item=>
              <button 
                class="w-full flex justify-between items-center btn "
                onClick={()=>{
                  setLocale(item)
                  _lang_picker.close()
                }}
              >
                <div class="flex items-center gap-2">
                  <span class="inline-flex bg-base-content/80 text-base-100 uppercase rounded-md text-xs px-1">{item}</span>
                  <span>{locales[item].name}</span>
                </div>
                
                <Show when={item==locale()}>
                  <Icon icon="iconoir:check"></Icon>
                </Show>
              </button>
            }
          </For>

        </div>
        
      </ModalContainer> 
    </Modal>
    </div>
  )
}