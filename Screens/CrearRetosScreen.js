import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import styles from "../styles/crearRetosStyles";

const CrearRetoScreen = () => {
  const { params } = useRoute();
  const amigoId = params?.amigoId;
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estrellas, setEstrellas] = useState("5");
  const [imagenUri, setImagenUri] = useState(null);
  const [objetivo, setObjetivo] = useState("");        
  const [unidad, setUnidad] = useState("");            

  const navigation = useNavigation();
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const esFechaValida = (fecha) => /^\d{4}-\d{2}-\d{2}$/.test(fecha);

  const enviarReto = async () => {
    if (!titulo.trim()) {
      Alert.alert("Título requerido", "Debes escribir un título para el reto.");
      return;
    }

    if (!esFechaValida(fechaInicio) || !esFechaValida(fechaFin)) {
      Alert.alert("Formato de fecha inválido", "Usa el formato YYYY-MM-DD.");
      return;
    }

    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (inicio < hoy.setHours(0, 0, 0, 0)) {
      Alert.alert("Fecha inválida", "La fecha de inicio no puede ser anterior a hoy.");
      return;
    }

    if (fin < inicio) {
      Alert.alert("Fecha inválida", "La fecha de fin no puede ser anterior a la de inicio.");
      return;
    }

    const estrellasNum = parseInt(estrellas);
    if (isNaN(estrellasNum) || estrellasNum < 1 || estrellasNum > 100) {
      Alert.alert("Estrellas inválidas", "Elige entre 1 y 100 estrellas.");
      return;
    }

    const objetivoNum = parseFloat(objetivo);
    if (isNaN(objetivoNum) || objetivoNum <= 0) {
      Alert.alert("Objetivo inválido", "Debes introducir un número válido como objetivo.");
      return;
    }

    if (!unidad.trim()) {
      Alert.alert("Unidad requerida", "Debes indicar una unidad (por ejemplo: km, páginas, horas).");
      return;
    }

    try {
      await addDoc(collection(db, "retos"), {
        creadorId: userId,
        retadoId: amigoId,
        titulo,
        detalle: detalle.trim() || null,
        fechaInicio,
        fechaFin,
        estado: "pendiente",
        imagen: imagenUri || null,
        estrellas: estrellasNum,
        creadoEn: serverTimestamp(),
        objetivo: objetivoNum,
        unidad: unidad.trim(),
        progreso: {
          [userId]: {
            porcentaje: 0,
            fotos: [],
          },
          [amigoId]: {
            porcentaje: 0,
            fotos: [],
          },
        },
      });

      Alert.alert("Reto enviado", "El reto ha sido enviado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al enviar reto: ", error);
      Alert.alert("Error", "No se pudo enviar el reto.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Reto</Text>

      <Text style={styles.label}>Título del Reto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Correr 20 km"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Detalles del Reto (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Describe más a fondo el reto..."
        value={detalle}
        onChangeText={setDetalle}
        multiline
      />

      <Text style={styles.label}>Objetivo numérico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 20"
        keyboardType="numeric"
        value={objetivo}
        onChangeText={setObjetivo}
      />

      <Text style={styles.label}>Unidad del objetivo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. km, páginas, horas"
        value={unidad}
        onChangeText={setUnidad}
      />

      <Text style={styles.label}>Estrellas apostadas</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={estrellas}
        onChangeText={setEstrellas}
        placeholder="Ej. 5"
      />

      <Text style={styles.label}>Fecha de Inicio (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-05-08"
        value={fechaInicio}
        onChangeText={setFechaInicio}
      />

      <Text style={styles.label}>Fecha de Fin (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-05-15"
        value={fechaFin}
        onChangeText={setFechaFin}
      />

      <Text style={styles.label}>Imagen (opcional)</Text>
      <Pressable onPress={seleccionarImagen} style={styles.imagePicker}>
        <Text>Seleccionar Imagen</Text>
      </Pressable>
      {imagenUri && <Image source={{ uri: imagenUri }} style={styles.preview} />}

      <Pressable style={styles.sendButton} onPress={enviarReto}>
        <Text style={styles.sendText}>Enviar Reto</Text>
      </Pressable>
    </ScrollView>
  );
};

export default CrearRetoScreen;
