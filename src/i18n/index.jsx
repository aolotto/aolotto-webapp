import * as i18n from "@solid-primitives/i18n";
import en from "./en.json"
import zh from "./zh.json"
import { createSignal,createMemo,createEffect, createRoot } from "solid-js";
import { createStore } from "solid-js/store";


export const {locale, setLocale, locales,dictionarys,setDictionarys,dict,t} =  createRoot(()=>{

  const lang = navigator.language||navigator.userLanguage

  const locales = {
    en: {name:"English",dict:en},
    zh: {name:"中文",dict:zh}
  };

  const [locale, setLocale] = createSignal(localStorage.getItem("CURRENT_LOCALE") || lang?.substr(0, 2) || "en");

  const [dictionarys,setDictionarys] = createStore({zh:{},en:{}})


  const dict = createMemo(()=>({
    ...i18n.prefix(i18n.flatten(locales[locale()]?.dict), "common"),
    ...i18n.flatten(dictionarys[locale()])
  }))


  const t = i18n.translator(dict, i18n.resolveTemplate);

  createEffect(()=>{
    localStorage.setItem("CURRENT_LOCALE",locale())
  })

  return ({
    locale, setLocale, locales,dictionarys,setDictionarys,dict,t
  })
  
})