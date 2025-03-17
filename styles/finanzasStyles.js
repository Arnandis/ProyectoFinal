import { StyleSheet } from 'react-native';

const finanzasStyle = StyleSheet.create({
  container: {
    flexGrow: 1,  // Asegura que el contenido se puede desplazar
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
    gap:15,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15, 
    backgroundColor: "#ddd", 

  },
});
