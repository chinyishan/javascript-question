// worker.js

importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
importScripts('https://html2canvas.hertzen.com/dist/html2canvas.js'); // 或者从你的服务器上加载 html2canvas

self.onmessage = function (event) {
  console.log(event);
  const { opt, pageHTMLString } = event.data;

  // 使用 DOMParser 将 HTML 字符串转换为 DOM 元素
  const parser = new DOMParser();
  const pageHTML = parser.parseFromString(pageHTMLString, 'text/html').body;

  // 在这里执行生成 PDF 的操作
  let pdf = new jspdf.jsPDF(opt);

  // 使用 html2canvas 将 HTML 内容转换为图像
  html2canvas(pageHTML, opt.html2canvas).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);
    pdf.addImage(imgData, "JPEG", opt.margin, opt.margin);
    pdf.addPage();

    // 获取生成的 PDF 数据
    const pdfData = pdf.output();

    // 向主线程发送生成的 PDF 数据
    self.postMessage(pdfData);
  });
};
