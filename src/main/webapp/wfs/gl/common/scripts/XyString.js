/**
 * 左补齐字符串
 * 
 * @param nSize
 *            要补齐的长度
 * @param ch
 *            要补齐的字符
 * @return
 */
String.prototype.padLeft = function(nSize, ch)
{
    var len = 0;
    var s = this ? this : "";
    ch = ch ? ch : '0';// 默认补0

    len = s.length;
    while (len < nSize)
    {
        s = ch + s;
        len++;
    }
    return s;
}

/**
 * 右补齐字符串
 * 
 * @param nSize
 *            要补齐的长度
 * @param ch
 *            要补齐的字符
 * @return
 */
String.prototype.padRight = function(nSize, ch)
{
    var len = 0;
    var s = this ? this : "";
    ch = ch ? ch : '0';// 默认补0

    len = s.length;
    while (len < nSize)
    {
        s = s + ch;
        len++;
    }
    return s;
}
/**
 * 左移小数点位置（用于数学计算，相当于除以Math.pow(10,scale)）
 * 
 * @param scale
 *            要移位的刻度
 * @return
 */
String.prototype.movePointLeft = function(scale)
{
    var s, s1, s2, ch, ps, sign;
    ch = '.';
    sign = '';
    s = this ? this : "";

    if (scale <= 0) return s;
    ps = s.split('.');
    s1 = ps[0] ? ps[0] : "";
    s2 = ps[1] ? ps[1] : "";
    if (s1.slice(0, 1) == '-')
    {
        s1 = s1.slice(1);
        sign = '-';
    }
    if (s1.length <= scale)
    {
        ch = "0.";
        s1 = s1.padLeft(scale);
    }
    return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
}
/**
 * 右移小数点位置（用于数学计算，相当于乘以Math.pow(10,scale)）
 * 
 * @param scale
 *            要移位的刻度
 * @return
 */
String.prototype.movePointRight = function(scale)
{
    var s, s1, s2, ch, ps;
    ch = '.';
    s = this ? this : "";

    if (scale <= 0) return s;
    ps = s.split('.');
    s1 = ps[0] ? ps[0] : "";
    s2 = ps[1] ? ps[1] : "";
    if (s2.length <= scale)
    {
        ch = '';
        s2 = s2.padRight(scale);
    }
    return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
}
/**
 * 移动小数点位置（用于数学计算，相当于（乘以/除以）Math.pow(10,scale)）
 * 
 * @param scale
 *            要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
 * @return
 */
String.prototype.movePoint = function(scale)
{
    if (scale >= 0)
        return this.movePointRight(scale);
    else
        return this.movePointLeft(-scale);
}