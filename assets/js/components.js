// ==========================================================================
// RENDERIZADOR COMPONETIZADO DE NAVEGACIÓN (Rutas Relativas Precisas)
// ==========================================================================

const NavigationComponents = {
    // 1. Calcular prefijo relativo exacto hacia la raíz del proyecto vlite
    getRelativePrefix() {
        const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
        const indexCursos = pathParts.indexOf('cursos');
        
        // Si no estamos dentro de la carpeta 'cursos', estamos en la raíz del proyecto
        if (indexCursos === -1) {
            return './';
        }
        
        // La distancia desde la raíz es la cantidad de carpetas después de 'cursos' + 1 (la propia carpeta 'cursos')
        const depthFromRoot = (pathParts.length - 1) - indexCursos;
        return '../'.repeat(depthFromRoot);
    },

    // 2. Renderizar Sidebar
    renderSidebar(activeTab = 'dashboard') {
        const sidebar = document.getElementById('app-sidebar');
        if (!sidebar) return;

        const prefix = this.getRelativePrefix();

        sidebar.className = 'sidebar';
        sidebar.innerHTML = `
            <!-- TOP: Header & Nav Fijo -->
            <div class="sidebar-top-group">
                <div class="sidebar-header">
                    <h2>RedBuho vLite</h2>
                </div>
                
                <nav class="sidebar-nav">
                    <a href="${prefix}index.html" class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Dashboard
                    </a>
                    <a href="${prefix}index.html" class="nav-item ${activeTab === 'curriculum' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        Currículo
                    </a>
                    <a href="#" class="nav-item ${activeTab === 'downloads' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Descargas
                    </a>
                    <a href="#" class="nav-item ${activeTab === 'settings' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Ajustes
                    </a>
                </nav>
            </div>

            <!-- MID: Área Central Flexible -->
            <div class="sidebar-mid-container" id="sidebar-mid-content"></div>

            <!-- BOTTOM: Offline Card & Footer Fijos -->
            <div class="sidebar-bottom-group">
                <div class="sidebar-offline-card">
                    <div class="offline-status">
                        <span class="status-dot"></span> OFFLINE READY
                    </div>
                    <button class="btn-resume-last">Resume Last Lesson</button>
                </div>

                <div class="sidebar-footer">
                    <a href="#" class="footer-link">Support</a>
                    <a href="#" class="footer-link">Sign Out</a>
                </div>
            </div>
        `;
    },

    // 3. Renderizar Top Header
    renderTopHeader() {
        const topHeader = document.getElementById('app-top-header');
        if (!topHeader) return;

        topHeader.className = 'top-header';
        topHeader.innerHTML = `
            <nav class="top-nav">
                <a href="#" class="active">Módulos</a>
                <a href="#">Biblioteca</a>
                <a href="#">Recursos</a>
            </nav>
            
            <div class="header-user-status">
                <div class="badge-offline">
                    <span class="badge-icon">×</span> MODO OFFLINE / USB
                </div>
                <div class="header-icons">
                    <div class="user-avatar"></div>
                </div>
            </div>
        `;
    },

    init(activeTab = 'dashboard') {
        this.renderSidebar(activeTab);
        this.renderTopHeader();
    }
};