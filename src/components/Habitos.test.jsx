import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Habitos from './Habitos';
import '@testing-library/jest-dom';


jest.mock('../assets/tada-fanfare-a-6313.mp3', () => '');
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => { });


describe('Habitos component', () => {
    const habitosMock = [{ id: 1, texto: 'Leer' }];
    const completadosMock = [{ id: 2, texto: 'Ejercicio' }];
    const agregarHabito = jest.fn();
    const completarHabito = jest.fn();
    const editarHabito = jest.fn();
    const eliminarHabito = jest.fn();
    const cambiarPagina = jest.fn();
    const reiniciarHabitos = jest.fn();

    const setup = () =>
        render(
            <Habitos
                habitos={habitosMock}
                completados={completadosMock}
                agregarHabito={agregarHabito}
                completarHabito={completarHabito}
                editarHabito={editarHabito}
                eliminarHabito={eliminarHabito}
                cambiarPagina={cambiarPagina}
                reiniciarHabitos={reiniciarHabitos}
            />
        );

    it('renderiza los hábitos pendientes y completados', () => {
        setup();
        expect(screen.getByText('Leer')).toBeInTheDocument();
        expect(screen.getByText('Ejercicio')).toBeInTheDocument();
    });

    it('permite agregar un hábito', () => {
        setup();
        const input = screen.getByPlaceholderText('Agregar Hábito');
        fireEvent.change(input, { target: { value: 'Estudiar' } });

        const boton = screen.getByRole('button', { name: 'Agregar Hábito' });
        fireEvent.click(boton);

        expect(agregarHabito).toHaveBeenCalledWith('Estudiar');
    });

    it('llama a eliminarHabito al hacer clic en el botón de eliminar', () => {
        setup();
        const botonEliminar = screen.getByTestId('eliminar-1');
        fireEvent.click(botonEliminar);
        expect(eliminarHabito).toHaveBeenCalledWith(1);

    });

    it('marca como completado un hábito al hacer clic', () => {
        setup();
        const botonCompletar = screen.getByText('Completar');
        fireEvent.click(botonCompletar);
        expect(completarHabito).toHaveBeenCalledWith(1);
    });

    it('puede cambiar de página', () => {
        setup();
        const botonNotas = screen.getByText('Ir a Notas');
        fireEvent.click(botonNotas);
        expect(cambiarPagina).toHaveBeenCalledWith('notas');
    });
});
