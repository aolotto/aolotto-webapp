import * as aoconnect  from "@permaweb/aoconnect";
import { arGql,GQLUrls } from "./argql";
import { createDataItemSigner } from "@permaweb/aoconnect";
const processQueue = new Map();


export const formatMessageTags = (tags) =>{
  if(tags instanceof Array){
    return tags.map(item=>{return {name:item[0],value:item[1]}})
  }else{
    const arr = Object.entries(tags)
    return arr.map(item=>{return {name:item[0],value:item[1]}})
  }
}

/**
 * 
 * @param {array} keys 
 * @param {array} arr 
 * @returns {array}
 */
export const findTagItemValues = (keys,arr) =>{
  const res = []
  for (const key of keys) {
    const tag_obj = arr.find(item => item.name === key);
    res.push(tag_obj?.value||null)
  }
  return res
}


export class AO {
  constructor(params) {
    this.gateWayUrl = params?.gateWayUrl || import.meta.env.VITE_GATEWAY_URL || "https://arweave.net";
    this.gqlUrl = import.meta.env.VITE_GQL_ENDPOINT || GQLUrls.arweave || GQLUrls.goldsky
    this.aoconnect = aoconnect.connect({
      MU_URL: params?.cu || import.meta.env.VITE_MU_URL || "https://mu.ao-testnet.xyz",
      CU_URL: params?.mu || import.meta.env.VITE_CU_URL || "https://cu.ao-testnet.xyz",
      GATEWAY_URL: this.gateWayUrl,
    });
    this.wallet = params?.wallet;
    this.scheduler = import.meta.env.VITE_SCHEDULER ||  "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA";
    this.module = import.meta.env.VITE_AO_MODULE
  }

  message = async function(params) {
    this.wallet = params?.wallet || this.wallet
    return await this.aoconnect.message({
      process: params?.process || this.process,
      tags: params?.tags?formatMessageTags(params?.tags):[],
      data: params?.data || "",
      signer: createDataItemSigner(this.wallet)
    })
  };

  result = async function(params) {
    return await this.aoconnect.result({
      process: params?.process,
      message: params?.message 
    })
  };

  dryrun = function(params) {
    const pid = params?.process;
    if (!pid) {return}
    const lastPromise = processQueue.get(pid) || Promise.resolve();
    const fetchPromise = lastPromise.then(async () => this.aoconnect.dryrun({
      process: pid,
      tags: params?.tags ? formatMessageTags(params?.tags) : [],
      data: params?.data || "",
      anchor: params?.anchor || ""
    })).then(result => {
      if (processQueue.get(pid) === fetchPromise) {
        processQueue.delete(pid);
      }
      return result;
    })
    processQueue.set(pid, fetchPromise);
    return fetchPromise;
  }

  spawn = async function(params) {
    this.module = params?.module || this.module
    this.scheduler = params?.scheduler || this.scheduler || "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA"
    this.wallet = params?.wallet || this.wallet
    return await this.aoconnect.spawn({
      module: this.module,
      scheduler: this.scheduler,
      tags: params?.tags?formatMessageTags(params?.tags):[],
      data: params?.data || "",
      signer: createDataItemSigner(this.wallet),
    })
  }

  monitor = async function (params) {
    this.process = params?.process || this.process
    this.wallet = params?.wallet || this.wallet
    return await this.aoconnect.monitor({
      process: this.process,
      signer: createDataItemSigner(this.wallet),
    })
  }

  unmonitor = async function(params) {
    this.wallet = params?.wallet || this.wallet
    return await this.aoconnect.unmonitor({
      process: params?.process ,
      signer: createDataItemSigner(this.wallet)
    })
  };
  
  assign = async function(params) {
    return await this.aoconnect.assign({
      process: params?.process,
      message: params?.msgid,
      baseLayer: params?.baseLayer || false,
      exclude: params?.exclude || []
    })
  };

  query = async function(query,options) {
    const gql = arGql({endpointUrl: this.gqlUrl || GQLUrls.goldsky})
    let res = await gql.run(query||'');
    return res?.data?.transactions?.edges
  }

  data = async function (id,options) {
    const getway = options?.gateWayUrl || this.gateWayUrl
    return await fetch(getway+"/"+id+"/data",{cache:options?.cache || "no-cache"}).then(res => res.json())
  }

}

