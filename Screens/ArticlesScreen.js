import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const ArticlesScreen = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'pub_86670319c56930c2df585f2173bc9b3c8013a';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=finanzas&language=es&category=business`
        );
        const data = await response.json();
        setArticles(data.results || []);
      } catch (error) {
        console.error('Error al cargar los artículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loaderText}>Cargando artículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artículos y consejos</Text>
      <FlatList
        data={articles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.articleCard}
            onPress={() => Linking.openURL(item.link)}
          >
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleDate}>
              {item.pubDate?.split(' ')[0]}
            </Text>
            <Text style={styles.articleDescription}>
              {item.description?.substring(0, 100)}...
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  articleCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  articleDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  articleDescription: {
    fontSize: 14,
    color: '#444',
  },
});

export default ArticlesScreen;
