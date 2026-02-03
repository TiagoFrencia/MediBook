package com.medibook.api.service;

import com.medibook.api.dto.DoctorRequest;
import com.medibook.api.dto.DoctorResponse;
import com.medibook.api.model.Doctor;
import com.medibook.api.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementación del servicio de gestión de doctores.
 */
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorServiceImpl.class);

    private final DoctorRepository doctorRepository;

    /**
     * Crea un nuevo perfil de doctor.
     * 
     * @param request Datos del doctor.
     * @return Doctor creado.
     */
    @Override
    public DoctorResponse create(DoctorRequest request) {
        Doctor doctor = mapToEntity(request);
        Doctor savedDoctor = doctorRepository.save(doctor);
        logger.info("Doctor creado: {} {}", savedDoctor.getFirstName(), savedDoctor.getLastName());
        return mapToResponse(savedDoctor);
    }

    /**
     * Busca un doctor por su ID.
     * 
     * @param id ID del doctor.
     * @return Doctor encontrado.
     */
    @Override
    public DoctorResponse getById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return mapToResponse(doctor);
    }

    /**
     * Listado de todos los doctores.
     * 
     * @return Lista de doctores.
     */
    @Override
    public List<DoctorResponse> getAll() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza la información de un doctor.
     * 
     * @param id      ID por actualizar.
     * @param request Nuevos datos.
     * @return Doctor actualizado.
     */
    @Override
    public DoctorResponse update(Long id, DoctorRequest request) {
        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        existingDoctor.setFirstName(request.firstName());
        existingDoctor.setLastName(request.lastName());
        existingDoctor.setSpecialty(request.specialty());
        existingDoctor.setEmail(request.email());
        existingDoctor.setBio(request.bio());
        existingDoctor.setConsultationPrice(request.consultationPrice());

        Doctor updatedDoctor = doctorRepository.save(existingDoctor);
        logger.info("Doctor actualizado ID: {}", id);
        return mapToResponse(updatedDoctor);
    }

    /**
     * Elimina un doctor por ID.
     * 
     * @param id ID del doctor.
     */
    @Override
    public void delete(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found");
        }
        doctorRepository.deleteById(id);
        logger.warn("Doctor eliminado ID: {}", id);
    }

    private Doctor mapToEntity(DoctorRequest request) {
        return Doctor.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .specialty(request.specialty())
                .email(request.email())
                .bio(request.bio())
                .consultationPrice(request.consultationPrice())
                .build();
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getSpecialty(),
                doctor.getEmail(),
                doctor.getBio(),
                doctor.getConsultationPrice());
    }
}
