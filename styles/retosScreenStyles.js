import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalEstrellas: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoria: {
    marginBottom: 30,
  },
  tituloCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  retoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  retoCompletado: {
    backgroundColor: '#e0e0e0',
  },
  retoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
  estrellas: {
    fontSize: 14,
    color: '#888',
  },
});
export default styles;