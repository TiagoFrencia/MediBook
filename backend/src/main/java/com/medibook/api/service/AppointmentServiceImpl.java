package com.medibook.api.service;

import com.medibook.api.dto.AppointmentDTO.AppointmentRequest;
import com.medibook.api.dto.AppointmentDTO.AppointmentResponse;
import com.medibook.api.model.Appointment;
import com.medibook.api.model.AppointmentStatus;
import com.medibook.api.model.Doctor;
import com.medibook.api.repository.AppointmentRepository;
import com.medibook.api.repository.DoctorRepository;
import com.medibook.api.repository.PatientRepository;
import com.medibook.api.model.Patient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementación de la lógica de negocio para la gestión de citas.
 * Maneja la creación, consulta y actualización de turnos médicos.
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

        private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

        private final AppointmentRepository appointmentRepository;
        private final DoctorRepository doctorRepository;
        private final PatientRepository patientRepository;
        private final NotificationService notificationService;

        public AppointmentServiceImpl(
                        AppointmentRepository appointmentRepository,
                        DoctorRepository doctorRepository,
                        PatientRepository patientRepository,
                        NotificationService notificationService) {
                this.appointmentRepository = appointmentRepository;
                this.doctorRepository = doctorRepository;
                this.patientRepository = patientRepository;
                this.notificationService = notificationService;
        }

        /**
         * Crea una nueva cita validando disponibilidad y reglas de negocio.
         * 
         * @param request Datos de la solicitud.
         * @return Detalles de la cita creada.
         */
        @Override
        @Transactional
        public AppointmentResponse createAppointment(AppointmentRequest request) {
                if (request.dateTime().isBefore(java.time.LocalDateTime.now())) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.BAD_REQUEST,
                                        "Error: No puedes agendar citas en el pasado.");
                }

                if (appointmentRepository.existsByDoctorIdAndDateTime(request.doctorId(), request.dateTime())) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.CONFLICT,
                                        "Error: El doctor ya tiene una cita agendada en ese horario.");
                }

                Doctor doctor = doctorRepository.findById(request.doctorId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Doctor not found with ID: " + request.doctorId()));

                java.time.LocalTime appointmentTime = request.dateTime().toLocalTime();
                if (appointmentTime.isBefore(doctor.getWorkStart()) || appointmentTime.isAfter(doctor.getWorkEnd())) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.BAD_REQUEST,
                                        "El doctor solo atiende de " + doctor.getWorkStart() + " a "
                                                        + doctor.getWorkEnd());
                }

                // Find or Create Patient
                Patient patient = patientRepository.findByEmail(request.patientEmail())
                                .orElseGet(() -> {
                                        String[] nameParts = request.patientName().trim().split(" ", 2);
                                        String firstName = nameParts[0];
                                        String lastName = nameParts.length > 1 ? nameParts[1] : "-";

                                        return patientRepository.save(Patient.builder()
                                                        .firstName(firstName)
                                                        .lastName(lastName)
                                                        .email(request.patientEmail())
                                                        .build());
                                });

                Appointment appointment = Appointment.builder()
                                .dateTime(request.dateTime())
                                .patient(patient)
                                .doctor(doctor)
                                .status(AppointmentStatus.CONFIRMED) // Default as per requirements
                                .build();

                Appointment savedAppointment = appointmentRepository.save(appointment);
                logger.info("Cita creada ID: {} para Paciente: {} con Doctor ID: {}", savedAppointment.getId(),
                                savedAppointment.getPatient().getEmail(), doctor.getId());

                notificationService.sendConfirmation(
                                savedAppointment.getPatient().getEmail(),
                                "Confirmación de Cita - MediBook",
                                "Hola " + savedAppointment.getPatient().getFirstName() + ", tu cita con el Dr. "
                                                + doctor.getFirstName() + " " + doctor.getLastName()
                                                + " está confirmada para el " + savedAppointment.getDateTime() + ".");

                return new AppointmentResponse(
                                savedAppointment.getId(),
                                savedAppointment.getDateTime(),
                                savedAppointment.getPatient().getFirstName() + " "
                                                + savedAppointment.getPatient().getLastName(),
                                savedAppointment.getPatient().getEmail(),
                                savedAppointment.getStatus(),
                                doctor.getFirstName() + " " + doctor.getLastName(),
                                doctor.getSpecialty(),
                                savedAppointment.getDiagnosis(),
                                savedAppointment.getTreatment());
        }

        /**
         * Obtiene todas las citas registradas en el sistema.
         * 
         * @return Lista de todas las citas.
         */
        @Override
        @Transactional(readOnly = true)
        public java.util.List<AppointmentResponse> getAllAppointments() {
                return appointmentRepository.findAll().stream()
                                .map(appointment -> new AppointmentResponse(
                                                appointment.getId(),
                                                appointment.getDateTime(),
                                                appointment.getPatient().getFirstName() + " "
                                                                + appointment.getPatient().getLastName(),
                                                appointment.getPatient().getEmail(),
                                                appointment.getStatus(),
                                                appointment.getDoctor().getFirstName() + " "
                                                                + appointment.getDoctor().getLastName(),
                                                appointment.getDoctor().getSpecialty(),
                                                appointment.getDiagnosis(),
                                                appointment.getTreatment()))
                                .toList();
        }

        /**
         * Actualiza el estado de una cita.
         * 
         * @param id     ID de la cita.
         * @param status Nuevo estado.
         * @return Cita actualizada.
         */
        @Override
        @Transactional
        public AppointmentResponse updateStatus(Long id, AppointmentStatus status) {
                Appointment appointment = appointmentRepository.findById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND,
                                                "Appointment not found with ID: " + id));

                appointment.setStatus(status);
                Appointment savedAppointment = appointmentRepository.save(appointment);
                logger.info("Estado de cita ID {} actualizado a {}", id, status);

                return new AppointmentResponse(
                                savedAppointment.getId(),
                                savedAppointment.getDateTime(),
                                savedAppointment.getPatient().getFirstName() + " "
                                                + savedAppointment.getPatient().getLastName(),
                                savedAppointment.getPatient().getEmail(),
                                savedAppointment.getStatus(),
                                savedAppointment.getDoctor().getFirstName() + " "
                                                + savedAppointment.getDoctor().getLastName(),
                                savedAppointment.getDoctor().getSpecialty(),
                                savedAppointment.getDiagnosis(),
                                savedAppointment.getTreatment());
        }

        /**
         * Actualiza el diagnóstico y tratamiento de una cita (Consulta finalizada).
         * 
         * @param id        ID de la cita.
         * @param diagnosis Descripción del diagnóstico.
         * @param treatment Tratamiento prescrito.
         * @return Cita actualizada.
         */
        @Override
        @Transactional
        public AppointmentResponse updateDiagnosis(Long id, String diagnosis, String treatment) {
                Appointment appointment = appointmentRepository.findById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND,
                                                "Appointment not found with ID: " + id));

                appointment.setDiagnosis(diagnosis);
                appointment.setTreatment(treatment);
                Appointment savedAppointment = appointmentRepository.save(appointment);
                logger.info("Diagnóstico registrado para cita ID {}", id);

                return new AppointmentResponse(
                                savedAppointment.getId(),
                                savedAppointment.getDateTime(),
                                savedAppointment.getPatient().getFirstName() + " "
                                                + savedAppointment.getPatient().getLastName(),
                                savedAppointment.getPatient().getEmail(),
                                savedAppointment.getStatus(),
                                savedAppointment.getDoctor().getFirstName() + " "
                                                + savedAppointment.getDoctor().getLastName(),
                                savedAppointment.getDoctor().getSpecialty(),
                                savedAppointment.getDiagnosis(),
                                savedAppointment.getTreatment());
        }

        @Override
        @Transactional(readOnly = true)
        public java.util.List<AppointmentResponse> getPatientHistory(String email) {
                return appointmentRepository.findByPatient_EmailOrderByDateTimeDesc(email).stream()
                                .map(appointment -> new AppointmentResponse(
                                                appointment.getId(),
                                                appointment.getDateTime(),
                                                appointment.getPatient().getFirstName() + " "
                                                                + appointment.getPatient().getLastName(),
                                                appointment.getPatient().getEmail(),
                                                appointment.getStatus(),
                                                appointment.getDoctor().getFirstName() + " "
                                                                + appointment.getDoctor().getLastName(),
                                                appointment.getDoctor().getSpecialty(),
                                                appointment.getDiagnosis(),
                                                appointment.getTreatment()))
                                .toList();
        }

        @Override
        public com.medibook.api.model.Appointment getAppointment(Long id) {
                return appointmentRepository.findById(id)
                                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND,
                                                "Appointment not found with ID: " + id));
        }

        @Override
        @Transactional(readOnly = true)
        public java.util.List<com.medibook.api.model.Appointment> getAppointmentsByDoctorAndDateRange(Long doctorId,
                        java.time.LocalDateTime start, java.time.LocalDateTime end) {
                return appointmentRepository.findByDoctorIdAndDateTimeBetween(doctorId, start, end);
        }
}
