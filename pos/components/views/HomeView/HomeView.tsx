import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/hooks';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const HomeView: React.FC = () => {
  const { deviceMetadata, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>RGPAY</ThemedText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <ThemedText style={styles.logoutText}>Sair</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeTitle}>Bem-vindo!</ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Dispositivo registrado e pronto para uso
          </ThemedText>
        </View>

        {deviceMetadata && (
          <View style={styles.deviceCard}>
            <ThemedText style={styles.cardTitle}>
              Informações do Dispositivo
            </ThemedText>

            <View style={styles.deviceRow}>
              <ThemedText style={styles.deviceLabel}>Serial:</ThemedText>
              <ThemedText style={styles.deviceValue}>
                {deviceMetadata.serialId}
              </ThemedText>
            </View>

            <View style={styles.deviceRow}>
              <ThemedText style={styles.deviceLabel}>Sistema:</ThemedText>
              <ThemedText style={styles.deviceValue}>
                {deviceMetadata.operationalSystem}
              </ThemedText>
            </View>

            {deviceMetadata.provider && (
              <View style={styles.deviceRow}>
                <ThemedText style={styles.deviceLabel}>Provedor:</ThemedText>
                <ThemedText style={styles.deviceValue}>
                  {deviceMetadata.provider}
                </ThemedText>
              </View>
            )}

            {deviceMetadata.deviceName && (
              <View style={styles.deviceRow}>
                <ThemedText style={styles.deviceLabel}>Nome:</ThemedText>
                <ThemedText style={styles.deviceValue}>
                  {deviceMetadata.deviceName}
                </ThemedText>
              </View>
            )}

            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <ThemedText style={styles.statusText}>Ativo</ThemedText>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>Nova Venda</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
          >
            <ThemedText
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              Histórico
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
          >
            <ThemedText
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              Configurações
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  logoutText: {
    color: '#dc3545',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  deviceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deviceLabel: {
    fontWeight: '500',
    color: '#666',
  },
  deviceValue: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  statusRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#28a745',
  },
  statusText: {
    fontWeight: '500',
    color: '#28a745',
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#0a7ea4',
  },
});
