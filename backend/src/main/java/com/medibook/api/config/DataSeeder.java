package com.medibook.api.config;

import com.medibook.api.model.Doctor;
import com.medibook.api.model.User;
import com.medibook.api.repository.DoctorRepository;
import com.medibook.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final com.medibook.api.repository.PatientRepository patientRepository;
    private final com.medibook.api.repository.AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(DoctorRepository doctorRepository, UserRepository userRepository,
            com.medibook.api.repository.PatientRepository patientRepository,
            com.medibook.api.repository.AppointmentRepository appointmentRepository,
            PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Cargar Doctores si no existen
        if (doctorRepository.count() == 0) {
            Doctor house = Doctor.builder()
                    .firstName("Gregory")
                    .lastName("House")
                    .specialty("Diagnóstico")
                    .email("house@medibook.com")
                    .bio("Especialista en enfermedades infecciosas y nefrología.")
                    .consultationPrice(200.00)
                    .workStart(LocalTime.of(8, 0))
                    .workEnd(LocalTime.of(14, 0))
                    .build();

            Doctor grey = Doctor.builder()
                    .firstName("Meredith")
                    .lastName("Grey")
                    .specialty("Cirugía General")
                    .email("grey@medibook.com")
                    .bio("Jefa de cirugía general en el Grey Sloan.")
                    .consultationPrice(150.00)
                    .workStart(LocalTime.of(9, 0))
                    .workEnd(LocalTime.of(17, 0))
                    .build();

            Doctor shepherd = Doctor.builder()
                    .firstName("Derek")
                    .lastName("Shepherd")
                    .specialty("Neurocirugía")
                    .email("shepherd@medibook.com")
                    .bio("Especialista en tumores cerebrales.")
                    .consultationPrice(300.00)
                    .workStart(LocalTime.of(10, 0))
                    .workEnd(LocalTime.of(16, 0))
                    .build();

            doctorRepository.save(house);
            doctorRepository.save(grey);
            doctorRepository.save(shepherd);

            System.out.println("✅ Doctores cargados en la Base de Datos.");

            // 2. Cargar Pacientes
            if (patientRepository.count() == 0) {
                com.medibook.api.model.Patient alfredo = com.medibook.api.model.Patient.builder()
                        .firstName("Alfredo")
                        .lastName("García")
                        .email("alfredo@email.com")
                        .phone("555-0011")
                        .dni("12345678A")
                        .birthDate(java.time.LocalDate.of(1980, 5, 20))
                        .allergies("Penicilina")
                        .bloodType("O+")
                        .build();

                com.medibook.api.model.Patient maria = com.medibook.api.model.Patient.builder()
                        .firstName("María")
                        .lastName("López")
                        .email("maria@email.com")
                        .phone("555-0022")
                        .dni("87654321B")
                        .birthDate(java.time.LocalDate.of(1992, 11, 15))
                        .allergies("Ninguna")
                        .bloodType("A-")
                        .build();

                patientRepository.save(alfredo);
                patientRepository.save(maria);
                System.out.println("✅ Pacientes de prueba cargados.");

                // 3. Crear Citas para los Pacientes con los Doctores creados
                // Cita para Alfredo con House mañana a las 10:00
                com.medibook.api.model.Appointment app1 = com.medibook.api.model.Appointment.builder()
                        .dateTime(java.time.LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0))
                        .patient(alfredo)
                        .doctor(house)
                        .status(com.medibook.api.model.AppointmentStatus.CONFIRMED)
                        .build();

                // Cita para María con Grey pasado mañana a las 12:00
                com.medibook.api.model.Appointment app2 = com.medibook.api.model.Appointment.builder()
                        .dateTime(java.time.LocalDateTime.now().plusDays(2).withHour(12).withMinute(0).withSecond(0))
                        .patient(maria)
                        .doctor(grey)
                        .status(com.medibook.api.model.AppointmentStatus.CONFIRMED)
                        .build();

                // Cita pasada para Alfredo con Shepherd (ayer) - completada
                com.medibook.api.model.Appointment app3 = com.medibook.api.model.Appointment.builder()
                        .dateTime(java.time.LocalDateTime.now().minusDays(1).withHour(11).withMinute(0).withSecond(0))
                        .patient(alfredo)
                        .doctor(shepherd)
                        .status(com.medibook.api.model.AppointmentStatus.COMPLETED)
                        .diagnosis("Migraña tensional")
                        .treatment("Ibuprofeno 600mg cada 8 horas")
                        .build();

                appointmentRepository.save(app1);
                appointmentRepository.save(app2);
                appointmentRepository.save(app3);
                System.out.println("✅ Citas de prueba cargadas.");
            }
        }

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Usuario Admin creado: admin / admin123");
        }
    }
}
