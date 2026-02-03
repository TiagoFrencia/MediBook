package com.medibook.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class MedibookApplication {

	public static void main(String[] args) {
		// CRÍTICO: Esto debe ir ANTES de SpringApplication.run
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

		SpringApplication.run(MedibookApplication.class, args);
	}
}
