import { StyleSheet } from 'react-native';

const rankingStyles = StyleSheet.create({
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