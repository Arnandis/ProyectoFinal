import { StyleSheet } from 'react-native';

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
export default styles;