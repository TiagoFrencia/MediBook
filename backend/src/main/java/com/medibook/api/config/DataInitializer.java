package com.medibook.api.config;

import com.medibook.api.model.*;
import com.medibook.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Starting Data Seeding...");

        // 1. Create DOCTOR (Admin) User
        String adminEmail = "admin@medibook.com";
        Optional<User> adminUserOpt = userRepository.findByUsername(adminEmail);

        if (adminUserOpt.isPresent()) {
            System.out.println("Datos ya cargados (Admin existe). Skipping seeding.");
        } else {
            System.out.println("Creating Admin/Doctor user...");

            // Create Doctor Entity
            Doctor doctor = Doctor.builder()
                    .firstName("Dr. House")
                    .lastName("Demo")
                    .email(adminEmail)
                    .specialty("Diagnóstico")
                    .bio("Especialista en casos complejos. 'Everybody lies'.")
                    .consultationPrice(150.0)
                    .workStart(LocalTime.of(9, 0))
                    .workEnd(LocalTime.of(17, 0))
                    .build();

            doctor = doctorRepository.save(doctor);

            // Create User Entity for Login
            User adminUser = User.builder()
                    .username(adminEmail)
                    .password(passwordEncoder.encode("123456"))
                    .role("ADMIN") // Role ADMIN / DOCTOR
                    // Note: In this architecture, User doesn't seem to link directly to Doctor,
                    // but they share email. If User has a doctor field, it should be set here.
                    .build();

            userRepository.save(adminUser);

            // 2. Create PATIENT User
            String patientEmail = "paciente@medibook.com";
            if (userRepository.findByUsername(patientEmail).isEmpty()) {
                System.out.println("Creating Patient user...");

                // Create Patient Entity
                Patient patient = Patient.builder()
                        .firstName("Paciente")
                        .lastName("Demo")
                        .email(patientEmail)
                        .phone("555-1234")
                        .build();

                patient = patientRepository.save(patient);

                // Create User Entity linked to Patient
                User patientUser = User.builder()
                        .username(patientEmail)
                        .password(passwordEncoder.encode("123456"))
                        .role("PATIENT")
                        .patient(patient) // Linking patient
                        .build();

                userRepository.save(patientUser);

                // 3. Create Sample Appointments
                System.out.println("Creating sample appointments...");

                // Past Appointment
                Appointment pastAppt = Appointment.builder()
                        .doctor(doctor)
                        .patient(patient)
                        .dateTime(LocalDateTime.now().minusDays(3).withHour(10).withMinute(0))
                        .status(AppointmentStatus.COMPLETED)
                        .diagnosis("Migraña tensional")
                        .treatment("Ibuprofeno 400mg cada 8hs")
                        .build();
                appointmentRepository.save(pastAppt);

                // Today's Appointment
                Appointment todayAppt = Appointment.builder()
                        .doctor(doctor)
                        .patient(patient)
                        .dateTime(LocalDateTime.now().plusHours(2)) // 2 hours from now
                        .status(AppointmentStatus.CONFIRMED)
                        .build();
                appointmentRepository.save(todayAppt);

                // Future Appointment
                Appointment futureAppt = Appointment.builder()
                        .doctor(doctor)
                        .patient(patient)
                        .dateTime(LocalDateTime.now().plusDays(5).withHour(15).withMinute(30))
                        .status(AppointmentStatus.PENDING)
                        .build();
                appointmentRepository.save(futureAppt);
            }
        }
        System.out.println("Data Seeding Completed.");
    }
}
