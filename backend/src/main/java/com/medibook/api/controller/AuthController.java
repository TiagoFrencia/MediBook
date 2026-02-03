package com.medibook.api.controller;

import com.medibook.api.dto.AuthRequest;
import com.medibook.api.dto.AuthResponse;
import com.medibook.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador de Autenticación.
 * Gestiona el inicio de sesión y registro de usuarios y pacientes.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private final com.medibook.api.repository.UserRepository userRepository;
    private final com.medibook.api.repository.PatientRepository patientRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    /**
     * Autentica a un usuario y genera un token JWT.
     * 
     * @param request Credenciales del usuario.
     * @return Token JWT y detalles del usuario.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername());

        Long patientId = user.getPatient() != null ? user.getPatient().getId() : null;

        logger.info("Usuario autenticado exitosamente: {}", request.getUsername());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .patientId(patientId)
                .build());
    }

    /**
     * Registra un nuevo paciente en el sistema.
     * 
     * @param request Datos del paciente a registrar.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getEmail()).isPresent()) {
            logger.warn("Intento de registro con email ya existente: {}", request.getEmail());
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // Check if patient exists
        var existingPatient = patientRepository.findByEmail(request.getEmail())
                .or(() -> patientRepository.findByDni(request.getDni()));

        com.medibook.api.model.Patient patient;

        if (existingPatient.isPresent()) {
            patient = existingPatient.get();
        } else {
            patient = com.medibook.api.model.Patient.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .dni(request.getDni())
                    .build();
            // Patient will be saved when User is saved due to CascadeType.ALL usually,
            // but if we are linking an existing one, we just set it.
            // CAREFUL: If patient exists, we just link. If not, we create.
        }

        var user = com.medibook.api.model.User.builder()
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("PATIENT")
                .patient(patient)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("Patient registered successfully");
    }

    @lombok.Data
    public static class RegisterRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String dni;
        private String password;
    }
}
