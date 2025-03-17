import { StyleSheet } from 'react-native';

const goalStyles = StyleSheet.create({
    container: {
      flexGrow: 1,  // Asegura que el contenido se puede desplazar
      padding: 20,
      backgroundColor: '#f4f4f4',
      paddingBottom: 20,  // Agregar espacio en la parte inferior
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
    },
    input: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#ddd',
    },
    goalsContainer: {
      marginTop: 20,
    },
    goalContainer: {
      backgroundColor: '#fff',
      padding: 15,
      marginVertical: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    goalText: {
      fontSize: 18,
      marginBottom: 10,
    },
    deleteIcon: {
      marginTop: 10,
      alignSelf: 'flex-start',
    },
  });
  