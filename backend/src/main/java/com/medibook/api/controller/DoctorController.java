package com.medibook.api.controller;

import com.medibook.api.dto.DoctorRequest;
import com.medibook.api.dto.DoctorResponse;
import com.medibook.api.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para la gestión de doctores.
 * Mantiene el registro de los médicos, sus especialidades y disponibilidad.
 */
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private static final Logger logger = LoggerFactory.getLogger(DoctorController.class);

    private final DoctorService doctorService;

    /**
     * Registra un nuevo doctor en el sistema.
     * 
     * @param request Datos del nuevo doctor.
     * @return Detalles del doctor creado.
     */
    @PostMapping
    public ResponseEntity<DoctorResponse> create(@RequestBody DoctorRequest request) {
        DoctorResponse response = doctorService.create(request);
        logger.info("Doctor registrado: {} {}", request.firstName(), request.lastName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Obtiene la lista completa de doctores.
     * 
     * @return Lista de doctores.
     */
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAll() {
        return ResponseEntity.ok(doctorService.getAll());
    }

    /**
     * Busca un doctor por su ID.
     * 
     * @param id Identificador del doctor.
     * @return Detalles del doctor encontrado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getById(id));
    }

    /**
     * Actualiza la información de un doctor existente.
     * 
     * @param id      Identificador del doctor a actualizar.
     * @param request Nuevos datos del doctor.
     * @return Detalles del doctor actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponse> update(@PathVariable Long id, @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.update(id, request));
    }

    /**
     * Elimina un doctor del sistema.
     * 
     * @param id Identificador del doctor a eliminar.
     * @return Respuesta vacía (no content).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doctorService.delete(id);
        logger.info("Doctor eliminado con ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
