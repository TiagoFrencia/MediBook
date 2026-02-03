package com.medibook.api.controller;

import com.medibook.api.model.Patient;
import com.medibook.api.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para la gestión de pacientes.
 * Permite buscar, crear, actualizar y listar pacientes.
 */
@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private static final Logger logger = LoggerFactory.getLogger(PatientController.class);

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    /**
     * Obtiene la lista de todos los pacientes registrados.
     * 
     * @return Lista de pacientes.
     */
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    /**
     * Busca pacientes por nombre, apellido o DNI/email.
     * 
     * @param query Texto de búsqueda.
     * @return Lista de pacientes que coinciden con la búsqueda.
     */
    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String query) {
        return patientService.searchPatients(query);
    }

    /**
     * Crea un nuevo paciente en el sistema.
     * 
     * @param patient Datos del paciente.
     * @return Paciente creado.
     */
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        Patient newPatient = patientService.createPatient(patient);
        logger.info("Nuevo paciente registrado: {} {} (Email: {})", newPatient.getFirstName(), newPatient.getLastName(),
                newPatient.getEmail());
        return newPatient;
    }

    /**
     * Actualiza los datos de un paciente existente.
     * 
     * @param id             ID del paciente.
     * @param patientDetails Nuevos datos del paciente.
     * @return Paciente actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        try {
            return ResponseEntity.ok(patientService.updatePatient(id, patientDetails));
        } catch (RuntimeException e) {
            logger.error("Error al actualizar paciente ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtiene los detalles de un paciente específico.
     * 
     * @param id Identificador del paciente.
     * @return Detalles del paciente.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
