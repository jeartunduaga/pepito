import { useState, useEffect } from 'react';
import Notas from './components/Notas';
import Habitos from './components/Habitos';
import './App.css';

function App() {
  const [pagina, setPagina] = useState('notas');
  const [notas, setNotas] = useState(() => {
    const savedNotas = localStorage.getItem('notas');
    return savedNotas ? JSON.parse(savedNotas) : [];
  });

  const [categorias, setCategorias] = useState(() => {
    const savedCategorias = localStorage.getItem('categorias');
    return savedCategorias ? JSON.parse(savedCategorias) : [];
  });

  const [habitos, setHabitos] = useState(() => {
    const savedHabitos = localStorage.getItem('habitos');
    return savedHabitos ? JSON.parse(savedHabitos) : [];
  });

  const [completados, setCompletados] = useState(() => {
    const savedCompletados = localStorage.getItem('completados');
    return savedCompletados ? JSON.parse(savedCompletados) : [];
  });

  useEffect(() => {
    localStorage.setItem('notas', JSON.stringify(notas));
  }, [notas]);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem('habitos', JSON.stringify(habitos));
  }, [habitos]);

  useEffect(() => {
    localStorage.setItem('completados', JSON.stringify(completados));
  }, [completados]);

  const manejarCategoria = (accion, categoria, nuevaCategoria = '') => {
    if (accion === 'crear') {
      if (categoria && !categorias.includes(categoria)) {
        setCategorias((prevCategorias) => [...prevCategorias, categoria]);
      }
    } else if (accion === 'editar') {
      setCategorias((prevCategorias) =>
        prevCategorias.map((cat) => (cat === categoria ? nuevaCategoria : cat))
      );
    } else if (accion === 'eliminar') {
      setCategorias((prevCategorias) =>
        prevCategorias.filter((cat) => cat !== categoria)
      );
    }
  };

  const agregarHabito = (texto) => {
    if (!texto.trim()) return;
    const nuevoHabito = { id: Date.now(), texto };
    setHabitos((prevHabitos) => [...prevHabitos, nuevoHabito]);
  };

  const completarHabito = (id) => {
    const habito = habitos.find((h) => h.id === id);
    if (habito) {
      setHabitos((prevHabitos) => prevHabitos.filter((h) => h.id !== id));
      setCompletados((prevCompletados) => [...prevCompletados, habito]);
    }
  };

  const editarHabito = (id, nuevoTexto) => {
    setHabitos((prevHabitos) =>
      prevHabitos.map((h) => (h.id === id ? { ...h, texto: nuevoTexto } : h))
    );
  };

  const eliminarHabito = (id) => {
    setHabitos((prevHabitos) => prevHabitos.filter((h) => h.id !== id));
  };

  const reiniciarHabitos = () => {
    setHabitos([]);
    setCompletados([]);
  };

  const editarNota = (id, nuevaNota) => {
    setNotas((prevNotas) =>
      prevNotas.map((nota) =>
        nota.id === id ? { ...nota, ...nuevaNota } : nota
      )
    );
  };

  return (
    <div>
      {pagina === 'notas' ? (
        <Notas
          cambiarPagina={setPagina}
          notas={notas}
          categorias={categorias}
          agregarNota={(texto, categoria) => {
            const nuevaNota = { id: Date.now(), texto, categoria };
            setNotas((prevNotas) => [...prevNotas, nuevaNota]);
          }}
          eliminarNota={(id) => setNotas((prevNotas) => prevNotas.filter((n) => n.id !== id))}
          editarNota={editarNota} // Pasar la función editarNota como prop
          manejarCategoria={manejarCategoria}
        />
      ) : (
        <Habitos
          habitos={habitos}
          completados={completados}
          agregarHabito={agregarHabito}
          completarHabito={completarHabito}
          editarHabito={editarHabito}
          eliminarHabito={eliminarHabito}
          cambiarPagina={setPagina}
          reiniciarHabitos={reiniciarHabitos}
        />
      )}
    </div>
  );
}

export default App;
