Number.prototype.toFixed = function(scale)
{
    var s, s1, s2, start;

    s1 = this + "";
    start = s1.indexOf(".");
    s = s1.movePoint(scale);

    if (start >= 0)
    {
        s2 = Number(s1.substr(start + scale + 1, 1));
        if (s2 >= 5 && this >= 0 || s2 < 5 && this < 0)
        {
            s = Math.ceil(s);
        }
        else
        {
            s = Math.floor(s);
        }
    }

    return s.toString().movePoint(-scale);
}
/*
Number.prototype.toFixed = function(scale)
{
    var s = this + "";
    if (!scale) scale = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(scale + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (scale + 1) + "})?)\\d*$").test(s))
    {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == scale + 2)
        {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4)
            {
                for (var i = a.length - 2; i >= 0; i--)
                {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10)
                    {
                        a[i] = 0;
                        b = i != 1;
                    }
                    else
                        break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + scale + "})\\d$"), "$1.$2");
        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
}
*/
Number.prototype.add = function(arg)
{
    var n, n1, n2, s, s1, s2, ps;

    s1 = this.toString();
    ps = s1.split('.');
    n1 = ps[1] ? ps[1].length : 0;

    s2 = arg.toString();
    ps = s2.split('.');
    n2 = ps[1] ? ps[1].length : 0;

    n = n1 > n2 ? n1 : n2;
    s = Number(s1.movePoint(n)) + Number(s2.movePoint(n));
    s = s.toString().movePoint(-n);
    return Number(s);
}
Number.prototype.sub = function(arg)
{
    var n, n1, n2, s, s1, s2, ps;

    s1 = this.toString();
    ps = s1.split('.');
    n1 = ps[1] ? ps[1].length : 0;

    s2 = arg.toString();
    ps = s2.split('.');
    n2 = ps[1] ? ps[1].length : 0;

    n = n1 > n2 ? n1 : n2;
    s = Number(s1.movePoint(n)) - Number(s2.movePoint(n));
    s = s.toString().movePoint(-n);
    return Number(s);
}
Number.prototype.mul = function(arg)
{
    var n, n1, n2, s, s1, s2, ps;

    s1 = this.toString();
    ps = s1.split('.');
    n1 = ps[1] ? ps[1].length : 0;

    s2 = arg.toString();
    ps = s2.split('.');
    n2 = ps[1] ? ps[1].length : 0;

    n = n1 + n2;
    s = Number(s1.replace('.', '')) * Number(s2.replace('.', ''));
    s = s.toString().movePoint(-n);
    return Number(s);
}
Number.prototype.div = function(arg)
{
    var n, n1, n2, s, s1, s2, ps;

    s1 = this.toString();
    ps = s1.split('.');
    n1 = ps[1] ? ps[1].length : 0;

    s2 = arg.toString();
    ps = s2.split('.');
    n2 = ps[1] ? ps[1].length : 0;

    n = n1 - n2;
    s = Number(s1.replace('.', '')) / Number(s2.replace('.', ''));
    s = s.toString().movePoint(-n);
    return Number(s);
}
