import { StyleSheet } from 'react-native';

const registroStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f1f1f1',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,
    },
    svgContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1,
    },
    titulo: {
      fontSize: 80,  
      color: '#34434D',
      fontWeight: 'bold',
      zIndex: 1,
      marginTop: height / 18,
      marginBottom: 30,
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
    button: {
      width: '80%',
      height: 50,
      backgroundColor: '#2980B9',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      marginTop: 20,
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
      fontSize: 14,
    },
  });