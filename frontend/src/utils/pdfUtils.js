import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// =============================
// COMMON PDF GENERATOR (REUSABLE)
// =============================
const generatePDF = async (elementId, fileName) => {
  const element = document.getElementById(elementId)

  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    const pageHeight = 297 // still useful for pagination

    const imgWidth = 190
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 10

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${fileName}.pdf`)
  } catch (error) {
    console.error('PDF generation failed:', error)
  }
}

// =============================
export const downloadAppointmentSlip = (elementId) => {
  return generatePDF(elementId, 'appointment-slip')
}

export const downloadConsultationReport = (elementId) => {
  return generatePDF(elementId, 'consultation-report')
}