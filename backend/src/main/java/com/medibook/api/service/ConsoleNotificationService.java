package com.medibook.api.service;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servicio de notificación simulado que imprime en logs.
 * Útil para desarrollo y pruebas locales.
 */
@Service
@Primary
public class ConsoleNotificationService implements NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(ConsoleNotificationService.class);

    /**
     * Envía una confirmación (simulada en logs).
     * 
     * @param to      Destinatario.
     * @param subject Asunto.
     * @param body    Cuerpo del mensaje.
     */
    @Override
    public void sendConfirmation(String to, String subject, String body) {
        logger.info("===== EMAIL SIMULADO =====");
        logger.info("Para: {}", to);
        logger.info("Asunto: {}", subject);
        logger.info("Mensaje: {}", body);
        logger.info("==========================");
    }
}
