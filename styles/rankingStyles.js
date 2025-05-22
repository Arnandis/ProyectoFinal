import { StyleSheet } from "react-native";

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
  verRetosButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  verRetosText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
