import React from "react";
import { StyleSheet, Text, View, TextInput, Dimensions, Touchable, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ButtonGradient(){
    return(
        <TouchableOpacity style={styles.container}>
            <LinearGradient
            // Button Linear Gradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            start={{x:1,y:0}}
            end={{x:0,y:1}}
            style={styles.button}>
            <Text style={styles.text}>SIGN IN</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        width: 200,
        marginTop:60,
        
    },

    text: {
        fontSize: 14,
        color: '#fff',
        fontWeight:'bold',

    },
    button: {
        width: '80%',
        height: 50,
        borderRadius: 25,
        padding: 10,
        alignItems:'center',
        justifyContent: 'center',
    }
})