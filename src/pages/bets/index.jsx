import { Suspense, ErrorBoundary } from "solid-js"
import { pool } from "../../data/resources"
export default props => {
  return(
    <Suspense fallback={<div>loading...</div>}>
      <ErrorBoundary fallback={<div>error...</div>}>
        <div className="container">
          <h1>{pool()?.round}</h1>
        </div>
      </ErrorBoundary>
    </Suspense>
    
  )
}