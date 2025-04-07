var shakeThreshold = 10000; // 定义一个摇动的阈值
var lastUpdate = 0; // 记录上一次摇动的时间
var x, y, z, lastX, lastY, lastZ; // 定义x、y、z记录三个轴的数据以及上一次触发的数据

// // 监听传感器运动事件
var shake = true;
// if (window.DeviceMotionEvent) {
//     window.addEventListener('devicemotion', deviceMotionHandler, false);
// } else {
//     shake = false;
//     alert('您的设备不支持摇一摇');
// }

// 运动传感器处理
export function deviceMotionHandler(e,fn) {
    if (!shake) {
        return false;
    }
    var acceleration = e.accelerationIncludingGravity; // 获取含重力的加速度
    var curTime = new Date().getTime();

    // 100毫秒进行一次位置判断
    if ((curTime - lastUpdate) > 100) {

        var diffTime = curTime - lastUpdate;
        lastUpdate = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
        // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
        if (speed > shakeThreshold) {
            fn();
        }

        lastX = x;
        lastY = y;
        lastZ = z;
    }
}

