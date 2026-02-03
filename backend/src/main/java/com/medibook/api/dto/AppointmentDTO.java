package com.medibook.api.dto;

import com.medibook.api.model.AppointmentStatus;
import java.time.LocalDateTime;

public class AppointmentDTO {

        public record AppointmentRequest(
                        Long doctorId,
                        LocalDateTime dateTime,
                        String patientName,
                        String patientEmail) {
        }

        public record AppointmentResponse(
                        Long id,
                        LocalDateTime dateTime,
                        String patientName,
                        String patientEmail,
                        AppointmentStatus status,
                        String doctorName,
                        String doctorSpecialty,
                        String diagnosis,
                        String treatment) {
        }

        public record DiagnosisRequest(
                        String diagnosis,
                        String treatment) {
        }
}
