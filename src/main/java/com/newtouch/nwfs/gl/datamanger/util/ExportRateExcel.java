package com.newtouch.nwfs.gl.datamanger.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;

@SuppressWarnings( { "serial" })
public class ExportRateExcel implements Serializable
{
	public static HSSFCellStyle createRedStyle(HSSFWorkbook workbook)
	{
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		cellStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		return cellStyle;
	}

	public static HSSFCellStyle createCommonStyle(HSSFWorkbook workbook)
	{
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		return cellStyle;
	}

	public static HSSFCellStyle createWrapCommonStyle(HSSFWorkbook workbook)
	{
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		cellStyle.setWrapText(true);// 自动换行
		return cellStyle;
	}

	public static HSSFCellStyle createTitleStyle(HSSFWorkbook workbook)
	{
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		HSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 10);// 字体大小
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 加粗
		cellStyle = workbook.createCellStyle();
		cellStyle.setFont(font);
		return cellStyle;
	}

	public static HSSFCellStyle createWrapTitleStyle(HSSFWorkbook workbook)
	{
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		HSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 10);// 字体大小
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 加粗
		cellStyle = workbook.createCellStyle();
		cellStyle.setFont(font);
		cellStyle.setWrapText(true);// 自动换行
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		return cellStyle;
	}

	public static HSSFCellStyle createColorWrapTitleStyle(HSSFWorkbook workbook)
	{
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setFillBackgroundColor(HSSFColor.LIGHT_BLUE.index);
		HSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 10);// 字体大小
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 加粗
		cellStyle = workbook.createCellStyle();
		cellStyle.setFont(font);
		cellStyle.setWrapText(true);// 自动换行
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		return cellStyle;
	}

	/**
	 * 插入标题行
	 * @param book
	 * @param sheet
	 * @param titles
	 */
	private void insertTitle(HSSFWorkbook hssfWorkbook, HSSFSheet sheet, String[] titles)
	{
		HSSFRow row = sheet.createRow(0);
		HSSFCell cell = null;
		for (int m = 0; m < titles.length; m++)
		{
			cell = row.createCell(m);// 创建单元格
			cell.setCellStyle(createTitleStyle(hssfWorkbook));// 设置单元格的样式
			cell.setCellValue(new HSSFRichTextString(titles[m]));// 给单元格赋值
		}
	}

	/**
	 * 导出Excel文件
	 * @param response
	 * @param list 要导出的数据
	 * @param firstsheetname sheet的名字
	 * @param titles 例如： String[] titles = { "姓名", "报账编号", "报销金额" };
	 * @throws IOException
	 */
	public void expToExcel(HttpServletResponse response, List<?> list, String firstsheetname, String[] titles) throws IOException
	{

		OutputStream os = null;
		HSSFWorkbook hssfWorkbook = null;

		// 判断结果集是否为空
		if (null != list && list.size() > 0)
		{
			hssfWorkbook = new HSSFWorkbook();
			os = response.getOutputStream();
			response.setCharacterEncoding("UTF-8");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			response.setHeader("Content-disposition", "attachment; filename=" + df.format(new Date()) + ".xls");
			response.setContentType("application/vnd.ms-excel");

			HSSFSheet commonSheet = hssfWorkbook.createSheet(firstsheetname);
			// 设置单元格默认宽度
			commonSheet.setDefaultColumnWidth(30);
			insertTitle(hssfWorkbook, commonSheet, titles);
			for (int j = 0; j < list.size(); j++)
			{
				insertRow(hssfWorkbook, commonSheet, list.get(j), j + 1);
			}
			hssfWorkbook.write(os); // 写入文件
			if (null != os)
			{// 关闭输出流
				os.flush();
				os.close(); // close outputStream
				os = null;
			}
		}
		else
		{// 结果集为空，那么弹出提示信息
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("<script type='text/javascript' language='java'>top.Ext.MessageBox.alert('提示框','没有可导出的资源！')</script>");
		}
	}

	@SuppressWarnings("unused")
	public HSSFWorkbook expToExcel(List<?> list, String firstsheetname, String[] titles) throws IOException
	{

		OutputStream os = null;
		HSSFWorkbook hssfWorkbook = null;

		// 判断结果集是否为空
		if (null != list && list.size() > 0)
		{
			hssfWorkbook = new HSSFWorkbook();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");

			HSSFSheet commonSheet = hssfWorkbook.createSheet(firstsheetname);
			// 设置单元格默认宽度
			commonSheet.setDefaultColumnWidth(30);
			insertTitle(hssfWorkbook, commonSheet, titles);
			for (int j = 0; j < list.size(); j++)
			{
				insertRow(hssfWorkbook, commonSheet, list.get(j), j + 1);
			}
			/*hssfWorkbook.write(os)*/; // 写入文件
			if (null != os)
			{// 关闭输出流
				os.flush();
				os.close(); // close outputStream
				os = null;
			}
		}

		return hssfWorkbook;
	}
	
	public void downloadExcel(HttpServletResponse response, String filename, InputStream fis) throws IOException
	{
		try
		{	
			OutputStream os = response.getOutputStream();
			response.setCharacterEncoding("UTF-8");
			response.setHeader("Content-disposition", "attachment; filename="+ filename);
			response.setContentType("application/vnd.ms-excel");

			if(null != fis)
			{
			    byte[] buf = new byte[255]; 
			    int len = 0; 
			    while ((len = fis.read(buf)) != -1) { 
			    	os.write(buf, 0, len); 
			    } 
			 
			    fis.close(); 
			}

			if (null != os)
			{// 关闭输出流
				os.flush();
				os.close(); // close outputStream
				os = null;
			}
			
			
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	private void insertRow(HSSFWorkbook hssfWorkbook, HSSFSheet sheet, Object result, int index)
	{
		HSSFRow row = sheet.createRow(index);
		HSSFCell cell = null;
		HSSFDataFormat format = hssfWorkbook.createDataFormat();
		HSSFCellStyle cellStyle = hssfWorkbook.createCellStyle(); // 建立新的cell样式
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		cellStyle.setDataFormat(format.getFormat("#,##0.00")); // 设置cell样式为定制的浮点数格式
		Object[] results = (Object[]) result;
		for (int i = 0; i < results.length; i++)
		{
			cell = row.createCell(i);
			cell.setCellStyle(createCommonStyle(hssfWorkbook));
			if(results[i] != null){
				cell.setCellValue(new HSSFRichTextString(results[i].toString()));
			}
		}
	}
}
