//esta clase la gastarem per a posar tots els estilos globals i no repetir codic.
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 80,  
    color: '#34434D',
    fontWeight: 'bold',
    zIndex: 1, // Asegúrate de que el texto esté encima del SVG
    marginBottom: 30
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
