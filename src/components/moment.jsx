import { createMemo } from "solid-js"
import tooltip from "./tooltip";
import mergeClasses from "@robit-dev/tailwindcss-class-combiner";

let minute = 1000 * 60;
let hour = minute * 60;
let day = hour * 24;
let week = day * 7;
let month = day * 30;
 
 
// 传入时间格式或时间戳，这里传入的时间格式: 2022-08-05T08:17:14.000+00:00
function convertTimeToHumanReadable(dateTime) {
 

	let timestamp_current = new Date().getTime();
	let _date = new Date(dateTime);
	let timestamp_input = _date.getTime();
	let timestamp_diff = timestamp_current - timestamp_input;

	let minC = timestamp_diff / minute;
	let hourC = timestamp_diff / hour;
	let dayC = timestamp_diff / day;
	let weekC = timestamp_diff / week;
	let monthC = timestamp_diff / month;
 
	if (monthC >= 1 && monthC < 4) {
		return parseInt(monthC) + (monthC==1?" month":" months") + " ago";
	} else if (weekC >= 1 && weekC < 4) {
		return parseInt(weekC) + (weekC==1?" week":" weeks") + " ago";
	} else if (dayC >= 1 && dayC < 7) {
		return parseInt(dayC) + (dayC==1?" day":" days") + " ago";
	} else if (hourC >= 1 && hourC < 24) {
		return parseInt(hourC) + (hourC==1?" hour":" hours") + " ago";
	} else if (minC >= 1 && minC < 60) {
		return parseInt(minC) + (minC==1?" minute":" minutes") + " ago";
	} else if ((timestamp_diff >= 0) && (timestamp_diff <= minute)) {
		return "Just now";
	} else {
		return new Date(timestamp_input).toLocaleString()
	}
}
 

export const Moment = props => {
  const ts = new Date(props?.ts).getTime()
  const date = createMemo(()=>{
    return convertTimeToHumanReadable(ts)
  })
  return <div className="lg:tooltip" data-tip={new Date(ts).toLocaleString()}><button>{date}</button></div>
}

export const Datetime = props => {
	const ts = new Date(props?.ts).getTime()
	const full = new Date(ts).toLocaleString()
	let display = new Date(ts).toLocaleString()
	if(props?.display == "date"){
		display = new Date(ts).toLocaleDateString()
	}else if(props?.display == "time"){
		display = new Date(ts).toLocaleTimeString()
	}
	return <span className="lg:tooltip" class={mergeClasses("",props?.class || props?.className)} data-tip={full}>{display}</span>
}