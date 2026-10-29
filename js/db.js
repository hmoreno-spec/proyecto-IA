/**
 * db.js - Capa de Base de Datos y Persistencia Local (IndexedDB)
 * Implementa el esquema relacional definido en database/schema.sql
 * Almacenamiento local, seguro, offline-first y sin datos de pacientes.
 */

const DB_NAME = 'EnfermePracticaDB';
const DB_VERSION = 1;

export const INITIAL_CATEGORIES = [
  { id: 'valoracion', nombre: 'Valoración', icono: 'vital_signs', color: '#00685f' },
  { id: 'cuidados_basicos', nombre: 'Cuidados Básicos', icono: 'healing', color: '#006c49' },
  { id: 'farmacologia', nombre: 'Farmacología', icono: 'medication', color: '#825100' },
  { id: 'asepsia_quirurgica', nombre: 'Asepsia & Quirúrgico', icono: 'sanitizer', color: '#0b1c30' }
];

export const INITIAL_PROCEDURES = [
  // 1. Valoración (6)
  { id: 'proc-01', nombre: 'Toma de Signos Vitales', categoriaId: 'valoracion', fecha: '2026-10-24', estado: 'dominado', notas: 'Medición precisa de PA, FC, FR, temperatura axilar y oximetría de pulso.' },
  { id: 'proc-02', nombre: 'Somatometría del Adulto', categoriaId: 'valoracion', fecha: '2026-10-22', estado: 'dominado', notas: 'Toma de peso, talla, IMC y perímetro abdominal con técnica correcta.' },
  { id: 'proc-03', nombre: 'Glucemia Capilar por Tira Reactiva', categoriaId: 'valoracion', fecha: '2026-10-21', estado: 'dominado', notas: 'Punción lateral, asepsia adecuada y lectura confiable del glucómetro.' },
  { id: 'proc-04', nombre: 'Electrocardiograma de 12 Derivaciones', categoriaId: 'valoracion', fecha: '2026-10-18', estado: 'practica', notas: 'Buena colocación de precordiales V1-V6; afianzar velocidad de registro y filtro.' },
  { id: 'proc-05', nombre: 'Escala de Glasgow y Valoración Neurológica', categoriaId: 'valoracion', fecha: '2026-10-15', estado: 'practica', notas: 'Identificación de respuesta motora y simetría pupilar. Reforzar reflejo fotomotor.' },
  { id: 'proc-06', nombre: 'Valoración de Escala de Braden (Riesgo UPP)', categoriaId: 'valoracion', fecha: '2026-10-10', estado: 'pendiente', notas: 'Pendiente de aplicar de forma autónoma en el pase de visita de piso.' },

  // 2. Cuidados Básicos (6)
  { id: 'proc-07', nombre: 'Higiene y Baño de Esponja en Cama', categoriaId: 'cuidados_basicos', fecha: '2026-10-23', estado: 'dominado', notas: 'Técnica céfalo-caudal cuidando temperatura del agua, pudor y cambios de lencería.' },
  { id: 'proc-08', nombre: 'Cambios Posturales y Prevención de UPP', categoriaId: 'cuidados_basicos', fecha: '2026-10-22', estado: 'dominado', notas: 'Movilización cada 2 horas con cojines ergonómicos y técnica ergonómica corporal.' },
  { id: 'proc-09', nombre: 'Alimentación Asistida y Cuidados de SNG', categoriaId: 'cuidados_basicos', fecha: '2026-10-19', estado: 'dominado', notas: 'Verificación de residuo gástrico y posición Fowler a 45 grados.' },
  { id: 'proc-10', nombre: 'Higiene Bucal en Paciente Inconsciente', categoriaId: 'cuidados_basicos', fecha: '2026-10-17', estado: 'dominado', notas: 'Protección de vía aérea con gasas húmedas y aspiración suave.' },
  { id: 'proc-11', nombre: 'Tendida de Cama Quirúrgica y Ocupada', categoriaId: 'cuidados_basicos', fecha: '2026-10-14', estado: 'dominado', notas: 'Confección de esquinas de mitra y doblado sin sacudir telas.' },
  { id: 'proc-12', nombre: 'Dispositivos de Inmovilización Terapéutica', categoriaId: 'cuidados_basicos', fecha: '2026-10-09', estado: 'pendiente', notas: 'Revisar protocolo institucional para sujeción suave y signos de perfusión distal.' },

  // 3. Farmacología (7)
  { id: 'proc-13', nombre: 'Regla de los 10 Correctos en Medicación', categoriaId: 'farmacologia', fecha: '2026-10-25', estado: 'dominado', notas: 'Verificación rigurosa antes de cada preparación y administración.' },
  { id: 'proc-14', nombre: 'Administración Vía Oral y Sublingual', categoriaId: 'farmacologia', fecha: '2026-10-23', estado: 'dominado', notas: 'Confirmación de deglución efectiva y tolerancia estomacal.' },
  { id: 'proc-15', nombre: 'Inyección Intramuscular (Dorso-glútea / Deltoides)', categoriaId: 'farmacologia', fecha: '2026-10-20', estado: 'dominado', notas: 'Técnica en Z para fármacos irritantes, aspiración previa sin retorno hemático.' },
  { id: 'proc-16', nombre: 'Administración Subcutánea (Insulina y Heparina)', categoriaId: 'farmacologia', fecha: '2026-10-18', estado: 'practica', notas: 'Ángulo de 45° y 90° según panículo adiposo, rotación de sitios de punción.' },
  { id: 'proc-17', nombre: 'Canalización de Vía Venosa Periférica', categoriaId: 'farmacologia', fecha: '2026-10-25', estado: 'practica', notas: 'Buena palpación venosa; afianzar fijación estéril y ángulo de entrada.' },
  { id: 'proc-18', nombre: 'Cálculo de Goteo y Preparación de Infusiones', categoriaId: 'farmacologia', fecha: '2026-10-16', estado: 'practica', notas: 'Fórmula de macro y microgoteo; practicar programación de bombas de infusión.' },
  { id: 'proc-19', nombre: 'Administración Intradérmica (Mantoux)', categoriaId: 'farmacologia', fecha: '2026-10-08', estado: 'pendiente', notas: 'Formación de la pápula característica sin aspirar.' },

  // 4. Asepsia & Quirúrgico (5)
  { id: 'proc-20', nombre: 'Lavado de Manos Clínico y Quirúrgico (OMS)', categoriaId: 'asepsia_quirurgica', fecha: '2026-10-25', estado: 'dominado', notas: 'Dominio de los 5 momentos y secuencia de frotado de 40 a 60 segundos.' },
  { id: 'proc-21', nombre: 'Colocación de Guantes (Técnica Abierta / Cerrada)', categoriaId: 'asepsia_quirurgica', fecha: '2026-10-24', estado: 'dominado', notas: 'Conservación estricta de esterilidad sin tocar superficie externa.' },
  { id: 'proc-22', nombre: 'Curación Simple y Plana de Herida Quirúrgica', categoriaId: 'asepsia_quirurgica', fecha: '2026-10-20', estado: 'practica', notas: 'Limpieza del centro a la periferia con antiséptico y apósito oclusivo.' },
  { id: 'proc-23', nombre: 'Sondaje Vesical Femenino y Masculino (Foley)', categoriaId: 'asepsia_quirurgica', fecha: '2026-10-12', estado: 'practica', notas: 'Introducción con lubricante estéril e inflado de balón con agua bidestilada.' },
  { id: 'proc-24', nombre: 'Aspiración de Secreciones por Tubo ET', categoriaId: 'asepsia_quirurgica', fecha: '2026-10-05', estado: 'pendiente', notas: 'Pendiente de realizar en unidad de cuidados intensivos o centro de simulación.' }
];

class ClinicalDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store: procedimientos
        if (!db.objectStoreNames.contains('procedimientos')) {
          const procStore = db.createObjectStore('procedimientos', { keyPath: 'id' });
          procStore.createIndex('estado', 'estado', { unique: false });
          procStore.createIndex('categoriaId', 'categoriaId', { unique: false });
          procStore.createIndex('fecha', 'fecha', { unique: false });
          procStore.createIndex('nombre', 'nombre', { unique: false });
        }

        // Store: categorias
        if (!db.objectStoreNames.contains('categorias')) {
          db.createObjectStore('categorias', { keyPath: 'id' });
        }

        // Store: historial
        if (!db.objectStoreNames.contains('historial')) {
          const histStore = db.createObjectStore('historial', { keyPath: 'id' });
          histStore.createIndex('procedimientoId', 'procedimientoId', { unique: false });
        }
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        await this._checkAndSeedData();
        resolve(this);
      };

      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async _checkAndSeedData() {
    const count = await this.countProcedures();
    if (count === 0) {
      console.log('Inicializando datos base (seed data)...');
      const tx = this.db.transaction(['categorias', 'procedimientos'], 'readwrite');
      const catStore = tx.objectStore('categorias');
      const procStore = tx.objectStore('procedimientos');

      for (const cat of INITIAL_CATEGORIES) {
        catStore.put(cat);
      }

      for (const proc of INITIAL_PROCEDURES) {
        procStore.put({
          ...proc,
          creadoEn: new Date().toISOString(),
          actualizadoEn: new Date().toISOString()
        });
      }

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
      });
    }
  }

  countProcedures() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('procedimientos', 'readonly');
      const store = tx.objectStore('procedimientos');
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });
  }

  async getAllProcedures(filters = {}) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('procedimientos', 'readonly');
      const store = tx.objectStore('procedimientos');
      const req = store.getAll();

      req.onsuccess = () => {
        let results = req.result || [];

        // Filtro por búsqueda
        if (filters.search && filters.search.trim() !== '') {
          const query = filters.search.toLowerCase().trim();
          results = results.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            (p.notas && p.notas.toLowerCase().includes(query))
          );
        }

        // Filtro por estado
        if (filters.status && filters.status !== 'all') {
          results = results.filter(p => p.estado === filters.status);
        }

        // Filtro por categoría
        if (filters.category && filters.category !== 'all') {
          results = results.filter(p => p.categoriaId === filters.category);
        }

        // Ordenamiento por fecha descendente
        results.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        resolve(results);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async getProcedureById(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('procedimientos', 'readonly');
      const store = tx.objectStore('procedimientos');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async createProcedure(data) {
    const id = 'proc-' + Date.now();
    const newRecord = {
      id,
      nombre: data.nombre.trim(),
      categoriaId: data.categoriaId || 'valoracion',
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      estado: data.estado || 'pendiente',
      notas: data.notas ? data.notas.trim() : '',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
      const procStore = tx.objectStore('procedimientos');
      const histStore = tx.objectStore('historial');

      procStore.add(newRecord);

      histStore.add({
        id: 'hist-' + Date.now(),
        procedimientoId: id,
        estadoAnterior: null,
        estadoNuevo: newRecord.estado,
        fechaCambio: new Date().toISOString(),
        observacion: 'Registro inicial de práctica'
      });

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'create', record: newRecord } }));
        resolve(newRecord);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async updateStatus(id, newStatus) {
    const existing = await this.getProcedureById(id);
    if (!existing) throw new Error('Procedimiento no encontrado');

    const estadoAnterior = existing.estado;
    existing.estado = newStatus;
    existing.actualizadoEn = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
      const procStore = tx.objectStore('procedimientos');
      const histStore = tx.objectStore('historial');

      procStore.put(existing);

      histStore.add({
        id: 'hist-' + Date.now(),
        procedimientoId: id,
        estadoAnterior,
        estadoNuevo: newStatus,
        fechaCambio: new Date().toISOString(),
        observacion: `Cambio de estado a ${newStatus}`
      });

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'update-status', record: existing } }));
        resolve(existing);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteProcedure(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('procedimientos', 'readwrite');
      const store = tx.objectStore('procedimientos');
      store.delete(id);

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'delete', id } }));
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async getStats() {
    const all = await this.getAllProcedures();
    const total = all.length;
    const dominados = all.filter(p => p.estado === 'dominado').length;
    const practica = all.filter(p => p.estado === 'practica').length;
    const pendientes = all.filter(p => p.estado === 'pendiente').length;

    const porcentajeDominio = total > 0 ? Math.round((dominados / total) * 100) : 0;
    const porcentajePractica = total > 0 ? Math.round((practica / total) * 100) : 0;
    const porcentajePendiente = total > 0 ? Math.round((pendientes / total) * 100) : 0;

    // Métricas por categoría
    const byCategory = {};
    for (const cat of INITIAL_CATEGORIES) {
      const items = all.filter(p => p.categoriaId === cat.id);
      const catDominados = items.filter(p => p.estado === 'dominado').length;
      byCategory[cat.id] = {
        ...cat,
        total: items.length,
        dominados: catDominados,
        practica: items.filter(p => p.estado === 'practica').length,
        pendientes: items.filter(p => p.estado === 'pendiente').length,
        porcentaje: items.length > 0 ? Math.round((catDominados / items.length) * 100) : 0
      };
    }

    return {
      total,
      dominados,
      practica,
      pendientes,
      porcentajeDominio,
      porcentajePractica,
      porcentajePendiente,
      byCategory
    };
  }

  async exportDatabase() {
    const allProcedures = await this.getAllProcedures();
    const data = {
      exportedAt: new Date().toISOString(),
      appName: 'EnfermePráctica',
      version: '1.0.0',
      categories: INITIAL_CATEGORIES,
      procedures: allProcedures
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enfermepractica_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async resetToSeed() {
    const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
    const procStore = tx.objectStore('procedimientos');
    const histStore = tx.objectStore('historial');

    procStore.clear();
    histStore.clear();

    for (const proc of INITIAL_PROCEDURES) {
      procStore.put({
        ...proc,
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString()
      });
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'reset' } }));
        resolve();
      };
    });
  }
}

export const clinicalDb = new ClinicalDatabase();
