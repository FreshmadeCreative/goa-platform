const ExcelJS = require("exceljs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Bad JSON" }; }

  const { clients, dateFrom, dateTo } = body;

  const wb = new ExcelJS.Workbook();
  wb.creator = "goa platform";
  wb.created = new Date();

  // SHEET 1 — Summary
  const ws = wb.addWorksheet("Bonus Report Summary");
  ws.properties.tabColor = { argb:"FFC8102E" };

  const headerStyle = { font:{ bold:true, color:{ argb:"FFFFFFFF" }, name:"Calibri", size:11 }, fill:{ type:"pattern", pattern:"solid", fgColor:{ argb:"FF111827" }}, alignment:{ horizontal:"left", vertical:"middle" }, border:{ bottom:{ style:"thin", color:{ argb:"FFE5E7EB" }}}};
  const redStyle = { font:{ bold:true, color:{ argb:"FFC8102E" }, name:"Calibri", size:11 }};
  const subStyle = { font:{ color:{ argb:"FF6B7280" }, name:"Calibri", size:10 }};
  const totalStyle = { font:{ bold:true, name:"Calibri", size:11 }, fill:{ type:"pattern", pattern:"solid", fgColor:{ argb:"FFF9FAFB" }}};

  // Title block
  ws.mergeCells("A1:G1");
  ws.getCell("A1").value = "goa · Bonus Report";
  ws.getCell("A1").font = { bold:true, size:16, name:"Calibri", color:{ argb:"FF111827" }};
  ws.getRow(1).height = 30;

  ws.mergeCells("A2:G2");
  ws.getCell("A2").value = `Period: ${dateFrom||""} – ${dateTo||""}  ·  Generated: ${new Date().toLocaleDateString("en-AU")}`;
  ws.getCell("A2").font = { size:10, name:"Calibri", color:{ argb:"FF6B7280" }};
  ws.getRow(2).height = 20;

  ws.getRow(3).height = 8;

  // Headers
  const headers = ["Client","Campaigns","Paid media ($)","Bonus given ($)","Bonus %","Sites","Status"];
  const widths =   [22, 12, 18, 18, 12, 10, 14];
  headers.forEach((h,i) => {
    const cell = ws.getCell(4, i+1);
    cell.value = h;
    Object.assign(cell, headerStyle);
    ws.getColumn(i+1).width = widths[i];
  });
  ws.getRow(4).height = 24;

  // Data rows
  const sampleClients = clients || [
    { name:"Suncorp", campaigns:6, paid:248000, bonus:31000, sites:6, status:"Active" },
    { name:"QLD Rail", campaigns:4, paid:184000, bonus:28000, sites:4, status:"Active" },
    { name:"Alliance Media", campaigns:3, paid:91000, bonus:12000, sites:3, status:"Active" },
    { name:"BrisQuad FC", campaigns:2, paid:33000, bonus:4200, sites:2, status:"Active" },
    { name:"OzWine Group", campaigns:2, paid:62000, bonus:9300, sites:3, status:"Inactive" },
  ];

  let totalPaid=0, totalBonus=0;
  sampleClients.forEach((c,i) => {
    const r = ws.getRow(5+i);
    const pct = c.paid > 0 ? ((c.bonus/c.paid)*100).toFixed(1)+"%" : "0%";
    r.values = ["", c.name, c.campaigns, c.paid, c.bonus, pct, c.sites, c.status||"Active"];
    // shift: values starts at col 1
    r.values = [c.name, c.campaigns, c.paid, c.bonus, pct, c.sites, c.status||"Active"];
    r.getCell(1).font = { bold:true, name:"Calibri", size:10 };
    r.getCell(3).numFmt = '"$"#,##0';
    r.getCell(4).numFmt = '"$"#,##0';
    r.getCell(4).font = { color:{ argb:"FFC8102E" }, name:"Calibri", size:10 };
    const pctNum = parseFloat(pct);
    if (pctNum > 15) r.getCell(5).font = { color:{ argb:"FFD97706" }, bold:true, name:"Calibri", size:10 };
    else r.getCell(5).font = { color:{ argb:"FF059669" }, bold:true, name:"Calibri", size:10 };
    r.getCell(7).font = { color:{ argb: c.status==="Active" ? "FF059669":"FF6B7280"}, name:"Calibri", size:10 };
    r.height = 20;
    if(i%2===1) r.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF9FAFB" }};
    totalPaid += c.paid||0;
    totalBonus += c.bonus||0;
  });

  // Totals row
  const totRow = ws.getRow(5 + sampleClients.length + 1);
  totRow.values = ["TOTAL", sampleClients.reduce((s,c)=>s+(c.campaigns||0),0), totalPaid, totalBonus, ((totalBonus/totalPaid)*100).toFixed(1)+"%", sampleClients.reduce((s,c)=>s+(c.sites||0),0), ""];
  [1,2,3,4,5,6].forEach(i => Object.assign(totRow.getCell(i), totalStyle));
  totRow.getCell(3).numFmt = '"$"#,##0';
  totRow.getCell(4).numFmt = '"$"#,##0';
  totRow.height = 22;

  // SHEET 2 — by campaign period
  const ws2 = wb.addWorksheet("By LP Period");
  ws2.columns = [
    { header:"LP Period", key:"lp", width:16 },
    { header:"Dates", key:"dates", width:22 },
    { header:"Total paid ($)", key:"paid", width:16 },
    { header:"Total bonus ($)", key:"bonus", width:16 },
    { header:"Bonus %", key:"pct", width:12 },
    { header:"Clients", key:"clients", width:10 },
  ];
  ws2.getRow(1).font = { bold:true, name:"Calibri" };
  ws2.getRow(1).fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF111827" }};
  ws2.getRow(1).font = { bold:true, name:"Calibri", color:{ argb:"FFFFFFFF" }};
  [
    { lp:"LP8 2026", dates:"12 Jan – 8 Feb 2026", paid:210000, bonus:28000, clients:4 },
    { lp:"LP9 2026", dates:"9 Feb – 8 Mar 2026", paid:287000, bonus:43000, clients:5 },
    { lp:"LP10 2026", dates:"9 Mar – 5 Apr 2026", paid:195000, bonus:24000, clients:4 },
  ].forEach((r,i) => {
    const row = ws2.addRow({ ...r, pct:((r.bonus/r.paid)*100).toFixed(1)+"%" });
    row.getCell("paid").numFmt = '"$"#,##0';
    row.getCell("bonus").numFmt = '"$"#,##0';
    if(i%2===1) row.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF9FAFB" }};
  });

  const buf = await wb.xlsx.writeBuffer();
  const b64 = Buffer.from(buf).toString("base64");
  return {
    statusCode: 200,
    headers: { "Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition":`attachment; filename="goa_bonus_report_${dateFrom||"export"}.xlsx"` },
    body: b64,
    isBase64Encoded: true
  };
};
