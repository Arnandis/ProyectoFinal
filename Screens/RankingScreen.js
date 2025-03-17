import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Pressable, Animated } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { FadeInDown } from "react-native-reanimated";

const RankingScreen = () => {
  const [ranking, setRanking] = useState([]);
  const [filteredRanking, setFilteredRanking] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rankingUsuarios"));
        const usersArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedUsers = usersArray.sort((a, b) => b.horasTotales - a.horasTotales);
        setRanking(sortedUsers);
        setFilteredRanking(sortedUsers);
      } catch (error) {
        console.error("Error fetching ranking: ", error);
      }
    };

    fetchRanking();
  }, []);

  // Función para asignar medallas
  const getMedal = (index) => {
    if (index === 0) return "🥇"; 
    if (index === 1) return "🥈"; 
    if (index === 2) return "🥉"; 
    return "";
  };

  // Filtrar usuarios según la categoría seleccionada
  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "Todos") {
      setFilteredRanking(ranking);
    } else {
      setFilteredRanking(ranking.filter(user => user.categoria === category));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Ranking General</Text>

      {/* Filtros por categoría */}
      <View style={styles.filterContainer}>
        {["Todos", "Estudiante", "Famoso"].map((category) => (
          <Pressable 
            key={category} 
            onPress={() => filterByCategory(category)}
            style={[
              styles.filterButton, 
              selectedCategory === category && styles.activeFilter
            ]}
          >
            <Text style={styles.filterText}>{category}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredRanking}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.card}>
            <Text style={styles.medal}>{getMedal(index)}</Text>
            <Image source={{ uri: item.imagen }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.category}>{item.categoria}</Text>
              <Text style={styles.hours}>⏳ {item.horasTotales} horas</Text>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#F8F9FA" },

  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20 },
  
    filterContainer: { 
      flexDirection: "row",
      justifyContent: "center", 
      marginBottom: 15 },
      
    filterButton: { 
      paddingVertical: 8,
      paddingHorizontal: 15, 
      backgroundColor: "#ddd", 
      borderRadius: 20,
      marginHorizontal: 5 
    },
  activeFilter: { 
    backgroundColor: "#007BFF" },
  
  filterText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#fff" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medal: { fontSize: 30, marginRight: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold" },
  category: { color: "#666" },
  hours: { fontSize: 16, fontWeight: "600", color: "#007BFF" },
});

export default RankingScreen;
