
export default props => {
  return (
    <span 
      class="text-accent-content text-xs px-[3px] py-[2px] inline-block rounded-sm"
      classList={{
        "bg-accent": props?.level>=4,
        "bg-accent/80": props?.level==3,
        "bg-accent/50": props?.level==2,
        "bg-accent/20": props?.level==1,
      }}
    >
      {props?.level? `L${props?.level}`: props?.children}
    </span> 
  )
}