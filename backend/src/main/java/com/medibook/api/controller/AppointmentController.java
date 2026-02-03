package com.medibook.api.controller;

import com.medibook.api.dto.AppointmentDTO.AppointmentRequest;
import com.medibook.api.dto.AppointmentDTO.AppointmentResponse;
import com.medibook.api.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para la gestión de citas médicas.
 * Permite crear, consultar, actualizar y descargar información sobre los
 * turnos.
 */
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    private final AppointmentService appointmentService;
    private final com.medibook.api.service.PdfService pdfService;
    private final com.medibook.api.repository.UserRepository userRepository;

    /**
     * Crea una nueva cita médica en el sistema.
     * 
     * @param request Datos de la solicitud de la cita.
     * @return Respuesta con los detalles de la cita creada.
     */
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.createAppointment(request);
        logger.info("Cita creada correctamente para el paciente: {}", request.patientEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Obtiene el historial de citas del usuario autenticado.
     * 
     * @param principal Usuario autenticado.
     * @return Lista de citas del usuario.
     */
    @org.springframework.web.bind.annotation.GetMapping("/my-appointments")
    public ResponseEntity<java.util.List<AppointmentResponse>> getMyAppointments(java.security.Principal principal) {
        return ResponseEntity.ok(appointmentService.getPatientHistory(principal.getName()));
    }

    /**
     * Permite a un paciente registrar su propia cita.
     * 
     * @param request   Datos de la solicitud.
     * @param principal Usuario autenticado.
     * @return Detalles de la cita creada.
     */
    @PostMapping("/book-me")
    public ResponseEntity<AppointmentResponse> bookMe(@RequestBody AppointmentRequest request,
            java.security.Principal principal) {
        var user = userRepository.findByUsername(principal.getName()).orElseThrow();
        var patient = user.getPatient();

        if (patient == null) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "User not linked to a patient");
        }

        AppointmentRequest safeRequest = new AppointmentRequest(
                request.doctorId(),
                request.dateTime(),
                patient.getFirstName() + " " + patient.getLastName(),
                patient.getEmail());

        AppointmentResponse response = appointmentService.createAppointment(safeRequest);
        logger.info("Paciente {} reservó una cita con doctor ID {}", patient.getEmail(), request.doctorId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @org.springframework.web.bind.annotation.GetMapping
    public ResponseEntity<java.util.List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam com.medibook.api.model.AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/diagnosis")
    public ResponseEntity<AppointmentResponse> updateDiagnosis(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @RequestBody com.medibook.api.dto.AppointmentDTO.DiagnosisRequest request) {
        return ResponseEntity.ok(appointmentService.updateDiagnosis(id, request.diagnosis(), request.treatment()));
    }

    @org.springframework.web.bind.annotation.GetMapping("/patient/{email}")
    public ResponseEntity<java.util.List<AppointmentResponse>> getPatientHistory(
            @org.springframework.web.bind.annotation.PathVariable String email) {
        return ResponseEntity.ok(appointmentService.getPatientHistory(email));
    }

    @org.springframework.web.bind.annotation.GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generatePdf(@org.springframework.web.bind.annotation.PathVariable Long id) {
        com.medibook.api.model.Appointment appointment = appointmentService.getAppointment(id);

        if (appointment.getStatus() != com.medibook.api.model.AppointmentStatus.COMPLETED) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Error: El PDF solo está disponible para citas completadas.");
        }

        byte[] pdfContent = pdfService.generatePrescription(appointment);

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE,
                        org.springframework.http.MediaType.APPLICATION_PDF_VALUE)
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=receta_medibook_" + id + ".pdf")
                .body(pdfContent);
    }

    @org.springframework.web.bind.annotation.GetMapping("/taken-slots")
    public ResponseEntity<java.util.List<java.time.LocalTime>> getTakenSlots(
            @org.springframework.web.bind.annotation.RequestParam Long doctorId,
            @org.springframework.web.bind.annotation.RequestParam String date) {

        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        java.time.LocalDateTime start = localDate.atStartOfDay();
        java.time.LocalDateTime end = localDate.atTime(java.time.LocalTime.MAX);

        java.util.List<com.medibook.api.model.Appointment> appointments = appointmentService
                .getAppointmentsByDoctorAndDateRange(doctorId, start, end);

        java.util.List<java.time.LocalTime> takenSlots = appointments.stream()
                .map(appointment -> appointment.getDateTime().toLocalTime())
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(takenSlots);
    }
}
