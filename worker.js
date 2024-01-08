// worker.js

// 监听从主线程传递过来的消息
self.onmessage = function (event) {
  const { opt, pages } = event.data;

  // 在这里执行耗时操作，生成 PDF 数据
  const pdfData = generatePdf(opt, pages);

  // 向主线程发送生成的 PDF 数据
  self.postMessage(pdfData);
};

function generatePdf(opt, pages) {
  // 在这里执行生成 PDF 的操作
  const doc = new jsPDF(opt.jsPDF);

  for (const page of pages) {
    // 使用 html2canvas 将页面转换为图像
    html2canvas(page, opt.html2canvas).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);
      doc.addImage(imgData, "JPEG", opt.margin, opt.margin);
      doc.addPage();
    });
  }

  // 返回生成的 PDF 数据
  return doc.output();
}
