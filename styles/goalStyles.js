// screens/styles/goalStyles.js
import { StyleSheet } from 'react-native';

export const goalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  filtroBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  filtroBtnActivo: {
    backgroundColor: '#2196F3',
  },
  filtroText: {
    color: '#333',
    fontWeight: 'bold',
  },
  filtroTextActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  goalsContainer: {
    marginTop: 10,
  },
  goalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  goalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  goalSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  deleteIcon: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});
