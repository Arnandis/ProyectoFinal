import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const RetosRecibidosScreen = () => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRetos = async () => {
    try {
      const retosRef = collection(db, "retos");
      const q = query(retosRef, where("retadoId", "==", userId), where("estado", "==", "pendiente"));
      const snapshot = await getDocs(q);

      const retosConUsuarios = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const creadorRef = doc(db, "users", data.creadorId);
          const creadorSnap = await getDoc(creadorRef);
          const creadorData = creadorSnap.exists() ? creadorSnap.data() : null;

          return {
            id: docSnap.id,
            ...data,
            creador: creadorData,
          };
        })
      );

      setRetos(retosConUsuarios);
    } catch (error) {
      console.error("Error al obtener retos:", error);
      Alert.alert("Error", "No se pudieron cargar los retos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetos();
  }, []);

  const aceptarReto = async (retoId) => {
    try {
      await updateDoc(doc(db, "retos", retoId), {
        estado: "aceptado",
      });
      Alert.alert("Reto aceptado", "Has aceptado el reto.");
      fetchRetos(); // refrescar lista
    } catch (error) {
      console.error("Error al aceptar reto:", error);
      Alert.alert("Error", "No se pudo aceptar el reto.");
    }
  };

  const rechazarReto = async (retoId) => {
    try {
      await updateDoc(doc(db, "retos", retoId), {
        estado: "rechazado",
      });
      Alert.alert("Reto rechazado", "Has rechazado el reto.");
      fetchRetos(); // refrescar lista
    } catch (error) {
      console.error("Error al rechazar reto:", error);
      Alert.alert("Error", "No se pudo rechazar el reto.");
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Cargando retos...</Text>;

  if (retos.length === 0) return <Text style={{ padding: 20 }}>No tienes retos pendientes.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {retos.map((reto) => (
        <View key={reto.id} style={styles.card}>
          <Text style={styles.title}>{reto.titulo}</Text>

          {reto.imagen && <Image source={{ uri: reto.imagen }} style={styles.image} />}

          <Text>Fecha de inicio: {reto.fechaInicio}</Text>
          <Text>Fecha de fin: {reto.fechaFin}</Text>
          <Text>Estrellas en juego: {reto.estrellas}</Text>

          {reto.creador && (
            <View style={styles.creadorInfo}>
              <Image
                source={{ uri: reto.creador.photo }}
                style={styles.avatar}
              />
              <Text>{reto.creador.name}</Text>
            </View>
          )}

          <View style={styles.buttons}>
            <Pressable onPress={() => aceptarReto(reto.id)} style={styles.acceptBtn}>
              <Text style={styles.btnText}>Aceptar</Text>
            </Pressable>
            <Pressable onPress={() => rechazarReto(reto.id)} style={styles.rejectBtn}>
              <Text style={styles.btnText}>Rechazar</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  creadorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptBtn: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  rejectBtn: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default RetosRecibidosScreen;
