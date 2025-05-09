import { StyleSheet } from 'react-native';

export const goalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  filtroBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  filtroBtnActivo: {
    backgroundColor: '#2196F3',
  },
  filtroText: {
    color: '#666',
    fontWeight: '500',
  },
  filtroTextActivo: {
    color: '#fff',
    fontWeight: '600',
  },
  goalsContainer: {
    marginTop: 10,
  },
  goalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  goalSubText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  deleteIcon: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  retosBtn: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  retosBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  noGoalsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  }
});
