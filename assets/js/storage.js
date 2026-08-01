// Gestor de Estado para RedBuho vLite
const StorageManager = {
    KEY: 'redbuho_vlite_state',

    // Estado inicial por defecto
    defaultState: {
        ultimaLeccion: null,
        progreso: {},
        estadisticas: {
            totalLeccionesCompletadas: 0,
            tiempoEstudioSegundos: 0
        }
    },

    // Obtener estado actual
    getState() {
        const data = localStorage.getItem(this.KEY);
        if (!data) {
            this.saveState(this.defaultState);
            return this.defaultState;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Error al leer el estado local, reiniciando...', e);
            return this.defaultState;
        }
    },

    // Guardar estado completo
    saveState(state) {
        localStorage.setItem(this.KEY, JSON.stringify(state));
    },

    // Registrar/Actualizar la última lección visitada
    setUltimaLeccion(cursoId, temaId, leccionId, titulo, url) {
        const state = this.getState();
        state.ultimaLeccion = {
            cursoId,
            temaId,
            leccionId,
            titulo,
            url,
            fecha: new Date().toISOString()
        };
        this.saveState(state);
    },

    // Marcar lección como completada
    marcarLeccionCompletada(cursoId, leccionClave) {
        const state = this.getState();
        
        if (!state.progreso[cursoId]) {
            state.progreso[cursoId] = { leccionesCompletadas: [] };
        }

        const completadas = state.progreso[cursoId].leccionesCompletadas;
        if (!completadas.includes(leccionClave)) {
            completadas.push(leccionClave);
            
            // Incrementar contador global
            state.estadisticas.totalLeccionesCompletadas = 
                Object.values(state.progreso).reduce((acc, curr) => acc + curr.leccionesCompletadas.length, 0);

            this.saveState(state);
        }
    },

    // Sumar tiempo de estudio (en segundos)
    agregarTiempoEstudio(segundos) {
        const state = this.getState();
        state.estadisticas.tiempoEstudioSegundos += segundos;
        this.saveState(state);
    },

    // Formatear segundos a texto comprensible (ej: "8h 45m")
    getTiempoFormateado() {
        const state = this.getState();
        const totalSegundos = state.estadisticas.tiempoEstudioSegundos;
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);

        if (horas === 0) return `${minutos}m`;
        return `${horas}h ${minutos}m`;
    }
};