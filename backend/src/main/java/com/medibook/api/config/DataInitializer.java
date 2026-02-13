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

                String adminEmail = "admin@medibook.com";
                String patientEmail = "paciente@medibook.com";

                Doctor demoDoctor = null;
                Patient demoPatient = null;
                boolean createdNewDoctor = false;

                // 1. Create OR Update DOCTOR (Admin) User
                Optional<User> adminUserOpt = userRepository.findByUsername(adminEmail);

                if (adminUserOpt.isPresent()) {
                        System.out.println("Admin user exists. Updating credentials and username...");
                        User adminUser = adminUserOpt.get();
                        adminUser.setPassword(passwordEncoder.encode("123456"));
                        adminUser.setUsername(adminEmail); // Ensure username is the email
                        userRepository.save(adminUser);
                        System.out.println("Usuario Admin actualizado: Password reset & Username sync.");

                        // Try to find the associated doctor to use for appointments if needed
                        // This assumes the relationship or email matches
                        Optional<Doctor> existingDoctor = doctorRepository.findByEmail(adminEmail);
                        if (existingDoctor.isPresent()) {
                                demoDoctor = existingDoctor.get();
                        }
                } else {
                        System.out.println("Creating Admin/Doctor user...");

                        // Check if doctor exists independently to avoid duplicates
                        Optional<Doctor> existingDoctor = doctorRepository.findByEmail(adminEmail);
                        if (existingDoctor.isPresent()) {
                                demoDoctor = existingDoctor.get();
                                System.out.println("Doctor entity already exists, using it.");
                        } else {
                                // Create Doctor Entity
                                demoDoctor = Doctor.builder()
                                                .firstName("Dr. House")
                                                .lastName("Demo")
                                                .email(adminEmail)
                                                .specialty("Diagnóstico")
                                                .bio("Especialista en casos complejos. 'Everybody lies'.")
                                                .consultationPrice(150.0)
                                                .workStart(LocalTime.of(9, 0))
                                                .workEnd(LocalTime.of(17, 0))
                                                .build();
                                demoDoctor = doctorRepository.save(demoDoctor);
                                createdNewDoctor = true;
                        }

                        // Create User Entity for Login
                        User adminUser = User.builder()
                                        .username(adminEmail)
                                        .password(passwordEncoder.encode("123456"))
                                        .role("ADMIN")
                                        .build();

                        userRepository.save(adminUser);
                }

                // 2. Create OR Update PATIENT User
                Optional<User> patientUserOpt = userRepository.findByUsername(patientEmail);

                if (patientUserOpt.isPresent()) {
                        System.out.println("Patient user exists. Updating credentials and username...");
                        User patientUser = patientUserOpt.get();
                        patientUser.setPassword(passwordEncoder.encode("123456"));
                        patientUser.setUsername(patientEmail); // Ensure username is the email
                        userRepository.save(patientUser);
                        System.out.println("Usuario Paciente actualizado: Password reset & Username sync.");

                        demoPatient = patientUser.getPatient();
                } else {
                        System.out.println("Creating Patient user...");

                        // Check if patient entity exists independently
                        Optional<Patient> existingPatient = patientRepository.findByEmail(patientEmail);
                        if (existingPatient.isPresent()) {
                                demoPatient = existingPatient.get();
                                System.out.println("Patient entity already exists, using it.");
                        } else {
                                // Create Patient Entity
                                demoPatient = Patient.builder()
                                                .firstName("Paciente")
                                                .lastName("Demo")
                                                .email(patientEmail)
                                                .phone("555-1234")
                                                .build();
                                demoPatient = patientRepository.save(demoPatient);
                        }

                        // Create User Entity linked to Patient
                        User patientUser = User.builder()
                                        .username(patientEmail)
                                        .password(passwordEncoder.encode("123456"))
                                        .role("PATIENT")
                                        .patient(demoPatient) // Linking patient
                                        .build();

                        userRepository.save(patientUser);
                }

                // 3. Create Sample Appointments (Only if we created the doctor/new data to
                // avoid duplicates on every restart)
                // Check if appointments already exist for this doctor/patient combo to be safe
                if (demoDoctor != null && demoPatient != null) {
                        long appointmentCount = appointmentRepository.count();
                        if (appointmentCount == 0 || createdNewDoctor) {
                                System.out.println("Creating sample appointments...");

                                // Past Appointment
                                Appointment pastAppt = Appointment.builder()
                                                .doctor(demoDoctor)
                                                .patient(demoPatient)
                                                .dateTime(LocalDateTime.now().minusDays(3).withHour(10).withMinute(0))
                                                .status(AppointmentStatus.COMPLETED)
                                                .diagnosis("Migraña tensional")
                                                .treatment("Ibuprofeno 400mg cada 8hs")
                                                .build();
                                appointmentRepository.save(pastAppt);

                                // Today's Appointment
                                Appointment todayAppt = Appointment.builder()
                                                .doctor(demoDoctor)
                                                .patient(demoPatient)
                                                .dateTime(LocalDateTime.now().plusHours(2)) // 2 hours from now
                                                .status(AppointmentStatus.CONFIRMED)
                                                .build();
                                appointmentRepository.save(todayAppt);

                                // Future Appointment
                                Appointment futureAppt = Appointment.builder()
                                                .doctor(demoDoctor)
                                                .patient(demoPatient)
                                                .dateTime(LocalDateTime.now().plusDays(5).withHour(15).withMinute(30))
                                                .status(AppointmentStatus.PENDING)
                                                .build();
                                appointmentRepository.save(futureAppt);
                        } else {
                                System.out.println("Appointments likely already exist. Skipping creation.");
                        }
                }

                System.out.println("Data Seeding Completed.");
        }
}
