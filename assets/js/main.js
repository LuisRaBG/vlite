// 1. Inyectar menú global dinámico
function inyectarMenuGlobal() {
    const nav = document.getElementById('menu-global');
    if (!nav) return;
    
    // Obtenemos la ruta actual
    const pathParts = window.location.pathname.split('/');
    let rutaRegresar = '../index.html'; 

    if (pathParts[pathParts.length - 3] === 'cursos') {
        rutaRegresar = '../../index.html'; 
    } 
    else if (!window.location.pathname.includes('/cursos/')) {
        nav.innerHTML = ''; // Ocultamos el menú si estamos en la raíz
        return; 
    }

    nav.innerHTML = `
        <div style="background: #1e3a8a; padding: 16px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <a href="${rutaRegresar}" style="color: white; text-decoration: none; font-weight: 600; font-family: sans-serif; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px;">
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
    // A. Vista de Inicio (Raíz) - NUEVAS TARJETAS DE CURSO
    const listaCursos = document.getElementById('lista-cursos');
    if (listaCursos && typeof CONFIG !== 'undefined') {
        CONFIG.cursos.forEach(c => {
            // Extraemos la primera letra del nombre del curso para hacer un icono dinámico
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

    // C. Vista de Lección Interna
    const listaLecciones = document.getElementById('lista-enlaces');
    if (listaLecciones && typeof CURSO_DATA !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const temaId = pathParts[pathParts.length - 2]; 
        const tema = CURSO_DATA.temas.find(t => t.id === temaId);
        
        if (tema) {
            tema.lecciones.forEach((l, i) => {
                listaLecciones.innerHTML += `<li><a href="L${i + 1}/index.html">${l.titulo}</a></li>`;
            });
        }
    }
}

// 3. Inicializador
window.addEventListener('load', () => {
    inyectarMenuGlobal();
    init();
});