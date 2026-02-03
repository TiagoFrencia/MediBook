package com.medibook.api.service;

public interface NotificationService {
    void sendConfirmation(String to, String subject, String body);
}
