package com.medibook.repositories;

import com.medibook.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a WHERE a.doctor.id = :doctorId AND a.dateTime = :dateTime")
    boolean existsByDoctorIdAndDateTime(@Param("doctorId") Long doctorId, @Param("dateTime") LocalDateTime dateTime);
}
