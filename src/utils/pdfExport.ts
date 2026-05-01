import jsPDF from "jspdf";
import { type Session, formatDate } from "../lib/sessionsStore";

export function exportSessionPDF(session: Session) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Color Palette
  const primary = "#c1440e"; // Warm Parchment Primary
  const ink = "#151512";
  const gray = "#706d62";

  // Header
  doc.setFillColor(250, 247, 242);
  doc.rect(0, 0, pageWidth, 60, "F");
  
  doc.setFontSize(24);
  doc.setTextColor(ink);
  doc.setFont("helvetica", "bold");
  doc.text("BEC DEV CLUB", 20, 35);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(primary);
  doc.text("SESSION ARCHIVE SYSTEM", 20, 45);

  doc.setFontSize(10);
  doc.setTextColor(gray);
  const dateStr = formatDate(session.createdAt);
  doc.text(dateStr.toUpperCase(), pageWidth - 20, 35, { align: "right" });

  // Divider
  doc.setDrawColor(232, 224, 210);
  doc.setLineWidth(0.5);
  doc.line(20, 60, pageWidth - 20, 60);

  // Session Body
  doc.setFontSize(22);
  doc.setTextColor(ink);
  doc.setFont("helvetica", "bold");
  doc.text(session.title || "Untitled Session", 20, 80);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray);
  doc.text(`Host: ${session.host || "N/A"}`, 20, 92);

  // Stats
  const present = session.members.filter(m => m.present).length;
  const total = session.members.length;
  const rate = total ? Math.round((present / total) * 100) : 0;

  doc.setFillColor(245, 232, 212);
  doc.roundedRect(20, 105, pageWidth - 40, 30, 4, 4, "F");

  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text("ATTENDANCE", 30, 115);
  doc.text("SUCCESS RATE", pageWidth / 2 + 10, 115);

  doc.setFontSize(16);
  doc.setTextColor(ink);
  doc.setFont("helvetica", "bold");
  doc.text(`${present} / ${total} members`, 30, 126);
  doc.text(`${rate}%`, pageWidth / 2 + 10, 126);

  // Attendance List
  doc.setFontSize(14);
  doc.setTextColor(ink);
  doc.setFont("helvetica", "bold");
  doc.text("Attendance Register", 20, 155);

  let y = 168;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  session.members.forEach((m, i) => {
    // Page break if needed
    if (y > 270) {
      doc.addPage();
      y = 30;
    }

    doc.setTextColor(ink);
    doc.text(`${String(i + 1).padStart(2, '0')}. ${m.name}`, 25, y);
    
    if (m.present) {
      doc.setTextColor(45, 158, 107); // Green
      doc.text("PRESENT", pageWidth - 25, y, { align: "right" });
    } else {
      doc.setTextColor(217, 91, 91); // Red
      doc.text("ABSENT", pageWidth - 25, y, { align: "right" });
    }
    
    doc.setDrawColor(240, 234, 214);
    doc.setLineWidth(0.1);
    doc.line(20, y + 4, pageWidth - 20, y + 4);
    
    y += 12;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(gray);
    doc.text(`BEC DEV CLUB · Digital Archive Report · Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: "center" });
  }

  doc.save(`${session.title?.replace(/\s+/g, '_') || "session"}_report.pdf`);
}
