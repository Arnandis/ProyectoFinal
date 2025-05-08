import React, { useEffect, useState,useRef, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, Pressable } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";

const RankingScreen = () => {
  const [ranking, setRanking] = useState([]);
  const [previousRanking, setPreviousRanking] = useState({});
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUserId = auth.currentUser.uid;

const previousRankingRef = useRef({});

useFocusEffect(
  useCallback(() => {
    const fetchRanking = async () => {
      try {
        const userDocRef = doc(db, "users", currentUserId);
        const userDoc = await getDoc(userDocRef);
        const currentUser = { id: currentUserId, ...userDoc.data() };

        const amigosIds = currentUser.amigos || [];

        const querySnapshot = await getDocs(collection(db, "users"));
        const allUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const amigos = allUsers.filter(user => amigosIds.includes(user.id));

        const isIncluded = amigos.some(user => user.id === currentUserId);
        const fullRanking = isIncluded ? amigos : [...amigos, currentUser];

        const sorted = fullRanking.sort((a, b) => b.estrellas - a.estrellas);

        const newRanking = sorted.map((user, index) => ({ ...user, position: index + 1 }));
        const prevPositions = ranking.reduce((acc, user, idx) => {
          acc[user.id] = idx + 1;
          return acc;
        }, {});

        // Guardar las posiciones anteriores en ref
        previousRankingRef.current = prevPositions;

        setRanking(newRanking);
      } catch (error) {
        console.error("Error fetching ranking: ", error);
      }
    };

    fetchRanking();
  }, [currentUserId])
);

// Cambia el método de flechas:
const getPositionChange = (user) => {
  const prevPos = previousRankingRef.current[user.id];
  if (!prevPos) return null;
  const diff = prevPos - user.position;
  if (diff > 0) return <AntDesign name="arrowup" size={16} color="green" />;
  if (diff < 0) return <AntDesign name="arrowdown" size={16} color="red" />;
  return <AntDesign name="minus" size={16} color="gray" />;
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏅 Ranking de Amigos</Text>

      <FlatList
        data={ranking}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              item.id === currentUserId && { backgroundColor: "#E0F2FE" } // azul claro para el actual
            ]}
          >
            <Text style={styles.position}>{index + 1}</Text>
            <Image source={{ uri: item.photo }} style={styles.avatar} />
            <View style={styles.info}>
              <Pressable onPress={() => navigation.navigate("PerfilAmigo", { id: item.id })}>
                <Text style={styles.name}>{item.name}</Text>
              </Pressable>
              <Text style={styles.stars}>⭐ {item.estrellas}</Text>
            </View>
            <View style={styles.arrow}>{getPositionChange(item)}</View>
            <Pressable
              style={styles.retarButton}
              onPress={() => navigation.navigate("CrearReto", { amigoId: item.id })}
            >
              <Text style={styles.retarText}>Retar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  position: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    color: "#555",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  stars: {
    color: "#FFD700",
    fontWeight: "600",
    marginTop: 2,
  },
  arrow: {
    marginRight: 10,
  },
  retarButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  retarText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default RankingScreen;
