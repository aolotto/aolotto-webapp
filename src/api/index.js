export { AO } from "./ao"
export { arGql } from "./argql"
// fetchers
export { fetchStats } from "./fetchers/stats"
export { fetchProcessInfo } from "./fetchers/info"
export { fetchBalance } from "./fetchers/balance"
export { fetchState } from "./fetchers/state"
export { fetchActiveBets } from "./fetchers/activeBets"
export { fetchRanks } from "./fetchers/ranks" 
export { fetchAccount } from "./fetchers/account"
export { fetchDividends } from "./fetchers/dividends"
export { fetchStaker } from "./fetchers/staker"
export { fetchDraws,fetchDrawsDetail } from "./fetchers/draws"
export { fetchPrice } from "./fetchers/price"
export { fetchSupply } from "./fetchers/supply"
export { 
  fetchPlayerMintings, 
  fetchPlayerTickets,
  fetchPlayerCliams,
  fetchPlayerDividends,
  fetchPlayerStakings,
  fetchPlayerWinings,
  fetchClaimApproveResult
} from "./fetchers/player"
export { 
  fetchAltMintings,
  fetchAltBurnings,
  fetchAltStakings,
  fetchAltUnStakings
 } from "./fetchers/alt"


// submits

export { postBet } from "./submits/postBet"
export { cliamDividends } from "./submits/cliamDividends"
export { submitStaking } from "./submits/postStake"
export { cliamPrize } from "./submits/cliamPrize"
