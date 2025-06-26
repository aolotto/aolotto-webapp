import { AO } from "../ao"

/**
 * Sends a bet transaction using the AO library.
 *
 * @function
 * @param {Object} params - The parameters for the bet transaction.
 * @param {string} params.token_id - The token ID for the transaction. Required.
 * @param {string} params.skake_id - The stake ID (recipient) for the transaction. Required.
 * @param {Array<string>} params.quantity - The 3-digist numbers selected for the bet.
 * @param {Object} params.wallet - The wallet signer object. Must be an object.
 * @returns {Promise<string>} A promise that resolves with the message ID of the transaction if successful.
 * @throws {Error} Throws an error if any required parameter is missing or if the transaction fails.
 *
 * @example
 * postBet({
 *   token_id: "12345",
 *   stake_id: "agent123",
 *   quantity: 100,
 *   wallet: walletSigner
 * })
 * .then((messageId) => {
 *   console.log("Transaction successful:", messageId);
 * })
 * .catch((error) => {
 *   console.error("Transaction failed:", error);
 * });
 */
export const boostStake = ({
    token_id,
    stake_id,
    quantity,
    wallet
  }) => new Promise(async(resovle,reject)=>{
    try {
      if(!token_id){
        reject(new Error("Missed token id"))
      }
      if(!stake_id){
        reject(new Error("Missed stake id"))
      }
      if(!wallet||typeof(wallet)!="object"){
        reject(new Error("Missed wallet signer or type error"))
      }
      const ao = new AO({wallet})
      const msg =  await ao.message(token_id,{
        Action: "Transfer",
        Quantity: String(quantity),
        Recipient: stake_id,
        ['X-Transfer-Type']: "Boost",
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