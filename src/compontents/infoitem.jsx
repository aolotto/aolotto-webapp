import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
export const InfoItem = ({label, value, children, ...rest}) => (
  <dl className={mergeClasses("flex gap-4 w-full py-1",rest?.class||rest?.className)}>
    <dt className="text-base-content/50 w-[36%] overflow-x-clip whitespace-nowrap">{label}</dt>
    <dd className="text-base-content flex-1 flex justify-end md:justify-start text-right md:text-left">{children || value}</dd>
  </dl>
)