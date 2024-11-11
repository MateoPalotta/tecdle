import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface GameBoardProps {
  intentos: string[];
  palabraActual: string;
}

type EstadoLetra = 'correcto' | 'posicionIncorrecta' | 'incorrecto' | 'vacio';

const obtenerEstadoLetra = (
  letra: string,
  posicion: number,
  fila: number,
  palabraCorrecta: string,
  intentoActual?: string
): EstadoLetra => {
  if (!letra) return 'vacio';
  if (!intentoActual) return 'vacio';

  if (palabraCorrecta[posicion] === letra) {
    return 'correcto';
  }

  if (palabraCorrecta.includes(letra)) {
    return 'posicionIncorrecta';
  }

  return 'incorrecto';
};

const GameBoard: React.FC<GameBoardProps> = ({ intentos, palabraActual }) => {
  return (
    <View style={styles.container}>
      {Array(5).fill(null).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {Array(5).fill(null).map((_, colIndex) => {
            const letra = intentos[rowIndex]?.[colIndex] || '';
            const estado = obtenerEstadoLetra(
              letra,
              colIndex,
              rowIndex,
              palabraActual,
              intentos[rowIndex]
            );
            
            return (
              <View key={colIndex} style={[styles.celda, styles[estado]]}>
                <Text style={styles.letra}>{letra}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  celda: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  letra: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  correcto: {
    backgroundColor: '#6aaa64',
  },
  posicionIncorrecta: {
    backgroundColor: '#c9b458',
  },
  incorrecto: {
    backgroundColor: '#787c7e',
  },
  vacio: {
    backgroundColor: 'transparent',
  },
} as const);

export default GameBoard; 