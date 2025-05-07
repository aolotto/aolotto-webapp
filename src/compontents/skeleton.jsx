import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
export default function Skeleton(props) {
  return <div className={mergeClasses("skeleton inline-block",props?.className||props?.class)} style={{ "width":`${props?.w || 1}em`, "height":  `${props?.h || 1}em` }}></div>
}