// ManagerPro - Construction Site Management Application
// Full CRUD functionality with skeuomorphic UI

class ManagerProApp {
    constructor() {
        this.data = {
            chantiers: [],
            salaries: [],
            pointages: []
        };
        
        this.currentTab = 'chantiers';
        this.editedItem = null;
        this.editedModule = null;
        
        this.init();
    }
    
    init() {
        // Load data from localStorage or initialize with sample data
        this.loadData();
        
        // Initialize event listeners
        this.initTabNavigation();
        this.initButtons();
        this.initSearchFilters();
        this.initModals();
        
        // Render initial data
        this.renderAllModules();
        
        // Initialize chantier dropdowns for salarié and pointage modules
        this.updateChantierDropdowns();
    }
    
    loadData() {
        const savedData = localStorage.getItem('managerproData');
        if (savedData) {
            try {
                this.data = JSON.parse(savedData);
            } catch (e) {
                console.error('Error loading data:', e);
                this.initSampleData();
            }
        } else {
            this.initSampleData();
        }
    }
    
    saveData() {
        localStorage.setItem('managerproData', JSON.stringify(this.data));
    }
    
    initSampleData() {
        // Sample chantier data
        this.data.chantiers = [
            {
                num: 1,
                designation: "Construction du Centre Commercial",
                chef_chantier: "Ahmed Hassan",
                adresse: "123 Rue de la République, Casablanca",
                utilisateur: "admin"
            },
            {
                num: 2,
                designation: "Résidence Al Amal",
                chef_chantier: "Fatima Zahra",
                adresse: "45 Avenue Mohammed V, Rabat",
                utilisateur: "admin"
            }
        ];
        
        // Sample salarié data
        this.data.salaries = [
            {
                num_cin: "AB123456",
                nom: "Mohamed Ali",
                immatriculation: "123456",
                num_cnss: "CNSS789",
                num_dossier: 1001,
                date_embauche: "2022-03-15",
                categorie: "Ouvrier qualifié",
                service: "Construction",
                chantier: "Construction du Centre Commercial",
                declarer: true,
                equipe: "Equipe A"
            },
            {
                num_cin: "CD789012",
                nom: "Sophie Martin",
                immatriculation: "789012",
                num_cnss: "CNSS345",
                num_dossier: 1002,
                date_embauche: "2021-11-01",
                categorie: "Ingénieur",
                service: "Études",
                chantier: "Résidence Al Amal",
                declarer: true,
                equipe: "Equipe B"
            }
        ];
        
        // Sample pointage data
        this.data.pointages = [
            {
                num: 1,
                date: "2026-08-15",
                nom_et_prenom: "Mohamed Ali",
                cin: "AB123456",
                chantier: "Construction du Centre Commercial",
                jour: 15,
                heure_supp: 2,
                avance: 50,
                type_salarie: "Ouvrier qualifié",
                salaire_de_base: 3000,
                salaire_heure: 25,
                equipe: "Equipe A",
                matricule: "123456"
            },
            {
                num: 2,
                date: "2026-08-14",
                nom_et_prenom: "Sophie Martin",
                cin: "CD789012",
                chantier: "Résidence Al Amal",
                jour: 14,
                heure_supp: 0,
                avance: 0,
                type_salarie: "Ingénieur",
                salaire_de_base: 4500,
                salaire_heure: 35,
                equipe: "Equipe B",
                matricule: "789012"
            }
        ];
        
        this.saveData();
    }
    
    initTabNavigation() {
        const tabs = document.querySelectorAll('.binder-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.binder-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        const activeTab = document.querySelector(`.binder-tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }
        
        // Update active panel
        document.querySelectorAll('.module-panel').forEach(panel => {
            panel.hidden = true;
        });
        
        const activePanel = document.getElementById(`panel-${tabName}`);
        if (activePanel) {
            activePanel.hidden = false;
        }
        
        this.currentTab = tabName;
        this.updateTabIndicator(activeTab);
    }
    
    updateTabIndicator(activeTab) {
        const indicator = document.querySelector('.tab-indicator');
        if (!activeTab || !indicator) return;
        
        const rect = activeTab.getBoundingClientRect();
        const binderTabsRect = document.querySelector('.binder-tabs').getBoundingClientRect();
        
        indicator.style.left = `${rect.left - binderTabsRect.left}px`;
        indicator.style.width = `${rect.width}px`;
    }
    
    initButtons() {
        document.getElementById('btn-add-chantier')?.addEventListener('click', () => this.openAddChantierModal());
        document.getElementById('btn-add-salarie')?.addEventListener('click', () => this.openAddSalarieModal());
        document.getElementById('btn-add-pointage')?.addEventListener('click', () => this.openAddPointageModal());
        
        document.getElementById('btn-export-chantiers')?.addEventListener('click', () => this.exportChantiers());
        document.getElementById('btn-export-salaries')?.addEventListener('click', () => this.exportSalaries());
        document.getElementById('btn-export-pointages')?.addEventListener('click', () => this.exportPointages());
        
        document.getElementById('btn-print-chantiers')?.addEventListener('click', () => this.printModule('chantiers'));
        document.getElementById('btn-print-salaries')?.addEventListener('click', () => this.printModule('salaries'));
        document.getElementById('btn-print-pointages')?.addEventListener('click', () => this.printModule('pointages'));
    }
    
    initSearchFilters() {
        document.getElementById('search-chantier')?.addEventListener('input', (e) => this.filterChantiers(e.target.value));
        document.getElementById('search-salarie')?.addEventListener('input', (e) => this.filterSalaries(e.target.value));
        document.getElementById('search-pointage')?.addEventListener('input', (e) => this.filterPointages(e.target.value));
        
        document.getElementById('filter-chantier-statut')?.addEventListener('change', (e) => this.renderChantiers());
        document.getElementById('filter-salarie-chantier')?.addEventListener('change', (e) => this.filterSalariesByChantier(e.target.value));
        document.getElementById('filter-salarie-categorie')?.addEventListener('change', (e) => this.renderSalaries());
        document.getElementById('filter-pointage-date')?.addEventListener('change', (e) => this.filterPointagesByDate(e.target.value));
        document.getElementById('filter-pointage-chantier')?.addEventListener('change', (e) => this.filterPointagesByChantier(e.target.value));
        document.getElementById('filter-pointage-equipe')?.addEventListener('change', (e) => this.filterPointagesByEquipe(e.target.value));
    }
    
    initModals() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        const btnCancel = document.getElementById('btn-cancel');
        
        [modalClose, btnCancel].forEach(element => {
            if (element) element.addEventListener('click', () => this.closeModal());
        });
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.closeModal();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modalOverlay.hidden) this.closeModal();
        });
        
        const modalForm = document.getElementById('modal-form');
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveModalForm();
            });
        }
    }
    
    openAddChantierModal() {
        this.editedModule = 'chantiers';
        this.editedItem = null;
        this.openModal('Nouveau Chantier', this.getChantierFormFields(), 'Enregistrer');
    }
    
    openEditChantierModal(chantier) {
        this.editedModule = 'chantiers';
        this.editedItem = chantier;
        this.openModal('Modifier Chantier', this.getChantierFormFields(chantier), 'Mettre à jour');
    }
    
    openAddSalarieModal() {
        this.editedModule = 'salaries';
        this.editedItem = null;
        this.openModal('Nouveau Salarié', this.getSalarieFormFields(), 'Enregistrer');
    }
    
    openEditSalarieModal(salarie) {
        this.editedModule = 'salaries';
        this.editedItem = salarie;
        this.openModal('Modifier Salarié', this.getSalarieFormFields(salarie), 'Mettre à jour');
    }
    
    openAddPointageModal() {
        this.editedModule = 'pointages';
        this.editedItem = null;
        this.openModal('Nouveau Pointage', this.getPointageFormFields(), 'Enregistrer');
    }
    
    openEditPointageModal(pointage) {
        this.editedModule = 'pointages';
        this.editedItem = pointage;
        this.openModal('Modifier Pointage', this.getPointageFormFields(pointage), 'Mettre à jour');
    }
    
    openModal(title, fields, submitText) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const formFields = document.getElementById('form-fields');
        const btnSubmitText = document.getElementById('btn-submit-text');
        
        if (modalTitle) modalTitle.textContent = title;
        if (btnSubmitText) btnSubmitText.textContent = submitText;
        if (formFields) formFields.innerHTML = fields;
        if (modalOverlay) modalOverlay.hidden = false;
        
        setTimeout(() => {
            const firstInput = formFields.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) modalOverlay.hidden = true;
        this.editedItem = null;
        this.editedModule = null;
    }
    
    saveModalForm() {
        const form = document.getElementById('modal-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        if (this.editedModule === 'chantiers') {
            if (data.num) data.num = parseInt(data.num);
        } else if (this.editedModule === 'pointages') {
            if (data.num) data.num = parseInt(data.num);
            if (data.jour) data.jour = parseInt(data.jour);
            if (data.heure_supp) data.heure_supp = parseFloat(data.heure_supp);
            if (data.avance) data.avance = parseFloat(data.avance);
            if (data.salaire_de_base) data.salaire_de_base = parseFloat(data.salaire_de_base);
            if (data.salaire_heure) data.salaire_heure = parseFloat(data.salaire_heure);
        }
        
        if (this.editedItem) {
            const index = this.data[this.editedModule].findIndex(item => 
                this.editedModule === 'chantiers' ? item.num === this.editedItem.num :
                this.editedModule === 'salaries' ? item.num_cin === this.editedItem.num_cin :
                item.num === this.editedItem.num
            );
            
            if (index !== -1) {
                this.data[this.editedModule][index] = {...this.data[this.editedModule][index], ...data};
                this.showToast(`Item updated successfully`, 'success');
            }
        } else {
            if (this.editedModule === 'chantiers') {
                const maxNum = Math.max(...this.data.chantiers.map(c => c.num), 0);
                data.num = maxNum + 1;
                this.data.chantiers.push(data);
            } else if (this.editedModule === 'salaries') {
                this.data.salaries.push(data);
            } else if (this.editedModule === 'pointages') {
                const maxNum = Math.max(...this.data.pointages.map(p => p.num), 0);
                data.num = maxNum + 1;
                this.data.pointages.push(data);
            }
            this.showToast(`Item added successfully`, 'success');
        }
        
        this.saveData();
        this.renderAllModules();
        this.updateChantierDropdowns();
        this.closeModal();
    }
    
    deleteItem(module, identifier) {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) return;
        
        let index;
        if (module === 'chantiers') {
            index = this.data.chantiers.findIndex(item => item.num === identifier);
        } else if (module === 'salaries') {
            index = this.data.salaries.findIndex(item => item.num_cin === identifier);
        } else if (module === 'pointages') {
            index = this.data.pointages.findIndex(item => item.num === identifier);
        }
        
        if (index !== -1) {
            this.data[module].splice(index, 1);
            this.saveData();
            this.renderAllModules();
            this.showToast(`Item deleted successfully`, 'success');
        }
    }
    
    renderAllModules() {
        this.renderChantiers();
        this.renderSalaries();
        this.renderPointages();
    }
    
    renderChantiers() {
        const tbody = document.getElementById('chantiers-tbody');
        const countEl = document.getElementById('chantiers-count');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.chantiers.map(chantier => `
            <tr>
                <td>${chantier.num}</td>
                <td>${chantier.designation}</td>
                <td>${chantier.chef_chantier}</td>
                <td>${chantier.adresse}</td>
                <td>${chantier.utilisateur}</td>
                <td>
                    <button class="action-btn" onclick="app.openEditChantierModal(${JSON.stringify(chantier).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="action-btn delete" onclick="app.deleteItem('chantiers', ${chantier.num})">🗑️</button>
                </td>
            </tr>
        `).join('');
        
        if (countEl) countEl.textContent = `${this.data.chantiers.length} chantier${this.data.chantiers.length > 1 ? 's' : ''}`;
    }
    
    renderSalaries() {
        const tbody = document.getElementById('salaries-tbody');
        const countEl = document.getElementById('salaries-count');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.salaries.map(salarie => `
            <tr>
                <td>${salarie.num_cin}</td>
                <td>${salarie.nom}</td>
                <td>${salarie.immatriculation}</td>
                <td>${salarie.num_cnss}</td>
                <td>${salarie.categorie}</td>
                <td>${salarie.service}</td>
                <td>${salarie.chantier}</td>
                <td>${salarie.equipe}</td>
                <td>${salarie.date_embauche}</td>
                <td>${salarie.declarer ? '✓' : '✗'}</td>
                <td>
                    <button class="action-btn" onclick="app.openEditSalarieModal(${JSON.stringify(salarie).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="action-btn delete" onclick="app.deleteItem('salaries', '${salarie.num_cin}')">🗑️</button>
                </td>
            </tr>
        `).join('');
        
        if (countEl) countEl.textContent = `${this.data.salaries.length} salarié${this.data.salaries.length > 1 ? 's' : ''}`;
    }
    
    renderPointages() {
        const tbody = document.getElementById('pointages-tbody');
        const countEl = document.getElementById('pointages-count');
        if (!tbody) return;
        
        tbody.innerHTML = this.data.pointages.map(pointage => `
            <tr>
                <td>${pointage.num}</td>
                <td>${pointage.date}</td>
                <td>${pointage.nom_et_prenom}</td>
                <td>${pointage.cin}</td>
                <td>${pointage.chantier}</td>
                <td>${pointage.jour}</td>
                <td>${pointage.heure_supp}</td>
                <td>${pointage.avance}</td>
                <td>${pointage.type_salarie}</td>
                <td>${pointage.salaire_de_base}</td>
                <td>${pointage.salaire_heure}</td>
                <td>${pointage.equipe}</td>
                <td>${pointage.matricule}</td>
                <td>
                    <button class="action-btn" onclick="app.openEditPointageModal(${JSON.stringify(pointage).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="action-btn delete" onclick="app.deleteItem('pointages', ${pointage.num})">🗑️</button>
                </td>
            </tr>
        `).join('');
        
        if (countEl) countEl.textContent = `${this.data.pointages.length} pointage${this.data.pointages.length > 1 ? 's' : ''}`;
    }
    
    updateChantierDropdowns() {
        const select1 = document.getElementById('filter-salarie-chantier');
        const select2 = document.getElementById('filter-pointage-chantier');
        const options = this.data.chantiers.map(c => `<option value="${c.designation}">${c.designation}</option>`).join('');
        if (select1) select1.innerHTML = '<option value="">Tous les chantiers</option>' + options;
        if (select2) select2.innerHTML = '<option value="">Tous les chantiers</option>' + options;
    }
    
    filterChantiers(query) {
        const filtered = this.data.chantiers.filter(c => 
            c.designation.toLowerCase().includes(query.toLowerCase()) ||
            c.chef_chantier.toLowerCase().includes(query.toLowerCase()) ||
            c.adresse.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFiltered('chantiers', filtered);
    }
    
    filterSalaries(query) {
        const filtered = this.data.salaries.filter(s => 
            s.nom.toLowerCase().includes(query.toLowerCase()) ||
            s.num_cin.toLowerCase().includes(query.toLowerCase()) ||
            s.immatriculation.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFiltered('salaries', filtered);
    }
    
    filterPointages(query) {
        const filtered = this.data.pointages.filter(p => 
            p.nom_et_prenom.toLowerCase().includes(query.toLowerCase()) ||
            p.cin.toLowerCase().includes(query.toLowerCase()) ||
            p.chantier.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFiltered('pointages', filtered);
    }
    
    filterPointagesByDate(date) {
        if (!date) { this.renderPointages(); return; }
        const filtered = this.data.pointages.filter(p => p.date === date);
        this.renderFiltered('pointages', filtered);
    }
    
    filterPointagesByChantier(chantier) {
        if (!chantier) { this.renderPointages(); return; }
        const filtered = this.data.pointages.filter(p => p.chantier === chantier);
        this.renderFiltered('pointages', filtered);
    }
    
    filterPointagesByEquipe(equipe) {
        if (!equipe) { this.renderPointages(); return; }
        const filtered = this.data.pointages.filter(p => p.equipe === equipe);
        this.renderFiltered('pointages', filtered);
    }
    
    filterSalariesByChantier(chantier) {
        if (!chantier) { this.renderSalaries(); return; }
        const filtered = this.data.salaries.filter(s => s.chantier === chantier);
        this.renderFiltered('salaries', filtered);
    }
    
    renderFiltered(module, data) {
        const methods = {
            chantiers: (data) => this.renderFilteredChantiers(data),
            salaries: (data) => this.renderFilteredSalaries(data),
            pointages: (data) => this.renderFilteredPointages(data)
        };
        if (methods[module]) methods[module](data);
    }
    
    renderFilteredChantiers(data) {
        const tbody = document.getElementById('chantiers-tbody');
        if (!tbody) return;
        tbody.innerHTML = data.map(c => `
            <tr>
                <td>${c.num}</td>
                <td>${c.designation}</td>
                <td>${c.chef_chantier}</td>
                <td>${c.adresse}</td>
                <td>${c.utilisateur}</td>
                <td>
                    <button class="action-btn" onclick="app.openEditChantierModal(${JSON.stringify(c).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="action-btn delete" onclick="app.deleteItem('chantiers', ${c.num})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    renderFilteredSalaries(data) {
        const tbody = document.getElementById('salaries-tbody');
        if (!tbody) return;
        tbody.innerHTML = data.map(s => `
            <tr>
                <td>${s.num_cin}</td>
                <td>${s.nom}</td>
                <td>${s.immatriculation}</td>
                <td>${s.num_cnss}</td>
                <td>${s.categorie}</td>
                <td>${s.service}</td>
                <td>${s.chantier}</td>
                <td>${s.equipe}</td>
                <td>${s.date_embauche}</td>
                <td>${s.declarer ? '✓' : '✗'}</td>
                <td>
                    <button class="action-btn" onclick="app.openEditSalarieModal(${JSON.stringify(s).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="action-btn delete" onclick="app.deleteItem('salaries', '${s.num_cin}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    renderFilteredPointages(data) {
        const tbody = document.getElementById('pointages-tbody');
        if (!tbody) return;
        tbody.innerHTML = data.map(p => `
            <tr>
                <td>${p.num}</td>
                <td>${p.date}</td>
                <td>${p.nom_et_prenom}</td>
                <td>${p.cin}</td>
                <td>${p.chantier}</td>
                <td>${p.jour}</td>
                <td>${p.heure_supp}</td>
                <td>${p.avance}</td>
                <td>${p.type_salarie}</td>
                <td>${p.salaire_de_base}</td>
                <td>${p.salaire_heure}</td>
                <td>${p.equipe}</td>
                <td>${p.matricule}</td>
                <td>
                    <button class="action-btn" onclick="app.openEditPointageModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">✏️</button>
                    <button class="action-btn delete" onclick="app.deleteItem('pointages', ${p.num})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    exportChantiers() { this.exportToCSV('chantiers', this.data.chantiers); }
    exportSalaries() { this.exportToCSV('salaries', this.data.salaries); }
    exportPointages() { this.exportToCSV('pointages', this.data.pointages); }
    
    exportToCSV(filename, data) {
        if (data.length === 0) { this.showToast('No data to export', 'warning'); return; }
        const headers = Object.keys(data[0]);
        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            csv += headers.map(h => typeof row[h] === 'string' && row[h].includes(',') ? `"${row[h]}"` : row[h]).join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showToast(`${filename} exported successfully`, 'success');
    }
    
    printModule(module) { window.print(); }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    getChantierFormFields(c = null) {
        const isEdit = !!c;
        return `
            <div class="form-group">
                <label>N°</label>
                <input type="number" name="num" ${isEdit ? `value="${c.num}" readonly` : ''} required>
            </div>
            <div class="form-group">
                <label>Désignation</label>
                <input type="text" name="designation" value="${isEdit ? c.designation : ''}" required maxlength="300">
            </div>
            <div class="form-group">
                <label>Chef de Chantier</label>
                <input type="text" name="chef_chantier" value="${isEdit ? c.chef_chantier : ''}" required maxlength="200">
            </div>
            <div class="form-group">
                <label>Adresse</label>
                <input type="text" name="adresse" value="${isEdit ? c.adresse : ''}" required maxlength="300">
            </div>
            <div class="form-group">
                <label>Utilisateur</label>
                <input type="text" name="utilisateur" value="${isEdit ? c.utilisateur : ''}" required maxlength="50">
            </div>
        `;
    }
    
    getSalarieFormFields(s = null) {
        const isEdit = !!s;
        return `
            <div class="form-group"><label>CIN</label><input type="text" name="num_cin" value="${isEdit ? s.num_cin : ''}" ${isEdit ? 'readonly' : ''} required></div>
            <div class="form-group"><label>Nom</label><input type="text" name="nom" value="${isEdit ? s.nom : ''}" required></div>
            <div class="form-group"><label>Immatriculation</label><input type="text" name="immatriculation" value="${isEdit ? s.immatriculation : ''}"></div>
            <div class="form-group"><label>CNSS</label><input type="text" name="num_cnss" value="${isEdit ? s.num_cnss : ''}"></div>
            <div class="form-group"><label>N° Dossier</label><input type="number" name="num_dossier" value="${isEdit ? s.num_dossier : ''}" required></div>
            <div class="form-group"><label>Date Embauche</label><input type="date" name="date_embauche" value="${isEdit ? s.date_embauche : ''}" required></div>
            <div class="form-group"><label>Catégorie</label><input type="text" name="categorie" value="${isEdit ? s.categorie : ''}" required></div>
            <div class="form-group"><label>Service</label><input type="text" name="service" value="${isEdit ? s.service : ''}" required></div>
            <div class="form-group"><label>Chantier</label><input type="text" name="chantier" value="${isEdit ? s.chantier : ''}" required></div>
            <div class="form-group"><label>Équipe</label><input type="text" name="equipe" value="${isEdit ? s.equipe : ''}" required></div>
        `;
    }
    
    getPointageFormFields(p = null) {
        const isEdit = !!p;
        return `
            <div class="form-group"><label>Date</label><input type="date" name="date" value="${isEdit ? p.date : ''}" required></div>
            <div class="form-group"><label>Nom & Prénom</label><input type="text" name="nom_et_prenom" value="${isEdit ? p.nom_et_prenom : ''}" required></div>
            <div class="form-group"><label>CIN</label><input type="text" name="cin" value="${isEdit ? p.cin : ''}" required></div>
            <div class="form-group"><label>Chantier</label><input type="text" name="chantier" value="${isEdit ? p.chantier : ''}" required></div>
            <div class="form-group"><label>Jour</label><input type="number" name="jour" value="${isEdit ? p.jour : ''}" required></div>
            <div class="form-group"><label>Heures Supplémentaires</label><input type="number" name="heure_supp" value="${isEdit ? p.heure_supp : ''}" step="0.5"></div>
            <div class="form-group"><label>Avance</label><input type="number" name="avance" value="${isEdit ? p.avance : ''}" step="0.01"></div>
            <div class="form-group"><label>Type de Salarié</label><input type="text" name="type_salarie" value="${isEdit ? p.type_salarie : ''}" required></div>
            <div class="form-group"><label>Salaire Base</label><input type="number" name="salaire_de_base" value="${isEdit ? p.salaire_de_base : ''}" step="0.01" required></div>
            <div class="form-group"><label>Salaire/Heure</label><input type="number" name="salaire_heure" value="${isEdit ? p.salaire_heure : ''}" step="0.01" required></div>
            <div class="form-group"><label>Équipe</label><input type="text" name="equipe" value="${isEdit ? p.equipe : ''}" required></div>
            <div class="form-group"><label>Matricule</label><input type="text" name="matricule" value="${isEdit ? p.matricule : ''}" required></div>
        `;
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ManagerProApp();
});
