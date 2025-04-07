import { createStore } from "solid-js/store"
import { Show } from "solid-js"
import table from "daisyui/components/table"
export default props => {
  return(
    <table class="rsps_table">
      <caption>title</caption>
      <thead>
        <tr>
          <th>Player</th>
          <th>Number</th>
          <th>Bet2Mint</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr data-action={<div>a</div>}>
          <td data-label="Player">td</td>
          <td data-label="Number">td2</td>
          <td data-label="Bet2Mint">td2</td>
          <td data-label="Date">td2</td>
        </tr>
        <tr>
          <td data-label="Player">td</td>
          <td data-label="Number">td2</td>
          <td data-label="Bet2Mint">td2</td>
          <td data-label="Date">td2</td>
        </tr>
      </tbody>
    </table>
  )
}