// ===== Tabs =====
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach((p) => p.classList.remove('is-active'));

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('is-active');

    render();
  });
});

// ===== Helpers =====
const val = (id) => document.getElementById(id).value.trim();
const fallback = (v, placeholder) => (v ? v : placeholder);

const NORMAS_TREINAMENTO = `1 - Todos os participantes deverão formar uma fila organizada no STS e aguardar, em silêncio, as orientações do instrutor responsável.

2 - Não é permitido falar sem autorização. Para solicitar a palavra, utilize “PPF!” (Permissão Para Falar) e aguarde a liberação do instrutor.

3 - Discussões, desentendimentos ou qualquer tipo de briga não serão tolerados. Os envolvidos serão imediatamente dispensados do treinamento.

4 - Militares que ingressarem atrasados poderão ser retirados do servidor ou impedidos de participar do treinamento.

5 - Qualquer tentativa de burlar comandos, instruções ou atividades resultará em penalidades, podendo incluir desconto de pontos ou eliminação do treinamento.

6 - Não é permitido questionar o resultado do treinamento durante sua realização.

7 - Todos os participantes devem manter postura, disciplina, respeito e organização durante todo o treinamento.

8 - Caso algum militar entre atrasado, deverá solicitar autorização ao instrutor para participar, ficando a decisão final a critério do responsável pelo treinamento.`;

const DIVIDER = '◈─────────────────────────◈';

function buildTreinamento() {
  const numero = fallback(val('t-numero'), '01/50');
  const instrutor = fallback(val('t-instrutor'), '(Sua marcação)');
  const auxiliares = fallback(val('t-auxiliares'), '(Apenas Oficiais)');
  const patenteInstrutor = fallback(val('t-patente-instrutor'), '(Aspirante a Oficial ou acima)');
  const patenteAuxiliares = fallback(val('t-patente-auxiliares'), '(Aspirante a Oficial ou acima)');
  const marcacao = fallback(val('t-marcacao'), '(Patente que realizará o treinamento)');
  const horario = fallback(val('t-horario'), '(00:00)');
  const codigo = fallback(val('t-codigo'), '(Gerado no jogo)');

  return `TREINAMENTO FÍSICO (${numero})
${DIVIDER}
| • Instrutor: ${instrutor}
| • Auxiliares: ${auxiliares}
| • Patente do Instrutor: ${patenteInstrutor}
| • Patente dos Auxiliares: ${patenteAuxiliares}
${DIVIDER}
| • Marcação: ${marcacao}
${DIVIDER}
| • Horário: ${horario}
| • Código do Servidor: ${codigo}
${DIVIDER}
     → Observações e Normas ←
${NORMAS_TREINAMENTO}`;
}

function buildPromocao() {
  const numero = fallback(val('p-numero'), '01');
  const instrutor = fallback(val('p-instrutor'), '(sua marcação)');
  const auxiliares = fallback(val('p-auxiliares'), '(apenas oficiais)');
  const aprovados = fallback(val('p-aprovados'), '-');
  const reprovados = fallback(val('p-reprovados'), '-');
  const data = fallback(val('p-data'), '(o Discord já mostra)');
  const observacoes = fallback(val('p-observacoes'), '(obrigatório)');
  const comprovacoes = fallback(val('p-comprovacoes'), '(fotos em anexo — obrigatório)');

  return `RELATÓRIO DE PROMOÇÃO (${numero})
${DIVIDER}
Instrutor: ${instrutor}
Auxiliares: ${auxiliares}
${DIVIDER}
Aprovados: ${aprovados}

Reprovados: ${reprovados}

${DIVIDER}
Data e hora: ${data}
Observações: ${observacoes}
${DIVIDER}
Comprovações: ${comprovacoes}`;
}

function render() {
  const activeTab = document.querySelector('.tab.is-active').dataset.tab;
  const output = document.getElementById('output-text');
  output.textContent = activeTab === 'treinamento' ? buildTreinamento() : buildPromocao();
}

// ===== Live updates =====
document.querySelectorAll('#form-treinamento input, #form-promocao input, #form-promocao textarea')
  .forEach((el) => el.addEventListener('input', render));

// ===== "Agora" button =====
document.getElementById('btn-agora').addEventListener('click', () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('p-data').value = `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
  render();
});

// ===== Copy button =====
document.getElementById('btn-copy').addEventListener('click', async () => {
  const btn = document.getElementById('btn-copy');
  const text = document.getElementById('output-text').textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copiado!';
    btn.classList.add('is-copied');
    setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.classList.remove('is-copied');
    }, 1500);
  } catch (e) {
    alert('Não foi possível copiar automaticamente. Selecione o texto manualmente.');
  }
});

// Initial render
render();
