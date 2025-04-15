import { InfoItem } from "../infoitem"
export default props => {
  return (
    <div className="px-6 py-4 divide-y divide-base-300 flex flex-col w-full">
      <InfoItem label="Bet" className="py-4 px-1">
        <div className="flex flex-col">
          <div>$234.00</div>
          <div className="text-xs text-current/50">total of 23 tickets</div>
        </div>
      </InfoItem>
      <InfoItem label="Win" className="py-4 px-1">
        <div className="flex flex-col">
          <div>$234.00</div>
          <div className="text-xs text-current/50">Won a total of 5 times</div>
        </div>
      </InfoItem>
      <InfoItem label="Mint" className="py-4 px-1"><div className="flex flex-col"><div>234.00 $ALT</div></div></InfoItem>
      <InfoItem label="Stake" className="py-4 px-1"><div className="flex flex-col"><div>234.00 $ALT</div></div></InfoItem>
      <InfoItem label="Dividends" className="py-4 px-1"><div className="flex flex-col"><div>$23.00</div></div></InfoItem>
      <InfoItem label="Faucet" className="py-4 px-1"><div className="flex flex-col">
        <div>234.00 ALTb</div>
        <div className="text-xs text-current/50">200 ALTb have been added</div>
      </div></InfoItem>
    </div>
  )
}