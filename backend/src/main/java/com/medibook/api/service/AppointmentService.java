package com.medibook.api.service;

import com.medibook.api.dto.AppointmentDTO.AppointmentRequest;
import com.medibook.api.dto.AppointmentDTO.AppointmentResponse;

public interface AppointmentService {
    AppointmentResponse createAppointment(AppointmentRequest request);

    java.util.List<AppointmentResponse> getAllAppointments();

    AppointmentResponse updateStatus(Long id, com.medibook.api.model.AppointmentStatus status);

    AppointmentResponse updateDiagnosis(Long id, String diagnosis, String treatment);

    java.util.List<AppointmentResponse> getPatientHistory(String email);

    com.medibook.api.model.Appointment getAppointment(Long id);

    java.util.List<com.medibook.api.model.Appointment> getAppointmentsByDoctorAndDateRange(Long doctorId,
            java.time.LocalDateTime start, java.time.LocalDateTime end);
}
