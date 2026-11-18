import { SprinDocument } from '../types/sprin';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function exportSprinToWord(doc: SprinDocument): void {
  const dasarContent =
    doc.dasarList.length <= 1
      ? `<div style="text-align:justify;">${escapeHtml(doc.dasarList[0] || '')}</div>`
      : `<table style="width:100%;border-collapse:collapse;">${doc.dasarList
          .map(
            (item, i) => `
      <tr>
        <td style="width:18pt;vertical-align:top;padding-bottom:4pt;">${i + 1}.</td>
        <td style="text-align:justify;vertical-align:top;padding-bottom:4pt;">${escapeHtml(item)}</td>
      </tr>`
          )
          .join('')}</table>`;

  let kepadaHtml = `<div style="text-transform:uppercase;">${escapeHtml(doc.kepadaText)}</div>`;
  if (!doc.useLampiran && doc.personelList.length === 1) {
    const p = doc.personelList[0];
    const line1 = [p.pangkat, p.nama, p.nrp ? `NRP ${p.nrp}` : ''].filter(Boolean).join(' ');
    kepadaHtml = `
      <div style="text-transform:uppercase;">
        <span style="text-decoration:underline;">${escapeHtml(line1)}</span>
        ${p.jabatan ? `<br/>${escapeHtml(p.jabatan)}` : ''}
      </div>`;
  } else if (!doc.useLampiran && doc.personelList.length > 1) {
    kepadaHtml = `<table style="width:100%;border-collapse:collapse;">${doc.personelList
      .map((p, i) => {
        const line1 = [p.pangkat, p.nama, p.nrp ? `NRP ${p.nrp}` : ''].filter(Boolean).join(' ');
        return `
          <tr>
            <td style="width:18pt;vertical-align:top;padding-bottom:4pt;">${i + 1}.</td>
            <td style="vertical-align:top;padding-bottom:4pt;text-transform:uppercase;">
              <span style="text-decoration:underline;">${escapeHtml(line1)}</span>
              ${p.jabatan ? `<br/>${escapeHtml(p.jabatan)}` : ''}
            </td>
          </tr>`;
      })
      .join('')}</table>`;
  }

  const untukRows = doc.untukList
    .map(
      (item, i) => `
      <tr>
        <td style="width:18pt;vertical-align:top;padding-bottom:5pt;">${i + 1}.</td>
        <td style="text-align:justify;vertical-align:top;padding-bottom:5pt;">${escapeHtml(item)}</td>
      </tr>`
    )
    .join('');

  const tembusanRows = doc.tembusanList
    .map((item, i) => `<div>${i + 1}. ${escapeHtml(item)}</div>`)
    .join('');

  const personnelRows = doc.personelList
    .map(
      (p, i) => `
      <tr>
        <td style="border:1pt solid #000;padding:4pt;text-align:center;">${i + 1}</td>
        <td style="border:1pt solid #000;padding:4pt;text-align:left;text-transform:uppercase;">${escapeHtml(p.nama)}</td>
        <td style="border:1pt solid #000;padding:4pt;text-align:center;text-transform:uppercase;">${escapeHtml(p.pangkat)}</td>
        <td style="border:1pt solid #000;padding:4pt;text-align:center;">${escapeHtml(p.nrp)}</td>
        <td style="border:1pt solid #000;padding:4pt;text-align:center;text-transform:uppercase;">${escapeHtml(p.jabatan)}</td>
        <td style="border:1pt solid #000;padding:4pt;text-align:center;text-transform:uppercase;">${escapeHtml(p.ket)}</td>
      </tr>`
    )
    .join('');

  const lampiranSection = doc.useLampiran
    ? `
    <!-- HALAMAN 2 -->
    <div class="page-break"></div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:18pt;">
      <tr>
        <td style="vertical-align:top;width:48%;">
          <table style="border-collapse:collapse;">
            <tr>
              <td style="text-align:center;font-size:10pt;border-bottom:1pt solid #000;padding-bottom:2pt;line-height:1.0;">
                ${escapeHtml(doc.kopLine1)}<br/>
                ${escapeHtml(doc.kopLine2)}<br/>
                ${escapeHtml(doc.kopLine3)}
              </td>
            </tr>
          </table>
        </td>
        <td style="vertical-align:top;width:52%;font-size:10pt;">
          <div style="border-bottom:1pt solid #000;padding-bottom:1pt;">${escapeHtml(doc.lampiranHeaderTitle)}</div>
          <div style="border-bottom:1pt solid #000;padding-bottom:1pt;">NOMOR &nbsp; : ${escapeHtml(doc.lampiranNomor)}</div>
          <div style="border-bottom:1pt solid #000;padding-bottom:1pt;">TANGGAL : ${escapeHtml(doc.lampiranTanggalUpper)}</div>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin-bottom:12pt;">
      <div style="text-transform:uppercase;">${escapeHtml(doc.lampiranJudul)}</div>
      <div style="display:inline-block;border-bottom:1pt solid #000;padding:0 10pt 1pt 10pt;text-transform:uppercase;">
        ${escapeHtml(doc.lampiranSubjudul)}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:10pt;">
      <thead>
        <tr>
          <th style="border:1pt solid #000;padding:5pt 3pt;font-weight:normal;width:30pt;">NO</th>
          <th style="border:1pt solid #000;padding:5pt 4pt;font-weight:normal;">NAMA</th>
          <th style="border:1pt solid #000;padding:5pt 4pt;font-weight:normal;width:70pt;">PANGKAT</th>
          <th style="border:1pt solid #000;padding:5pt 4pt;font-weight:normal;width:74pt;">NRP</th>
          <th style="border:1pt solid #000;padding:5pt 4pt;font-weight:normal;width:125pt;">JABATAN</th>
          <th style="border:1pt solid #000;padding:5pt 3pt;font-weight:normal;width:44pt;">KET</th>
        </tr>
        <tr>
          <th style="border:1pt solid #000;padding:2pt;font-weight:normal;">1</th>
          <th style="border:1pt solid #000;padding:2pt;font-weight:normal;">2</th>
          <th style="border:1pt solid #000;padding:2pt;font-weight:normal;">3</th>
          <th style="border:1pt solid #000;padding:2pt;font-weight:normal;">4</th>
          <th style="border:1pt solid #000;padding:2pt;font-weight:normal;">5</th>
          <th style="border:1pt solid #000;padding:2pt;font-weight:normal;">6</th>
        </tr>
      </thead>
      <tbody>
        ${personnelRows}
      </tbody>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:16pt;">
      <tr>
        <td style="width:45%;"></td>
        <td style="width:55%;text-align:left;">
          <div style="margin-left:28pt;">
            <div>Dikeluarkan di : ${escapeHtml(doc.dikeluarkanDi)}</div>
            <div style="border-bottom:1pt solid #000;display:inline-block;padding-bottom:1pt;">
              Pada tanggal &nbsp; : ${escapeHtml(doc.tanggalSuratHal2)}
            </div>
          </div>
          <div style="text-align:center;margin-top:6pt;font-size:10pt;">
            ${escapeHtml(doc.pejabatJabatan)}
          </div>
          <div style="height:48pt;"></div>
          <div style="text-align:center;">
            <span style="border-bottom:1pt solid #000;padding:0 8pt;text-transform:uppercase;">
              ${escapeHtml(doc.pejabatNama)}
            </span><br/>
            <span style="text-transform:uppercase;font-size:10pt;">
              ${escapeHtml(doc.pejabatPangkatNrp)}
            </span>
          </div>
        </td>
      </tr>
    </table>`
    : '';

  const htmlContent = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(doc.nomorSprin)}</title>
    <style>
      @page {
        size: 210mm 297mm;
        margin: 16mm 18mm 15mm 20mm;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        color: #000000;
        line-height: 1.0;
      }
      .page-break {
        page-break-before: always;
      }
    </style>
  </head>
  <body>
    <!-- HALAMAN 1 -->
    <table style="border-collapse:collapse;margin-bottom:10pt;">
      <tr>
        <td style="text-align:center;font-size:10pt;border-bottom:1pt solid #000;padding-bottom:2pt;line-height:1.0;">
          ${escapeHtml(doc.kopLine1)}<br/>
          ${escapeHtml(doc.kopLine2)}<br/>
          ${escapeHtml(doc.kopLine3)}
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin-bottom:14pt;">
      <div style="margin-bottom:4pt;">
        <img src="${typeof window !== 'undefined' ? window.location.origin : ''}/assets/aistudio/tb__1__e5e5aec3.png" width="54" height="52" alt="Tribrata" />
      </div>
      <div style="display:inline-block;border-bottom:1pt solid #000;padding:0 24pt 2pt 24pt;font-size:11.5pt;">
        SURAT PERINTAH
      </div>
      <div style="margin-top:2pt;font-size:10.5pt;">
        Nomor : ${escapeHtml(doc.nomorSprin)}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="width:92pt;vertical-align:top;padding-bottom:8pt;">Pertimbangan</td>
        <td style="width:14pt;vertical-align:top;padding-bottom:8pt;">:</td>
        <td style="text-align:justify;vertical-align:top;padding-bottom:8pt;">${escapeHtml(doc.pertimbangan)}</td>
      </tr>
      <tr>
        <td style="width:92pt;vertical-align:top;padding-bottom:8pt;">Dasar</td>
        <td style="width:14pt;vertical-align:top;padding-bottom:8pt;">:</td>
        <td style="vertical-align:top;padding-bottom:8pt;">
          ${dasarContent}
        </td>
      </tr>
      <tr>
        <td colspan="3" style="text-align:center;padding:8pt 0;font-size:11pt;">DIPERINTAHKAN</td>
      </tr>
      <tr>
        <td style="width:92pt;vertical-align:top;padding-bottom:8pt;">Kepada</td>
        <td style="width:14pt;vertical-align:top;padding-bottom:8pt;">:</td>
        <td style="vertical-align:top;padding-bottom:8pt;">${kepadaHtml}</td>
      </tr>
      <tr>
        <td style="width:92pt;vertical-align:top;padding-bottom:8pt;">Untuk</td>
        <td style="width:14pt;vertical-align:top;padding-bottom:8pt;">:</td>
        <td style="vertical-align:top;padding-bottom:8pt;">
          <table style="width:100%;border-collapse:collapse;">${untukRows}</table>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="padding-top:2pt;">Selesai.</td>
      </tr>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:18pt;">
      <tr>
        <td style="width:45%;"></td>
        <td style="width:55%;text-align:left;">
          <div style="margin-left:28pt;">
            <div>Dikeluarkan di : ${escapeHtml(doc.dikeluarkanDi)}</div>
            <div style="border-bottom:1pt solid #000;display:inline-block;padding-bottom:1pt;">
              ${doc.useLampiran ? 'Pada tanggal' : 'pada tanggal'} &nbsp; : ${escapeHtml(doc.tanggalSuratHal1)}
            </div>
          </div>
          <div style="text-align:center;margin-top:6pt;font-size:10pt;">
            ${escapeHtml(doc.pejabatJabatan)}
          </div>
          <div style="height:48pt;"></div>
          <div style="text-align:center;">
            <span style="border-bottom:1pt solid #000;padding:0 8pt;text-transform:uppercase;">
              ${escapeHtml(doc.pejabatNama)}
            </span><br/>
            <span style="text-transform:uppercase;font-size:10pt;">
              ${escapeHtml(doc.pejabatPangkatNrp)}
            </span>
          </div>
        </td>
      </tr>
    </table>

    <div style="margin-top:16pt;font-size:10.5pt;">
      <div>Tembusan:</div>
      <div style="margin-top:4pt;">${tembusanRows}</div>
    </div>

    ${lampiranSection}
  </body>
  </html>`;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = doc.nomorSprin.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  a.href = url;
  a.download = `${safeName || 'Surat_Perintah'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
