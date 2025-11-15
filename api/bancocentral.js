/**
 * API de integração com Banco Central do Brasil e Tesouro Nacional
 * Usa APIs oficiais do governo brasileiro para taxas reais
 */

/**
 * Busca a taxa SELIC meta do Banco Central (série 432)
 * @returns {Promise<number>} Taxa SELIC meta anual em %
 */
export const obterTaxaSELIC = async () => {
  try {
    // Série 432: Taxa Selic definida pelo Copom (meta)
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar taxa SELIC');
    }
    
    const data = await response.json();
    const taxaAnual = parseFloat(data[0].valor);
    
    // Converte para taxa mensal: (1 + taxa anual)^(1/12) - 1
    const taxaMensal = (Math.pow(1 + taxaAnual / 100, 1/12) - 1) * 100;
    
    
    return parseFloat(taxaMensal.toFixed(4));
  } catch (erro) {
    console.error('Erro ao buscar SELIC:', erro);
    return 1.17; // 15% ao ano = ~1.17% ao mês (Selic atual)
  }
};

/**
 * Busca a taxa CDI do Banco Central (série 4389 - DI diário)
 * @returns {Promise<number>} Taxa CDI mensal em %
 */
export const obterTaxaCDI = async () => {
  try {
    // Série 4389: Taxa de juros - DI - over (anualizada base 252)
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json'
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar taxa CDI');
    }
    
    const data = await response.json();
    const taxaAnual = parseFloat(data[0].valor);
    
    // Converte para taxa mensal
    const taxaMensal = (Math.pow(1 + taxaAnual / 100, 1/12) - 1) * 100;
    
    return parseFloat(taxaMensal.toFixed(4));
  } catch (erro) {
    console.error('Erro ao buscar CDI:', erro);
    return 1.16; // 14.9% ao ano = ~1.16% ao mês (CDI atual)
  }
};

/**
 * Busca a taxa de inflação IPCA
 * @returns {Promise<number>} Taxa IPCA mensal em %
 */
export const obterTaxaIPCA = async () => {
  try {
    // API do Banco Central - IPCA
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json'
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar IPCA');
    }
    
    const data = await response.json();
    const taxaMensal = parseFloat(data[0].valor);
    
    return parseFloat(taxaMensal.toFixed(4));
  } catch (erro) {
    console.error('Erro ao buscar IPCA:', erro);
    return 0.52;
  }
};

/**
 * Busca todas as taxas necessárias
 * @returns {Promise<object>} Objeto com todas as taxas
 */
export const obterTodasAsTaxas = async () => {
  try {
    const [taxaSELIC, taxaCDI, taxaIPCA] = await Promise.all([
      obterTaxaSELIC(),
      obterTaxaCDI(),
      obterTaxaIPCA()
    ]);

    

    // CDB: geralmente 100% do CDI (pode variar por banco)
    const cdb = taxaCDI;
    // LCI/LCA: geralmente 85-90% do CDI (compensado por isenção de IR)
    const lciLca = taxaCDI * 0.87;
    // Fundos monetários: geralmente 70-85% do CDI (descontando taxas)
    const fundo = taxaCDI * 0.75;

    return {
      selic: taxaSELIC,
      cdi: taxaCDI,
      ipca: taxaIPCA,
      cdb: cdb,
      lciLca: lciLca,
      fundo: fundo,
      ultimaAtualizacao: new Date().toISOString()
    };
  } catch (erro) {
    console.error('Erro ao buscar taxas:', erro);
    // Retorna taxas padrão atualizadas (Nov 2025 - Selic em 15%)
    return {
      selic: 1.17,  // ~15% ao ano
      cdi: 1.16,    // ~14.9% ao ano
      ipca: 0.38,   // ~4.6% ao ano
      cdb: 1.16,    // 100% CDI
      lciLca: 1.01, // 87% CDI
      fundo: 0.87,  // 75% CDI
      ultimaAtualizacao: new Date().toISOString()
    };
  }
};

/**
 * Cache simples para evitar requisições repetidas
 */
let cacheGlobal = {
  dados: null,
  timestamp: null,
  ttl: 3600000 // 1 hora em milissegundos
};

/**
 * Busca taxas com cache
 * @returns {Promise<object>} Taxas do Banco Central
 */
export const obterTaxasComCache = async () => {
  const agora = Date.now();
  
  // Se tem cache válido, retorna
  if (cacheGlobal.dados && (agora - cacheGlobal.timestamp) < cacheGlobal.ttl) {
    return cacheGlobal.dados;
  }
  
  // Busca novas taxas
  const taxas = await obterTodasAsTaxas();
  
  // Salva no cache
  cacheGlobal.dados = taxas;
  cacheGlobal.timestamp = agora;
  
  return taxas;
};
