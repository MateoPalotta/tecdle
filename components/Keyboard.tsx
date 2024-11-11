import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const TECLADO: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  return (
    <View style={styles.container}>
      {TECLADO.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.tecla,
                key === 'ENTER' && styles.teclaEspecial,
              ]}
              onPress={() => onKeyPress(key)}
            >
              <Text style={styles.teclaTexto}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tecla: {
    backgroundColor: '#d3d6da',
    padding: 10,
    margin: 3,
    borderRadius: 4,
    minWidth: 30,
    alignItems: 'center',
  },
  teclaEspecial: {
    minWidth: 65,
  },
  teclaTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Keyboard; 