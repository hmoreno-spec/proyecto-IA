/**
 * db.js - Capa de Base de Datos y Persistencia Local (IndexedDB)
 * Implementa el esquema relacional definido en database/schema.sql
 * 
 * Principios:
 * - Todo estudiante nuevo comienza en 0% de progreso (0 dominados, 0 en práctica, 24 por practicar).
 * - Cero fechas, notas o avances ficticios.
 * - Perfil personalizable guardado localmente.
 * - Copias de seguridad completas (importar / exportar).
 * - Cero datos de pacientes.
 */

const DB_NAME = 'EnfermePracticaDB';
const DB_VERSION = 2;

export const DEFAULT_PROFILE = {
  id: 'principal',
  nombre: '',
  semestre: '1er Semestre',
  institucion: '',
  lugarPractica: ''
};

export const INITIAL_CATEGORIES = [
  { id: 'valoracion', nombre: 'Valoración', icono: 'vital_signs', color: '#00685f' },
  { id: 'cuidados_basicos', nombre: 'Cuidados Básicos', icono: 'healing', color: '#006c49' },
  { id: 'farmacologia', nombre: 'Farmacología', icono: 'medication', color: '#825100' },
  { id: 'asepsia_quirurgica', nombre: 'Asepsia & Quirúrgico', icono: 'sanitizer', color: '#0b1c30' }
];

// Catálogo académico de 24 competencias clínicas oficiales.
// Todos inician en 'pendiente' con 0% de avance, sin fechas ni notas ficticias.
export const INITIAL_PROCEDURES = [
  // 1. Valoración (6)
  { id: 'proc-01', nombre: 'Toma de Signos Vitales', categoriaId: 'valoracion', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-02', nombre: 'Somatometría del Adulto', categoriaId: 'valoracion', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-03', nombre: 'Glucemia Capilar por Tira Reactiva', categoriaId: 'valoracion', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-04', nombre: 'Electrocardiograma de 12 Derivaciones', categoriaId: 'valoracion', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-05', nombre: 'Escala de Glasgow y Valoración Neurológica', categoriaId: 'valoracion', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-06', nombre: 'Valoración de Escala de Braden (Riesgo UPP)', categoriaId: 'valoracion', fecha: '', estado: 'pendiente', notas: '' },

  // 2. Cuidados Básicos (6)
  { id: 'proc-07', nombre: 'Higiene y Baño de Esponja en Cama', categoriaId: 'cuidados_basicos', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-08', nombre: 'Cambios Posturales y Prevención de UPP', categoriaId: 'cuidados_basicos', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-09', nombre: 'Alimentación Asistida y Cuidados de SNG', categoriaId: 'cuidados_basicos', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-10', nombre: 'Higiene Bucal en Paciente Inconsciente', categoriaId: 'cuidados_basicos', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-11', nombre: 'Tendida de Cama Quirúrgica y Ocupada', categoriaId: 'cuidados_basicos', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-12', nombre: 'Dispositivos de Inmovilización Terapéutica', categoriaId: 'cuidados_basicos', fecha: '', estado: 'pendiente', notas: '' },

  // 3. Farmacología (7)
  { id: 'proc-13', nombre: 'Regla de los 10 Correctos en Medicación', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-14', nombre: 'Administración Vía Oral y Sublingual', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-15', nombre: 'Inyección Intramuscular (Dorso-glútea / Deltoides)', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-16', nombre: 'Administración Subcutánea (Insulina y Heparina)', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-17', nombre: 'Canalización de Vía Venosa Periférica', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-18', nombre: 'Cálculo de Goteo y Preparación de Infusiones', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-19', nombre: 'Administración Intradérmica (Mantoux)', categoriaId: 'farmacologia', fecha: '', estado: 'pendiente', notas: '' },

  // 4. Asepsia & Quirúrgico (5)
  { id: 'proc-20', nombre: 'Lavado de Manos Clínico y Quirúrgico (OMS)', categoriaId: 'asepsia_quirurgica', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-21', nombre: 'Colocación de Guantes (Técnica Abierta / Cerrada)', categoriaId: 'asepsia_quirurgica', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-22', nombre: 'Curación Simple y Plana de Herida Quirúrgica', categoriaId: 'asepsia_quirurgica', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-23', nombre: 'Sondaje Vesical Femenino y Masculino (Foley)', categoriaId: 'asepsia_quirurgica', fecha: '', estado: 'pendiente', notas: '' },
  { id: 'proc-24', nombre: 'Aspiración de Secreciones por Tubo ET', categoriaId: 'asepsia_quirurgica', fecha: '', estado: 'pendiente', notas: '' }
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

        // Store: perfil
        if (!db.objectStoreNames.contains('perfil')) {
          db.createObjectStore('perfil', { keyPath: 'id' });
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
    // 1. Inicializar Categorías si no existen
    const catCount = await this._countStore('categorias');
    if (catCount === 0) {
      const tx = this.db.transaction('categorias', 'readwrite');
      const catStore = tx.objectStore('categorias');
      for (const cat of INITIAL_CATEGORIES) {
        catStore.put(cat);
      }
    }

    // 2. Inicializar Perfil si no existe
    const profile = await this.getProfile();
    if (!profile) {
      await this.saveProfile(DEFAULT_PROFILE);
    }

    // 3. Inicializar Procedimientos si no existen
    const procCount = await this._countStore('procedimientos');
    if (procCount === 0) {
      console.log('Sembrando catálogo académico con progreso inicial en 0%...');
      await this._seedCleanCatalog();
    } else {
      // Limpiar datos de demostración antiguos si existen (donde proc-01 tenía notas demo prefabricadas)
      const proc1 = await this.getProcedureById('proc-01');
      if (proc1 && proc1.notas && proc1.notas.includes('Medición precisa de PA, FC')) {
        console.log('Detectados datos de demostración anteriores: migrando a progreso inicial limpio (0%)...');
        await this.resetProgress();
      }
    }
  }

  async _seedCleanCatalog() {
    const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
    const procStore = tx.objectStore('procedimientos');
    const histStore = tx.objectStore('historial');

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

  _countStore(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });
  }

  // --- GESTIÓN DE PERFIL DEL ESTUDIANTE ---

  async getProfile() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('perfil', 'readonly');
      const store = tx.objectStore('perfil');
      const req = store.get('principal');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async saveProfile(profileData) {
    const dataToSave = {
      id: 'principal',
      nombre: (profileData.nombre || '').trim(),
      semestre: profileData.semestre || '1er Semestre',
      institucion: (profileData.institucion || '').trim(),
      lugarPractica: (profileData.lugarPractica || '').trim(),
      actualizadoEn: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('perfil', 'readwrite');
      const store = tx.objectStore('perfil');
      store.put(dataToSave);
      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('profile-updated', { detail: dataToSave }));
        resolve(dataToSave);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- GESTIÓN DE PROCEDIMIENTOS ---

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

        // Ordenamiento: si tienen fecha registrada, más recientes primero; sino por orden de creación
        results.sort((a, b) => {
          if (a.fecha && b.fecha) return new Date(b.fecha) - new Date(a.fecha);
          if (a.fecha) return -1;
          if (b.fecha) return 1;
          return a.id.localeCompare(b.id);
        });

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
        observacion: 'Registro de práctica'
      });

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'create', record: newRecord } }));
        resolve(newRecord);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async updateProcedure(id, data) {
    const existing = await this.getProcedureById(id);
    if (!existing) throw new Error('Procedimiento no encontrado');

    const estadoAnterior = existing.estado;
    const updated = {
      ...existing,
      nombre: (data.nombre || existing.nombre).trim(),
      categoriaId: data.categoriaId || existing.categoriaId,
      fecha: data.fecha !== undefined ? data.fecha : existing.fecha,
      estado: data.estado || existing.estado,
      notas: data.notas !== undefined ? data.notas.trim() : existing.notas,
      actualizadoEn: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
      const procStore = tx.objectStore('procedimientos');
      const histStore = tx.objectStore('historial');

      procStore.put(updated);

      if (estadoAnterior !== updated.estado) {
        histStore.add({
          id: 'hist-' + Date.now(),
          procedimientoId: id,
          estadoAnterior,
          estadoNuevo: updated.estado,
          fechaCambio: new Date().toISOString(),
          observacion: `Modificación a ${updated.estado}`
        });
      }

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'update', record: updated } }));
        resolve(updated);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async updateStatus(id, newStatus) {
    const existing = await this.getProcedureById(id);
    if (!existing) throw new Error('Procedimiento no encontrado');

    const estadoAnterior = existing.estado;
    existing.estado = newStatus;
    // Si no tenía fecha y pasa a práctica o dominado, asignar la fecha de hoy
    if (!existing.fecha && (newStatus === 'practica' || newStatus === 'dominado')) {
      existing.fecha = new Date().toISOString().split('T')[0];
    }
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
      const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
      const procStore = tx.objectStore('procedimientos');
      procStore.delete(id);

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

  // --- REINICIAR PROGRESO A CERO ---

  async resetProgress() {
    const tx = this.db.transaction(['procedimientos', 'historial'], 'readwrite');
    const procStore = tx.objectStore('procedimientos');
    const histStore = tx.objectStore('historial');

    procStore.clear();
    histStore.clear();

    for (const proc of INITIAL_PROCEDURES) {
      procStore.put({
        ...proc,
        fecha: '',
        estado: 'pendiente',
        notas: '',
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString()
      });
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'reset-progress' } }));
        resolve();
      };
    });
  }

  // --- COPIAS DE SEGURIDAD (EXPORTAR E IMPORTAR) ---

  async exportDatabase() {
    const allProcedures = await this.getAllProcedures();
    const profile = await this.getProfile();
    const data = {
      exportedAt: new Date().toISOString(),
      appName: 'EnfermePráctica',
      version: '2.0.0',
      profile: profile || DEFAULT_PROFILE,
      categories: INITIAL_CATEGORIES,
      procedures: allProcedures
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const studentTag = profile?.nombre ? `_${profile.nombre.replace(/\s+/g, '_')}` : '';
    a.download = `enfermepractica_respaldo${studentTag}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importDatabase(jsonData) {
    if (!jsonData || !Array.isArray(jsonData.procedures)) {
      throw new Error('El archivo no contiene un respaldo válido de EnfermePráctica');
    }

    const tx = this.db.transaction(['procedimientos', 'perfil'], 'readwrite');
    const procStore = tx.objectStore('procedimientos');
    const profileStore = tx.objectStore('perfil');

    // Restaurar perfil si está presente
    if (jsonData.profile) {
      profileStore.put({
        ...DEFAULT_PROFILE,
        ...jsonData.profile,
        id: 'principal'
      });
    }

    // Restaurar procedimientos
    procStore.clear();
    for (const p of jsonData.procedures) {
      procStore.put(p);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('db-changed', { detail: { action: 'import' } }));
        if (jsonData.profile) {
          window.dispatchEvent(new CustomEvent('profile-updated', { detail: jsonData.profile }));
        }
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const clinicalDb = new ClinicalDatabase();
