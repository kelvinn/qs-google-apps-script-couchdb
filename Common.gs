function encodeString(q) {
    var str = encodeURIComponent(q);
    str = str.replace(/!/g,'%21');
    str = str.replace(/\*/g,'%2A');
    str = str.replace(/\(/g,'%28');
    str = str.replace(/\)/g,'%29');
    str = str.replace(/'/g,'%27');
    return str;
}

function htmlentities(str) {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    return str;
}