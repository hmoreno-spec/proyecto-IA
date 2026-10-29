# EnfermePráctica · Registro de Prácticas de Enfermería

Una aplicación web formativa, responsiva y diseñada con enfoque clínico (*mobile-first*) para que estudiantes de Enfermería lleven una bitácora estructurada de sus procedimientos, habilidades en proceso y competencias dominadas durante sus rotaciones y laboratorios.

---

## 🎯 Objetivo y Filosofía del Proyecto

Durante las prácticas clínicas (en hospitales, centros de salud y laboratorios de simulación), los estudiantes realizan diversos procedimientos asistenciales. **EnfermePráctica** proporciona una herramienta ágil y visual para:
- Registrar cada procedimiento realizado de forma reflexiva.
- Clasificar el nivel de autonomía: **Por practicar**, **En práctica** o **Dominado**.
- Monitorear el avance porcentual del catálogo académico de competencias.
- Filtrar y buscar procedimientos en segundos.

> [!IMPORTANT]
> **Compromiso Ético y de Privacidad (PRD):**
> Esta aplicación es exclusivamente para el seguimiento formativo personal de habilidades del estudiante.
> **No almacena datos de pacientes, no realiza diagnósticos ni prescripciones, y no sustituye la supervisión docente.**

---

## 🏗️ Arquitectura y Tecnologías

- **Frontend:** SPA moderna construida con HTML5 semántico, Tailwind CSS y Vanilla JavaScript modular (ES Modules).
- **Tipografía e Iconografía:** Google Fonts *Plus Jakarta Sans* y *Material Symbols Outlined*.
- **Base de Datos Local (Offline-first):** Persistencia en el navegador mediante **IndexedDB**, garantizando que los datos no se pierdan, funcionen sin conexión a internet y se puedan respaldar.
- **Esquema Relacional SQL:** Diseñado en [`database/schema.sql`](file:///C:/Users/hmoreno/.gemini/antigravity/scratch/proyecto-IA/database/schema.sql) y poblado con catálogo base en [`database/seed.sql`](file:///C:/Users/hmoreno/.gemini/antigravity/scratch/proyecto-IA/database/seed.sql).

---

## 🗄️ Esquema de la Base de Datos

```sql
-- Tablas principales
categorias (id, nombre, descripcion, icono, color_hex, orden)
procedimientos (id, nombre, categoria_id, fecha, estado, notas, rotacion_lugar, semestre, creado_en, actualizado_en)
historial_estados (id, procedimiento_id, estado_anterior, estado_nuevo, fecha_cambio, observacion)

-- Vistas analíticas
vista_resumen_progreso
vista_procedimientos_detallados
```

---

## 📱 Vistas Principales

1. **Inicio (Resumen Formativo):** Saludo personalizado, métricas bento de avance global, donut gauge de autonomía y resumen tri-status (*12 dominados, 7 en práctica, 5 por practicar*).
2. **Procedimientos (Búsqueda y Catálogo):** Buscador reactivo por texto, filtros por estado y por área (Valoración, Cuidados Básicos, Farmacología, Asepsia), y cambio de estado directo con un toque.
3. **Registrar Práctica:** Formulario optimizado para móviles con píldoras de sugerencias rápidas, fecha automática, selector de nivel de dominio y nota reflexiva.
4. **Mi Progreso:** Tablero analítico con gráfico interactivo y desglose de avance por área clínica.
5. **Gestor de Base de Datos:** Permite descargar una copia de seguridad en formato `.json` y restaurar los datos iniciales cuando se requiera.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalaciones complejas ni servidores pesados. Solo abre [`index.html`](file:///C:/Users/hmoreno/.gemini/antigravity/scratch/proyecto-IA/index.html) en tu navegador favorito o sirve la carpeta con cualquier servidor local:

```bash
# Opción 1: Abrir directamente con doble clic o en navegador
start index.html

# Opción 2: Usar cualquier servidor web estático (opcional)
npx serve .
# o con Python (si se instala):
python -m http.server 8000
```
