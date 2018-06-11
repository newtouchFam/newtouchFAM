Ext.namespace("wfs.gl");

/**
 * 凭证打印工具类
 */
wfs.gl.VoucherPrintUtil = {};

/**
 * 缩写定义
 */
VoucherPrintUtil = wfs.gl.VoucherPrintUtil;

/**
 * 凭证打印
 * @param voucherid	凭证ID
 * @param url		凭证打印action地址
 * @param location	jasper文件路径
 * @param format	打印格式。HTML、PDF等
 * @param target
 */
wfs.gl.VoucherPrintUtil.voucher_print = function(voucherid, url, location, format, target)
{
	var formVoucherPrint = document.createElement("form");
	formVoucherPrint.id = "nwfs-voucher-print";
	formVoucherPrint.name = "nwfs-voucher-print";
	formVoucherPrint.method = "post";
	formVoucherPrint.action = url;
	formVoucherPrint.target = target;

	if(format == undefined || format == null)
	{
		format = "PDF"
	}

	var inputLocation = document.createElement("input");
	inputLocation.name = "location";
	inputLocation.value = location;
	formVoucherPrint.appendChild(inputLocation);

	var inputFormat = document.createElement("input");
	inputFormat.name = "format";
	inputFormat.value = format;
	formVoucherPrint.appendChild(inputFormat);

	var detailData = new Array();
	var obj = 
	{
		voucherid : voucherid
	};
	detailData[0] = obj;
	var voucherids = Ext.encode(detailData);
	
	var param = 
	{
		voucherids : voucherids
	};

	var inputJsonFilter = document.createElement("input");
	inputJsonFilter.name = "jsonFilter";
	inputJsonFilter.value =  Ext.encode(param);
	formVoucherPrint.appendChild(inputJsonFilter);

	document.body.appendChild(formVoucherPrint);
	formVoucherPrint.submit();
};

/**
 * 凭证打印（连续）
 * @param voucherids	凭证ID数组
 * @param url		凭证打印action地址
 * @param mainlocation	主报表jasper文件路径
 * @param format	打印格式。HTML、PDF等
 * @param target
 */
wfs.gl.VoucherPrintUtil.voucher_prints = function(voucherids, url, location, format, target)
{
	var formVoucherPrint = document.createElement("form");
	formVoucherPrint.id = "nwfs-voucher-print";
	formVoucherPrint.name = "nwfs-voucher-print";
	formVoucherPrint.method = "post";
	formVoucherPrint.action = url;
	formVoucherPrint.target = target;

	if(format == undefined || format == null)
	{
		format = "PDF"
	}

	var inputLocation = document.createElement("input");
	inputLocation.name = "location";
	inputLocation.value = location;
	formVoucherPrint.appendChild(inputLocation);

	var inputFormat = document.createElement("input");
	inputFormat.name = "format";
	inputFormat.value = format;
	formVoucherPrint.appendChild(inputFormat);

	var param = 
	{
		voucherids : voucherids
	};

	var inputJsonFilter = document.createElement("input");
	inputJsonFilter.name = "jsonFilter";
	inputJsonFilter.value =  Ext.encode(param);
	formVoucherPrint.appendChild(inputJsonFilter);

	document.body.appendChild(formVoucherPrint);
	formVoucherPrint.submit();
};

/**
 * PDF凭证打印
 * 在新浏览器页面中显示
 * @param voucherid		凭证ID
 */
wfs.gl.VoucherPrintUtil.voucher_printPDF = function(voucherid)
{
	wfs.gl.VoucherPrintUtil.voucher_print(voucherid,
			"voucher/prints",
			"wfs\\gl\\vouchermanager\\vouchermake\\voucher_main.jasper",
			"PDF",
			"_blank");
}

/**
 * PDF凭证连续打印
 * 在新浏览器页面中显示
 * @param voucherids		凭证ID数组
 */
wfs.gl.VoucherPrintUtil.voucher_printsPDF = function(voucherids)
{
	wfs.gl.VoucherPrintUtil.voucher_prints(
			voucherids,
			"voucher/prints",
			"wfs\\gl\\vouchermanager\\vouchermake\\voucher_main.jasper",
			"PDF",
			"_blank");
}

/**
 * HTML凭证打印
 * 在新浏览器页面中显示
 * @param voucherid		凭证ID
 */
wfs.gl.VoucherPrintUtil.voucher_printHTML = function(voucherid)
{
	wfs.gl.VoucherPrintUtil.voucher_print(voucherid,
			"voucher/prints",
			"wfs\\gl\\vouchermanager\\vouchermake\\voucher_main.jasper",
			"HTML",
			"_blank");
}
