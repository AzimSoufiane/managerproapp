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
                situation_familiale: "Marié",
                nombre_enfant: 2,
                date_naissance: "1990-08-22",
                lieu_naissance: "Casablanca",
                adresse: "78 Rue Ibn Sina, Casablanca",
                categorie: "Ouvrier qualifié",
                service: "Construction",
                chantier: "Construction du Centre Commercial",
                declarer: true,
                equipe: "Equipe A",
                date_record: new Date().toISOString()
            },
            {
                num_cin: "CD789012",
                nom: "Sophie Martin",
                immatriculation: "789012",
                num_cnss: "CNSS345",
                num_dossier: 1002,
                date_embauche: "2021-11-01",
                situation_familiale: "Célibataire",
                nombre_enfant: 0,
                date_naissance: "1995-04-10",
                lieu_naissance: "Marrakech",
                adresse: "34 Rue Al Qods, Marrakech",
                categorie: "Ingénieur",
                service: "Études",
                chantier: "Résidence Al Amal",
                declarer: true,
                equipe: "Equipe B",
                date_record: new Date().toISOString()
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
        
        // Update tab indicator position
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
        // Add buttons for each module
        document.getElementById('btn-add-chantier')?.addEventListener('click', () => this.openAddChantierModal());
        document.getElementById('btn-add-salarie')?.addEventListener('click', () => this.openAddSalarieModal());
        document.getElementById('btn-add-pointage')?.addEventListener('click', () => this.openAddPointageModal());
        
        // Export buttons
        document.getElementById('btn-export-chantiers')?.addEventListener('click', () => this.exportChantiers());
        document.getElementById('btn-export-salaries')?.addEventListener('click', () => this.exportSalaries());
        document.getElementById('btn-export-pointages')?.addEventListener('click', () => this.exportPointages());
        
        // Print buttons
        document.getElementById('btn-print-chantiers')?.addEventListener('click', () => this.printModule('chantiers'));
        document.getElementById('btn-print-salaries')?.addEventListener('click', () => this.printModule('salaries'));
        document.getElementById('btn-print-pointages')?.addEventListener('click', () => this.printModule('pointages'));
    }
    
    initSearchFilters() {
        // Search inputs
        document.getElementById('search-chantier')?.addEventListener('input', (e) => {
            this.filterChantiers(e.target.value);
        });
        
        document.getElementById('search-salarie')?.addEventListener('input', (e) => {
            this.filterSalaries(e.target.value);
        });
        
        document.getElementById('search-pointage')?.addEventListener('input', (e) => {
            this.filterPointages(e.target.value);
        });
        
        // Filter selects
        document.getElementById('filter-chantier-statut')?.addEventListener('change', (e) => {
            this.filterChantiersByStatus(e.target.value);
        });
        
        document.getElementById('filter-salarie-chantier')?.addEventListener('change', (e) => {
            this.filterSalariesByChantier(e.target.value);
        });
        
        document.getElementById('filter-salarie-categorie')?.addEventListener('change', (e) => {
            this.filterSalariesByCategorie(e.target.value);
        });
        
        document.getElementById('filter-pointage-date')?.addEventListener('change', (e) => {
            this.filterPointagesByDate(e.target.value);
        });
        
        document.getElementById('filter-pointage-chantier')?.addEventListener('change', (e) => {
            this.filterPointagesByChantier(e.target.value);
        });
        
        document.getElementById('filter-pointage-equipe')?.addEventListener('change', (e) => {
            this.filterPointagesByEquipe(e.target.value);
        });
    }
    
    initModals() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        const btnCancel = document.getElementById('btn-cancel');
        
        // Close modal
        [modalClose, btnCancel].forEach(element => {
            if (element) {
                element.addEventListener('click', () => this.closeModal());
            }
        });
        
        // Close on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modalOverlay.hidden) {
                this.closeModal();
            }
        });
        
        // Form submission
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
        
        // Focus first input
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
        
        // Convert numeric fields
        if (this.editedModule === 'chantiers') {
            if (data.num) data.num = parseInt(data.num);
        } else if (this.editedModule === 'salaries') {
            if (data.num_dossier) data.num_dossier = parseInt(data.num_dossier);
            if (data.nombre_enfant) data.nombre_enfant = parseInt(data.nombre_enfant);
            data.declarer = data.declarer === 'true' || data.declarer === 'on';
            data.date_record = new Date().toISOString();
        } else if (this.editedModule === 'pointages') {
            if (data.num) data.num = parseInt(data.num);
            if (data.jour) data.jour = parseInt(data.jour);
            if (data.heure_supp) data.heure_supp = parseFloat(data.heure_supp);
            if (data.avance) data.avance = parseFloat(data.avance);
            if (data.salaire_de_base) data.salaire_de_base = parseFloat(data.salaire_de_base);
            if (data.salaire_heure) data.salaire_heure = parseFloat(data.salaire_heure);
        }
        
        if (this.editedItem) {
            // Update existing item
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
            // Add new item
            if (this.editedModule === 'chantiers') {
                // Generate new num
                const maxNum = Math.max(...this.data.chantiers.map(c => c.num), 0);
                data.num = maxNum + 1;
                this.data.chantiers.push(data);
            } else if (this.editedModule === 'salaries') {
                // num_cin is the primary key
                this.data.salaries.push(data);
            } else if (this.editedModule === 'pointages') {
                // Generate new num
                const maxNum = Math.max(...this.data.pointages.map(p => p.num), 0);
                data.num = maxNum + 1;
                this.data.pointages.push(data);
            }
            this.showToast(`Item added successfully`, 'success');
        }
        
        this.saveData();
        this.renderAllModules();
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
    
    getChantierFormFields(chantier = null) {
        const isEdit = !!chantier;
        return `
            <div class="form-group">
                <label for="form-num">N°</label>
                <input type="number" id="form-num" name="num" ${isEdit ? 'value="' + chantier.num + '"' : ''} ${isEdit ? 'readonly' : ''} required>
            </div>
            <div class="form-group">
                <label for="form-designation">Désignation</label>
                <input type="text" id="form-designation" name="designation" value="${isEdit ? chantier.designation : ''}" required maxlength="300">
            </div>
            <div class="form-group">
                <label for="form-chef_chantier">Chef de Chantier</label>
                <input type="text" id="form-chef_chantier" name="chef_chantier" value="${isEdit ? chantier.chef_chantier : ''}" required maxlength="200">
            </div>
            <div class="form-group">
                <label for="form-adresse">Adresse</label>
                <input type="text" id="form-adresse" name="adresse" value="${isEdit ? chantier.adresse : ''}" required maxlength="300">
            </div>
            <div class="form-group">
                <label for="form-utilisateur">Utilisateur</label>
                <input type="text" id="form-utilisateur" name="utilisateur" value="${isEdit ? chantier.utilisateur : ''}" required maxlength="50">
            </div>
        `;
    }
    
    getSalarieFormFields(salarie = null) {
        const isEdit = !!salarie;
        return `
            <div class="form-group">
                <label for="form-num_cin">CIN</label>
                <input type="text" id="form-num_cin" name="num_cin" value="${isEdit ? salarie.num_cin : ''}" ${isEdit ? 'readonly' : ''} required maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-nom">Nom</label>
                <input type="text" id="form-nom" name="nom" value="${isEdit ? salarie.nom : ''}" required maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-immatriculation">Immatriculation</label>
                <input type="text" id="form-immatriculation" name="immatriculation" value="${isEdit ? salarie.immatriculation : ''}" maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-num_cnss">CNSS</label>
                <input type="text" id="form-num_cnss" name="num_cnss" value="${isEdit ? salarie.num_cnss : ''}" maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-num_dossier">N° Dossier</label>
                <input type="number" id="form-num_dossier" name="num_dossier" value="${isEdit ? salarie.num_dossier : ''}" required>
            </div>
            <div class="form-group">
                <label for="form-date_embauche">Date d'embauche</label>
                <input type="date" id="form-date_embauche" name="date_embauche" value="${isEdit ? salarie.date_embauche : ''}" required>
            </div