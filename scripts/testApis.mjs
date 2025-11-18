import { obterTodasAsTaxas } from '../api/bancocentral.js';
import { getTaxaConversao, converterMoeda } from '../api/conversorMoedas.js';

async function run() {
  console.log('--- Iniciando testes das APIs ---');

  try {
    console.log('\n1) Testando obterTodasAsTaxas()');
    const taxas = await obterTodasAsTaxas();
    console.log('Taxas obtidas:', taxas);
  } catch (err) {
    console.error('Erro ao obter taxas:', err);
  }

  try {
    console.log('\n2) Testando getTaxaConversao() e converterMoeda()');
    const usdbrl = await getTaxaConversao('USD','BRL');
    console.log('USD → BRL =', usdbrl);

    const convertido = await converterMoeda(100, 'USD', 'BRL');
    console.log('100 USD ≈', convertido, 'BRL');

    const brl2usd = await getTaxaConversao('BRL','USD');
    console.log('BRL → USD =', brl2usd);

    const convertido2 = await converterMoeda(1000, 'BRL', 'USD');
    console.log('1000 BRL ≈', convertido2, 'USD');
  } catch (err) {
    console.error('Erro na cotação:', err);
  }

  console.log('\n--- Testes finalizados ---');
}

run();
