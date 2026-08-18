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
        this.loadData();
        this.initTabNavigation();
        this.initButtons();
        this.initSearchFilters();
        this.initModals();
        this.renderAllModules();
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
        document.querySelectorAll('.binder-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        const activeTab = document.querySelector(`.binder-tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }
        
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
        document.getElementById('search-chantier')?.addEventListener('input', (e) => {
            this.filterChantiers(e.target.value);
        });
        
        document.getElementById('search-salarie')?.addEventListener('input', (e) => {
            this.filterSalaries(e.target.value);
        });
        
        document.getElementById('search-pointage')?.addEventListener('input', (e) => {
            this.filterPointages(e.target.value);
        });
        
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
        
        [modalClose, btnCancel].forEach(element => {
            if (element) {
                element.addEventListener('click', () => this.closeModal());
            }
        });
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
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
        
        if (modalOverlay) {
            modalOverlay.hidden = false;
            modalOverlay.classList.add('active');
        }
        
        setTimeout(() => {
            const firstInput = formFields.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            modalOverlay.hidden = true;
        }
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
            </div>
            <div class="form-group">
                <label for="form-situation_familiale">Situation familiale</label>
                <input type="text" id="form-situation_familiale" name="situation_familiale" value="${isEdit ? salarie.situation_familiale : ''}" maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-nombre_enfant">Nombre d'enfants</label>
                <input type="number" id="form-nombre_enfant" name="nombre_enfant" value="${isEdit ? salarie.nombre_enfant : ''}" min="0">
            </div>
            <div class="form-group">
                <label for="form-date_naissance">Date de naissance</label>
                <input type="date" id="form-date_naissance" name="date_naissance" value="${isEdit ? salarie.date_naissance : ''}" required>
            </div>
            <div class="form-group">
                <label for="form-lieu_naissance">Lieu de naissance</label>
                <input type="text" id="form-lieu_naissance" name="lieu_naissance" value="${isEdit ? salarie.lieu_naissance : ''}" maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-adresse">Adresse</label>
                <input type="text" id="form-adresse" name="adresse" value="${isEdit ? salarie.adresse : ''}" maxlength="200">
            </div>
            <div class="form-group">
                <label for="form-categorie">Catégorie</label>
                <input type="text" id="form-categorie" name="categorie" value="${isEdit ? salarie.categorie : ''}" maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-service">Service</label>
                <input type="text" id="form-service" name="service" value="${isEdit ? salarie.service : ''}" maxlength="100">
            </div>
            <div class="form-group">
                <label for="form-chantier">Chantier</label>
                <select id="form-chantier" name="chantier" required>
                    <option value="">Sélectionner un chantier</option>
                    ${this.data.chantiers.map(c => `
                        <option value="${c.designation}" ${isEdit && salarie.chantier === c.designation ? 'selected' : ''}>
                            ${c.designation}
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="form-declarer">Déclaré</label>
                <select id="form-declarer" name="declarer">
                    <option value="true" ${isEdit && salarie.declarer === true ? 'selected' : ''}>Oui</option>
                    <option value="false" ${isEdit && salarie.declarer === false ? 'selected' : ''}>Non</option>
                </select>
            </div>
            <div class="form-group">
                <label for="form-equipe">Équipe</label>
                <input type="text" id="form-equipe" name="equipe" value="${isEdit ? salarie.equipe : ''}" maxlength="333">
            </div>
        `;
    }
    
    getPointageFormFields(pointage = null) {
        const isEdit = !!pointage;
        return `
            <div class="form-group">
                <label for="form-num">N°</label>
                <input type="number" id="form-num" name="num" ${isEdit ? 'value="' + pointage.num + '"' : ''} ${isEdit ? 'readonly' : ''} required>
            </div>
            <div class="form-group">
                <label for="form-date">Date</label>
                <input type="date" id="form-date" name="date" value="${isEdit ? pointage.date : ''}" required>
            </div>
            <div class="form-group">
                <label for="form-nom_et_prenom">Nom & Prénom</label>
                <input type="text" id="form-nom_et_prenom" name="nom_et_prenom" value="${isEdit ? pointage.nom_et_prenom : ''}" maxlength="555">
            </div>
            <div class="form-group">
                <label for="form-cin">CIN</label>
                <input type="text" id="form-cin" name="cin" value="${isEdit ? pointage.cin : ''}" maxlength="555">
            </div>
            <div class="form-group">
                <label for="form-chantier">Chantier</label>
                <select id="form-chantier" name="chantier" required>
                    <option value="">Sélectionner un chantier</option>
                    ${this.data.chantiers.map(c => `
                        <option value="${c.designation}" ${isEdit && pointage.chantier === c.designation ? 'selected' : ''}>
                            ${c.designation}
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="form-jour">Jour</label>
                <input type="number" id="form-jour" name="jour" value="${isEdit ? pointage.jour : ''}" required min="1" max="31">
            </div>
            <div class="form-group">
                <label for="form-heure_supp">Heures Supplémentaires</label>
                <input type="number" id="form-heure_supp" name="heure_supp" value="${isEdit ? pointage.heure_supp : ''}" min="0" step="0.5">
            </div>
            <div class="form-group">
                <label for="form-avance">Avance</label>
                <input type="number" id="form-avance" name="avance" value="${isEdit ? pointage.avance : ''}" min="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="form-type_salarie">Type de Salarié</label>
                <input type="text" id="form-type_salarie" name="type_salarie" value="${isEdit ? pointage.type_salarie : ''}" maxlength="555">
            </div>
            <div class="form-group">
                <label for="form-salaire_de_base">Salaire de Base</label>
                <input type="number" id="form-salaire_de_base" name="salaire_de_base" value="${isEdit ? pointage.salaire_de_base : ''}" min="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="form-salaire_heure">Salaire Horaire</label>
                <input type="number" id="form-salaire_heure" name="salaire_heure" value="${isEdit ? pointage.salaire_heure : ''}" min="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="form-equipe">Équipe</label>
                <input type="text" id="form-equipe" name="equipe" value="${isEdit ? pointage.equipe : ''}" maxlength="777">
            </div>
            <div class="form-group">
                <label for="form-matricule">Matricule</label>
                <input type="text" id="form-matricule" name="matricule" value="${isEdit ? pointage.matricule : ''}" maxlength="555">
            </div>
        `;
    }
    
    filterChantiers(searchTerm) {
        this.renderChantiersTable(this.data.chantiers.filter(chantier =>
            chantier.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chantier.chef_chantier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chantier.adresse.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
    
    filterChantiersByStatus(status) {
        this.renderChantiersTable(this.data.chantiers);
    }
    
    filterSalaries(searchTerm) {
        this.renderSalariesTable(this.data.salaries.filter(salarie =>
            salarie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salarie.num_cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salarie.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
    
    filterSalariesByChantier(chantier) {
        if (!chantier) {
            this.renderSalariesTable(this.data.salaries);
        } else {
            this.renderSalariesTable(this.data.salaries.filter(salarie => salarie.chantier === chantier));
        }
    }
    
    filterSalariesByCategorie(categorie) {
        if (!categorie) {
            this.renderSalariesTable(this.data.salaries);
        } else {
            this.renderSalariesTable(this.data.salaries.filter(salarie => salarie.categorie === categorie));
        }
    }
    
    filterPointages(searchTerm) {
        this.renderPointagesTable(this.data.pointages.filter(pointage =>
            pointage.nom_et_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pointage.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pointage.chantier.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
    
    filterPointagesByDate(date) {
        if (!date) {
            this.renderPointagesTable(this.data.pointages);
        } else {
            this.renderPointagesTable(this.data.pointages.filter(pointage => pointage.date === date));
        }
    }
    
    filterPointagesByChantier(chantier) {
        if (!chantier) {
            this.renderPointagesTable(this.data.pointages);
        } else {
            this.renderPointagesTable(this.data.pointages.filter(pointage => pointage.chantier === chantier));
        }
    }
    
    filterPointagesByEquipe(equipe) {
        if (!equipe) {
            this.renderPointagesTable(this.data.pointages);
        } else {
            this.renderPointagesTable(this.data.pointages.filter(pointage => pointage.equipe === equipe));
        }
    }
    
    renderAllModules() {
        this.renderChantiersTable();
        this.renderSalariesTable();
        this.renderPointagesTable();
        this.updateChantierDropdowns();
        this.updateRecordCounts();
    }
    
    renderChantiersTable(chantiers = this.data.chantiers) {
        const tbody = document.getElementById('chantiers-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (chantiers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">Aucun chantier trouvé</td>
                </tr>
            `;
            return;
        }
        
        chantiers.forEach(chantier => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${chantier.num}</td>
                <td>${chantier.designation}</td>
                <td>${chantier.chef_chantier}</td>
                <td>${chantier.adresse}</td>
                <td>${chantier.utilisateur}</td>
                <td class="actions-cell">
                    <button class="btn-action btn-edit" data-num="${chantier.num}" title="Modifier">
                        <span class="action-icon">✏️</span>
                    </button>
                    <button class="btn-action btn-delete" data-num="${chantier.num}" title="Supprimer">
                        <span class="action-icon">🗑️</span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.closest('[data-num]').dataset.num);
                const chantier = this.data.chantiers.find(c => c.num === num);
                if (chantier) this.openEditChantierModal(chantier);
            });
        });
        
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.closest('[data-num]').dataset.num);
                this.deleteItem('chantiers', num);
            });
        });
        
        this.updateChantierPagination();
    }
    
    renderSalariesTable(salaries = this.data.salaries) {
        const tbody = document.getElementById('salaries-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (salaries.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="no-data">Aucun salarié trouvé</td>
                </tr>
            `;
            return;
        }
        
        salaries.forEach(salarie => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${salarie.num_cin}</td>
                <td>${salarie.nom}</td>
                <td>${salarie.immatriculation}</td>
                <td>${salarie.num_cnss}</td>
                <td>${salarie.categorie}</td>
                <td>${salarie.service}</td>
                <td>${salarie.chantier}</td>
                <td>${salarie.equipe}</td>
                <td>${salarie.date_embauche}</td>
                <td>${salarie.declarer ? 'Oui' : 'Non'}</td>
                <td class="actions-cell">
                    <button class="btn-action btn-edit" data-cin="${salarie.num_cin}" title="Modifier">
                        <span class="action-icon">✏️</span>
                    </button>
                    <button class="btn-action btn-delete" data-cin="${salarie.num_cin}" title="Supprimer">
                        <span class="action-icon">🗑️</span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cin = e.target.closest('[data-cin]').dataset.cin;
                const salarie = this.data.salaries.find(s => s.num_cin === cin);
                if (salarie) this.openEditSalarieModal(salarie);
            });
        });
        
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cin = e.target.closest('[data-cin]').dataset.cin;
                this.deleteItem('salaries', cin);
            });
        });
        
        this.updateSalariesPagination();
    }
    
    renderPointagesTable(pointages = this.data.pointages) {
        const tbody = document.getElementById('pointages-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (pointages.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="13" class="no-data">Aucun pointage trouvé</td>
                </tr>
            `;
            return;
        }
        
        pointages.forEach(pointage => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
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
                <td class="actions-cell">
                    <button class="btn-action btn-edit" data-num="${pointage.num}" title="Modifier">
                        <span class="action-icon">✏️</span>
                    </button>
                    <button class="btn-action btn-delete" data-num="${pointage.num}" title="Supprimer">
                        <span class="action-icon">🗑️</span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.closest('[data-num]').dataset.num);
                const pointage = this.data.pointages.find(p => p.num === num);
                if (pointage) this.openEditPointageModal(pointage);
            });
        });
        
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.closest('[data-num]').dataset.num);
                this.deleteItem('pointages', num);
            });
        });
        
        this.updatePointagesPagination();
    }
    
    updateChantierDropdowns() {
        const salaireChantierSelect = document.getElementById('filter-salarie-chantier');
        if (salaireChantierSelect) {
            salaireChantierSelect.innerHTML = '<option value="">Tous les chantiers</option>' +
                this.data.chantiers.map(c => `<option value="${c.designation}">${c.designation}</option>`).join('');
        }
        
        const pointageChantierFilter = document.getElementById('filter-pointage-chantier');
        if (pointageChantierFilter) {
            pointageChantierFilter.innerHTML = '<option value="">Tous les chantiers</option>' +
                this.data.chantiers.map(c => `<option value="${c.designation}">${c.designation}</option>`).join('');
        }
    }
    
    updateRecordCounts() {
        document.getElementById('chantiers-count')?.textContent = `${this.data.chantiers.length} chantiers`;
        document.getElementById('salaries-count')?.textContent = `${this.data.salaries.length} salariés`;
        document.getElementById('pointages-count')?.textContent = `${this.data.pointages.length} pointages`;
    }
    
    updateChantierPagination() {
        const pagination = document.getElementById('chantiers-pagination');
        if (!pagination) return;
        
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Affichage de 1 à ${this.data.chantiers.length} sur ${this.data.chantiers.length} entrées`;
        pagination.innerHTML = '';
        pagination.appendChild(pageInfo);
    }
    
    updateSalariesPagination() {
        const pagination = document.getElementById('salaries-pagination');
        if (!pagination) return;
        
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Affichage de 1 à ${this.data.salaries.length} sur ${this.data.salaries.length} entrées`;
        pagination.innerHTML = '';
        pagination.appendChild(pageInfo);
    }
    
    updatePointagesPagination() {
        const pagination = document.getElementById('pointages-pagination');
        if (!pagination) return;
        
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Affichage de 1 à ${this.data.pointages.length} sur ${this.data.pointages.length} entrées`;
        pagination.innerHTML = '';
        pagination.appendChild(pageInfo);
    }
    
    exportChantiers() {
        const csv = this.convertToCSV(this.data.chantiers, [
            { key: 'num', label: 'N°' },
            { key: 'designation', label: 'Désignation' },
            { key: 'chef_chantier', label: 'Chef de Chantier' },
            { key: 'adresse', label: 'Adresse' },
            { key: 'utilisateur', label: 'Utilisateur' }
        ]);
        this.downloadFile(csv, 'chantiers.csv');
        this.showToast('Chantiers exportés avec succès', 'success');
    }
    
    exportSalaries() {
        const csv = this.convertToCSV(this.data.salaries, [
            { key: 'num_cin', label: 'CIN' },
            { key: 'nom', label: 'Nom' },
            { key: 'immatriculation', label: 'Immatriculation' },
            { key: 'num_cnss', label: 'CNSS' },
            { key: 'num_dossier', label: 'N° Dossier' },
            { key: 'date_embauche', label: 'Date d\'embauche' },
            { key: 'situation_familiale', label: 'Situation familiale' },
            { key: 'nombre_enfant', label: 'Nombre d\'enfants' },
            { key: 'date_naissance', label: 'Date de naissance' },
            { key: 'lieu_naissance', label: 'Lieu de naissance' },
            { key: 'adresse', label: 'Adresse' },
            { key: 'categorie', label: 'Catégorie' },
            { key: 'service', label: 'Service' },
            { key: 'chantier', label: 'Chantier' },
            { key: 'declarer', label: 'Déclaré' },
            { key: 'equipe', label: 'Équipe' },
            { key: 'date_record', label: 'Date d\'enregistrement' }
        ]);
        this.downloadFile(csv, 'salaries.csv');
        this.showToast('Salariés exportés avec succès', 'success');
    }
    
    exportPointages() {
        const csv = this.convertToCSV(this.data.pointages, [
            { key: 'num', label: 'N°' },
            { key: 'date', label: 'Date' },
            { key: 'nom_et_prenom', label: 'Nom & Prénom' },
            { key: 'cin', label: 'CIN' },
            { key: 'chantier', label: 'Chantier' },
            { key: 'jour', label: 'Jour' },
            { key: 'heure_supp', label: 'Heures Suppl.' },
            { key: 'avance', label: 'Avance' },
            { key: 'type_salarie', label: 'Type Salarié' },
            { key: 'salaire_de_base', label: 'Salaire Base' },
            { key: 'salaire_heure', label: 'Salaire Heure' },
            { key: 'equipe', label: 'Équipe' },
            { key: 'matricule', label: 'Matricule' }
        ]);
        this.downloadFile(csv, 'pointages.csv');
        this.showToast('Pointages exportés avec succès', 'success');
    }
    
    convertToCSV(data, fields) {
        const header = fields.map(f => `"${f.label}"`).join(',');
        const rows = data.map(item => 
            fields.map(f => {
                const value = item[f.key] === null || item[f.key] === undefined ? '' : item[f.key];
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        );
        return [header, ...rows].join('\n');
    }
    
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    printModule(module) {
        document.querySelectorAll('.module-panel').forEach(panel => {
            panel.style.display = 'none';
        });
        
        const panelToPrint = document.getElementById(`panel-${module}`);
        if (panelToPrint) {
            panelToPrint.style.display = 'block';
        }
        
        window.print();
        
        setTimeout(() => {
            document.querySelectorAll('.module-panel').forEach(panel => {
                panel.style.display = '';
            });
            
            document.querySelectorAll('.module-panel').forEach(panel => {
                const panelId = panel.id.replace('panel-', '');
                if (panelId !== this.currentTab) {
                    panel.style.display = 'none';
                }
            });
        }, 500);
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3100);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.managerProApp = new ManagerProApp();
});