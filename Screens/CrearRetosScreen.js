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

const CrearRetoScreen = () => {
  const { params } = useRoute();
  const amigoId = params?.amigoId;
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estrellas, setEstrellas] = useState("5");
  const [imagenUri, setImagenUri] = useState(null);
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

      <Text style={styles.label}>Estrellas apostadas (1 - 100)</Text>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  imagePicker: {
    backgroundColor: "#E0E7FF",
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default CrearRetoScreen;
