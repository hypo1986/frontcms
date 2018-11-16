/*
cms public
2016-06-02
*/

//取地址栏参数
function getAddressUrlParam() {
  var url = location.search; 
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
//截取字符串里两个 字符串之间部分
function _strBetween(strAll,strStart,strEnd){
  var s = strAll.indexOf(strStart) + strStart.length;
  var e = strAll.indexOf(strEnd);
  return strAll.slice(s,e);
}
//rgb转16进制
function _rgbToHex(rgb) { 
  var b = rgb.slice(4,-1).split(',');
  return '#'+((b[0] << 16) | (b[1] << 8) | b[2]).toString(16);
} 
//数组取最大值
Array.prototype._max=function(){
  var max = this[0];
  for(var i=1;i<this.length;i++){ 
    if(max < this[i])max=this[i];
  }
  return max;
}
//数组插入中间位置 返回位置索引值
Array.prototype._insert = function (arr,num){
  for(var i=0;i<arr.length;i++){
    if(num < a[i]){
      return i;
      break;
    }
  }
}


