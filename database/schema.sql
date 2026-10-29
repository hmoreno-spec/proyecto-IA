-- ====================================================================
-- ESQUEMA DE BASE DE DATOS: REGISTRO DE PRÁCTICAS DE ENFERMERÍA
-- Base de datos relacional para seguimiento de procedimientos clínicos formativos
-- Cumplimiento estricto: Cero almacenamiento de datos de pacientes (PII / PHI)
-- ====================================================================

-- 1. Tabla de Categorías / Áreas Clínicas
CREATE TABLE IF NOT EXISTS categorias (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'medical_services',
    color_hex VARCHAR(20) DEFAULT '#00685f',
    orden INT DEFAULT 0
);

-- 2. Tabla Principal de Procedimientos Registrados
CREATE TABLE IF NOT EXISTS procedimientos (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    categoria_id VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'practica', 'dominado')),
    notas TEXT,
    rotacion_lugar VARCHAR(150) DEFAULT 'Hospital General de Zona 48',
    semestre VARCHAR(50) DEFAULT '3er Semestre',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 3. Tabla de Historial de Evolución de Estados
CREATE TABLE IF NOT EXISTS historial_estados (
    id VARCHAR(36) PRIMARY KEY,
    procedimiento_id VARCHAR(36) NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacion TEXT,
    FOREIGN KEY (procedimiento_id) REFERENCES procedimientos(id) ON DELETE CASCADE
);

-- Índices para optimizar búsquedas y filtros
CREATE INDEX IF NOT EXISTS idx_procedimientos_estado ON procedimientos(estado);
CREATE INDEX IF NOT EXISTS idx_procedimientos_categoria ON procedimientos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_procedimientos_fecha ON procedimientos(fecha);
CREATE INDEX IF NOT EXISTS idx_procedimientos_nombre ON procedimientos(nombre);

-- ====================================================================
-- VISTAS DE ESTADÍSTICAS Y MÉTRICAS FORMATIVAS
-- ====================================================================

-- Vista de resumen del progreso general
CREATE VIEW IF NOT EXISTS vista_resumen_progreso AS
SELECT 
    COUNT(*) AS total_procedimientos,
    SUM(CASE WHEN estado = 'dominado' THEN 1 ELSE 0 END) AS dominados,
    SUM(CASE WHEN estado = 'practica' THEN 1 ELSE 0 END) AS en_practica,
    SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS por_practicar,
    ROUND((SUM(CASE WHEN estado = 'dominado' THEN 1.0 ELSE 0.0 END) / COUNT(*)) * 100, 1) AS porcentaje_dominio
FROM procedimientos;

-- Vista detallada de procedimientos con datos de categoría
CREATE VIEW IF NOT EXISTS vista_procedimientos_detallados AS
SELECT 
    p.id,
    p.nombre,
    p.categoria_id,
    c.nombre AS categoria_nombre,
    c.icono AS categoria_icono,
    c.color_hex AS categoria_color,
    p.fecha,
    p.estado,
    p.notas,
    p.rotacion_lugar,
    p.semestre,
    p.creado_en,
    p.actualizado_en
FROM procedimientos p
LEFT JOIN categorias c ON p.categoria_id = c.id
ORDER BY p.fecha DESC, p.creado_en DESC;
