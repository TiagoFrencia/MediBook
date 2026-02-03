package com.medibook.api.service;

import com.medibook.api.model.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientService {
    List<Patient> getAllPatients();

    Patient createPatient(Patient patient);

    Patient updatePatient(Long id, Patient patientDetails);

    Optional<Patient> getPatientById(Long id);

    Optional<Patient> getPatientByDni(String dni);

    List<Patient> searchPatients(String query);
}
