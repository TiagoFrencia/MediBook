package com.medibook.api.service;

import com.medibook.api.dto.DoctorRequest;
import com.medibook.api.dto.DoctorResponse;
import java.util.List;

public interface DoctorService {
    DoctorResponse create(DoctorRequest request);

    DoctorResponse getById(Long id);

    List<DoctorResponse> getAll();

    DoctorResponse update(Long id, DoctorRequest request);

    void delete(Long id);
}
