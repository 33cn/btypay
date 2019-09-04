export default{
    filters: {
        formatTime(code){
            let isLessTen = function(val){
                return val < 10? '0'+val : val
            }
            let time = new Date(parseInt(code))
            let y = time.getFullYear();
            let m = time.getMonth()+1;
            let d = time.getDate();
            let h = time.getHours();
            let mm = time.getMinutes();
            let s = time.getSeconds();
            return isLessTen(y) + '/' + isLessTen(m) + '/' + isLessTen(d) + ' ' + isLessTen(h) + ':' + isLessTen(mm) + ':' + isLessTen(s);
        }
    }
}