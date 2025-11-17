import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import CaixaDeTexto from '../componentes/CaixaDeTexto';
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';
import { compararInvestimentos } from '../api/finance';
import { useCalculos } from '../contexto/CalculosContexto';
import { converterMoeda } from '../api/conversorMoedas';
import PopupAviso from '../componentes/PopupAviso/PopupAviso';

export default function TelaSimulador() {
  const [valorInicial, setValorInicial] = useState('');
  const [tipoInvestimento, setTipoInvestimento] = useState('SELIC');
  const [meses, setMeses] = useState('12');
  const [resultados, setResultados] = useState(null);
  const { simularInvestimento, tiposInvestimento, carregando, ultimaAtualizacao } = useCalculos();
  const [tipoModalVisible, setTipoModalVisible] = useState(false);
  const [valorConvertidoUSD, setValorConvertidoUSD] = useState(null);
  const [conversaoErro, setConversaoErro] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSimular = () => {
    if (!valorInicial || parseFloat(valorInicial) <= 0) {
      setPopupMessage('Por favor, insira um valor válido');
      setPopupVisible(true);
      return;
    }

    const valor = parseFloat(valorInicial);
    const mesesTotais = parseInt(meses) || 12;

    // Converte o valor para USD (exibição)
    (async () => {
      try {
        setConversaoErro(null);
        const convertido = await converterMoeda(valor, 'BRL', 'USD');
        setValorConvertidoUSD(convertido);
      } catch (err) {
        console.error('Erro na conversão:', err);
        setConversaoErro('Não foi possível converter agora');
        setValorConvertidoUSD(null);
      }
    })();

    // Compara todos os investimentos com as taxas atualizadas da API
    const comparacao = compararInvestimentos(valor, mesesTotais, tiposInvestimento);
    setResultados(comparacao);

    // Simula o investimento selecionado
    const taxaSelecionada = tiposInvestimento[tipoInvestimento].taxa;
    simularInvestimento(valor, tipoInvestimento, taxaSelecionada);
  };

  const renderResultado = ({ item }) => {
    const isEscolhido = item.tipo === tipoInvestimento;

    return (
      <View style={[styles.cartaoResultado, isEscolhido && styles.cartaoEscolhido]}>
        <View style={styles.headerResultado}>
          <View style={styles.nomeContainer}>
            <Text style={styles.nomeInvestimento}>{item.nome}</Text>
            {isEscolhido && (
              <View style={styles.badgeEscolhido}>
                <MaterialIcons name="check-circle" size={14} color={theme.colors.success} />
                <Text style={styles.textoEscolhido}>Sua escolha</Text>
              </View>
            )}
          </View>
          <Text style={styles.taxaInvestimento}>{item.taxa.toFixed(2)}% a.m</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dadosResultado}>
          <View style={styles.dadoItem}>
            <Text style={styles.labelDado}>Valor Final</Text>
            <Text style={styles.valorDado}>
              R$ {item.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.dadoItem}>
            <Text style={styles.labelDado}>Ganho Total</Text>
            <Text style={[styles.valorDado, { color: theme.colors.success }]}>
              R$ {item.ganho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.dadoItem}>
            <Text style={styles.labelDado}>Rentabilidade</Text>
            <Text style={[styles.valorDado, { color: theme.colors.info }]}>
              {((item.ganho / parseFloat(valorInicial)) * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <PopupAviso visible={popupVisible} title="Campo obrigatório" message={popupMessage} onClose={() => setPopupVisible(false)} />
        <Text style={styles.titulo}>Simule seu Investimento</Text>

        {carregando ? (
          <View style={styles.statusCarregando}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.textoCarregando}>Buscando taxas do Banco Central...</Text>
          </View>
        ) : (
          <View style={styles.statusTaxas}>
            <View style={styles.headerStatus}>
              <MaterialIcons name="security" size={16} color={theme.colors.success} />
              <Text style={styles.textoStatus}>Taxas em tempo real do Banco Central</Text>
            </View>
            <Text style={styles.dataAtualizacao}>
              Atualizado em: {ultimaAtualizacao ? new Date(ultimaAtualizacao).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'}
            </Text>
          </View>
        )}

        <View style={styles.formulario}>
          <Text style={styles.label}>Valor Inicial (R$)</Text>
          <CaixaDeTexto
            placeholder="0,00"
            value={valorInicial}
            onChangeText={setValorInicial}
            keyboardType="decimal-pad"
            icon="money"
          />

          {valorConvertidoUSD !== null && (
            <>
              <Text style={{ marginTop: theme.spacing.sm, color: theme.colors.textSoft }}>
                ≈ US$ {valorConvertidoUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <PopupAviso visible={popupVisible} title="Campo obrigatório" message={popupMessage} onClose={() => setPopupVisible(false)} />
            </>
          )}
          {conversaoErro && (
            <Text style={{ marginTop: theme.spacing.sm, color: theme.colors.danger }}>{conversaoErro}</Text>
          )}

          <Text style={[styles.label, { marginTop: theme.spacing.lg }]}>
            Tipo de Investimento
          </Text>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => !carregando && setTipoModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.pickerRow}>
              <Text style={styles.pickerText} numberOfLines={1} ellipsizeMode="tail">
                {tiposInvestimento && tiposInvestimento[tipoInvestimento]
                  ? `${tiposInvestimento[tipoInvestimento].nome} (${tiposInvestimento[tipoInvestimento].taxa.toFixed(2)}%)`
                  : 'Selecione um tipo'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.textSoft} />
            </View>
          </TouchableOpacity>

          <Modal
            visible={tipoModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setTipoModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setTipoModalVisible(false)} />
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Escolha o tipo de investimento</Text>
              <FlatList
                data={Object.entries(tiposInvestimento)}
                keyExtractor={([key]) => key}
                renderItem={({ item }) => {
                  const [key, value] = item;
                  const selected = key === tipoInvestimento;
                  return (
                    <TouchableOpacity
                      style={[styles.optionItem, selected && styles.optionSelected]}
                      onPress={() => { setTipoInvestimento(key); setTipoModalVisible(false); }}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {value.nome} ({value.taxa.toFixed(2)}%)
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Modal>

          <Text style={[styles.label, { marginTop: theme.spacing.lg }]}>
            Período (Meses)
          </Text>
          <CaixaDeTexto
            placeholder="12"
            value={meses}
            onChangeText={setMeses}
            keyboardType="number-pad"
            icon="event"
          />

          <BotaoPersonalizado
            title="Simular"
            onPress={handleSimular}
            style={{ marginTop: theme.spacing.xl, opacity: carregando ? 0.5 : 1 }}
            disabled={carregando}
          />
        </View>

        {resultados && (
          <View style={styles.secaoResultados}>
            {/* Investimento Escolhido */}
            <View style={styles.secaoEscolhido}>
              <View style={styles.headerSecao}>
                <MaterialIcons name="star" size={20} color={theme.colors.warning} />
                <Text style={styles.tituloSecao}>Investimento Escolhido</Text>
              </View>
              {renderResultado({ item: resultados.find(item => item.tipo === tipoInvestimento) })}
            </View>

            {/* Outras Opções */}
            <View style={styles.secaoOutros}>
              <View style={styles.headerSecao}>
                <MaterialIcons name="compare-arrows" size={20} color={theme.colors.info} />
                <Text style={styles.tituloSecao}>Outras Opções de Investimento</Text>
              </View>
              <FlatList
                data={resultados.filter(item => item.tipo !== tipoInvestimento)}
                renderItem={renderResultado}
                keyExtractor={(item) => item.tipo}
                scrollEnabled={false}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.screen,
  },
  content: {
    padding: theme.spacing.lg,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    fontFamily: 'Inter_800ExtraBold',
  },
  formulario: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Inter_600SemiBold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    color: theme.colors.text,
    fontSize: 14,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  modalCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadow.card,
    maxHeight: '60%'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  optionItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  optionSelected: {
    backgroundColor: theme.colors.primaryMuted,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  secaoResultados: {
    marginTop: theme.spacing.xl,
  },
  secaoEscolhido: {
    marginBottom: theme.spacing.xl,
  },
  secaoOutros: {
    marginTop: theme.spacing.md,
  },
  headerSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Inter_600SemiBold',
  },
  tituloResultados: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    fontFamily: 'Inter_600SemiBold',
  },
  cartaoResultado: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },
  cartaoEscolhido: {
    borderWidth: 2,
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.primaryMuted,
  },
  headerResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  nomeContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  nomeInvestimento: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  badgeEscolhido: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.successMuted,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  textoEscolhido: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.success,
    marginLeft: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  taxaInvestimento: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  dadosResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dadoItem: {
    flex: 1,
    alignItems: 'center',
  },
  labelDado: {
    fontSize: 12,
    color: theme.colors.textSoft,
    marginBottom: theme.spacing.xs,
    fontFamily: 'Inter_400Regular',
  },
  valorDado: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  statusCarregando: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  textoCarregando: {
    fontSize: 14,
    color: theme.colors.textSoft,
    marginTop: theme.spacing.md,
    fontFamily: 'Inter_400Regular',
  },
  statusTaxas: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  textoStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Inter_600SemiBold',
  },
  dataAtualizacao: {
    fontSize: 11,
    color: theme.colors.textSoft,
    fontFamily: 'Inter_400Regular',
  },
});