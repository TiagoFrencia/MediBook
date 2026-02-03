## 🏥 MediBook  
### Plataforma SaaS de Gestión Médica Integral

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)

> **MediBook** es una plataforma **SaaS full-stack** orientada a la digitalización de centros médicos y consultorios.  
> Permite a pacientes y profesionales gestionar turnos de forma segura, eficiente y en tiempo real, optimizando la experiencia médica y reduciendo la carga administrativa.

---

## 📸 Vista General

![Landing](./screenshots/landing.png)  
*Landing institucional moderna y profesional.*

![Login](./screenshots/login.png)  
*Sistema de autenticación seguro.*

![Dashboard](./screenshots/dashboard.png)  
*Dashboard intuitivo para pacientes.*

![Booking](./screenshots/booking.png)  
*Reserva de turnos inteligente en tiempo real.*

---

## ✨ Funcionalidades Principales

- 🔐 **Seguridad Avanzada**
  - Autenticación JWT stateless
  - Control de acceso por roles (Admin / Patient)
  - Protección de endpoints con Spring Security

- 📅 **Gestión Inteligente de Turnos**
  - Cálculo dinámico de disponibilidad
  - Prevención de overbooking
  - Respeto de horarios médicos configurables

- 🎨 **Experiencia de Usuario**
  - Interfaz moderna y responsive
  - Validaciones en tiempo real
  - Diseño enfocado en usabilidad y claridad

---

## 🧱 Arquitectura y Stack Tecnológico

### Backend
- Java 21
- Spring Boot 3
- Spring Security + JWT
- Maven
- Arquitectura REST
- PostgreSQL

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Arquitectura basada en componentes

---

## 🗂️ Estructura del Proyecto

```
medibook/
├── backend/
├── frontend/
└── README.md
```

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
- Java 21
- Node.js 18+
- PostgreSQL
- Maven

### Clonar el repositorio
```bash
git clone https://github.com/TiagoFrencia/medibook.git
cd medibook
```

### Ejecutar Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Ejecutar Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Estado del Proyecto

✅ MVP funcional  
🚧 En evolución  
🔮 Roadmap:
- Gestión de profesionales médicos
- Historial clínico
- Notificaciones (email / WhatsApp)
- Panel administrativo avanzado
- Deploy productivo con Docker y Cloud

---

## 👤 Autor

**Tiago Frencia**  
Desarrollador Full Stack  

- 💻 GitHub: https://github.com/TiagoFrencia  
- 💼 LinkedIn: https://www.linkedin.com/in/tiagofrencia/
