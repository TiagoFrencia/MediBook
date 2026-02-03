package com.medibook.api.service.impl;

import com.medibook.api.model.Patient;
import com.medibook.api.repository.PatientRepository;
import com.medibook.api.service.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementación de la lógica de negocio de pacientes.
 */
@Service
public class PatientServiceImpl implements PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    /**
     * Obtiene todos los pacientes.
     * 
     * @return Lista completa de pacientes.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    /**
     * Registra un nuevo paciente.
     * 
     * @param patient Datos del paciente.
     * @return Paciente creado.
     */
    @Override
    @Transactional
    public Patient createPatient(Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado.");
        }
        Patient savedPatient = patientRepository.save(patient);
        logger.info("Paciente creado: {} {}", savedPatient.getFirstName(), savedPatient.getLastName());
        return savedPatient;
    }

    /**
     * Actualiza un paciente existente.
     * 
     * @param id             ID del paciente.
     * @param patientDetails Datos actualizados.
     * @return Paciente actualizado.
     */
    @Override
    @Transactional
    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + id));

        patient.setFirstName(patientDetails.getFirstName());
        patient.setLastName(patientDetails.getLastName());
        patient.setPhone(patientDetails.getPhone());
        patient.setDni(patientDetails.getDni());
        patient.setBirthDate(patientDetails.getBirthDate());
        patient.setAllergies(patientDetails.getAllergies());
        patient.setBloodType(patientDetails.getBloodType());
        // Email usually shouldn't be changed easily or needs validation, but keeping it
        // simple for now or ignoring if null
        // Assuming email is unique identifier for us, maybe we allow changing if not
        // taken.
        if (patientDetails.getEmail() != null && !patientDetails.getEmail().equals(patient.getEmail())) {
            if (patientRepository.findByEmail(patientDetails.getEmail()).isPresent()) {
                throw new RuntimeException("El email ya está registrado.");
            }
            patient.setEmail(patientDetails.getEmail());
        }

        Patient updated = patientRepository.save(patient);
        logger.info("Paciente actualizado ID: {}", id);
        return updated;
    }

    /**
     * Busca un paciente por ID.
     * 
     * @param id ID del paciente.
     * @return Paciente (Opcional).
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    /**
     * Busca un paciente por DNI.
     * 
     * @param dni Documento de identidad.
     * @return Paciente (Opcional).
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> getPatientByDni(String dni) {
        return patientRepository.findByDni(dni);
    }

    /**
     * Busca pacientes por coincidencia en nombre o email.
     * 
     * @param query Texto de búsqueda.
     * @return Lista de pacientes coincidentes.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Patient> searchPatients(String query) {
        return patientRepository.searchPatients(query);
    }
}
