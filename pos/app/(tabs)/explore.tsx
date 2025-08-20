import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Funcionalidades</ThemedText>
      </ThemedView>

      <ThemedText>
        Descubra todas as funcionalidades do RGPAY para seu estabelecimento.
      </ThemedText>

      <Collapsible title="Gestão de Produtos">
        <ThemedText>
          Cadastre e gerencie seus produtos de forma organizada por categorias.
          Defina preços, descrições e disponibilidade dos itens.
        </ThemedText>
        <ThemedText>
          • Categorias personalizáveis{'\n'}• Controle de estoque{'\n'}• Preços
          dinâmicos{'\n'}• Imagens dos produtos
        </ThemedText>
      </Collapsible>

      <Collapsible title="Sistema de Pedidos">
        <ThemedText>
          Crie e gerencie pedidos de forma rápida e eficiente. Acompanhe o
          status dos pedidos em tempo real.
        </ThemedText>
        <ThemedText>
          • Interface intuitiva{'\n'}• Múltiplos itens por pedido{'\n'}•
          Observações personalizadas{'\n'}• Histórico completo
        </ThemedText>
      </Collapsible>

      <Collapsible title="Relatórios e Analytics">
        <ThemedText>
          Acompanhe o desempenho do seu negócio com relatórios detalhados e
          análises em tempo real.
        </ThemedText>
        <ThemedText>
          • Faturamento por período{'\n'}• Produtos mais vendidos{'\n'}•
          Horários de pico{'\n'}• Exportação de dados
        </ThemedText>
      </Collapsible>

      <Collapsible title="Configurações">
        <ThemedText>
          Personalize o sistema de acordo com as necessidades do seu
          estabelecimento.
        </ThemedText>
        <ThemedText>
          • Informações da unidade{'\n'}• Configurações de impressão{'\n'}•
          Backup automático{'\n'}• Integrações
        </ThemedText>
      </Collapsible>

      <Collapsible title="Suporte e Atualizações">
        <ThemedText>
          O RGPAY é constantemente atualizado com novas funcionalidades e
          melhorias de performance.
        </ThemedText>
        <ThemedText>
          • Atualizações automáticas{'\n'}• Suporte técnico 24/7{'\n'}•
          Documentação completa{'\n'}• Comunidade ativa
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
