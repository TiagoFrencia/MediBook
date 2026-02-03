package com.medibook.api.repository;

import com.medibook.api.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByDni(String dni);

    @Query("SELECT p FROM Patient p WHERE lower(p.firstName) LIKE lower(concat('%', :query, '%')) OR lower(p.lastName) LIKE lower(concat('%', :query, '%')) OR p.dni LIKE concat('%', :query, '%')")
    List<Patient> searchPatients(@Param("query") String query);
}
