import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '~/components/ThemedText';
import { ThemedView } from '~/components/ThemedView';
export default function OnboardingScreen() {
  const handleStart = () => {
    router.push('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <ThemedText style={styles.logoText}>RGPAY</ThemedText>
          </View>
        </View>

        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            Bem-vindo ao RGPAY
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Comandas simplificadas, sem complicação.
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <ThemedText style={styles.buttonText}>Começar</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
