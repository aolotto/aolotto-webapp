export default props => {
  <div role="alert" className="alert alert-error alert-dash">
    <span>{props?.value || "Error"}</span>
  </div>
}