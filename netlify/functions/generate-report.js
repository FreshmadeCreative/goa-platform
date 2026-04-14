const PptxGenJS = require("pptxgenjs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Bad JSON" }; }

  const { type, client, period, preparedBy, sections, sites, totalValue } = body;

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "goa platform";

  const RED = "C8102E", DARK = "111827", WHITE = "FFFFFF", GRAY = "6B7280", LTGRAY = "F9FAFB";

  const addSlide = (bg) => {
    const s = pptx.addSlide();
    s.background = { color: bg || DARK };
    return s;
  };

  if (type === "postcampaign") {
    // SLIDE 1 — Cover
    let s = addSlide(DARK);
    s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"30%", h:"100%", fill:{ color: RED } });
    s.addText("goa", { x:0.3, y:0.4, w:2, h:0.6, fontSize:28, bold:true, color:WHITE, fontFace:"Arial" });
    s.addText(client || "Campaign Report", { x:3, y:1.5, w:6.5, h:1, fontSize:32, bold:true, color:WHITE, fontFace:"Arial" });
    s.addText(period || "", { x:3, y:2.6, w:6.5, h:0.5, fontSize:16, color:"CCCCCC", fontFace:"Arial" });
    s.addText("Post-Campaign Report", { x:3, y:3.3, w:6.5, h:0.5, fontSize:14, color:RED, fontFace:"Arial", bold:true });
    s.addText(preparedBy || "goa · Queensland Sales", { x:3, y:6, w:6.5, h:0.4, fontSize:11, color:"999999", fontFace:"Arial" });

    // SLIDE 2 — Campaign overview
    s = addSlide(WHITE);
    s.addText("Campaign Overview", { x:0.4, y:0.3, w:12, h:0.5, fontSize:20, bold:true, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:0.85, w:1.5, h:0.04, fill:{ color:RED } });
    const metrics = [
      { label:"Client", val: client||"—" },
      { label:"Period", val: period||"—" },
      { label:"Total sites", val: (sites||[]).length + " sites" },
      { label:"Total investment", val: totalValue||"—" },
    ];
    metrics.forEach((m,i) => {
      const x = 0.4 + (i % 2) * 6, y = 1.2 + Math.floor(i/2) * 1.1;
      s.addShape(pptx.ShapeType.rect, { x, y, w:5.5, h:0.9, fill:{ color:LTGRAY }, line:{ color:"E5E7EB", width:1 }, rounding:true });
      s.addText(m.label, { x:x+0.2, y:y+0.1, w:5, h:0.3, fontSize:10, color:GRAY, fontFace:"Arial" });
      s.addText(m.val, { x:x+0.2, y:y+0.38, w:5, h:0.4, fontSize:16, bold:true, color:DARK, fontFace:"Arial" });
    });

    // Site table
    if ((sites||[]).length > 0) {
      const rows = [
        [{ text:"Site", options:{ bold:true, fill:DARK, color:WHITE }}, { text:"Format", options:{ bold:true, fill:DARK, color:WHITE }}, { text:"Dimensions", options:{ bold:true, fill:DARK, color:WHITE }}, { text:"Rate (LP)", options:{ bold:true, fill:DARK, color:WHITE }}],
        ...sites.slice(0,8).map(site => [site.name||"", site.format||"", site.dimensions||"", site.lunar_rate ? "$"+Number(site.lunar_rate).toLocaleString() : "—"])
      ];
      s.addTable(rows, { x:0.4, y:3.4, w:12.2, fontSize:10, fontFace:"Arial", colW:[5,1.5,3,2.2], border:{ color:"E5E7EB" }, align:"left" });
    }

    // SLIDE 3 — Performance
    s = addSlide(WHITE);
    s.addText("Performance Results", { x:0.4, y:0.3, w:12, h:0.5, fontSize:20, bold:true, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:0.85, w:1.5, h:0.04, fill:{ color:RED } });
    [
      { label:"Total impressions", val:"2,143,800", sub:"vs 1.9M estimated" },
      { label:"Campaign uptime", val:"99.8%", sub:"Industry avg 98.2%" },
      { label:"Bonus delivery", val:"+$2,720", sub:"Over-delivered" },
      { label:"MOVE LTS reach", val:"1.24M", sub:"P18+ · 7-day" },
    ].forEach((m,i) => {
      const x = 0.4 + (i%2)*6.3, y = 1.1 + Math.floor(i/2)*1.8;
      s.addShape(pptx.ShapeType.rect, { x, y, w:5.8, h:1.5, fill:{ color:LTGRAY }, line:{ color:"E5E7EB", width:1 } });
      s.addText(m.val, { x:x+0.2, y:y+0.2, w:5.4, h:0.8, fontSize:32, bold:true, color:RED, fontFace:"Arial" });
      s.addText(m.label, { x:x+0.2, y:y+0.95, w:5.4, h:0.3, fontSize:11, bold:true, color:DARK, fontFace:"Arial" });
      s.addText(m.sub, { x:x+0.2, y:y+1.2, w:5.4, h:0.2, fontSize:9, color:GRAY, fontFace:"Arial" });
    });

    // SLIDE 4 — Delivery summary
    s = addSlide(WHITE);
    s.addText("Delivery Summary", { x:0.4, y:0.3, w:12, h:0.5, fontSize:20, bold:true, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:0.85, w:1.5, h:0.04, fill:{ color:RED } });
    const delivRows = [
      [{ text:"Week", options:{ bold:true, fill:DARK, color:WHITE }},{ text:"Impressions", options:{ bold:true, fill:DARK, color:WHITE }},{ text:"Uptime", options:{ bold:true, fill:DARK, color:WHITE }},{ text:"Notes", options:{ bold:true, fill:DARK, color:WHITE }}],
      ["Week 1","498,200","100%","On schedule"],["Week 2","541,400","99.6%","Minor outage Thu — resolved"],
      ["Week 3","562,100","100%","Peak performance"],["Week 4","542,100","100%","Campaign completed"],
    ];
    s.addTable(delivRows, { x:0.4, y:1.1, w:12.2, fontSize:11, fontFace:"Arial", colW:[2,3,2,5.2], border:{ color:"E5E7EB" }, align:"left" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:4.5, w:12.2, h:1.4, fill:{ color:DARK } });
    s.addText("99.8% campaign uptime", { x:0.7, y:4.65, w:6, h:0.5, fontSize:22, bold:true, color:WHITE, fontFace:"Arial" });
    s.addText("Industry benchmark: 98.2%  ·  +$2,720 bonus delivery", { x:0.7, y:5.15, w:8, h:0.4, fontSize:11, color:"AAAAAA", fontFace:"Arial" });

    // SLIDE 5 — Investment + Renewal
    s = addSlide(WHITE);
    s.addText("Investment Summary & Renewal", { x:0.4, y:0.3, w:12, h:0.5, fontSize:20, bold:true, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:0.85, w:1.5, h:0.04, fill:{ color:RED } });
    s.addText("Investment", { x:0.4, y:1.1, w:6, h:0.35, fontSize:13, bold:true, color:DARK, fontFace:"Arial" });
    s.addText(["Total investment: " + (totalValue||"$48,200"), "Format: " + (sites?.[0]?.format||"Digital"), "Sites: " + (sites||[]).length, "CPM: $22.60"].join("\n"),
      { x:0.4, y:1.5, w:5.5, h:2, fontSize:12, color:DARK, fontFace:"Arial", bullet:true });
    s.addShape(pptx.ShapeType.rect, { x:7, y:1.1, w:5.8, h:3.5, fill:{ color:RED } });
    s.addText("Recommended for renewal", { x:7.2, y:1.35, w:5.4, h:0.5, fontSize:14, bold:true, color:WHITE, fontFace:"Arial" });
    s.addText(["• Retain core site selections", "• Consider adding Iconic for Q3", "• Recommend LP10–11 package"], { x:7.2, y:1.95, w:5.4, h:2, fontSize:12, color:WHITE, fontFace:"Arial" });
    s.addText("Book now to hold current rates →", { x:7.2, y:4.1, w:5.4, h:0.4, fontSize:11, color:"FFCCCC", fontFace:"Arial", italic:true });

  } else if (type === "proposal") {
    // SLIDE 1 — Proposal cover
    let s = addSlide(DARK);
    s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:"100%", h:"35%", fill:{ color:RED } });
    s.addText("goa", { x:0.5, y:0.35, w:3, h:0.6, fontSize:24, bold:true, color:WHITE, fontFace:"Arial" });
    s.addText("Media Proposal", { x:0.5, y:1.0, w:8, h:0.7, fontSize:30, bold:true, color:WHITE, fontFace:"Arial" });
    s.addText("Prepared for: " + (client||"Client"), { x:0.5, y:2.6, w:8, h:0.5, fontSize:16, color:WHITE, fontFace:"Arial" });
    s.addText(period||"", { x:0.5, y:3.2, w:8, h:0.4, fontSize:13, color:"CCCCCC", fontFace:"Arial" });
    s.addText(preparedBy||"Hannah F. · Senior Sales QLD", { x:0.5, y:6.0, w:8, h:0.4, fontSize:11, color:"AAAAAA", fontFace:"Arial" });
    s.addText(new Date().toLocaleDateString("en-AU", {day:"numeric",month:"long",year:"numeric"}), { x:9.5, y:6.0, w:3, h:0.4, fontSize:11, color:"AAAAAA", fontFace:"Arial", align:"right" });

    // SLIDE 2 — The opportunity
    s = addSlide(WHITE);
    s.addText("The Opportunity", { x:0.4, y:0.3, w:12, h:0.5, fontSize:20, bold:true, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:0.85, w:1.5, h:0.04, fill:{ color:RED } });
    s.addText("Campaign objective", { x:0.4, y:1.1, w:6, h:0.35, fontSize:12, bold:true, color:RED, fontFace:"Arial" });
    s.addText(body.objective||"Brand awareness and reach across key Brisbane corridors.", { x:0.4, y:1.5, w:6, h:1.5, fontSize:13, color:DARK, fontFace:"Arial" });
    s.addText("Target audience", { x:0.4, y:3.1, w:6, h:0.35, fontSize:12, bold:true, color:RED, fontFace:"Arial" });
    s.addText(body.audience||"P25–54, Brisbane Metro", { x:0.4, y:3.5, w:6, h:0.5, fontSize:13, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:7.2, y:1.1, w:5.5, h:5.5, fill:{ color:LTGRAY }, line:{ color:"E5E7EB", width:1 } });
    s.addText("Total investment", { x:7.4, y:1.4, w:5, h:0.35, fontSize:11, color:GRAY, fontFace:"Arial" });
    s.addText(totalValue||"$48,300", { x:7.4, y:1.8, w:5, h:0.8, fontSize:36, bold:true, color:RED, fontFace:"Arial" });
    s.addText(["Campaign period: " + (period||"—"), "Sites: " + (sites||[]).length, "Format: Digital + Iconic"].join("\n"),
      { x:7.4, y:2.7, w:5, h:1.5, fontSize:12, color:DARK, fontFace:"Arial" });

    // SLIDE 3 — Site selections
    s = addSlide(WHITE);
    s.addText("Site Selections", { x:0.4, y:0.3, w:12, h:0.5, fontSize:20, bold:true, color:DARK, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.4, y:0.85, w:1.5, h:0.04, fill:{ color:RED } });
    if ((sites||[]).length > 0) {
      const siteRows = [
        [{ text:"#", options:{bold:true,fill:DARK,color:WHITE,align:"center"}},{text:"Site name",options:{bold:true,fill:DARK,color:WHITE}},{text:"Suburb",options:{bold:true,fill:DARK,color:WHITE}},{text:"Format/size",options:{bold:true,fill:DARK,color:WHITE}},{text:"Direction",options:{bold:true,fill:DARK,color:WHITE}},{text:"Rate (LP)",options:{bold:true,fill:DARK,color:WHITE}}],
        ...sites.slice(0,10).map((site,i) => [
          {text:String(i+1),options:{align:"center",color:GRAY}}, site.name||"", site.suburb||"",
          (site.format||"") + (site.dimensions ? " · "+site.dimensions.split(" ")[0] : ""),
          site.direction||"",
          site.lunar_rate ? "$"+Number(site.lunar_rate).toLocaleString() : "—"
        ])
      ];
      s.addTable(siteRows, { x:0.4, y:1.1, w:12.2, fontSize:10, fontFace:"Arial", colW:[0.5,4,2,2.5,1.5,1.7], border:{ color:"E5E7EB" }, align:"left" });
    }

    // SLIDE 4 — Why goa / next steps
    s = addSlide(DARK);
    s.addText("Why goa", { x:0.5, y:0.4, w:5.5, h:0.5, fontSize:20, bold:true, color:WHITE, fontFace:"Arial" });
    s.addShape(pptx.ShapeType.rect, { x:0.5, y:0.95, w:1.2, h:0.04, fill:{ color:RED } });
    ["Queensland's #1 independent OOH network", "532 premium sites across Brisbane metro", "MOVE-verified audience measurement", "Dedicated QLD sales support + production"].forEach((t,i) => {
      s.addShape(pptx.ShapeType.rect, { x:0.5, y:1.2 + i*1.2, w:5.5, h:1.0, fill:{ color:"1F2937" }, line:{ color:"374151", width:1 } });
      s.addText(t, { x:0.8, y:1.45 + i*1.2, w:5, h:0.5, fontSize:13, color:WHITE, fontFace:"Arial" });
    });
    s.addShape(pptx.ShapeType.rect, { x:7, y:0.5, w:6, h:6.5, fill:{ color:RED } });
    s.addText("Next steps", { x:7.3, y:0.8, w:5.4, h:0.5, fontSize:18, bold:true, color:WHITE, fontFace:"Arial" });
    ["1. Review proposal & site list", "2. Confirm site selections", "3. Return signed contract", "4. Submit artwork by deadline", "5. Campaign goes live!"].forEach((t,i) => {
      s.addText(t, { x:7.3, y:1.5+i*0.9, w:5.4, h:0.6, fontSize:13, color:WHITE, fontFace:"Arial" });
    });
    s.addText("Let's lock it in →", { x:7.3, y:6.0, w:5.4, h:0.5, fontSize:14, bold:true, color:"FFCCCC", fontFace:"Arial" });
  }

  const b64 = await pptx.write({ outputType:"base64" });
  return {
    statusCode: 200,
    headers: { "Content-Type":"application/vnd.openxmlformats-officedocument.presentationml.presentation", "Content-Disposition":`attachment; filename="${(client||"Report").replace(/\s+/g,"-")}_${type}.pptx"` },
    body: b64,
    isBase64Encoded: true
  };
};
