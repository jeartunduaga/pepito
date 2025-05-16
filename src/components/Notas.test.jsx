import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Notas from './Notas';
import '@testing-library/jest-dom';

jest.mock('bootstrap/dist/css/bootstrap.min.css', () => { });

describe('Notas component', () => {
    const notasMock = [{ id: 1, texto: 'Estudiar React', categoria: 'Estudios' }];
    const categoriasMock = ['Estudios', 'Trabajo'];

    const agregarNota = jest.fn();
    const eliminarNota = jest.fn();
    const editarNota = jest.fn();
    const manejarCategoria = jest.fn();
    const cambiarPagina = jest.fn();

    const setup = () =>
        render(
            <Notas
                notas={notasMock}
                categorias={categoriasMock}
                agregarNota={agregarNota}
                eliminarNota={eliminarNota}
                editarNota={editarNota}
                manejarCategoria={manejarCategoria}
                cambiarPagina={cambiarPagina}
            />
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('muestra las notas con su categoría', () => {
        setup();
        expect(screen.getByText('Estudiar React')).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Estudios' })).toBeInTheDocument();
    });

    it('permite agregar una nota', () => {
        setup();
        fireEvent.change(screen.getByPlaceholderText('Agregar Nota'), {
            target: { value: 'Leer un libro' },
        });
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'Estudios' },
        });
        fireEvent.click(screen.getByText('Agregar'));
        expect(agregarNota).toHaveBeenCalledWith('Leer un libro', 'Estudios');
    });

    it('permite eliminar una nota', () => {
        setup();
        const botonEliminar = screen.getAllByRole('button').find((btn) =>
            btn.innerHTML.includes('bi-trash-fill')
        );
        fireEvent.click(botonEliminar);
        expect(eliminarNota).toHaveBeenCalledWith(1);
    });

    it('permite abrir el modal de categorías', () => {
        setup();
        fireEvent.click(screen.getByText('Administrar Categorías'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('permite cambiar de página', () => {
        setup();
        fireEvent.click(screen.getByText('Ir a Hábitos'));
        expect(cambiarPagina).toHaveBeenCalledWith('habitos');
    });
});
