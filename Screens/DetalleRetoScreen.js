import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Button, ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebase/firebaseConfig";
import { restarEstrellas, sumarEstrellas } from "../services/retoService";

const DetalleRetoScreen = () => {
  const { params } = useRoute();
  const retoId = params?.retoId;
  const [reto, setReto] = useState(null);
  const [miProgreso, setMiProgreso] = useState(0);
  const [misFotos, setMisFotos] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const cargarReto = async () => {
      const docRef = doc(db, "retos", retoId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReto(data);
        const miParte = data.progreso[userId];
        setMiProgreso(miParte?.valorReal || 0); // Mostramos lo que hizo realmente
        setMisFotos(miParte?.fotos || []);
      } else {
        Alert.alert("Error", "El reto no existe.");
      }
    };

    cargarReto();
  }, [retoId]);

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const base64 = result.assets[0].base64;
      const uriBase64 = `data:image/jpeg;base64,${base64}`;
      const nuevasFotos = [...misFotos, uriBase64];
      setMisFotos(nuevasFotos);
    }
  };

  const guardarProgreso = async () => {
    if (!reto || !reto.objetivo) {
      Alert.alert("Error", "Este reto no tiene un objetivo definido.");
      return;
    }

    const porcentajeReal = Math.min((miProgreso / reto.objetivo) * 100, 100);

    const nuevoProgreso = {
      ...reto.progreso,
      [userId]: {
        porcentaje: porcentajeReal,
        valorReal: miProgreso,
        fotos: misFotos,
      },
    };

    const otroUserId = reto.creadorId === userId ? reto.retadoId : reto.creadorId;
    const otroProgreso = reto.progreso[otroUserId]?.porcentaje || 0;
    const miProgresoPrevio = reto.progreso[userId]?.porcentaje || 0;

    let ganadorId = reto.ganadorId || null;

    // Ganador lógico: tú has terminado y el otro no
    if (!ganadorId && porcentajeReal === 100 && miProgresoPrevio < 100 && otroProgreso < 100) {
      ganadorId = userId;
      await sumarEstrellas(userId, reto.estrellas || 1);
      await restarEstrellas(otroUserId, reto.estrellas || 1);
      Alert.alert("🎉 ¡Felicidades!", "Has ganado el reto y recibido estrellas.");
    }

    try {
      await updateDoc(doc(db, "retos", retoId), {
        progreso: nuevoProgreso,
        ganadorId: ganadorId,
      });
      Alert.alert("Guardado", "Tu progreso se ha actualizado.");
    } catch (error) {
      console.error("Error al guardar progreso", error);
      Alert.alert("Error", "No se pudo guardar tu progreso.");
    }
  };

  if (!reto) return <Text>Cargando...</Text>;

  const otroUserId = reto.creadorId === userId ? reto.retadoId : reto.creadorId;
  const progresoOtro = reto.progreso[otroUserId] || { porcentaje: 0, fotos: [] };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{reto.titulo}</Text>
      <Text>{reto.detalle}</Text>
      <Text>Inicio: {reto.fechaInicio} - Fin: {reto.fechaFin}</Text>
      <Text>Objetivo: {reto.objetivo} {reto.unidad}</Text>

      {reto.imagen && (
        <Image source={{ uri: reto.imagen }} style={{ width: "100%", height: 200, borderRadius: 10, marginVertical: 10 }} />
      )}

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Tu progreso:</Text>
      <TextInput
        keyboardType="numeric"
        value={miProgreso.toString()}
        onChangeText={(text) => setMiProgreso(Number(text))}
        placeholder={`¿Cuánto llevas? (ej: 5 ${reto.unidad})`}
        style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10, marginVertical: 10 }}
      />
      <Text>Equivale a: {Math.min(((miProgreso / reto.objetivo) * 100).toFixed(1), 100)}%</Text>

      <Button title="Añadir Foto" onPress={seleccionarImagen} />

      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {misFotos.map((foto, index) => (
          <Image
            key={index}
            source={{ uri: foto }}
            style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
          />
        ))}
      </ScrollView>

      <Button title="Guardar Progreso" onPress={guardarProgreso} />

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontWeight: "bold" }}>Progreso de tu amigo:</Text>
        <Text>{progresoOtro.porcentaje || 0}%</Text>

        <ScrollView horizontal style={{ marginTop: 10 }}>
          {progresoOtro.fotos?.map((foto, index) => (
            <Image
              key={index}
              source={{ uri: foto }}
              style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default DetalleRetoScreen;
