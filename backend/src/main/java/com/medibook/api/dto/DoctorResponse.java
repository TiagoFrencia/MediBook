package com.medibook.api.dto;

public record DoctorResponse(
        Long id,
        String firstName,
        String lastName,
        String specialty,
        String email,
        String bio,
        Double consultationPrice) {
}
