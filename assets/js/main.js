// 1. Inyectar menú global dinámico de retorno
function inyectarMenuGlobal() {
    const nav = document.getElementById('menu-global');
    if (!nav) return;
    
    const pathParts = window.location.pathname.split('/');
    let rutaRegresar = "../index.html"; 

    if (pathParts[pathParts.length - 3] === 'cursos') {
        rutaRegresar = '../../index.html'; 
    } 
    else if (!window.location.pathname.includes('/cursos/')) {
        nav.innerHTML = ''; 
        return; 
    }

    nav.innerHTML = `
        <div style="height: 60px; background: var(--color-azul-obscuro); padding: 16px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; align-items: center;">
            <a href="${rutaRegresar}" style="color: var(--color-blanco); text-decoration: none; font-weight: 600; font-family: sans-serif; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; transition: opacity 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path>
                </svg>
                Regresar
            </a>
        </div>
    `;
}

// 2. Lógica centralizada de la plataforma
function init() {
    // Determine active tab for sidebar
    const path = window.location.pathname;
    let activeTab = 'dashboard';
    if (path.includes('/cursos/')) activeTab = 'curriculum';

    // Inyectar Componentes Unificados (Sidebar + Header)
    if (typeof NavigationComponents !== 'undefined') {
        NavigationComponents.init(activeTab);
    }

    // A. Vista de Inicio (Dashboard Principal)
    const listaCursos = document.getElementById('lista-cursos');
    if (listaCursos && typeof CONFIG !== 'undefined' && typeof StorageManager !== 'undefined') {
        const state = StorageManager.getState();

        listaCursos.innerHTML = '';
        CONFIG.cursos.forEach(c => {
            const inicial = c.nombre.charAt(0).toUpperCase();
            const cursoProgreso = state.progreso[c.id] || { leccionesCompletadas: [] };
            const completadasCount = cursoProgreso.leccionesCompletadas.length;

            listaCursos.innerHTML += `
                <a href="cursos/${c.id}/index.html" class="course-card">
                    <div class="course-card-header">
                        <span class="course-initial">${inicial}</span>
                    </div>
                    <div class="course-card-body">
                        <h3 class="course-title">${c.nombre}</h3>
                        <div class="course-meta" style="font-size: 0.75rem; color: var(--color-texto-muted); margin-bottom: 12px; font-weight: 600;">
                            ${completadasCount} lecciones completadas
                        </div>
                        <div class="course-action">
                            Ingresar al curso
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </a>
            `;
        });

        // Sincronización de tarjeta Hero "Continuar Aprendizaje"
        const heroTitle = document.querySelector('.continue-info h1');
        const heroProgressBar = document.querySelector('.continue-info .progress-fill');
        const heroProgressText = document.querySelector('.continue-info .progress-percentage');
        const heroBtn = document.querySelector('.continue-info .btn-primary-action');
        const sidebarResumeBtn = document.querySelector('.btn-resume-last');

        if (state.ultimaLeccion) {
            if (heroTitle) heroTitle.innerHTML = state.ultimaLeccion.titulo;
            
            const irAUltimaLeccion = () => {
                window.location.href = NavigationComponents.getRelativePrefix() + state.ultimaLeccion.url;
            };

            if (heroBtn) heroBtn.onclick = irAUltimaLeccion;
            if (sidebarResumeBtn) sidebarResumeBtn.onclick = irAUltimaLeccion;

            const cursoId = state.ultimaLeccion.cursoId;
            const leccionesCurso = state.progreso[cursoId]?.leccionesCompletadas.length || 0;
            const pct = Math.min(Math.round((leccionesCurso / 15) * 100), 100); 

            if (heroProgressBar) heroProgressBar.style.width = `${pct}%`;
            if (heroProgressText) heroProgressText.innerText = `${pct}%`;
        } else {
            if (heroTitle) heroTitle.innerHTML = "¡Bienvenido!<br>Selecciona un Curso";
            if (heroProgressBar) heroProgressBar.style.width = `0%`;
            if (heroProgressText) heroProgressText.innerText = `0%`;
            if (heroBtn) {
                heroBtn.onclick = () => {
                    if (CONFIG.cursos.length > 0) {
                        window.location.href = `cursos/${CONFIG.cursos[0].id}/index.html`;
                    }
                };
            }
        }

        // Sincronizar métricas de actividad local
        const statLecciones = document.querySelector('.stat-value');
        const statTiempo = document.querySelectorAll('.stat-value')[1];

        if (statLecciones) {
            statLecciones.innerHTML = `${state.estadisticas.totalLeccionesCompletadas} <span class="stat-sub">/ 42 total</span>`;
        }
        if (statTiempo) {
            statTiempo.innerText = StorageManager.getTiempoFormateado();
        }
    }

    // B. Vista de Detalle del Curso (/cursos/ESS/index.html)
    const listaTemas = document.getElementById('lista-temas');
    if (listaTemas && typeof CURSO_DATA !== 'undefined') {
        const tituloCurso = document.getElementById('titulo-curso');
        const descCurso = document.getElementById('descripcion-curso');
        const contador = document.getElementById('contador-temas');

        if (tituloCurso) tituloCurso.innerText = CURSO_DATA.nombre_curso;
        if (descCurso) descCurso.innerText = CURSO_DATA.descripcion;
        if (contador) contador.innerText = `${CURSO_DATA.temas.length} Módulos Disponibles`;

        listaTemas.innerHTML = '';
        CURSO_DATA.temas.forEach((t, index) => {
            const numeroModulo = String(index + 1).padStart(2, '0'); 
            listaTemas.innerHTML += `
                <a href="${t.id}/index.html" class="module-card">
                    <span class="module-number">Módulo ${numeroModulo}</span>
                    <h3 class="module-title">${t.titulo}</h3>
                </a>
            `;
        });
    }

    // C. Vista de Tema Interno / Módulo (/cursos/ESS/T001/index.html)
    const listaLecciones = document.getElementById('lista-enlaces');
    if (listaLecciones && typeof CURSO_DATA !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const temaId = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1]; 
        const tema = CURSO_DATA.temas.find(t => t.id === temaId);
        
        // C.1 Inyectar Navegación de Módulos dentro del MID del Sidebar
        const sidebarMid = document.getElementById('sidebar-mid-content');
        if (sidebarMid) {
            let htmlModules = `
                <span class="overview-tag">NAVEGACIÓN DEL CURSO</span>
                <h3 style="font-size: 0.85rem; font-weight: 800; color: var(--color-azul-obscuro); margin-bottom: 4px;">${CURSO_DATA.nombre_curso}</h3>
                <div class="modules-quick-list">
            `;

            CURSO_DATA.temas.forEach(t => {
                const esActivo = t.id === temaId ? 'active' : '';
                htmlModules += `
                    <a href="../${t.id}/index.html" class="module-quick-item ${esActivo}">
                        <span class="mod-code">${t.id}</span>
                        <span class="mod-name">${t.id} • ${t.lecciones.length} lecciones</span>
                    </a>
                `;
            });

            htmlModules += `</div>`;
            sidebarMid.innerHTML = htmlModules;
        }

        // C.2 Inyectar cabecera y descripción del tema actual
        if (tema) {
            const tituloCursoPadre = document.getElementById('titulo-curso-padre');
            const tituloTema = document.getElementById('titulo-tema');
            const descTema = document.getElementById('descripcion-tema');
            
            if (tituloCursoPadre) tituloCursoPadre.innerText = CURSO_DATA.nombre_curso;
            if (tituloTema) tituloTema.innerText = tema.titulo;
            if (descTema) descTema.innerText = tema.descripcion || CURSO_DATA.descripcion;

            // C.3 Renderizar lecciones del tema
            listaLecciones.innerHTML = ''; 
            tema.lecciones.forEach((l, i) => {
                const numeroLeccion = i + 1;
                
                listaLecciones.innerHTML += `
                    <li class="lesson-card">
                        <div class="lesson-thumbnail">
                            <span class="lesson-badge">${numeroLeccion}</span>
                        </div>
                        <div class="lesson-content">
                            <h3 class="lesson-title">${l.titulo}</h3>
                            <div class="lesson-meta">
                                Sesión de estudio • Lección ${numeroLeccion}
                            </div>
                            <p class="lesson-desc">Accede a los contenidos, lecturas y recursos preparados específicamente para esta etapa del módulo.</p>
                        </div>
                        <div class="lesson-action">
                            <a href="${l.id}/index.html" class="btn-start">Iniciar Actividad</a>
                        </div>
                    </li>
                `;
            });
        }
    }

 // D. Vista de Lección / Actividad Individual (Lectura Dinámica)
    if (window.location.pathname.includes('/L') && typeof StorageManager !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const indexL = pathParts.findIndex(p => /^L\d+$/i.test(p));
        
        if (indexL !== -1) {
            const cursoId = pathParts[indexL - 2];
            const temaId = pathParts[indexL - 1];
            const leccionId = pathParts[indexL];
            
            let tituloLeccion = `Lección ${leccionId}`;
            let indicaciones = "";
            let parrafosContenido = [];

            // Leer datos del manifest.js propio de la lección
            if (typeof LECCION_DATA !== 'undefined') {
                tituloLeccion = LECCION_DATA.titulo || tituloLeccion;
                indicaciones = LECCION_DATA.indicaciones || "";
                
                if (Array.isArray(LECCION_DATA.contenido)) {
                    parrafosContenido = LECCION_DATA.contenido;
                } else if (typeof LECCION_DATA.contenido === 'string') {
                    parrafosContenido = [LECCION_DATA.contenido];
                }
            }

            // D.1 Actualizar Título
            const h1Element = document.querySelector('.reading-header h1') || document.querySelector('h1');
            if (h1Element) h1Element.innerText = tituloLeccion;

            // D.2 Inyectar Indicaciones (si existen)
            const readingHeader = document.querySelector('.reading-header');
            if (readingHeader && indicaciones) {
                let descElement = document.getElementById('instrucciones-leccion');
                if (!descElement) {
                    descElement = document.createElement('p');
                    descElement.id = 'instrucciones-leccion';
                    descElement.className = 'activity-instructions';
                    readingHeader.appendChild(descElement);
                }
                descElement.innerText = indicaciones;
            }

            // D.3 Inyectar Párrafos de Contenido Dinámicamente
            const bodyTextContainer = document.querySelector('.reading-body-text');
            if (bodyTextContainer && parrafosContenido.length > 0) {
                bodyTextContainer.innerHTML = ''; // Limpia el marcador de posición "Contenido del texto..."
                
                parrafosContenido.forEach(textoParrafo => {
                    const p = document.createElement('p');
                    p.innerText = textoParrafo;
                    bodyTextContainer.appendChild(p);
                });
            }

            // Registro en Storage
            const leccionClave = `${temaId}_${leccionId}`;
            const relativeUrl = `cursos/${cursoId}/${temaId}/${leccionId}/index.html`;
            StorageManager.setUltimaLeccion(cursoId, temaId, leccionId, tituloLeccion, relativeUrl);

            // D.4 Inyectar Navegación de Lecciones en el MID del Sidebar
            if (typeof CURSO_DATA !== 'undefined') {
                const sidebarMid = document.getElementById('sidebar-mid-content');
                const temaActual = CURSO_DATA.temas.find(t => t.id === temaId);

                if (sidebarMid && temaActual) {
                    let htmlNav = `
                        <span class="overview-tag">${CURSO_DATA.nombre_curso}</span>
                        <h3 style="font-size: 0.8rem; font-weight: 800; color: var(--color-azul-obscuro); margin-bottom: 2px;">${temaActual.titulo}</h3>
                        <div class="modules-quick-list" style="margin-top: 6px;">
                    `;

                    temaActual.lecciones.forEach((l, idx) => {
                        const numL = `L${idx + 1}`;
                        const esActiva = numL === leccionId ? 'active' : '';
                        htmlNav += `
                            <a href="../${numL}/index.html" class="module-quick-item ${esActiva}">
                                <span class="mod-code">${numL}</span>
                                <span class="mod-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;">${l.titulo}</span>
                            </a>
                        `;
                    });

                    htmlNav += `</div>`;
                    sidebarMid.innerHTML = htmlNav;
                }
            }

            // D.5 Inyectar Barra de Completar al Pie
            const article = document.querySelector('article.activity-reading-card') || document.querySelector('article') || document.body;
            
            if (!document.querySelector('.lesson-completion-bar')) {
                const controlBar = document.createElement('div');
                controlBar.className = 'lesson-completion-bar';
                controlBar.style.cssText = 'margin-top: 30px; padding: 20px; background: #EBF0F7; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--color-borde);';
                
                const esCompletada = StorageManager.getState().progreso[cursoId]?.leccionesCompletadas.includes(leccionClave);
                controlBar.innerHTML = `
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-texto-main);">
                        ${esCompletada ? '✓ Lección Completada' : '¿Terminaste de estudiar este tema?'}
                    </span>
                    <button id="btn-completar-leccion" style="background: ${esCompletada ? 'var(--color-secundario)' : 'var(--color-primario)'}; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; cursor: pointer;">
                        ${esCompletada ? 'Completado' : 'Marcar como Completada'}
                    </button>
                `;
                article.appendChild(controlBar);

                document.getElementById('btn-completar-leccion').onclick = function() {
                    StorageManager.marcarLeccionCompletada(cursoId, leccionClave);
                    this.innerText = 'Completado';
                    this.style.background = 'var(--color-secundario)';
                };
            }

            // Temporizador de lectura activa
            setInterval(() => {
                if (!document.hidden) {
                    StorageManager.agregarTiempoEstudio(30);
                }
            }, 30000);
        }
    }

}

// 3. Inicializador
window.addEventListener('load', () => {
    inyectarMenuGlobal();
    init();
});