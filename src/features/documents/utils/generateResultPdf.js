import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { getConsecutiveAspekMeta } from '@/shared/constants/aspek'
import {
  formatDateTime,
  formatDateTimeFull,
  formatNilaiRasio,
  formatPersentaseMaks,
  formatSkor,
} from '@/shared/utils/format'

const MARGIN = 14
const PAGE_WIDTH = 210
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const STATUS_FILL = {
  Hijau: [220, 252, 231],
  Kuning: [254, 243, 199],
  Merah: [254, 226, 226],
  'Tidak Dapat Dihitung': [241, 245, 249],
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeResults(results) {
  return {
    totalSkorParsial: toNumber(results?.totalSkorParsial),
    persentaseParsial: toNumber(results?.persentaseParsial),
    bobotDapatDihitung: toNumber(results?.bobotDapatDihitung, 85),
    predikat: results?.predikat ?? '-',
    tidakDapatDihitung: results?.tidakDapatDihitung ?? null,
    detail: Array.isArray(results?.detail) ? results.detail : [],
  }
}

function getPredikatFill(predikat) {
  const upper = predikat.toUpperCase()
  if (upper === 'SEHAT') return [34, 197, 94]
  if (upper === 'CUKUP SEHAT') return [220, 252, 231]
  if (upper === 'KURANG SEHAT') return [254, 243, 199]
  if (upper === 'TIDAK SEHAT') return [254, 226, 226]
  return [220, 38, 38]
}

function getPredikatTextColor(predikat) {
  const upper = predikat.toUpperCase()
  if (upper === 'SEHAT') return [255, 255, 255]
  if (upper === 'CUKUP SEHAT') return [21, 128, 61]
  if (upper === 'KURANG SEHAT') return [161, 98, 7]
  if (upper === 'TIDAK SEHAT') return [185, 28, 28]
  return [255, 255, 255]
}

function buildDetailRows(detail) {
  const aspekMeta = getConsecutiveAspekMeta(detail)

  return detail.map((row, index) => {
    const cells = []
    const { showAspek, aspekRowSpan } = aspekMeta[index]

    if (showAspek) {
      cells.push({
        content: row.aspek,
        rowSpan: aspekRowSpan,
        styles: { fontStyle: 'bold', valign: 'top' },
      })
    }

    cells.push(
      row.komponen,
      formatNilaiRasio(row.nilaiRasio, row.skor),
      String(row.nilai),
      String(row.bobot),
      formatSkor(toNumber(row.skor)),
      formatPersentaseMaks(row.persentaseMaks),
      row.status,
    )

    return cells
  })
}

function addFooter(doc) {
  const pageCount = doc.getNumberOfPages()
  const generatedAt = formatDateTimeFull(new Date())

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120)
    doc.text(`Dibuat oleh AutoSkor · ${generatedAt}`, PAGE_WIDTH / 2, 287, {
      align: 'center',
    })
    doc.text(`Halaman ${page} dari ${pageCount}`, PAGE_WIDTH - MARGIN, 287, {
      align: 'right',
    })
    doc.setTextColor(0)
  }
}

function addTidakDapatDihitungSection(doc, data, startY) {
  let y = startY

  if (y > 235) {
    doc.addPage()
    y = MARGIN
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Tidak Dapat Dihitung', MARGIN, y)
  y += 2

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text('Tidak termasuk dalam skor parsial', MARGIN, y + 4)
  doc.setTextColor(0)
  y += 8

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    tableWidth: CONTENT_WIDTH,
    styles: { fontSize: 9, cellPadding: 3, fillColor: [248, 250, 252] },
    body: [[data.catatan]],
    margin: { left: MARGIN, right: MARGIN },
  })

  y = doc.lastAutoTable.finalY + 4

  const komponenRows = (data.komponen ?? []).map((item) => [
    item.nama,
    `${item.jumlahPertanyaan} pertanyaan`,
  ])

  autoTable(doc, {
    startY: y,
    tableWidth: CONTENT_WIDTH,
    head: [[data.aspek, data.flag]],
    body: komponenRows,
    foot: [
      [
        { content: 'Bobot', styles: { halign: 'center', fillColor: [248, 250, 252] } },
        { content: 'Skor', styles: { halign: 'center', fillColor: [248, 250, 252] } },
      ],
      [
        { content: String(data.bobot), styles: { halign: 'center', fontStyle: 'bold' } },
        {
          content: formatSkor(toNumber(data.skor)),
          styles: { halign: 'center', fontStyle: 'bold', textColor: [100, 116, 139] },
        },
      ],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
    },
    footStyles: { fillColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: CONTENT_WIDTH * 0.68 },
      1: { cellWidth: CONTENT_WIDTH * 0.32, halign: 'right' },
    },
    margin: { left: MARGIN, right: MARGIN },
  })

  return doc.lastAutoTable.finalY
}

function buildResultPdfDoc({ document, results }) {
  const normalizedResults = normalizeResults(results)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MARGIN

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('AutoSkor', MARGIN, y)
  y += 8

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Laporan Hasil Penilaian Kesehatan Koperasi', MARGIN, y)
  y += 6

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text('Berdasarkan Permen KUKM No. 14 Tahun 2009', MARGIN, y)
  doc.setTextColor(0)
  y += 10

  doc.setFillColor(248, 250, 252)
  doc.rect(MARGIN, y, CONTENT_WIDTH, 20, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Dokumen: ${document?.fileName ?? '-'}`, MARGIN + 4, y + 8)
  doc.text(`Diunggah: ${formatDateTime(document?.uploadedAt)}`, MARGIN + 4, y + 15)
  y += 26

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Ringkasan Penilaian', MARGIN, y)
  y += 2

  const bobotParsial = normalizedResults.bobotDapatDihitung

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    tableWidth: CONTENT_WIDTH,
    styles: { fontSize: 10, cellPadding: 4 },
    body: [
      [
        {
          content: 'Skor Parsial (Dapat Dihitung)',
          styles: { halign: 'center', fillColor: [248, 250, 252], fontStyle: 'bold' },
        },
        {
          content: 'Persentase Parsial',
          styles: { halign: 'center', fillColor: [248, 250, 252], fontStyle: 'bold' },
        },
        {
          content: 'Predikat Kesehatan',
          styles: { halign: 'center', fillColor: [248, 250, 252], fontStyle: 'bold' },
        },
      ],
      [
        {
          content: `${formatSkor(normalizedResults.totalSkorParsial)} / ${bobotParsial}`,
          styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
        },
        {
          content: `${normalizedResults.persentaseParsial.toFixed(1)}%`,
          styles: {
            halign: 'center',
            fontSize: 14,
            fontStyle: 'bold',
            textColor: [29, 78, 216],
          },
        },
        {
          content: normalizedResults.predikat,
          styles: {
            halign: 'center',
            fontSize: 11,
            fontStyle: 'bold',
            fillColor: getPredikatFill(normalizedResults.predikat),
            textColor: getPredikatTextColor(normalizedResults.predikat),
          },
        },
      ],
    ],
    margin: { left: MARGIN, right: MARGIN },
  })

  y = doc.lastAutoTable.finalY + 4

  if (normalizedResults.tidakDapatDihitung) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text(
      `Aspek Manajemen (${normalizedResults.tidakDapatDihitung.bobot} bobot) tidak dihitung karena data non-keuangan tidak tersedia dalam dokumen.`,
      MARGIN,
      y + 4,
      { maxWidth: CONTENT_WIDTH },
    )
    doc.setTextColor(0)
    y += 10
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Detail Penilaian', MARGIN, y)
  y += 2

  autoTable(doc, {
    startY: y,
    tableWidth: CONTENT_WIDTH,
    head: [
      [
        'Aspek',
        'Komponen / Rasio',
        'Nilai Rasio',
        'Nilai',
        'Bobot',
        'Skor',
        '% thd Maks',
        'Status',
      ],
    ],
    body: buildDetailRows(normalizedResults.detail),
    styles: { fontSize: 7.5, cellPadding: 2, overflow: 'linebreak' },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 56 },
      2: { halign: 'right', cellWidth: 18 },
      3: { halign: 'right', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 14 },
      5: { halign: 'right', cellWidth: 16 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'center', cellWidth: 22 },
    },
    margin: { left: MARGIN, right: MARGIN },
    didParseCell(cellData) {
      if (cellData.section !== 'body' || cellData.column.index !== 7) return

      const status = cellData.cell.raw
      if (STATUS_FILL[status]) {
        cellData.cell.styles.fillColor = STATUS_FILL[status]
        cellData.cell.styles.fontStyle = 'bold'
      }
    },
  })

  y = doc.lastAutoTable.finalY + 8

  if (normalizedResults.tidakDapatDihitung) {
    addTidakDapatDihitungSection(doc, normalizedResults.tidakDapatDihitung, y)
  }

  addFooter(doc)

  return doc
}

function buildPdfFileName(fileName) {
  const baseName = (fileName ?? 'dokumen').replace(/\.[^.]+$/, '').trim() || 'dokumen'
  return `${baseName}-hasil-penilaian.pdf`
}

export function createResultPdfBlob(documentResult) {
  return buildResultPdfDoc(documentResult).output('blob')
}

export function getResultPdfFileName(documentResult) {
  return buildPdfFileName(documentResult.document?.fileName)
}

export function downloadResultPdf(documentResult) {
  const doc = buildResultPdfDoc(documentResult)
  doc.save(getResultPdfFileName(documentResult))
}

