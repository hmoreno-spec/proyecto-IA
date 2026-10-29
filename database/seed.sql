-- ====================================================================
-- DATOS INICIALES (SEED DATA): REGISTRO DE PRÁCTICAS DE ENFERMERÍA
-- Catálogo académico oficial de 24 competencias formativas
-- Estado inicial: 0% dominados, 0% en práctica, 24 por practicar (100% pendientes)
-- Cero fechas ficticias, cero notas ficticias
-- ====================================================================

-- 1. Perfil Inicial Vacío (Personalizable por el estudiante)
INSERT OR REPLACE INTO perfil_estudiante (id, nombre, semestre, institucion, lugar_practica) VALUES
('principal', '', '1er Semestre', '', '');

-- 2. Inserción de Categorías
INSERT OR REPLACE INTO categorias (id, nombre, descripcion, icono, color_hex, orden) VALUES
('valoracion', 'Valoración', 'Evaluación clínica inicial, signos vitales y examen físico', 'vital_signs', '#00685f', 1),
('cuidados_basicos', 'Cuidados Básicos', 'Higiene, movilización, confort y nutrición asistida', 'healing', '#006c49', 2),
('farmacologia', 'Farmacología', 'Vías de administración, cálculo de dosis y dilución de medicamentos', 'medication', '#825100', 3),
('asepsia_quirurgica', 'Asepsia & Quirúrgico', 'Técnicas estériles, curaciones de heridas y sondajes', 'sanitizer', '#0b1c30', 4);

-- 3. Catálogo Académico de 24 Procedimientos Oficiales
-- Todos inician en estado 'pendiente', sin fechas ni notas ficticias

-- Área 1: Valoración (6 procedimientos)
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-01', 'Toma de Signos Vitales', 'valoracion', NULL, 'pendiente', ''),
('proc-02', 'Somatometría del Adulto', 'valoracion', NULL, 'pendiente', ''),
('proc-03', 'Glucemia Capilar por Tira Reactiva', 'valoracion', NULL, 'pendiente', ''),
('proc-04', 'Electrocardiograma de 12 Derivaciones', 'valoracion', NULL, 'pendiente', ''),
('proc-05', 'Escala de Glasgow y Valoración Neurológica Pupilar', 'valoracion', NULL, 'pendiente', ''),
('proc-06', 'Valoración de Escala de Braden (Riesgo de UPP)', 'valoracion', NULL, 'pendiente', '');

-- Área 2: Cuidados Básicos (6 procedimientos)
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-07', 'Higiene y Baño de Esponja en Cama', 'cuidados_basicos', NULL, 'pendiente', ''),
('proc-08', 'Cambios Posturales y Prevención de UPP', 'cuidados_basicos', NULL, 'pendiente', ''),
('proc-09', 'Alimentación Asistida y Cuidados de Sonda Nasogástrica', 'cuidados_basicos', NULL, 'pendiente', ''),
('proc-10', 'Higiene Bucal en Paciente Inconsciente', 'cuidados_basicos', NULL, 'pendiente', ''),
('proc-11', 'Tendida de Cama Quirúrgica y Ocupada', 'cuidados_basicos', NULL, 'pendiente', ''),
('proc-12', 'Manejo de Dispositivos de Inmovilización Terapéutica', 'cuidados_basicos', NULL, 'pendiente', '');

-- Área 3: Farmacología (7 procedimientos)
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-13', 'Regla de los 10 Correctos en Medicación', 'farmacologia', NULL, 'pendiente', ''),
('proc-14', 'Administración Vía Oral y Sublingual', 'farmacologia', NULL, 'pendiente', ''),
('proc-15', 'Inyección Intramuscular (Zona Dorso-glútea y Deltoides)', 'farmacologia', NULL, 'pendiente', ''),
('proc-16', 'Administración Subcutánea (Insulina y Heparina)', 'farmacologia', NULL, 'pendiente', ''),
('proc-17', 'Canalización de Vía Venosa Periférica (Catéter 20G/22G)', 'farmacologia', NULL, 'pendiente', ''),
('proc-18', 'Cálculo de Goteo y Preparación de Infusiones IV', 'farmacologia', NULL, 'pendiente', ''),
('proc-19', 'Administración Intradérmica (Prueba de Mantoux/Tuberculina)', 'farmacologia', NULL, 'pendiente', '');

-- Área 4: Asepsia & Quirúrgico (5 procedimientos)
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-20', 'Lavado de Manos Clínico y Quirúrgico (OMS)', 'asepsia_quirurgica', NULL, 'pendiente', ''),
('proc-21', 'Colocación de Guantes con Técnica Abierta y Cerrada', 'asepsia_quirurgica', NULL, 'pendiente', ''),
('proc-22', 'Curación Simple y Plana de Herida Quirúrgica', 'asepsia_quirurgica', NULL, 'pendiente', ''),
('proc-23', 'Sondaje Vesical Femenino y Masculino (Foley)', 'asepsia_quirurgica', NULL, 'pendiente', ''),
('proc-24', 'Aspiración de Secreciones por Tubo Endotraqueal', 'asepsia_quirurgica', NULL, 'pendiente', '');
