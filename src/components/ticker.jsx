import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
export default props => {
  return (
    <span class={mergeClasses("inline-flex items-center",props?.class||props?.className)}><span>{props?.symbol||"$"}</span><span>{props?.children || props?.value}</span></span>
  )
}