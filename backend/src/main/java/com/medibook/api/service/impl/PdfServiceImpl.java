package com.medibook.api.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.medibook.api.model.Appointment;
import com.medibook.api.service.PdfService;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public byte[] generatePrescription(Appointment appointment) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);

            document.open();

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);

            // Header
            Paragraph header = new Paragraph("MediBook - Clínica Privada", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            document.add(Chunk.NEWLINE);

            // Doctor Info
            String doctorName = "Dr. " + appointment.getDoctor().getFirstName() + " "
                    + appointment.getDoctor().getLastName();
            Paragraph doctorInfo = new Paragraph(doctorName, subHeaderFont);
            doctorInfo.add(new Chunk("\nEspecialidad: " + appointment.getDoctor().getSpecialty(), bodyFont));
            document.add(doctorInfo);

            // Separator
            document.add(Chunk.NEWLINE);
            document.add(new Paragraph("____________________________________________________________"));
            document.add(Chunk.NEWLINE);

            // Patient Info
            Paragraph patientInfo = new Paragraph(
                    "Paciente: " + appointment.getPatient().getFirstName() + " "
                            + appointment.getPatient().getLastName(),
                    bodyFont);
            patientInfo.add(new Chunk("\nEmail: " + appointment.getPatient().getEmail(), bodyFont));
            patientInfo.add(new Chunk(
                    "\nFecha: " + appointment.getDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    bodyFont));
            document.add(patientInfo);

            document.add(Chunk.NEWLINE);

            // Diagnosis
            Paragraph diagnosisTitle = new Paragraph("Diagnóstico", subHeaderFont);
            document.add(diagnosisTitle);
            Paragraph diagnosisText = new Paragraph(
                    appointment.getDiagnosis() != null ? appointment.getDiagnosis() : "N/A", bodyFont);
            document.add(diagnosisText);

            document.add(Chunk.NEWLINE);

            // Treatment
            Paragraph treatmentTitle = new Paragraph("Tratamiento / Rx", subHeaderFont);
            document.add(treatmentTitle);
            Paragraph treatmentText = new Paragraph(
                    appointment.getTreatment() != null ? appointment.getTreatment() : "N/A", bodyFont);
            document.add(treatmentText);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            // Footer / Signature
            Paragraph footer = new Paragraph("__________________________", bodyFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);
            Paragraph signature = new Paragraph("Firma y Sello", smallFont);
            signature.setAlignment(Element.ALIGN_CENTER);
            document.add(signature);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
