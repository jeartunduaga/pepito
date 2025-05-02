import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Notas = ({
  notas,
  categorias,
  agregarNota,
  eliminarNota,
  editarNota,
  manejarCategoria,
  cambiarPagina,
}) => {
  const [nota, setNota] = useState('');
  const [categoria, setCategoria] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar el modal
  const [categoriaNueva, setCategoriaNueva] = useState(''); // Estado para nueva categoría
  const [mostrarCampoNuevaCategoria, setMostrarCampoNuevaCategoria] = useState(false); // Mostrar campo para nueva categoría
  const [categoriaEditada, setCategoriaEditada] = useState(''); // Estado para editar categorías

  const manejarAgregarNota = () => {
    if (editandoId) {
      // Llamar a la función editarNota con los parámetros correctos
      editarNota(editandoId, { texto: nota, categoria });
      setEditandoId(null); // Limpiar el estado de edición
    } else {
      // Agregar una nueva nota
      agregarNota(nota, categoria);
    }
    // Limpiar los campos después de agregar o editar
    setNota('');
    setCategoria('');
  };

  const manejarEditarNota = (nota) => {
    setNota(nota.texto); // Establecer el texto de la nota en el campo de entrada
    setCategoria(nota.categoria); // Establecer la categoría de la nota
    setEditandoId(nota.id); // Establecer el ID de la nota que se está editando
  };

  const manejarCambioCategoria = (e) => {
    const seleccion = e.target.value;
    if (seleccion === 'crear') {
      setMostrarCampoNuevaCategoria(true); // Mostrar campo para nueva categoría
    } else {
      setMostrarCampoNuevaCategoria(false);
      setCategoria(seleccion);
    }
  };

  const manejarCrearCategoria = () => {
    if (!categoriaNueva.trim()) {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }
    manejarCategoria('crear', categoriaNueva); // Crear la nueva categoría
    setCategoria(categoriaNueva); // Seleccionar la nueva categoría
    setCategoriaNueva(''); // Limpiar el campo
    setMostrarCampoNuevaCategoria(false); // Ocultar el campo
  };

  const manejarGuardarCategoria = (categoriaOriginal) => {
    if (!categoriaEditada.trim()) {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }
    manejarCategoria('editar', categoriaOriginal, categoriaEditada);
    setCategoriaEditada('');
  };

  const manejarEliminarCategoria = (categoriaAEliminar) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría "${categoriaAEliminar}"?`
    );
    if (confirmacion) {
      manejarCategoria('eliminar', categoriaAEliminar);
    }
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

      <h4 className="mb-4">{editandoId ? 'Editar Nota' : 'Agregar Nota'}</h4>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Agregar Nota"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
      />

      <select
        className="form-select mb-3"
        value={categoria}
        onChange={manejarCambioCategoria}
      >
        <option value="">Categoría...</option>
        <option value="crear">Crear Categoría...</option>
        {categorias.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Campo para crear nueva categoría */}
      {mostrarCampoNuevaCategoria && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nueva Categoría"
            value={categoriaNueva}
            onChange={(e) => setCategoriaNueva(e.target.value)}
          />
          <button className="btn btn-success" onClick={manejarCrearCategoria}>
            Guardar Categoría
          </button>
        </div>
      )}

      <button className="btn btn-primary w-100 mb-4" onClick={manejarAgregarNota}>
        {editandoId ? 'Guardar Cambios' : 'Agregar'}
      </button>

      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Nota</th>
            <th scope="col">Categoría</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td className="break-word">{n.texto}</td>
              <td>{n.categoria || 'Sin Categoría'}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => manejarEditarNota(n)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarNota(n.id)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para abrir el modal */}
      <button
        className="btn btn-info w-100 mt-4"
        onClick={() => setMostrarModal(true)}
      >
        Administrar Categorías
      </button>

      {/* Modal para administrar categorías */}
      {mostrarModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Administrar Categorías</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setMostrarModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {categorias.map((cat, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <input
                        type="text"
                        className="form-control me-2"
                        value={categoriaEditada === cat ? categoriaEditada : cat} // Controlar dinámicamente
                        onChange={(e) => setCategoriaEditada(e.target.value)}
                      />
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => manejarGuardarCategoria(cat)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => manejarEliminarCategoria(cat)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
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

export default Notas;
