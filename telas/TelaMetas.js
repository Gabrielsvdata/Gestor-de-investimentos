import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import CaixaDeTexto from '../componentes/CaixaDeTexto';
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';
import { useCalculos } from '../contexto/CalculosContexto';
import PopupAviso from '../componentes/PopupAviso/PopupAviso';

export default function TelaMetas() {
  const [descricao, setDescricao] = useState('');
  const [metaValor, setMetaValor] = useState('');
  const [aporteInicial, setAporteInicial] = useState('0');
  const [aporteMensal, setAporteMensal] = useState('');
  const [resultados, setResultados] = useState(null);
  const { tiposInvestimento, carregando, ultimaAtualizacao } = useCalculos();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const calcularMeta = () => {
    if (!metaValor || !aporteMensal) {
      setPopupMessage('Preencha pelo menos a Meta e o Aporte Mensal');
      setPopupVisible(true);
      return;
    }

    const meta = parseFloat(metaValor);
    const inicial = parseFloat(aporteInicial) || 0;
    const mensal = parseFloat(aporteMensal);

    if (meta <= 0 || inicial < 0 || mensal <= 0) {
      setPopupMessage('Valores inválidos');
      setPopupVisible(true);
      return;
    }

    if (inicial >= meta) {
      setPopupMessage('Você já tem o valor da meta!');
      setPopupVisible(true);
      return;
    }

    // Calcula para cada tipo de investimento
    const simulacoes = Object.entries(tiposInvestimento).map(([tipo, info]) => {
      const taxaMensal = info.taxa / 100;
      let saldo = inicial;
      let meses = 0;
      const maxMeses = 1200; // Limite de 100 anos

      // Simula mês a mês até atingir a meta
      while (saldo < meta && meses < maxMeses) {
        meses++;
        saldo = saldo * (1 + taxaMensal) + mensal;
      }

      const investidoTotal = inicial + (mensal * meses);
      const rendimento = saldo - investidoTotal;
      const anos = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;

      return {
        tipo,
        nome: info.nome,
        taxa: info.taxa,
        meses,
        anos,
        mesesRestantes,
        valorFinal: saldo,
        investidoTotal,
        rendimento,
        tempoTexto: anos > 0 
          ? `${anos} ano${anos > 1 ? 's' : ''}${mesesRestantes > 0 ? ` e ${mesesRestantes} mês${mesesRestantes > 1 ? 'es' : ''}` : ''}`
          : `${meses} mês${meses > 1 ? 'es' : ''}`
      };
    });

    // Ordena do mais rápido (menos meses) para o mais lento
    simulacoes.sort((a, b) => a.meses - b.meses);

    setResultados(simulacoes);
  };

  const renderResultado = ({ item, index }) => {
    const isPrimeiro = index === 0;
    const tempoMaximo = resultados[resultados.length - 1].meses;
    const progressoPorcentagem = ((tempoMaximo - item.meses) / tempoMaximo) * 100;

    return (
      <View style={[styles.cartaoResultado, isPrimeiro && styles.cartaoMaisRapido]}>
        {isPrimeiro && (
          <View style={styles.badgeMaisRapido}>
            <MaterialIcons name="flash-on" size={16} color={theme.colors.warning} />
            <Text style={styles.textoMaisRapido}>Mais Rápido</Text>
          </View>
        )}

        <View style={styles.headerResultado}>
          <View style={styles.nomeInvestimentoContainer}>
            <Text style={styles.nomeInvestimento}>{item.nome}</Text>
            <Text style={styles.taxaInvestimento}>{item.taxa.toFixed(2)}% a.m</Text>
          </View>
          <View style={styles.tempoContainer}>
            <MaterialIcons 
              name="schedule" 
              size={20} 
              color={isPrimeiro ? theme.colors.success : theme.colors.primary} 
            />
            <Text style={[styles.tempoTotal, isPrimeiro && { color: theme.colors.success }]}>
              {item.tempoTexto}
            </Text>
          </View>
        </View>

        {/* Barra de progresso comparativa */}
        <View style={styles.barraProgressoContainer}>
          <View style={[styles.barraProgresso, { width: `${Math.max(progressoPorcentagem, 10)}%` }]} />
        </View>

        <View style={styles.detalhesResultado}>
          <View style={styles.detalheItem}>
            <Text style={styles.labelDetalhe}>Investido</Text>
            <Text style={styles.valorDetalhe}>
              R$ {item.investidoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.detalheItem}>
            <Text style={styles.labelDetalhe}>Rendimento</Text>
            <Text style={[styles.valorDetalhe, { color: theme.colors.success }]}>
              R$ {item.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.detalheItem}>
            <Text style={styles.labelDetalhe}>Total Acumulado</Text>
            <Text style={[styles.valorDetalhe, { color: theme.colors.info }]}>
              R$ {item.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View style={styles.infoAdicional}>
          <MaterialIcons name="info-outline" size={14} color={theme.colors.textSoft} />
          <Text style={styles.textoInfoAdicional}>
            {item.meses} aportes mensais de R$ {parseFloat(aporteMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <PopupAviso visible={popupVisible} title="Aviso" message={popupMessage} onClose={() => setPopupVisible(false)} />
      <View style={styles.content}>
        <Text style={styles.titulo}>Planejador de Metas</Text>
        <Text style={styles.subtitulo}>Descubra quanto tempo levará para alcançar seus objetivos financeiros</Text>

        {carregando ? (
          <View style={styles.statusCarregando}>
            <MaterialIcons name="sync" size={20} color={theme.colors.primary} />
            <Text style={styles.textoCarregandoPequeno}>Carregando taxas...</Text>
          </View>
        ) : (
          <View style={styles.statusTaxas}>
            <View style={styles.headerStatus}>
              <MaterialIcons name="security" size={16} color={theme.colors.success} />
              <Text style={styles.textoStatus}>Taxas em tempo real do Banco Central</Text>
            </View>
            <Text style={styles.dataAtualizacao}>
              Atualizado: {ultimaAtualizacao ? new Date(ultimaAtualizacao).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'}
            </Text>
          </View>
        )}

        <View style={styles.formulario}>
          <Text style={styles.label}>📋 Descrição da Meta (opcional)</Text>
          <CaixaDeTexto
            placeholder="Ex: Casa própria, Carro novo, Viagem..."
            value={descricao}
            onChangeText={setDescricao}
            icon="flag"
          />

          <Text style={[styles.label, { marginTop: theme.spacing.lg }]}>
            💰 Valor da Meta (R$)
          </Text>
          <CaixaDeTexto
            placeholder="Ex: 200000"
            value={metaValor}
            onChangeText={setMetaValor}
            keyboardType="decimal-pad"
            icon="money"
          />

          <Text style={[styles.label, { marginTop: theme.spacing.lg }]}>
            🏦 Quanto você tem hoje? (R$)
          </Text>
          <CaixaDeTexto
            placeholder="Ex: 100000 (deixe 0 se não tiver nada)"
            value={aporteInicial}
            onChangeText={setAporteInicial}
            keyboardType="decimal-pad"
            icon="savings"
          />

          <Text style={[styles.label, { marginTop: theme.spacing.lg }]}>
            📅 Quanto pode investir por mês? (R$)
          </Text>
          <CaixaDeTexto
            placeholder="Ex: 1000"
            value={aporteMensal}
            onChangeText={setAporteMensal}
            keyboardType="decimal-pad"
            icon="event"
          />

          <BotaoPersonalizado
            title="Calcular Prazo para a Meta"
            onPress={calcularMeta}
            style={{ marginTop: theme.spacing.xl, opacity: carregando ? 0.5 : 1 }}
            disabled={carregando}
          />
        </View>

        {resultados && (
          <View style={styles.secaoResultados}>
            <View style={styles.headerResultados}>
              <MaterialIcons name="insights" size={24} color={theme.colors.primary} />
              <Text style={styles.tituloResultados}>
                Comparação de Investimentos
              </Text>
            </View>

            <View style={styles.infoMeta}>
              <Text style={styles.textoMeta}>
                Para atingir <Text style={styles.valorMeta}>R$ {parseFloat(metaValor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
              </Text>
              {descricao && (
                <Text style={styles.descricaoMetaTexto}>"{descricao}"</Text>
              )}
              <Text style={styles.resumoMeta}>
                Investindo R$ {parseFloat(aporteMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
              </Text>
            </View>

            <FlatList
              data={resultados}
              renderItem={renderResultado}
              keyExtractor={(item) => item.tipo}
              scrollEnabled={false}
            />
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
    marginBottom: theme.spacing.sm,
    fontFamily: 'Inter_800ExtraBold',
  },
  subtitulo: {
    fontSize: 14,
    color: theme.colors.textSoft,
    marginBottom: theme.spacing.lg,
    fontFamily: 'Inter_400Regular',
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
  statusCarregando: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  textoCarregandoPequeno: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
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
  secaoResultados: {
    marginTop: theme.spacing.xl,
  },
  headerResultados: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  tituloResultados: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Inter_600SemiBold',
  },
  infoMeta: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  textoMeta: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: 'Inter_400Regular',
  },
  valorMeta: {
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  descricaoMetaTexto: {
    fontSize: 13,
    color: theme.colors.textSoft,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  resumoMeta: {
    fontSize: 12,
    color: theme.colors.textSoft,
    marginTop: theme.spacing.xs,
    fontFamily: 'Inter_400Regular',
  },
  cartaoResultado: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
    position: 'relative',
  },
  cartaoMaisRapido: {
    borderWidth: 2,
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.successMuted,
  },
  badgeMaisRapido: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  textoMaisRapido: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  headerResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  nomeInvestimentoContainer: {
    flex: 1,
  },
  nomeInvestimento: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  taxaInvestimento: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  tempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  tempoTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  barraProgressoContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.sm,
  },
  detalhesResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detalheItem: {
    flex: 1,
    alignItems: 'center',
  },
  labelDetalhe: {
    fontSize: 11,
    color: theme.colors.textSoft,
    marginBottom: theme.spacing.xs,
    fontFamily: 'Inter_400Regular',
  },
  valorDetalhe: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  infoAdicional: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  textoInfoAdicional: {
    fontSize: 11,
    color: theme.colors.textSoft,
    marginLeft: 6,
    fontFamily: 'Inter_400Regular',
  },
});
