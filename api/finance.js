import { obterTaxasComCache } from './bancocentral.js';

// Tipos de investimentos com taxas padrão (fallback) - atualizadas Nov 2025
export const TIPOS_INVESTIMENTO = {
  SELIC: { nome: 'Tesouro Selic', taxa: 1.17 }, // 15% ao ano = 1.17% ao mês
  CDB: { nome: 'CDB', taxa: 1.16 }, // 14.9% ao ano = 1.16% ao mês
  LCI_LCA: { nome: 'LCI/LCA', taxa: 1.01 }, // 87% do CDI
  FUNDO: { nome: 'Fundo Multimercado', taxa: 0.87 } // 75% do CDI
};

/**
 * Obtém os tipos de investimento com taxas atualizadas do Banco Central
 * @returns {Promise<object>} Tipos de investimento com taxas reais
 */
export const obterTiposInvestimentoAtualizados = async () => {
  try {
    const taxas = await obterTaxasComCache();
    // Valida cada taxa individualmente
    const validarTaxa = (valor, nome, fallback) => {
      const taxa = parseFloat(valor);
      if (!Number.isFinite(taxa) || taxa <= 0) {
        return fallback;
      }
      return taxa;
    };

    const selic = validarTaxa(taxas.selic, 'SELIC', 1.17);
    const cdi = validarTaxa(taxas.cdi, 'CDI', 1.16);
    const cdb = validarTaxa(taxas.cdb, 'CDB', cdi);
    const lciLca = validarTaxa(taxas.lciLca, 'LCI/LCA', cdi * 0.87);
    const fundo = validarTaxa(taxas.fundo, 'Fundo', cdi * 0.75);


    const resultado = {
      SELIC: { nome: 'Tesouro Selic', taxa: parseFloat(selic.toFixed(4)) },
      CDB: { nome: 'CDB', taxa: parseFloat(cdb.toFixed(4)) },
      LCI_LCA: { nome: 'LCI/LCA', taxa: parseFloat(lciLca.toFixed(4)) },
      FUNDO: { nome: 'Fundo Multimercado', taxa: parseFloat(fundo.toFixed(4)) },
      ultimaAtualizacao: taxas.ultimaAtualizacao || new Date().toISOString()
    };
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao obter taxas atualizadas:', erro);
    return TIPOS_INVESTIMENTO;
  }
};

/**
 * Calcula o tempo necessário para atingir um valor com juros compostos
 * @param {number} valorInicial - Valor inicial do investimento
 * @param {number} taxaMensal - Taxa de juros mensal em %
 * @param {number} valorFinal - Valor final desejado (opcional)
 * @returns {object} Objeto com resultado dos cálculos
 */
export const calcularTempo = (valorInicial, taxaMensal, valorFinal = null) => {
  if (!valorFinal) {
    // Calcula o crescimento ao longo dos meses
    const taxaDecimal = taxaMensal / 100;
    const resultado = [];
    
    for (let mes = 0; mes <= 24; mes++) {
      const valor = valorInicial * Math.pow(1 + taxaDecimal, mes);
      resultado.push({
        mes,
        valor: parseFloat(valor.toFixed(2)),
        ganho: parseFloat((valor - valorInicial).toFixed(2))
      });
    }
    
    return resultado;
  } else {
    // Calcula o tempo para atingir um valor específico
    const taxaDecimal = taxaMensal / 100;
    let meses = Math.log(valorFinal / valorInicial) / Math.log(1 + taxaDecimal);
    
    return {
      meses: Math.ceil(meses),
      valorFinal: parseFloat(valorFinal.toFixed(2)),
      ganho: parseFloat((valorFinal - valorInicial).toFixed(2))
    };
  }
};

/**
 * Calcula o investimento mínimo para atingir uma meta
 * @param {number} metaValor - Valor da meta
 * @param {number} taxaMensal - Taxa de juros mensal em %
 * @param {number} meses - Número de meses para atingir a meta
 * @returns {number} Investimento mínimo necessário
 */
export const calcularInvestimentoMinimo = (metaValor, taxaMensal, meses) => {
  const taxaDecimal = taxaMensal / 100;
  const investimentoMinimo = metaValor / Math.pow(1 + taxaDecimal, meses);
  return parseFloat(investimentoMinimo.toFixed(2));
};

/**
 * Encontra o melhor investimento para uma meta específica
 * @param {number} metaValor - Valor da meta
 * @param {number} montanteDisponivel - Montante disponível para investir
 * @param {object} tiposInvest - Objeto com tipos de investimento atualizados (opcional)
 * @returns {object} Melhor opção de investimento com detalhes
 */
export const encontrarMelhorInvestimento = (metaValor, montanteDisponivel, tiposInvest = null) => {
  let melhorOpcao = null;
  let menorTempo = Infinity;

  const tipos = tiposInvest || TIPOS_INVESTIMENTO;

  Object.entries(tipos).forEach(([chave, investimento]) => {
    const resultado = calcularTempo(montanteDisponivel, investimento.taxa, metaValor);
    
    if (resultado.meses < menorTempo) {
      menorTempo = resultado.meses;
      melhorOpcao = {
        tipo: chave,
        nome: investimento.nome,
        taxa: investimento.taxa,
        ...resultado
      };
    }
  });

  return melhorOpcao;
};

/**
 * Calcula o valor futuro com juros compostos
 * @param {number} valorInicial - Valor inicial
 * @param {number} taxaMensal - Taxa mensal em %
 * @param {number} meses - Número de meses
 * @returns {number} Valor futuro
 */
export const calcularValorFuturo = (valorInicial, taxaMensal, meses) => {
  const taxaDecimal = taxaMensal / 100;
  const valorFuturo = valorInicial * Math.pow(1 + taxaDecimal, meses);
  return parseFloat(valorFuturo.toFixed(2));
};

/**
 * Compara diferentes investimentos para um valor inicial
 * @param {number} valorInicial - Valor inicial
 * @param {number} meses - Número de meses para comparação
 * @param {object} tiposInvest - Objeto com tipos de investimento atualizados (opcional)
 * @returns {array} Array com comparação de investimentos
 */
export const compararInvestimentos = (valorInicial, meses, tiposInvest = null) => {
  const tipos = tiposInvest || TIPOS_INVESTIMENTO;
  
  const comparacao = Object.entries(tipos).map(([chave, investimento]) => {
    const valorFinal = calcularValorFuturo(valorInicial, investimento.taxa, meses);
    return {
      tipo: chave,
      nome: investimento.nome,
      taxa: investimento.taxa,
      valorFinal,
      ganho: parseFloat((valorFinal - valorInicial).toFixed(2))
    };
  });

  return comparacao.sort((a, b) => b.valorFinal - a.valorFinal);
};