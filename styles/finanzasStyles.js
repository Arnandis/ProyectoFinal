// styles/finanzasStyles.js
import { StyleSheet } from 'react-native';

export const finanzasStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  chartTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  result: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: '70%',
    marginBottom: 20,
    gap: 15,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#ddd",
  },
   modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',  // Fondo semitransparente oscuro para el modal
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 350,
    // Sombra para Android
    elevation: 10,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  modalButton: {
    marginTop: 15,
    width: '100%',
  },
  inputCard: {
  width: '100%',
  backgroundColor: '#f9f9f9',
  borderRadius: 12,
  padding: 12,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
},

inputLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 6,
},

inputField: {
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 8,
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#ccc',
},
});
