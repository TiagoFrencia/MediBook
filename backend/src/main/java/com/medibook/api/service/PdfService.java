package com.medibook.api.service;

import com.medibook.api.model.Appointment;

public interface PdfService {
    byte[] generatePrescription(Appointment appointment);
}
