import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Alert, Keyboard as RNKeyboard } from 'react-native';
import { Stack } from 'expo-router';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';

const PALABRAS: string[] = ['GUARDAPOLVO', 'ESTANGA', 'SACRAMENTO', 'CHAPA', 'BUFFET'];
const INTENTOS_MAXIMOS: number = 5;
const TIEMPO_POR_FILA: number = 30;

export default function Game() {
  const [palabraActual, setPalabraActual] = useState<string>('');
  const [intentos, setIntentos] = useState<string[]>([]);
  const [intentoActual, setIntentoActual] = useState<string>('');
  const [tiempoRestante, setTiempoRestante] = useState<number>(TIEMPO_POR_FILA);
  const [filaActual, setFilaActual] = useState<number>(0);

  const iniciarNuevoJuego = useCallback(() => {
    const palabraAleatoria = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
    setPalabraActual(palabraAleatoria);
    setIntentos([]);
    setIntentoActual('');
    setTiempoRestante(TIEMPO_POR_FILA);
    setFilaActual(0);
  }, []);

  const verificarIntento = useCallback(() => {
    if (intentoActual === palabraActual) {
      Alert.alert('¡Felicitaciones!', '¿Quieres jugar otra vez?', [
        { text: 'Sí', onPress: iniciarNuevoJuego },
      ]);
      return;
    }

    setIntentos(prev => [...prev, intentoActual]);
    setIntentoActual('');
    setFilaActual(prev => prev + 1);
    setTiempoRestante(TIEMPO_POR_FILA);

    if (filaActual >= INTENTOS_MAXIMOS - 1) {
      Alert.alert('Game Over', `La palabra era: ${palabraActual}`, [
        { text: 'Jugar de nuevo', onPress: iniciarNuevoJuego },
      ]);
    }
  }, [intentoActual, palabraActual, filaActual, iniciarNuevoJuego]);

  const manejarTecla = useCallback((tecla: string) => {
    if (intentos.length >= INTENTOS_MAXIMOS) return;

    if (tecla === '⌫' || tecla === 'BACKSPACE') {
      setIntentoActual(prev => prev.slice(0, -1));
    } else if (tecla === 'ENTER') {
      if (intentoActual.length === 5) {
        verificarIntento();
      }
    } else if (intentoActual.length < 5 && /^[A-ZÑ]$/.test(tecla)) {
      setIntentoActual(prev => prev + tecla);
    }
  }, [intentoActual, intentos.length, verificarIntento, INTENTOS_MAXIMOS]);

  // Manejo del teclado físico
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      manejarTecla(key);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [manejarTecla]);

  // Temporizador por fila
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          if (filaActual < INTENTOS_MAXIMOS - 1) {
            setIntentos(prev => [...prev, intentoActual]);
            setIntentoActual('');
            setFilaActual(prevFila => prevFila + 1);
            return TIEMPO_POR_FILA;
          } else {
            clearInterval(timer);
            Alert.alert('¡Tiempo agotado!', `La palabra era: ${palabraActual}`, [
              { text: 'Jugar de nuevo', onPress: iniciarNuevoJuego },
            ]);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [filaActual, intentoActual, palabraActual, iniciarNuevoJuego, INTENTOS_MAXIMOS]);

  // Iniciar juego
  useEffect(() => {
    iniciarNuevoJuego();
  }, [iniciarNuevoJuego]);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'TECDLE',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.tiempo}>Tiempo restante: {tiempoRestante}s</Text>
        <Text style={styles.fila}>Fila: {filaActual + 1}/5</Text>
      </View>
      <GameBoard 
        intentos={[...intentos, intentoActual]} 
        palabraActual={palabraActual}
      />
      <Keyboard onKeyPress={manejarTecla} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  tiempo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fila: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 