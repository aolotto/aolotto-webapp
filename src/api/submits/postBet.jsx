import { AO } from "../ao"

/**
 * Sends a bet transaction using the AO library.
 *
 * @function
 * @param {Object} params - The parameters for the bet transaction.
 * @param {string} params.token_id - The token ID for the transaction. Required.
 * @param {string} params.agent_id - The agent ID (recipient) for the transaction. Required.
 * @param {string} params.pool_id - The pool ID associated with the bet.
 * @param {Array<string>} params.numbers - The 3-digist numbers selected for the bet.
 * @param {number} params.cost - The cost of the bet.
 * @param {Object} params.wallet - The wallet signer object. Must be an object.
 * @returns {Promise<string>} A promise that resolves with the message ID of the transaction if successful.
 * @throws {Error} Throws an error if any required parameter is missing or if the transaction fails.
 *
 * @example
 * postBet({
 *   token_id: "12345",
 *   agent_id: "agent123",
 *   pool_id: "pool678",
 *   numbers: ["1", "2", "3"],
 *   cost: 100,
 *   wallet: walletSigner
 * })
 * .then((messageId) => {
 *   console.log("Transaction successful:", messageId);
 * })
 * .catch((error) => {
 *   console.error("Transaction failed:", error);
 * });
 */
export const postBet = ({
    token_id,
    agent_id,
    pool_id,
    numbers,
    cost,
    wallet
  }) => new Promise(async(resovle,reject)=>{
    try {
      if(!token_id){
        reject(new Error("Missed token id"))
      }
      if(!agent_id){
        reject(new Error("Missed agent id"))
      }
      if(!wallet||typeof(wallet)!="object"){
        reject(new Error("Missed wallet signer or type error"))
      }
      const xnumber=numbers.join('')
      const ao = new AO({wallet})
      const msg =  await ao.message(token_id,{
        Action: "Transfer",
        Quantity: String(cost),
        Recipient: agent_id,
        ['X-Numbers']: xnumber,
        ['X-Pool']: pool_id
      })

      if(!msg){reject("Send message error")}
      const {Messages} = await ao.result({
        process: token_id,
        message: msg
      })
      if(!Messages||Messages?.length<2){
        reject(new Error("Transaction error"))
      }else{
        resovle(msg)
      }
    } catch (error) {
      reject(error)
    }
  })