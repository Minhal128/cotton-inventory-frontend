// Lightweight CSV exporter (Excel-compatible) and a print-to-PDF path.
// We avoid heavy client deps and use a small CSV-to-Blob download.

export function exportCSV(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(title, columns, rows) {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  const style = `
    body{font-family:Inter,system-ui,sans-serif;padding:24px;color:#1F2937;}
    h1{font-size:18px;margin:0 0 4px;}
    .meta{color:#6B7280;font-size:12px;margin-bottom:16px;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    th{text-align:left;background:#F9FAFB;padding:8px;border-bottom:1px solid #E5E7EB;}
    td{padding:8px;border-bottom:1px solid #F3F4F6;}
    tr:nth-child(even) td{background:#FAFAFB;}
  `;
  const head = columns.map((c) => `<th>${c.label}</th>`).join('');
  const body = rows.map((r) => `<tr>${columns.map((c) => `<td>${c.render ? c.render(r) : (r[c.key] ?? '')}</td>`).join('')}</tr>`).join('');
  w.document.write(`<!doctype html><html><head><title>${title}</title><style>${style}</style></head><body>
    <h1>${title}</h1>
    <div class="meta">Generated: ${new Date().toLocaleString()}</div>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    <script>window.onload=()=>setTimeout(()=>window.print(),200);<\/script>
  </body></html>`);
  w.document.close();
}