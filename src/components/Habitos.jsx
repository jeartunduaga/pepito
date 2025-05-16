import React, { useState, useEffect } from 'react';
import sonidoFelicidades from '../assets/tada-fanfare-a-6313.mp3';
import 'bootstrap/dist/css/bootstrap.min.css';

const Habitos = ({
  habitos,
  completados,
  agregarHabito,
  completarHabito,
  editarHabito,
  eliminarHabito,
  cambiarPagina,
  reiniciarHabitos,
}) => {
  const [habito, setHabito] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar el modal
  const [finalizarHabitos, setFinalizarHabitos] = useState(false); // Estado para el checkbox

  const manejarAgregarHabito = () => {
    if (editandoId) {
      editarHabito(editandoId, habito);
      setEditandoId(null);
    } else {
      agregarHabito(habito);
    }
    setHabito('');
  };

  const manejarEditarHabito = (habito) => {
    setHabito(habito.texto);
    setEditandoId(habito.id);
  };

  // Efecto para reiniciar hábitos diariamente a una hora específica
  useEffect(() => {
    const verificarHora = () => {
      const ahora = new Date();
      const horaReinicio = 18; // Cambia esta hora (en formato 24 horas)
      const minutoReinicio = 46; // Cambia este minuto

      if (ahora.getHours() === horaReinicio && ahora.getMinutes() === minutoReinicio) {
        console.log(`Reinicio de hábitos ejecutado a las ${ahora.toLocaleTimeString()}`);
        reiniciarHabitos(); // Llama a la función para reiniciar hábitos
      }
    };

    const intervalo = setInterval(verificarHora, 30000); // Verifica cada minuto

    return () => clearInterval(intervalo); // Limpia el intervalo al desmontar el componente
  }, [reiniciarHabitos]);

  // Efecto para verificar si todos los hábitos están completados
  useEffect(() => {
    if (finalizarHabitos && habitos.length === 0 && completados.length > 0) {
      setMostrarModal(true); // Mostrar el modal
      reproducirSonido(); // Reproducir sonido de felicitación
    }
  }, [finalizarHabitos, habitos, completados]);

  // Función para reproducir un sonido de felicitación
  const reproducirSonido = () => {
    const audio = new Audio(sonidoFelicidades); // Usa el archivo importado
    audio.play().catch((error) => {
      console.error('Error al reproducir el sonido:', error);
    });
  };

  return (
    <div className="main-container">
      <div className="d-flex justify-content-between mb-4">
        <button className="btn btn-secondary" onClick={() => cambiarPagina('notas')}>
          Ir a Notas
        </button>
        <button className="btn btn-secondary" onClick={() => cambiarPagina('habitos')}>
          Ir a Hábitos
        </button>
      </div>

      <h4 className="mb-4">{editandoId ? 'Editar Hábito' : 'Agregar Hábito'}</h4>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Agregar Hábito"
        value={habito}
        onChange={(e) => setHabito(e.target.value)}
      />

      <button className="btn btn-primary w-100 mb-4" onClick={manejarAgregarHabito}>
        {editandoId ? 'Guardar Cambios' : 'Agregar Hábito'}
      </button>

      {/* Checkbox para finalizar hábitos */}
      <div className="form-check text-start mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="finalizarHabitos"
          checked={finalizarHabitos}
          onChange={(e) => setFinalizarHabitos(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="finalizarHabitos">
          No agregaré más hábitos
        </label>
      </div>

      <h5 className="mb-3">Pendientes</h5>
      <ul className="list-group bg-dark">
        {habitos.map((h) => (
          <li
            key={h.id}
            className="list-group-item d-flex justify-content-between align-items-start bg-secondary text-white"
          >
            <span className="break-word">{h.texto}</span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => manejarEditarHabito(h)}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
              <button
                data-testid={`eliminar-${h.id}`}
                className="btn btn-sm btn-danger me-2"
                onClick={() => eliminarHabito(h.id)}
              >
                <i className="bi bi-trash-fill"></i>
              </button>

              <button
                className="btn btn-sm btn-success"
                onClick={() => completarHabito(h.id)}
              >
                Completar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h5 className="mt-4 mb-3">Completados</h5>
      <ul className="list-group bg-dark">
        {completados.map((h) => (
          <li
            key={h.id}
            className="list-group-item d-flex justify-content-between align-items-start bg-secondary text-white"
          >
            <span className="break-word">{h.texto}</span>
          </li>
        ))}
      </ul>

      {/* Modal de felicitación */}
      {mostrarModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¡Felicidades!</h5>
              </div>
              <div className="modal-body">
                <p>¡Has completado todos tus hábitos pendientes!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habitos;