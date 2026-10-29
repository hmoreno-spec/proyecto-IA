-- ====================================================================
-- DATOS INICIALES (SEED DATA): REGISTRO DE PRÁCTICAS DE ENFERMERÍA
-- 24 competencias clínicas estándar correspondientes al catálogo académico
-- ====================================================================

-- Inserción de Categorías
INSERT OR REPLACE INTO categorias (id, nombre, descripcion, icono, color_hex, orden) VALUES
('valoracion', 'Valoración', 'Evaluación clínica inicial, signos vitales y examen físico', 'vital_signs', '#00685f', 1),
('cuidados_basicos', 'Cuidados Básicos', 'Higiene, movilización, confort y nutrición asistida', 'healing', '#006c49', 2),
('farmacologia', 'Farmacología', 'Vías de administración, cálculo de dosis y dilución de medicamentos', 'medication', '#825100', 3),
('asepsia_quirurgica', 'Asepsia & Quirúrgico', 'Técnicas estériles, curaciones de heridas y sondajes', 'sanitizer', '#0b1c30', 4);

-- Inserción de los 24 Procedimientos Formativos
-- Distribución: 12 Dominados, 7 En práctica, 5 Por practicar

-- 1. Valoración
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-01', 'Toma de Signos Vitales', 'valoracion', '2026-10-24', 'dominado', 'Medición precisa de PA, FC, FR, temperatura axilar y oximetría de pulso.'),
('proc-02', 'Somatometría del Adulto', 'valoracion', '2026-10-22', 'dominado', 'Toma de peso, talla, IMC y perímetro abdominal con técnica correcta.'),
('proc-03', 'Glucemia Capilar por Tira Reactiva', 'valoracion', '2026-10-21', 'dominado', 'Punción lateral, asepsia adecuada y lectura confiable del glucómetro.'),
('proc-04', 'Electrocardiograma de 12 Derivaciones', 'valoracion', '2026-10-18', 'practica', 'Buena colocación de precordiales V1-V6; afianzar velocidad de registro y filtro.'),
('proc-05', 'Escala de Glasgow y Valoración Neurológica Pupilar', 'valoracion', '2026-10-15', 'practica', 'Identificación de respuesta motora y simetría pupilar. Reforzar reflejo fotomotor.'),
('proc-06', 'Valoración de Escala de Braden (Riesgo de UPP)', 'valoracion', '2026-10-10', 'pendiente', 'Pendiente de aplicar de forma autónoma en el pase de visita.');

-- 2. Cuidados Básicos
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-07', 'Higiene y Baño de Esponja en Cama', 'cuidados_basicos', '2026-10-23', 'dominado', 'Técnica céfalo-caudal cuidando temperatura del agua, pudor y cambios de lencería.'),
('proc-08', 'Cambios Posturales y Prevención de UPP', 'cuidados_basicos', '2026-10-22', 'dominado', 'Movilización cada 2 horas con cojines ergonómicos y técnica ergonómica corporal.'),
('proc-09', 'Alimentación Asistida y Cuidados de Sonda Nasogástrica', 'cuidados_basicos', '2026-10-19', 'dominado', 'Verificación de residuo gástrico y posición Fowler a 45 grados.'),
('proc-10', 'Higiene Bucal en Paciente Inconsciente', 'cuidados_basicos', '2026-10-17', 'dominado', 'Protección de vía aérea con gasas húmedas y aspiración suave.'),
('proc-11', 'Tendida de Cama Quirúrgica y Ocupada', 'cuidados_basicos', '2026-10-14', 'dominado', 'Confección de esquinas de mitra y doblado sin sacudir telas.'),
('proc-12', 'Manejo de Dispositivos de Inmovilización Terapéutica', 'cuidados_basicos', '2026-10-09', 'pendiente', 'Revisar protocolo institucional para sujeción suave y signos de perfusión distal.');

-- 3. Farmacología
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-13', 'Regla de los 10 Correctos en Medicación', 'farmacologia', '2026-10-25', 'dominado', 'Verificación rigurosa antes de cada preparación y administración.'),
('proc-14', 'Administración Vía Oral y Sublingual', 'farmacologia', '2026-10-23', 'dominado', 'Confirmación de deglución efectiva y tolerancia estomacal.'),
('proc-15', 'Inyección Intramuscular (Zona Dorso-glútea y Deltoides)', 'farmacologia', '2026-10-20', 'dominado', 'Técnica en Z para fármacos irritantes, aspiración previa sin retorno hemático.'),
('proc-16', 'Administración Subcutánea (Insulina y Heparina)', 'farmacologia', '2026-10-18', 'practica', 'Ángulo de 45° y 90° según panículo adiposo, rotación de sitios de punción.'),
('proc-17', 'Canalización de Vía Venosa Periférica (Catéter 20G/22G)', 'farmacologia', '2026-10-25', 'practica', 'Buena palpación venosa; afianzar fijación estéril y ángulo de entrada.'),
('proc-18', 'Cálculo de Goteo y Preparación de Infusiones IV', 'farmacologia', '2026-10-16', 'practica', 'Fórmula de macro y microgoteo; practicar programación de bombas de infusión.'),
('proc-19', 'Administración Intradérmica (Prueba de Mantoux/Tuberculina)', 'farmacologia', '2026-10-08', 'pendiente', 'Formación de la pápula característica sin aspirar.');

-- 4. Asepsia & Quirúrgico
INSERT OR REPLACE INTO procedimientos (id, nombre, categoria_id, fecha, estado, notas) VALUES
('proc-20', 'Lavado de Manos Clínico y Quirúrgico (OMS)', 'asepsia_quirurgica', '2026-10-25', 'dominado', 'Dominio de los 5 momentos y secuencia de frotado de 40 a 60 segundos.'),
('proc-21', 'Colocación de Guantes con Técnica Abierta y Cerrada', 'asepsia_quirurgica', '2026-10-24', 'dominado', 'Conservación estricta de esterilidad sin tocar superficie externa.'),
('proc-22', 'Curación Simple y Plana de Herida Quirúrgica', 'asepsia_quirurgica', '2026-10-20', 'practica', 'Limpieza del centro a la periferia con antiséptico y apósito oclusivo.'),
('proc-23', 'Sondaje Vesical Femenino y Masculino (Foley)', 'asepsia_quirurgica', '2026-10-12', 'practica', 'Introducción con lubricante estéril e inflado de balón con agua bidestilada.'),
('proc-24', 'Aspiración de Secreciones por Tubo Endotraqueal', 'asepsia_quirurgica', '2026-10-05', 'pendiente', 'Pendiente de realizar en unidad de cuidados intensivos o simulación.');
