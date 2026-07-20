// 1. Inyectar menú global dinámico
function inyectarMenuGlobal() {
    const nav = document.getElementById('menu-global');
    if (!nav) return;
    
    const pathParts = window.location.pathname.split('/');
    let rutaRegresar = '../index.html'; 

    if (pathParts[pathParts.length - 3] === 'cursos') {
        rutaRegresar = '../../index.html'; 
    } 
    else if (!window.location.pathname.includes('/cursos/')) {
        nav.innerHTML = ''; 
        return; 
    }

    nav.innerHTML = `
        <div style="height: 60px; background: var(--color-azul-obscuro); padding: 16px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
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
    // A. Vista de Inicio (Raíz)
    const listaCursos = document.getElementById('lista-cursos');
    if (listaCursos && typeof CONFIG !== 'undefined') {
        CONFIG.cursos.forEach(c => {
            const inicial = c.nombre.charAt(0).toUpperCase();
            listaCursos.innerHTML += `
                <a href="cursos/${c.id}/index.html" class="course-card">
                    <div class="course-card-header">
                        <span class="course-initial">${inicial}</span>
                    </div>
                    <div class="course-card-body">
                        <h3 class="course-title">${c.nombre}</h3>
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
    }

    // B. Vista de Dashboard del Curso (/cursos/ESS/index.html)
    const listaTemas = document.getElementById('lista-temas');
    if (listaTemas && typeof CURSO_DATA !== 'undefined') {
        document.getElementById('titulo-curso').innerText = CURSO_DATA.nombre_curso;
        document.getElementById('descripcion-curso').innerText = CURSO_DATA.descripcion;
        
        const contador = document.getElementById('contador-temas');
        if (contador) contador.innerText = `${CURSO_DATA.temas.length} Módulos Disponibles`;

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

    // C. Vista de Tema Interno (DISEÑO TIPO MASTERCLASS)
    const listaLecciones = document.getElementById('lista-enlaces');
    if (listaLecciones && typeof CURSO_DATA !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const temaId = pathParts[pathParts.length - 2]; 
        const tema = CURSO_DATA.temas.find(t => t.id === temaId);
        
        if (tema) {
            const tituloCursoPadre = document.getElementById('titulo-curso-padre');
            const tituloTema = document.getElementById('titulo-tema');
            
            if (tituloCursoPadre) tituloCursoPadre.innerText = CURSO_DATA.nombre_curso;
            if (tituloTema) tituloTema.innerText = tema.titulo;

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
                            <a href="L${numeroLeccion}/index.html" class="btn-start">Iniciar Actividad</a>
                        </div>
                    </li>
                `;
            });
        }
    }
}

// 3. Inicializador
window.addEventListener('load', () => {
    inyectarMenuGlobal();
    init();
});