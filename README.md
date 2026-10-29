# EnfermePráctica · Registro de Prácticas de Enfermería

Una aplicación web formativa, responsiva y diseñada con enfoque clínico (*mobile-first*) para que estudiantes de Enfermería lleven una bitácora estructurada de sus procedimientos, habilidades en proceso y competencias dominadas durante sus rotaciones y laboratorios.

---

## 🎯 Objetivo y Filosofía del Proyecto

Durante las prácticas clínicas (en hospitales, centros de salud y laboratorios de simulación), los estudiantes realizan diversos procedimientos asistenciales. **EnfermePráctica** proporciona una herramienta ágil y visual para:
- Registrar cada procedimiento realizado de forma reflexiva y personal.
- Comenzar con **0% de progreso real**: 24 procedimientos del catálogo académico por practicar, sin datos ni fechas ficticias.
- Personalizar el perfil del estudiante: nombre, semestre, institución educativa y lugar de rotación.
- Clasificar el nivel de autonomía: **Por practicar**, **En práctica** o **Dominado**.
- Monitorear el avance porcentual del catálogo académico de competencias en tiempo real.
- Filtrar, buscar, editar y eliminar procedimientos según las prácticas reales ejecutadas.

> [!IMPORTANT]
> **Compromiso Ético y de Privacidad (PRD):**
> Esta aplicación es exclusivamente para el seguimiento formativo personal de habilidades del estudiante.
> **No almacena datos de pacientes, no realiza diagnósticos ni prescripciones, y no sustituye la supervisión docente.**

---

## 🏗️ Arquitectura y Tecnologías

- **Frontend:** SPA moderna construida con HTML5 semántico, Tailwind CSS y Vanilla JavaScript modular (ES Modules).
- **Tipografía e Iconografía:** Google Fonts *Plus Jakarta Sans* y *Material Symbols Outlined*.
- **Base de Datos Local (Offline-first):** Persistencia en el navegador mediante **IndexedDB** (`EnfermePracticaDB` v2), garantizando que los datos no se pierdan al cerrar el navegador, funcionen sin conexión y se puedan respaldar/restaurar.
- **Esquema Relacional SQL:** Diseñado en [`database/schema.sql`](file:///C:/Users/hmoreno/.gemini/antigravity/scratch/proyecto-IA/database/schema.sql) y catálogo limpio oficial en [`database/seed.sql`](file:///C:/Users/hmoreno/.gemini/antigravity/scratch/proyecto-IA/database/seed.sql).

---

## 🗄️ Esquema de la Base de Datos

```sql
-- Tablas principales
perfil_estudiante (id, nombre, semestre, institucion, lugar_practica, actualizado_en)
categorias (id, nombre, descripcion, icono, color_hex, orden)
procedimientos (id, nombre, categoria_id, fecha, estado, notas, rotacion_lugar, semestre, creado_en, actualizado_en)
historial_estados (id, procedimiento_id, estado_anterior, estado_nuevo, fecha_cambio, observacion)

-- Vistas analíticas
vista_resumen_progreso
vista_procedimientos_detallados
```

---

## 📱 Vistas y Funciones Principales

1. **Inicio (Resumen Formativo Real):** Saludo y perfil dinámico del estudiante, métricas bento con medidor circular (inicia en 0% con 24 pendientes), barra tri-status y accesos directos.
2. **Procedimientos (Catálogo y Búsqueda):** Buscador reactivo por texto, filtros por estado (*Todos, Dominados, En práctica, Por practicar*) y por área clínica. Botones para modificar estado al instante, editar notas/fechas y eliminar registros erróneos.
3. **Registrar Práctica:** Formulario con sugerencias rápidas, fecha actual automática, selector táctil de estado y notas reflexivas (sin datos de pacientes).
4. **Mi Progreso:** Tablero analítico con gráfico donut dinámico, desglose por área clínica y botón para imprimir reporte de prácticas para entregar a tutores clínicos.
5. **Perfil Personalizable:** Modal interactivo para configurar nombre del estudiante, semestre académico (1° al 10°), institución educativa y sede de prácticas.
6. **Gestor de Base de Datos:** Permite descargar copia de seguridad en formato `.json`, restaurar respaldos y reiniciar el progreso a cero (24 por practicar) con confirmación de seguridad.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalaciones complejas ni servidores externos. Solo abre [`index.html`](file:///C:/Users/hmoreno/.gemini/antigravity/scratch/proyecto-IA/index.html) en tu navegador favorito o sírvelo con cualquier servidor local o en GitHub Pages:

```bash
# Opción 1: Abrir directamente con doble clic o en navegador
start index.html

# Opción 2: Usar cualquier servidor web estático (opcional)
npx serve .
# o con Python:
python -m http.server 8000
```
