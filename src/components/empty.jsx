import { Icon } from "@iconify-icon/solid"
export default props => (
  <div class="w-full h-60 flex justify-center items-center gap-2">
    <span class=" text-2xl text-current/30 flex items-center justify-center"><Icon icon="ph:empty-duotone" /></span>
    <span class=" text-xl text-current/30">{props?.tips || "no records yet"}</span>
  </div>
)