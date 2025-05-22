import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import styles from "../styles/articlesStyles";

const ArticlesScreen = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('finanzas'); // palabra clave para buscar
  const API_KEY = 'pub_86670319c56930c2df585f2173bc9b3c8013a';

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${encodeURIComponent(query)}&language=es&category=business`
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
  }, [query]);

  // Temas predefinidos para facilitar la búsqueda
  const predefinedTopics = [
    'finanzas',
    'motivación',
    'metas',
    'productividad',
    'tiempo',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artículos y consejos</Text>

      {/* Input para que el usuario escriba temas */}
      <TextInput
        style={styles.input}
        placeholder="Buscar temas (ej: finanzas, motivación)"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Botones con temas predefinidos */}
      <View style={styles.topicsContainer}>
        {predefinedTopics.map((topic) => (
          <TouchableOpacity
            key={topic}
            style={[
              styles.topicButton,
              query === topic && styles.topicButtonActive,
            ]}
            onPress={() => setQuery(topic)}
          >
            <Text
              style={[
                styles.topicButtonText,
                query === topic && styles.topicButtonTextActive,
              ]}
            >
              {topic}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loaderText}>Cargando artículos...</Text>
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default ArticlesScreen;
