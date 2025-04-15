import { createRoot, createResource } from "solid-js";
import { createStore } from "solid-js/store";

// 全局资源存储
const [resourcesStore, setResourcesStore] = createStore({});

/**
 * 创建并管理全局资源
 * @param {string} key 资源的唯一标识
 * @param {Function} fetcher 请求资源的函数
 * @param {number} ttl 可选，资源过期时间（毫秒），默认 5 分钟
 * @param {Signal} [signal] 可选，响应式信号，用于控制资源的更新
 * @returns {object} 资源及其操作
 */
export function storeResource(key, fn) {


  // 检查资源是否已存在且未过期
  if(resourcesStore[key]){
    return resourcesStore[key]
  }else{
    setResourcesStore(key, fn);
    return fn()
  }
}
