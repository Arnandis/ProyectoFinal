//gastarem estes clases per a posar tots els estilos que necesitarem en la clase login...
import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f1f1f1',
      alignItems: 'center',
      justifyContent: 'flex-start', // Asegura que el contenido empieza desde la parte superior
      paddingTop: 20, // Añadir un poco de margen superior
    },
    svgContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1, // Poner el SVG en el fondo
    },
    titulo: {
      fontSize: 80,  
      color: '#34434D',
      fontWeight: 'bold',
      zIndex: 1, // Asegúrate de que el texto esté encima del SVG
      marginTop: height / 18, // Coloca el título un poco más abajo
      marginBottom: 30
    },
    subTitle: {
      fontSize: 20,
      color: 'gray',
      zIndex: 1, 
      marginTop: 10, 
    },
    textInput: {
      paddingStart: 20,
      padding: 10,
      width: '80%',
      height: 50,
      marginTop: 20,
      borderRadius: 30,
      backgroundColor: '#fff',
    },
    forgotPassword: {
      fontSize: 14,
      color: 'gray',
      zIndex: 1,
      marginTop: 20,
    },
    button: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#2980B9',
      borderRadius: 30,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    registerButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#2980B9',
      borderRadius: 30,
      width: '80%',
      alignItems: 'center',
    },
    registerButtonText: {
      color: '#2980B9',
      fontSize: 16,
      fontWeight: 'bold',
    },  
    errorText: {
      color: 'red',
      marginTop: 10,
    },
  });