package com.medibook.api.dto;

public record DoctorRequest(
        String firstName,
        String lastName,
        String specialty,
        String email,
        String bio,
        Double consultationPrice) {
}
