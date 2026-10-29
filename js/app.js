/**
 * app.js - Controlador principal de UI y lógica de la aplicación
 * Gestiona el ciclo de vida, perfil del estudiante, navegación por pestañas,
 * renderizado reactivo y operaciones de base de datos.
 */

import { clinicalDb, DEFAULT_PROFILE } from './db.js';

class NursingApp {
  constructor() {
    this.currentTab = 'home';
    this.filterStatus = 'all';
    this.filterCategory = 'all';
    this.searchQuery = '';
    this.stats = null;
    this.profile = null;

    this.init();
  }

  async init() {
    try {
      // 1. Inicializar la base de datos IndexedDB
      await clinicalDb.init();
      console.log('✅ Base de datos clínica inicializada correctamente');

      // 2. Cargar perfil del estudiante
      this.profile = await clinicalDb.getProfile() || DEFAULT_PROFILE;
      this.updateProfileUI();

      // 3. Establecer fecha por defecto en el formulario de registro (hoy)
      const inputDate = document.getElementById('input-proc-date');
      if (inputDate) {
        inputDate.value = new Date().toISOString().split('T')[0];
      }

      // 4. Vincular listeners de UI
      this.bindEvents();

      // 5. Cargar datos iniciales
      await this.refreshUI();
    } catch (err) {
      console.error('Error al inicializar la aplicación:', err);
      this.showToast('Error al conectar con la base de datos', 'error');
    }
  }

  bindEvents() {
    // Escuchar cambios automáticos en la base de datos
    window.addEventListener('db-changed', () => {
      this.refreshUI();
    });

    // Escuchar cambios en el perfil
    window.addEventListener('profile-updated', (e) => {
      this.profile = e.detail;
      this.updateProfileUI();
    });

    // Navegación en la barra inferior (Bottom Tabs)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.navigateTab(tab);
      });
    });

    // Filtros por Estado (Chips)
    document.querySelectorAll('.chip-status').forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterStatus = chip.dataset.filterStatus;
        this.updateFilterStatusUI();
        this.renderProceduresList();
      });
    });

    // Filtros por Categoría
    document.querySelectorAll('.chip-category').forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterCategory = chip.dataset.filterCategory;
        this.updateFilterCategoryUI();
        this.renderProceduresList();
      });
    });

    // Búsqueda en tiempo real
    const searchInput = document.getElementById('input-search');
    const clearBtn = document.getElementById('btn-clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.classList.toggle('hidden', this.searchQuery.length === 0);
        }
        this.renderProceduresList();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        clearBtn.classList.add('hidden');
        this.renderProceduresList();
      });
    }

    // Selector de estado en el formulario de registro
    document.querySelectorAll('#state-selector-group .state-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#state-selector-group .state-card').forEach(c => {
          c.classList.remove('state-selected', 'bg-tertiary-fixed/40', 'border-2', 'border-tertiary');
          c.classList.add('bg-surface-container-lowest', 'border');
          const radio = c.querySelector('.radio-check');
          if (radio) radio.innerHTML = '';
        });

        card.classList.add('state-selected', 'bg-tertiary-fixed/40', 'border-2', 'border-tertiary');
        card.classList.remove('bg-surface-container-lowest');
        const radioInput = card.querySelector('input[type="radio"]');
        if (radioInput) radioInput.checked = true;

        const checkCircle = card.querySelector('.radio-check');
        if (checkCircle) {
          checkCircle.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-tertiary"></div>';
        }
      });
    });

    // Envío del Formulario de Registro
    const formProc = document.getElementById('form-procedure');
    if (formProc) {
      formProc.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleFormSubmit();
      });
    }

    // Modal de Perfil
    const btnProfileMenu = document.getElementById('btn-profile-menu');
    const btnEditProfileQuick = document.getElementById('btn-edit-profile-quick');
    const modalProfile = document.getElementById('modal-profile');
    const btnCloseProfile = document.getElementById('btn-close-modal-profile');
    const formProfile = document.getElementById('form-profile');

    const openProfileModal = () => {
      if (!modalProfile) return;
      const inputName = document.getElementById('profile-name');
      const inputSem = document.getElementById('profile-semester');
      const inputInst = document.getElementById('profile-institution');
      const inputRot = document.getElementById('profile-rotation');

      if (inputName) inputName.value = this.profile?.nombre || '';
      if (inputSem) inputSem.value = this.profile?.semestre || '1er Semestre';
      if (inputInst) inputInst.value = this.profile?.institucion || '';
      if (inputRot) inputRot.value = this.profile?.lugarPractica || '';

      modalProfile.classList.remove('hidden');
    };

    if (btnProfileMenu) btnProfileMenu.addEventListener('click', openProfileModal);
    if (btnEditProfileQuick) btnEditProfileQuick.addEventListener('click', openProfileModal);
    if (btnCloseProfile && modalProfile) {
      btnCloseProfile.addEventListener('click', () => modalProfile.classList.add('hidden'));
    }
    if (modalProfile) {
      modalProfile.addEventListener('click', (e) => {
        if (e.target === modalProfile) modalProfile.classList.add('hidden');
      });
    }

    if (formProfile) {
      formProfile.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputName = document.getElementById('profile-name');
        const inputSem = document.getElementById('profile-semester');
        const inputInst = document.getElementById('profile-institution');
        const inputRot = document.getElementById('profile-rotation');

        const updatedProfile = {
          nombre: inputName?.value || '',
          semestre: inputSem?.value || '1er Semestre',
          institucion: inputInst?.value || '',
          lugarPractica: inputRot?.value || ''
        };

        await clinicalDb.saveProfile(updatedProfile);
        this.profile = updatedProfile;
        this.updateProfileUI();
        modalProfile.classList.add('hidden');
        this.showToast('Perfil actualizado correctamente', 'badge');
      });
    }

    // Modal de Edición de Procedimiento
    const modalEdit = document.getElementById('modal-edit-procedure');
    const btnCloseEdit = document.getElementById('btn-close-modal-edit');
    const formEdit = document.getElementById('form-edit-proc');

    if (btnCloseEdit && modalEdit) {
      btnCloseEdit.addEventListener('click', () => modalEdit.classList.add('hidden'));
    }
    if (modalEdit) {
      modalEdit.addEventListener('click', (e) => {
        if (e.target === modalEdit) modalEdit.classList.add('hidden');
      });
    }
    if (formEdit) {
      formEdit.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleEditSubmit();
      });
    }

    // Modal de Base de Datos (Respaldos y Reinicio)
    const btnDbMenu = document.getElementById('btn-db-menu');
    const modalDb = document.getElementById('modal-db');
    const btnCloseDb = document.getElementById('btn-close-modal-db');
    const btnExport = document.getElementById('btn-export-db');
    const inputRestore = document.getElementById('input-restore-backup');
    const btnResetZero = document.getElementById('btn-reset-progress-zero');

    if (btnDbMenu && modalDb) {
      btnDbMenu.addEventListener('click', () => modalDb.classList.remove('hidden'));
    }
    if (btnCloseDb && modalDb) {
      btnCloseDb.addEventListener('click', () => modalDb.classList.add('hidden'));
    }
    if (modalDb) {
      modalDb.addEventListener('click', (e) => {
        if (e.target === modalDb) modalDb.classList.add('hidden');
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', async () => {
        await clinicalDb.exportDatabase();
        this.showToast('Copia de base de datos descargada', 'download_done');
      });
    }

    if (inputRestore) {
      inputRestore.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const data = JSON.parse(event.target.result);
              await clinicalDb.importDatabase(data);
              modalDb.classList.add('hidden');
              this.showToast('Respaldo restaurado con éxito', 'cloud_done');
            } catch (parseErr) {
              console.error(parseErr);
              this.showToast('Archivo de respaldo no válido', 'error');
            }
          };
          reader.readAsText(file);
        } catch (readErr) {
          console.error(readErr);
          this.showToast('Error al leer el archivo', 'error');
        } finally {
          inputRestore.value = '';
        }
      });
    }

    if (btnResetZero) {
      btnResetZero.addEventListener('click', async () => {
        const confirmMsg = '¿Deseas reiniciar todo tu progreso a CERO?\n\n- Procedimientos dominados: 0\n- Procedimientos en práctica: 0\n- Procedimientos por practicar: 24\n\nSe conservarán los datos de tu perfil y catálogo de competencias.';
        if (confirm(confirmMsg)) {
          await clinicalDb.resetProgress();
          modalDb.classList.add('hidden');
          this.showToast('Progreso reiniciado a 0%', 'restart_alt');
        }
      });
    }
  }

  updateProfileUI() {
    if (!this.profile) return;

    // Saludo
    const homeGreeting = document.getElementById('home-greeting');
    if (homeGreeting) {
      homeGreeting.textContent = this.profile.nombre
        ? `Hola, ${this.profile.nombre} 👋`
        : 'Hola, Estudiante 👋';
    }

    // Semestre badge
    const semBadge = document.getElementById('home-semester-badge');
    const semTagProgress = document.getElementById('progress-semester-tag');
    if (semBadge) semBadge.textContent = this.profile.semestre || '1er Semestre';
    if (semTagProgress) semTagProgress.textContent = this.profile.semestre || '1er Semestre';

    // Subtítulo con sede/institución
    const rotText = document.getElementById('home-rotation-text');
    if (rotText) {
      const parts = [];
      if (this.profile.institucion) parts.push(this.profile.institucion);
      if (this.profile.lugarPractica) parts.push(this.profile.lugarPractica);

      rotText.textContent = parts.length > 0
        ? parts.join(' • ')
        : 'Configura tu institución y sede de prácticas';
    }

    // Iniciales en Avatar del Header
    const avatarInitials = document.getElementById('header-avatar-initials');
    if (avatarInitials) {
      if (this.profile.nombre) {
        const words = this.profile.nombre.trim().split(/\s+/);
        const initials = words.length >= 2
          ? (words[0][0] + words[1][0]).toUpperCase()
          : words[0].slice(0, 2).toUpperCase();
        avatarInitials.textContent = initials;
      } else {
        avatarInitials.textContent = 'EP';
      }
    }
  }

  async refreshUI() {
    this.stats = await clinicalDb.getStats();
    this.updateHomeMetrics();
    this.updateProgressMetrics();
    this.renderProceduresList();
  }

  navigateTab(tabName, filterToApply = null) {
    this.currentTab = tabName;

    // Actualizar paneles visibles
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    const targetPanel = document.getElementById(`view-${tabName}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Actualizar subtítulo en header
    const subtitle = document.getElementById('header-subtitle');
    if (subtitle) {
      const titles = {
        home: 'Bitácora Formativa',
        procedures: 'Catálogo de Procedimientos',
        register: 'Nuevo Registro Clínico',
        progress: 'Análisis de Avance'
      };
      subtitle.textContent = titles[tabName] || 'Bitácora Formativa';
    }

    // Actualizar estilos activos de los botones del tab bar
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const isTarget = btn.dataset.tab === tabName;
      if (btn.dataset.tab !== 'register') {
        const icon = btn.querySelector('.tab-icon');
        if (isTarget) {
          btn.classList.add('text-primary');
          btn.classList.remove('text-outline');
          if (icon) icon.classList.add('icon-fill');
        } else {
          btn.classList.remove('text-primary');
          btn.classList.add('text-outline');
          if (icon) icon.classList.remove('icon-fill');
        }
      }
    });

    // Si se pasa un filtro específico (ej. al tocar una tarjeta tristatus en home)
    if (filterToApply && tabName === 'procedures') {
      this.filterStatus = filterToApply;
      this.updateFilterStatusUI();
      this.renderProceduresList();
    }
  }

  updateFilterStatusUI() {
    document.querySelectorAll('.chip-status').forEach(chip => {
      const isSelected = chip.dataset.filterStatus === this.filterStatus;
      if (isSelected) {
        chip.className = 'chip-status flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all bg-primary text-on-primary shadow-xs';
      } else {
        chip.className = 'chip-status flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all bg-surface-container-low text-on-surface-variant hover:bg-surface-container';
      }
    });
  }

  updateFilterCategoryUI() {
    document.querySelectorAll('.chip-category').forEach(chip => {
      const isSelected = chip.dataset.filterCategory === this.filterCategory;
      if (isSelected) {
        chip.className = 'chip-category px-3 py-1 rounded-xl text-xs font-medium transition-colors bg-primary-fixed text-on-primary-fixed font-bold shadow-xs';
      } else {
        chip.className = 'chip-category px-3 py-1 rounded-xl text-xs font-medium transition-colors bg-surface-container-lowest border border-surface-container text-on-surface-variant hover:bg-surface-container';
      }
    });
  }

  fillSuggestion(name, category) {
    const inputName = document.getElementById('input-proc-name');
    const selectCat = document.getElementById('select-proc-category');
    if (inputName) inputName.value = name;
    if (selectCat) selectCat.value = category;
    this.showToast(`Sugerencia aplicada: ${name}`, 'check');
  }

  async handleFormSubmit() {
    const inputName = document.getElementById('input-proc-name');
    const selectCat = document.getElementById('select-proc-category');
    const inputDate = document.getElementById('input-proc-date');
    const inputNotes = document.getElementById('input-proc-notes');
    const selectedRadio = document.querySelector('input[name="proc-state"]:checked');

    if (!inputName || !inputName.value.trim()) {
      this.showToast('El nombre del procedimiento es obligatorio', 'warning');
      return;
    }

    const newProc = {
      nombre: inputName.value.trim(),
      categoriaId: selectCat ? selectCat.value : 'valoracion',
      fecha: inputDate?.value || new Date().toISOString().split('T')[0],
      estado: selectedRadio ? selectedRadio.value : 'pendiente',
      notas: inputNotes ? inputNotes.value.trim() : ''
    };

    try {
      await clinicalDb.createProcedure(newProc);
      this.showToast('¡Práctica guardada en la base de datos!', 'check_circle');

      // Limpiar formulario y volver al listado
      inputName.value = '';
      if (inputNotes) inputNotes.value = '';
      this.navigateTab('procedures');
    } catch (err) {
      console.error('Error al guardar:', err);
      this.showToast('Error al guardar en la base de datos', 'error');
    }
  }

  async openEditModal(id) {
    const proc = await clinicalDb.getProcedureById(id);
    if (!proc) {
      this.showToast('Procedimiento no encontrado', 'error');
      return;
    }

    const modalEdit = document.getElementById('modal-edit-procedure');
    const inputId = document.getElementById('edit-proc-id');
    const inputName = document.getElementById('edit-proc-name');
    const inputCat = document.getElementById('edit-proc-category');
    const inputDate = document.getElementById('edit-proc-date');
    const inputStatus = document.getElementById('edit-proc-status');
    const inputNotes = document.getElementById('edit-proc-notes');

    if (inputId) inputId.value = proc.id;
    if (inputName) inputName.value = proc.nombre;
    if (inputCat) inputCat.value = proc.categoriaId;
    if (inputDate) inputDate.value = proc.fecha || '';
    if (inputStatus) inputStatus.value = proc.estado;
    if (inputNotes) inputNotes.value = proc.notas || '';

    if (modalEdit) modalEdit.classList.remove('hidden');
  }

  async handleEditSubmit() {
    const inputId = document.getElementById('edit-proc-id');
    const inputName = document.getElementById('edit-proc-name');
    const inputCat = document.getElementById('edit-proc-category');
    const inputDate = document.getElementById('edit-proc-date');
    const inputStatus = document.getElementById('edit-proc-status');
    const inputNotes = document.getElementById('edit-proc-notes');
    const modalEdit = document.getElementById('modal-edit-procedure');

    if (!inputId || !inputId.value) return;

    try {
      await clinicalDb.updateProcedure(inputId.value, {
        nombre: inputName?.value,
        categoriaId: inputCat?.value,
        fecha: inputDate?.value || '',
        estado: inputStatus?.value,
        notas: inputNotes?.value || ''
      });

      if (modalEdit) modalEdit.classList.add('hidden');
      this.showToast('Procedimiento actualizado', 'check_circle');
    } catch (err) {
      console.error('Error al actualizar:', err);
      this.showToast('No se pudo actualizar el procedimiento', 'error');
    }
  }

  async deleteProcedure(id, name) {
    if (confirm(`¿Deseas eliminar el registro de "${name}"?`)) {
      try {
        await clinicalDb.deleteProcedure(id);
        this.showToast('Procedimiento eliminado', 'delete');
      } catch (err) {
        console.error('Error al eliminar:', err);
        this.showToast('No se pudo eliminar el procedimiento', 'error');
      }
    }
  }

  printReport() {
    window.print();
  }

  async changeStatus(id, newStatus) {
    try {
      await clinicalDb.updateStatus(id, newStatus);
      const labels = {
        pendiente: 'Marcado por practicar',
        practica: 'Marcado en práctica',
        dominado: '¡Habilidad dominada! 🎉'
      };
      this.showToast(labels[newStatus] || 'Estado actualizado', 'check');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      this.showToast('No se pudo actualizar el estado', 'error');
    }
  }

  async renderProceduresList() {
    const container = document.getElementById('procedures-list');
    if (!container) return;

    const items = await clinicalDb.getAllProcedures({
      search: this.searchQuery,
      status: this.filterStatus,
      category: this.filterCategory
    });

    const resultsCount = document.getElementById('results-count-text');
    if (resultsCount) {
      resultsCount.innerHTML = `Mostrando <strong>${items.length}</strong> de <strong>${this.stats?.total || 0}</strong> procedimientos`;
    }

    // Actualizar badges de conteo en los filtros
    if (this.stats) {
      const bAll = document.getElementById('badge-all');
      const bDom = document.getElementById('badge-dominado');
      const bPrac = document.getElementById('badge-practica');
      const bPend = document.getElementById('badge-pendiente');

      if (bAll) bAll.textContent = this.stats.total;
      if (bDom) bDom.textContent = this.stats.dominados;
      if (bPrac) bPrac.textContent = this.stats.practica;
      if (bPend) bPend.textContent = this.stats.pendientes;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-surface-container">
          <span class="material-symbols-outlined text-[40px] text-outline mb-2">search_off</span>
          <p class="font-bold text-sm text-on-surface">No se encontraron procedimientos</p>
          <p class="text-xs text-outline mt-1">Prueba con otra búsqueda o cambia los filtros de estado/área.</p>
        </div>
      `;
      return;
    }

    const categoryNames = {
      valoracion: 'Valoración',
      cuidados_basicos: 'Cuidados Básicos',
      farmacologia: 'Farmacología',
      asepsia_quirurgica: 'Asepsia & Quirúrgico'
    };

    container.innerHTML = items.map(p => {
      // Formato de badge de estado
      let statusBadge = '';
      if (p.estado === 'dominado') {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
          <span class="material-symbols-outlined text-[13px] icon-fill">check_circle</span> Dominado
        </span>`;
      } else if (p.estado === 'practica') {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
          <span class="material-symbols-outlined text-[13px] icon-fill">autorenew</span> En práctica
        </span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold">
          <span class="material-symbols-outlined text-[13px]">bookmark</span> Por practicar
        </span>`;
      }

      // Fecha (o indicación de sin registrar)
      const dateLabel = p.fecha
        ? `<span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[13px]">calendar_today</span> ${p.fecha}</span>`
        : `<span class="text-outline/70">Sin fecha registrada</span>`;

      return `
        <article class="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-2.5 transition-all">
          <div class="flex items-start justify-between gap-2">
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <div class="flex items-center gap-2 text-[11px] text-outline">
                <span class="px-2 py-0.5 rounded-md bg-surface-container font-semibold text-on-surface-variant">
                  ${categoryNames[p.categoriaId] || 'Clínico'}
                </span>
                ${dateLabel}
              </div>
              <h3 class="font-bold text-sm text-on-surface leading-snug">${p.nombre}</h3>
            </div>
            
            <div class="flex items-center gap-1">
              ${statusBadge}
              <button onclick="window.app.openEditModal('${p.id}')" 
                      title="Editar procedimiento"
                      class="p-1 rounded-full text-outline hover:text-primary hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button onclick="window.app.deleteProcedure('${p.id}', '${p.nombre.replace(/'/g, "\\'")}')" 
                      title="Eliminar procedimiento"
                      class="p-1 rounded-full text-outline hover:text-error hover:bg-error-container/30 transition-colors">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>

          ${p.notas ? `
            <div class="p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-start gap-2">
              <span class="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">edit_note</span>
              <p class="leading-relaxed">${p.notas}</p>
            </div>
          ` : ''}

          <!-- Botones Rápidos de Cambio de Estado -->
          <div class="flex items-center justify-between pt-1 border-t border-surface-container text-xs">
            <span class="text-[11px] text-outline font-medium flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">tune</span> Modificar:
            </span>
            <div class="flex items-center gap-1 bg-surface-container p-0.5 rounded-xl">
              <button onclick="window.app.changeStatus('${p.id}', 'pendiente')"
                      class="px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${p.estado === 'pendiente' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}">
                Por practicar
              </button>
              <button onclick="window.app.changeStatus('${p.id}', 'practica')"
                      class="px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${p.estado === 'practica' ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}">
                En práctica
              </button>
              <button onclick="window.app.changeStatus('${p.id}', 'dominado')"
                      class="px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${p.estado === 'dominado' ? 'bg-secondary-container text-on-secondary-container shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}">
                Dominado
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  updateHomeMetrics() {
    if (!this.stats) return;

    const { total, dominados, practica, pendientes, porcentajeDominio, porcentajePractica, porcentajePendiente } = this.stats;

    // Conteo Tri-status
    const elDom = document.getElementById('home-count-dominado');
    const elPrac = document.getElementById('home-count-practica');
    const elPend = document.getElementById('home-count-pendiente');
    if (elDom) elDom.textContent = dominados;
    if (elPrac) elPrac.textContent = practica;
    if (elPend) elPend.textContent = pendientes;

    // Título y Ratio
    const elTitle = document.getElementById('home-progress-title');
    const elRatio = document.getElementById('home-progress-ratio');
    const elTotal = document.getElementById('home-total-count');
    const elComp = document.getElementById('home-completed-text');

    if (elTitle) elTitle.textContent = `${porcentajeDominio}% del Ciclo Clínico`;
    if (elRatio) elRatio.textContent = `${dominados}/${total}`;
    if (elTotal) elTotal.textContent = total;
    if (elComp) elComp.textContent = `${dominados} completados`;

    // Barras segmentadas
    const barDom = document.getElementById('home-bar-dominados');
    const barPrac = document.getElementById('home-bar-practica');
    const barPend = document.getElementById('home-bar-pendientes');
    if (barDom) barDom.style.width = `${porcentajeDominio}%`;
    if (barPrac) barPrac.style.width = `${porcentajePractica}%`;
    if (barPend) barPend.style.width = `${porcentajePendiente}%`;

    // Donut SVG círculo (Circunferencia = 2 * PI * 19 ≈ 119.38)
    const circ = 119.38;
    const offset = circ - (circ * (porcentajeDominio / 100));
    const donutCircle = document.getElementById('home-donut-circle');
    if (donutCircle) {
      donutCircle.setAttribute('stroke-dasharray', `${circ}`);
      donutCircle.setAttribute('stroke-dashoffset', `${offset}`);
    }
  }

  updateProgressMetrics() {
    if (!this.stats) return;

    const { total, dominados, practica, pendientes, porcentajeDominio, porcentajePractica, porcentajePendiente, byCategory } = this.stats;

    // Donut Hero en vista Progreso
    const heroPct = document.getElementById('progress-percentage-hero');
    const heroRatio = document.getElementById('progress-ratio-hero');
    if (heroPct) heroPct.textContent = `${porcentajeDominio}%`;
    if (heroRatio) heroRatio.textContent = `${dominados} de ${total} logrados`;

    // Leyendas
    const legDom = document.getElementById('leg-dominado');
    const legPrac = document.getElementById('leg-practica');
    const legPend = document.getElementById('leg-pendiente');
    if (legDom) legDom.textContent = `${porcentajeDominio}% Dominado`;
    if (legPrac) legPrac.textContent = `${porcentajePractica}% En curso`;
    if (legPend) legPend.textContent = `${porcentajePendiente}% Pendiente`;

    // Cálculo de arcos SVG (Circunferencia = 2 * PI * 68 ≈ 427.25)
    const C = 427.25;
    const arcDom = (dominados / (total || 1)) * C;
    const arcPrac = (practica / (total || 1)) * C;
    const arcPend = (pendientes / (total || 1)) * C;

    const cDom = document.getElementById('progress-donut-dominados');
    const cPrac = document.getElementById('progress-donut-practica');
    const cPend = document.getElementById('progress-donut-pendientes');

    if (cDom) {
      cDom.setAttribute('stroke-dasharray', `${arcDom} ${C}`);
      cDom.setAttribute('stroke-dashoffset', '0');
    }
    if (cPrac) {
      cPrac.setAttribute('stroke-dasharray', `${arcPrac} ${C}`);
      cPrac.setAttribute('stroke-dashoffset', `-${arcDom}`);
    }
    if (cPend) {
      cPend.setAttribute('stroke-dasharray', `${arcPend} ${C}`);
      cPend.setAttribute('stroke-dashoffset', `-${arcDom + arcPrac}`);
    }

    // Desglose por Área Clínica
    const catList = document.getElementById('category-progress-list');
    if (catList && byCategory) {
      catList.innerHTML = Object.values(byCategory).map(cat => `
        <div class="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container flex flex-col gap-2 shadow-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary">${cat.icono}</span>
              <span class="font-bold text-xs text-on-surface">${cat.nombre}</span>
            </div>
            <span class="text-xs font-bold text-secondary">${cat.dominados} / ${cat.total} (${cat.porcentaje}%)</span>
          </div>
          <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div class="bg-secondary h-full rounded-full transition-all duration-500" style="width: ${cat.porcentaje}%;"></div>
          </div>
          <div class="flex justify-between text-[10px] text-on-surface-variant font-medium">
            <span>En práctica: ${cat.practica}</span>
            <span>Por practicar: ${cat.pendientes}</span>
          </div>
        </div>
      `).join('');
    }
  }

  showToast(message, icon = 'check_circle') {
    const toast = document.getElementById('toast-msg');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');

    if (toast && toastText) {
      toastText.textContent = message;
      if (toastIcon) toastIcon.textContent = icon;
      toast.classList.remove('opacity-0', 'pointer-events-none');
      toast.classList.add('opacity-100');

      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
      }, 2500);
    }
  }
}

// Inicialización global
window.addEventListener('DOMContentLoaded', () => {
  window.app = new NursingApp();
});
