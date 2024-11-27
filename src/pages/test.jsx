export default props => {
  return(
    <div>
  <button popovertarget="my-popover">Open Popover</button>
  <div popover id="my-popover" class="opacity-0 open:opacity-100 ...">
   dddd
  </div>
</div>
  )
}