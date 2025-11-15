import React, { createContext, useContext, useState, useEffect } from 'react';
import { calcularTempo, calcularInvestimentoMinimo, encontrarMelhorInvestimento, obterTiposInvestimentoAtualizados, TIPOS_INVESTIMENTO } from '../api/finance';

const CalculosContext = createContext(null);

export const CalculosProvider = ({ children }) => {
  const [simulacoes, setSimulacoes] = useState([]);
  const [metas, setMetas] = useState([]);
  const [tiposInvestimento, setTiposInvestimento] = useState(TIPOS_INVESTIMENTO);
  const [carregando, setCarregando] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  // Carrega taxas do Banco Central ao inicializar
  useEffect(() => {
    const carregarTaxas = async () => {
      try {
        const tipos = await obterTiposInvestimentoAtualizados();
        // Se a função retornou um objeto com ultimaAtualizacao, extrai
        if (tipos && tipos.ultimaAtualizacao) {
          const { ultimaAtualizacao: ua, ...rest } = tipos;
          setTiposInvestimento(rest);
          setUltimaAtualizacao(ua);
        } else {
          setTiposInvestimento(tipos || TIPOS_INVESTIMENTO);
          setUltimaAtualizacao(null);
        }
      } catch (erro) {
        console.error('❌ Erro ao carregar taxas:', erro);
        // Mantém taxas padrão em caso de erro
      } finally {
        setCarregando(false);
      }
    };

    carregarTaxas();
    
    // Recarrega as taxas a cada 30 minutos
    const intervalo = setInterval(carregarTaxas, 30 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Simula um investimento
  const simularInvestimento = (valorInicial, tipoInvestimento, taxaMensal) => {
    const simulacao = {
      id: Date.now(),
      valorInicial,
      tipoInvestimento,
      taxaMensal,
      dataSimulacao: new Date().toLocaleDateString('pt-BR'),
      resultado: calcularTempo(valorInicial, taxaMensal)
    };
    
    setSimulacoes([...simulacoes, simulacao]);
    return simulacao;
  };

  // Calcula o investimento mínimo para atingir uma meta
  const calcularMetaInvestimento = (metaValor, taxaMensal, meses) => {
    const investimentoMinimo = calcularInvestimentoMinimo(metaValor, taxaMensal, meses);
    return investimentoMinimo;
  };

  // Encontra o melhor investimento para uma meta específica
  const obterMelhorInvestimento = (metaValor, montanteDisponivel) => {
    const melhorOpcao = encontrarMelhorInvestimento(metaValor, montanteDisponivel, tiposInvestimento);
    return melhorOpcao;
  };

  // Adiciona uma nova meta
  const adicionarMeta = (descricao, metaValor, montanteDisponivel) => {
    const meta = {
      id: Date.now(),
      descricao,
      metaValor,
      montanteDisponivel,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      melhorInvestimento: encontrarMelhorInvestimento(metaValor, montanteDisponivel, tiposInvestimento)
    };
    
    setMetas([...metas, meta]);
    return meta;
  };

  // Remove uma meta
  const removerMeta = (id) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

  // Remove uma simulação
  const removerSimulacao = (id) => {
    setSimulacoes(simulacoes.filter(sim => sim.id !== id));
  };

  const value = {
    simulacoes,
    metas,
    tiposInvestimento,
    carregando,
    ultimaAtualizacao,
    simularInvestimento,
    calcularMetaInvestimento,
    obterMelhorInvestimento,
    adicionarMeta,
    removerMeta,
    removerSimulacao
  };

  return (
    <CalculosContext.Provider value={value}>
      {children}
    </CalculosContext.Provider>
  );
};

export const useCalculos = () => {
  const context = useContext(CalculosContext);
  if (!context) {
    throw new Error('useCalculos deve ser usado dentro de um CalculosProvider');
  }
  return context;
};
