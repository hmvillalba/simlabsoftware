// lang/runtime/pt.js — textos de execução em português do Brasil.
//
// Parte da base espanhola e substitui as seções traduzidas. O teste de paridade
// roda depois de js/runtime-dict.js achatar os dois dicionários.
window.SIM_RUNTIME = window.SIM_RUNTIME || {};
(function () {
    var es = window.SIM_RUNTIME.es;
    window.SIM_RUNTIME.pt = Object.assign({}, es, {
        scen: {
            1: {
                name: '1 (Caso Integral)',
                s: [
                    'Lentidão extrema generalizada no sistema.',
                    'Uso alto de CPU e congestão da interface gráfica.',
                    'Leituras contínuas no disco rígido (ruído constante).',
                    'Temperatura da CPU acima do limite seguro.'
                ],
                p: [
                    "1. Abrir o Gerenciador de Tarefas ou o Console CMD e finalizar o processo malicioso 'svchost_fake.exe' (PID 666).",
                    '2. Ir à Loja de Hardware e ampliar a memória RAM para 1.5 GB ou 2.5 GB.',
                    '3. Abrir o Desfragmentador de Disco C: e executar a desfragmentação completa.',
                    '4. Abrir o Disk Cleaner para analisar e remover arquivos temporários.',
                    '5. Abrir o MSConfig e desativar serviços desnecessários na inicialização.'
                ]
            },
            2: {
                name: '2 (Thrashing e Memória Virtual)',
                s: [
                    'Tempos de resposta lentos ao alternar entre janelas.',
                    'Contagem de Page Faults (falhas de página) continuamente elevada.',
                    'Mapeamento de Swap extremamente cheio na Tabela de Páginas.',
                    'O disco rígido não para de transferir dados.'
                ],
                p: [
                    "1. Diagnosticar a saturação na janela 'Tabela de Páginas / Inspetor VMem'.",
                    '2. Abrir o Gerenciador de Tarefas para identificar consumo excessivo de RAM.',
                    '3. Ir à Loja de Hardware e aumentar a RAM física para 1.5 GB ou mais.',
                    '4. Verificar no Inspetor VMem se os Page Faults param.'
                ]
            },
            3: {
                name: '3 (Cibersegurança e Auditoria)',
                s: [
                    'Tráfego de rede anômalo e elevado em segundo plano (>100 KB/s).',
                    'Processo suspeito em execução imitando um binário do sistema.',
                    'Consumo ou pico de processador persistente em 45% ou mais.'
                ],
                p: [
                    '1. Abrir o Gerenciador de Tarefas ou CMD e revisar a coluna de Tráfego de Rede / CPU.',
                    "2. Identificar o processo 'svchost_fake.exe' (PID 666).",
                    '3. Finalizar o processo pela GUI ou pelo CMD: taskkill /PID 666.',
                    "4. Abrir o MSConfig e desmarcar 'svchost_fake.exe' da lista de inicialização."
                ]
            },
            4: {
                name: '4 (Manutenção de Hardware e Disco)',
                s: [
                    'Aviso de temperatura crítica no processador (>80°C).',
                    'Leitura de arquivos extremamente lenta devido à dispersão de setores.',
                    'Capacidade de armazenamento ocupada por lixo temporário massivo.'
                ],
                p: [
                    '1. Inspecionar as Propriedades do Sistema / Métricas para detectar a temperatura crítica.',
                    "2. Executar o 'Disk Cleaner' para limpar os temporários.",
                    "3. Executar o 'Desfragmentador C:' para reorganizar blocos fragmentados.",
                    '4. Confirmar a queda de temperatura e a saúde do sistema restaurada.'
                ]
            },
            5: {
                name: '5 (Inicialização Lenta do Windows)',
                s: [
                    'O sistema leva mais de 2 minutos para ficar utilizável após o login.',
                    'Vários processos são carregados automaticamente na inicialização.',
                    'Uso de CPU elevado durante os primeiros minutos.',
                    'O disco registra atividade intensa no início.'
                ],
                p: [
                    '1. Abrir o MSConfig e revisar a lista de programas de inicialização.',
                    "2. Desativar 'LegacyUpdater98.exe' e outros serviços desnecessários.",
                    '3. Verificar no Gerenciador de Tarefas que o consumo de inicialização diminuiu.',
                    '4. Confirmar que o tempo de inicialização simulado é reduzido significativamente.'
                ]
            },
            6: {
                name: '6 (Saturação de CPU)',
                s: [
                    'O computador responde lentamente mesmo com memória RAM disponível.',
                    'CPU perto de 100% durante intervalos prolongados.',
                    'Um processo concentra grande parte do consumo do processador.',
                    'Os aplicativos demoram a responder a cliques e mudanças de janela.'
                ],
                p: [
                    '1. Abrir o Gerenciador de Tarefas e ordenar/revisar a coluna de CPU.',
                    '2. Identificar o processo pesado (RenderEngine3D ou similar) que satura a CPU.',
                    '3. Finalizar o processo desnecessário pela GUI ou pelo CMD.',
                    '4. Verificar se o uso de CPU e a temperatura caem para níveis normais.'
                ]
            },
            7: {
                name: '7 (HDD Lento vs SSD)',
                s: [
                    'Tempos de carregamento de programas e arquivos muito elevados.',
                    'Latência alta em operações de leitura/escrita aleatórias.',
                    'O acesso ao disco fica caro durante a paginação.',
                    'A RAM não está saturada; o gargalo é o armazenamento.'
                ],
                p: [
                    '1. Revisar as Propriedades do Sistema e confirmar que o disco é HDD.',
                    '2. Observar a fragmentação e os tempos de resposta do disco.',
                    '3. Ir à Loja de Hardware e simular a troca para SSD (se o orçamento permitir).',
                    '4. Comparar o comportamento antes/depois: tempos de inicialização e carregamento.'
                ]
            },
            8: {
                name: '8 (Superaquecimento por Refrigeração)',
                s: [
                    'A temperatura do processador ultrapassa 85-90°C sob carga moderada.',
                    'O sistema reduz automaticamente a frequência (thermal throttling).',
                    'Os aplicativos ficam mais lentos após vários minutos.',
                    'O ventilador simulado funciona abaixo do necessário.'
                ],
                p: [
                    '1. Observar a temperatura no Painel de Missão e nas Propriedades do Sistema.',
                    '2. Identificar que o problema é de refrigeração (coolingEfficiency baixo).',
                    '3. Simular manutenção da refrigeração (comando ou ação de limpeza térmica).',
                    '4. Verificar se a temperatura cai e o thermal throttle desaparece.'
                ]
            },
            9: {
                name: '9 (Disco Quase Cheio)',
                s: [
                    'O disco tem menos de 10% de espaço livre.',
                    'Algumas operações de escrita falham ou são muito lentas.',
                    'Há centenas de MB de arquivos temporários e lixo.',
                    'O sistema avisa sobre espaço insuficiente.'
                ],
                p: [
                    '1. Abrir o Disk Cleaner e executar a análise de arquivos temporários.',
                    '2. Limpar os arquivos de lixo encontrados.',
                    '3. Verificar nas Propriedades do Sistema / métricas o espaço livre recuperado.',
                    '4. Confirmar que as operações de escrita voltam a funcionar normalmente.'
                ]
            },
            10: {
                name: '10 (Conflito de Software)',
                s: [
                    'Dois aplicativos geram lentidão intermitente quando executados juntos.',
                    'Um deles funciona bem isoladamente.',
                    'Aparecem picos de CPU e acessos frequentes ao disco.',
                    'O problema não é falta de RAM nem de espaço em disco.'
                ],
                p: [
                    "1. Abrir o Gerenciador de Tarefas e observar o processo 'OldOfficeHelper.exe'.",
                    '2. Comparar o comportamento com e sem esse processo ativo.',
                    '3. Finalizar ou desativar o processo conflitante pelo MSConfig ou Gerenciador de Tarefas.',
                    '4. Verificar se as lentidões intermitentes desaparecem.'
                ]
            },
            11: {
                name: '11 (Problemas de Rede)',
                s: [
                    'Não é possível navegar em sites mesmo com o cabo/rede parecendo conectado.',
                    'O tráfego de rede é irregular ou nulo em alguns casos.',
                    'Possível problema de DNS, gateway ou configuração de IP.',
                    'O restante do sistema (CPU/RAM/Disco) funciona normalmente.'
                ],
                p: [
                    "1. Abrir o Console CMD e executar 'ipconfig' ou 'network' para ver o estado.",
                    '2. Identificar o tipo de falha (DNS / Gateway / IP).',
                    '3. Executar o comando de reparo de rede simulado (netfix ou repair).',
                    '4. Verificar se a conectividade é restaurada e o tráfego volta ao normal.'
                ]
            },
            12: {
                name: '12 (Atualização com Orçamento Limitado)',
                s: [
                    'O computador está lento por uma combinação de pouca RAM e disco HDD.',
                    'Temperatura um pouco elevada e fragmentação moderada.',
                    'O orçamento de atualização é limitado (só é possível melhorar um componente principal).',
                    'É preciso escolher a melhoria com melhor relação custo-benefício.'
                ],
                p: [
                    '1. Diagnosticar qual é o principal gargalo (RAM vs Disco vs Temperatura).',
                    '2. Revisar o orçamento disponível na Loja de Hardware.',
                    '3. Escolher a atualização mais eficaz conforme o diagnóstico (RAM prioritária neste caso).',
                    '4. Aplicar a melhoria e verificar o impacto real nas métricas de desempenho.'
                ]
            }
        },
        help: {
            alumno: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Guia para alunos</h2>
        <p><b>O que é o RetroOS?</b> É um laboratório virtual no estilo Windows 98. O PC simulado tem problemas (pouca RAM, malware, disco cheio, temperatura alta etc.). Seu trabalho é <b>diagnosticar</b>, <b>corrigir</b> e <b>comprovar</b> que melhorou.</p>
        <p class="font-bold text-emerald-800">Método recomendado</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Leia os sintomas do <b>Painel de Missão</b> (se estiver visível).</li>
            <li>Abra as ferramentas: Gerenciador de Tarefas, Monitor HW, Tabela de Páginas, Propriedades, CMD.</li>
            <li>Formule uma hipótese (é RAM? malware? disco? calor?).</li>
            <li>Aplique uma solução concreta.</li>
            <li>Verifique as métricas ou capture um snapshot no Monitor HW.</li>
        </ol>
        <p class="font-bold text-emerald-800">O que você pode fazer</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>Finalizar processos (Gerenciador de Tarefas ou <code>taskkill</code> no CMD).</li>
            <li>Ampliar a RAM, migrar para SSD ou melhorar a refrigeração (Loja de Hardware).</li>
            <li>Desfragmentar o HDD, limpar temporários, desativar programas na inicialização (MSConfig).</li>
            <li>Reparar a rede com <code>ipconfig</code> / <code>netfix</code>.</li>
            <li>Jogar ou abrir programas pesados para ver o impacto na memória.</li>
        </ul>
        <p class="font-bold text-amber-800">No modo exame</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>O Painel de Missão fica oculto: investigue sozinho.</li>
            <li>Não é possível trocar de cenário.</li>
            <li>Há um cronômetro vermelho no topo.</li>
            <li>Não precisa adivinhar: use as ferramentas e deixe evidências do que fez.</li>
        </ul>
        <p class="text-gray-600">Dica: não amplie a RAM sem antes verificar se há um processo malicioso ou a CPU saturada. Cada problema tem sua causa.</p>
    `,
            docente: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Guia para professores</h2>
        <p><b>Acesso:</b> ícone Painel do Professor ou menu Iniciar. Senha inicial <code>1234</code> (deve ser alterada no primeiro acesso). Ela é armazenada criptografada (SHA-256 com salt) no navegador. Para uma senha que o aluno não possa apagar, defina <code>FIXED_TEACHER_HASH</code> no arquivo.</p>
        <p class="font-bold text-emerald-800">Painel do professor — funções</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li><b>Alterar senha</b> de acesso.</li>
            <li><b>Sair da sessão do professor</b> (volta a pedir a senha).</li>
            <li><b>Modo somente aluno</b>: oculta o ícone da área de trabalho; o acesso fica por Iniciar + senha.</li>
            <li><b>12 cenários</b> didáticos com sintomas e gabarito de correção.</li>
            <li><b>Injetor de falhas</b>: superaquecimento, swap, processo pesado, malware.</li>
            <li><b>Modo avaliação</b>: aluno(s), curso, turma, nível 1–3, cronômetro, avaliação automática.</li>
            <li><b>Observações</b> do professor no relatório.</li>
            <li><b>Exportar</b> relatório TXT, CSV ou PDF.</li>
            <li><b>Histórico</b> de avaliações (salvo neste navegador; ver / reexportar).</li>
        </ul>
        <p class="font-bold text-emerald-800">Fluxo de exame sugerido</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Escolha um cenário e carregue-o.</li>
            <li>Preencha curso, turma e adicione aluno(s) (até 8 por grupo).</li>
            <li>Nível: 1 guiado · 2 técnico · 3 profissional (sem dicas).</li>
            <li>Iniciar Exame → painel de missão oculto, cenários bloqueados, banner + tempo.</li>
            <li>Ao terminar: Finalizar e Avaliar → nota e critérios.</li>
            <li>Opcional: observações → Exportar PDF.</li>
            <li>Cancelar / Desbloquear sai sem nota.</li>
        </ol>
        <p class="font-bold text-amber-800">Avaliação automática</p>
        <p>Pontua resultados (malware, RAM, temperatura, disco, rede etc.) e procedimento (uso de ferramentas, diagnosticar antes de corrigir, verificar depois, evitar erros como desfragmentar SSD).</p>
    `,
            herramientas: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Ferramentas do sistema</h2>
        <ul class="list-disc list-inside space-y-1">
            <li><b>Gerenciador de Tarefas:</b> processos, RAM, CPU, rede; finalizar tarefas.</li>
            <li><b>Tabela de Páginas / VMem:</b> quadros RAM vs SWAP e page faults (thrashing).</li>
            <li><b>Monitor de Hardware:</b> barras e sparklines de RAM/CPU/temp/disco, ventilador, snapshots antes/depois.</li>
            <li><b>Desfragmentador:</b> apenas HDD. No SSD avisa que não se aplica.</li>
            <li><b>Disk Cleaner:</b> analisa e limpa temporários; recupera espaço.</li>
            <li><b>MSConfig:</b> programas de inicialização (inclui malware e serviços pesados).</li>
            <li><b>Loja de Hardware:</b> RAM, SSD, refrigeração.</li>
            <li><b>CMD:</b> help, tasklist, taskkill, mem, systeminfo, defrag, ipconfig, netfix, coolfix.</li>
            <li><b>Navegador / Jogos / Player:</b> geram carga real de recursos.</li>
            <li><b>Painel de Missão:</b> sintomas e métricas (oculto no exame).</li>
            <li><b>Manual / Ajuda:</b> esta janela; exportável para PDF.</li>
        </ul>
        <p class="font-bold text-emerald-800">Comandos CMD úteis</p>
        <p class="font-mono text-[11px] bg-gray-100 p-2 border">help · tasklist · taskkill /PID 666 · mem · systeminfo · defrag · ipconfig · netfix · coolfix · cls</p>
    `,
            escenarios: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Cenários 1 a 12</h2>
        <ol class="list-decimal list-inside space-y-1">
            <li><b>Caso integral:</b> RAM + malware + fragmentação + temperatura.</li>
            <li><b>Thrashing / VMem:</b> pouca RAM, page faults, swap cheio.</li>
            <li><b>Cibersegurança:</b> svchost_fake.exe, CPU e rede anômalas.</li>
            <li><b>Hardware e disco:</b> fragmentação alta, lixo, superaquecimento.</li>
            <li><b>Inicialização lenta:</b> muitos programas na inicialização.</li>
            <li><b>CPU saturada:</b> processo pesado; a RAM não é o gargalo.</li>
            <li><b>HDD vs SSD:</b> latência de disco; opção de migrar para SSD.</li>
            <li><b>Superaquecimento:</b> refrigeração deficiente e thermal throttle.</li>
            <li><b>Disco quase cheio:</b> pouco espaço livre e temporários.</li>
            <li><b>Conflito de software:</b> aplicativos que interferem entre si.</li>
            <li><b>Problemas de rede:</b> DNS/IP; reparar com CMD.</li>
            <li><b>Orçamento limitado:</b> escolher a melhor atualização de hardware.</li>
        </ol>
        <p class="text-gray-600 mt-2">No exame nível 3 o aluno não vê o gabarito nem o painel de sintomas: precisa descobrir a causa com as ferramentas.</p>
    `
        },
        alert: {
            scenarioLocked: 'Cenários bloqueados durante o exame.\nUse "Cancelar / Desbloquear" ou "Finalizar e Avaliar" para trocar de cenário.',
            gameStarted: 'Iniciando {name}... Observe o impacto na RAM/Swap no Painel de Missão e no Gerenciador de Tarefas.',
            ssdDefrag: 'A unidade simulada é SSD. Não é recomendável desfragmentá-la como um HDD; use a otimização/TRIM do sistema.',
            budgetInsufficient: 'Orçamento insuficiente.\n{label} custa ${cost} e restam apenas ${remaining}.',
            auditCopied: 'Relatório de Auditoria passo a passo copiado para a área de transferência.',
            auditCopyManual: 'Copiado manualmente:\n{report}',
            teacherExamActive: 'Há um exame em andamento. Finalize-o ou cancele-o antes de sair da sessão do professor.',
            teacherLoggedOut: 'Sessão do professor encerrada.\nA senha será necessária para entrar novamente.',
            historySaveFailed: 'Não foi possível salvar o histórico neste navegador. Exporte os relatórios (PDF/CSV) para não perdê-los.',
            clearHistory: 'Apagar TODO o histórico de avaliações salvo neste navegador? Esta ação não pode ser desfeita.',
            teacherPassSaveFailed: 'Não foi possível salvar a senha neste navegador (localStorage bloqueado).',
            initialPass: 'Você está usando a senha inicial (1234).\nAltere-a agora: não será possível iniciar exames até fazer isso.',
            loginLocked: 'Muitas tentativas. Aguarde {seconds} s.',
            loginWrong: 'Senha incorreta. Tente novamente.',
            examNoAddStudents: 'Não é possível adicionar alunos durante o exame.',
            examStudentName: 'Digite o nome do aluno.',
            examStudentDuplicate: 'Esse aluno já está na lista.',
            examStudentMax: 'Máximo de 8 alunos por exame em grupo.',
            examChangePass: 'Altere a senha inicial do professor antes de iniciar um exame.',
            examAlreadyRunning: 'Já existe um exame em andamento. Finalize-o ou cancele-o primeiro.',
            examNeedStudent: 'Adicione pelo menos um aluno (ou um grupo) antes de iniciar o exame.',
            examStarted: 'Modo Exame ativado\n\n{group}Alunos:\n• {students}\n\n• Banner vermelho + cronômetro\n• Painel de Missão oculto\n• Cenários bloqueados',
            examNoRunning: 'Não há exame em andamento.',
            examCancelConfirm: 'Cancelar o exame sem avaliar?\n\nO Painel de Missão será restaurado e os cenários desbloqueados.\nNenhuma pontuação será gerada.',
            examCancelled: 'Exame cancelado.\nPainel de Missão restaurado.\nCenários desbloqueados.',
            examNoReport: 'Não há relatório de exame. Inicie e finalize um exame primeiro.',
            pdfUnavailable: 'Não foi possível carregar a biblioteca PDF. Verifique a conexão com a internet ou use Exportar Relatório (.txt).',
            pdfUnavailableSimple: 'Não foi possível carregar a biblioteca PDF. Verifique a conexão com a internet.'
        },
        app: {
            'win-browser': 'Navegador Web',
            'win-player': 'Retro Player',
            'win-games': 'Jogos',
            'win-calc': 'Calculadora',
            'win-sysprops': 'Meu PC',
            'win-taskmgr': 'Admin. Tarefas',
            'win-vmem': 'Tabela Páginas',
            'win-defrag': 'Desfrag. Disco',
            'win-cleaner': 'Limpeza de Disco',
            'win-msconfig': 'MSConfig',
            'win-nanoedit': 'Bloco de Notas',
            'win-ramshop': 'Hardware RAM',
            'win-cmd': 'Console CMD',
            'win-teacher': 'Painel do Professor',
            'win-hwmon': 'Monitor HW',
            'win-help': 'Manual / Ajuda'
        },
        ui: Object.assign({}, es.ui, {
            resizeGrip: 'Arraste para redimensionar',
            playerPause: 'Pausa',
            playerPlay: 'Play',
            defragProcessing: 'Processando...',
            defragOptimized: '{pct}% (Otimizado)',
            cleanerFound: 'Encontrados {mb} MB de temporários e arquivos de lixo.',
            cleanerFree: 'Espaço livre atual estimado: {gb} GB',
            cleanerDone: 'Limpeza finalizada. Recuperados ~{mb} MB.',
            vmemUsed: '{used} MB Usados ({usedFrames}/{totalFrames} Quadros)',
            vmemPaged: '{mb} MB Paginados em Disco',
            vmemFreeFrame: 'LIVRE',
            taskmgrEnd: 'Finalizar',
            taskmgrClose: 'Fechar',
            budgetLimited: 'Orçamento: ${remaining} disponíveis de ${total} (gasto: ${spent})',
            budgetUnlimited: 'Sem limite de orçamento neste cenário. Gasto: ${spent}',
            shopCooling: 'Manutenção da refrigeração',
            correctionHide: 'Ocultar Gabarito',
            correctionShow: 'Ver Gabarito',
            lockedDuringExam: 'Bloqueado durante o exame',
            examCourseDiv: 'Curso/Turma: ',
            on: 'Habilitado',
            off: 'Desabilitado',
            disconnected: 'desconectado',
            hwmonHigh: 'Alto',
            hwmonMedium: 'Médio',
            hwmonLow: 'Baixo',
            hwmonYes: 'SIM ⚠',
            hwmonNo: 'Não',
            statusNoConnection: 'SEM CONEXÃO',
            statusOk: 'OK',
            statusFail: 'FALHA',
            statusYes: 'SIM',
            statusNo: 'NÃO',
            propsRam: 'RAM: {mb} MB SDRAM',
            propsDisk: 'Disco {type}: Frag {frag}% | Livre {free} GB',
            propsTemp: 'Temperatura: {temp}°C | Refrigeração: {cool}%',
            browserHomeTitle: 'BuscadorSúper 98',
            browserSearchPlaceholder: 'Pesquisar na web...',
            browserSearchBtn: 'Pesquisar',
            browserSites: 'Sites Recomendados:',
            browserNewsLink: 'Notícias de Tecnologia dos Anos 90',
            browserHeavyLink: 'Portal Web 3D/HD (carga pesada na RAM +350MB)',
            browserNewsTitle: 'Portal de Notícias Tech',
            browserNewsBody1: 'Novos módulos de SDRAM prometem eliminar os problemas de troca de páginas (swapping)!',
            browserNewsBody2: 'Recomendação: monitore o Gerenciador de Tarefas se notar lentidão.',
            browserHeavyTitle: 'Carregando portal web pesado com scripts e renderização 3D!',
            browserHeavyBody1: 'Esta aba está consumindo {mb} MB de RAM adicionais.',
            browserHeavyBody2: 'Veja como o sistema começa a paginar em disco (Swap/PageFaults) se não houver memória física suficiente.',
            compareEmpty: 'Capture um estado inicial e outro após intervir para comparar.',
            compareOne: 'Estado capturado às <b>{time}</b> — Saúde: {health}<br>RAM {ramUsed}/{ram} MB | CPU {cpu}% | Temp {temp}°C | Frag {frag}% | Livre {free} GB | Boot {boot}s',
            compareSecond: 'Capture um segundo estado para ver a comparação.',
            compareMetric: 'Métrica',
            compareBefore: 'Antes ({time})',
            compareAfter: 'Depois ({time})',
            compareHealth: 'Saúde',
            compareRamUsed: 'RAM usada',
            compareTemp: 'Temperatura',
            compareFrag: 'Fragmentação',
            compareFree: 'Espaço livre',
            compareBoot: 'Tempo de inicialização',
            compareCool: 'Refrigeração',
            historyEmpty: 'Ainda não há avaliações salvas.',
            historyView: 'Ver',
            historyLoaded: 'Histórico #{n} carregado — pronto para reexportar.',
            historyCourseDivision: 'Curso/Turma: {course} {division}',
            historyGroup: 'Grupo',
            historyStudent: 'Aluno',
            historyScore: 'Nota: {score}% · Cenário {scenario} · {time}',
            historyObservations: 'Observações:',
            studentsNone: 'Nenhum aluno adicionado',
            studentsRemove: 'Remover',
            studentsCount: '{n} alunos',
            groupDiv: 'Turma {div}',
            resultsCourseDivision: 'Curso/Turma: {course} {division}',
            resultsGroup: 'Grupo ({n})',
            resultsStudent: 'Aluno',
            resultsExcellent: 'Excelente',
            resultsPassed: 'Aprovado',
            resultsRegular: 'Regular',
            resultsInsufficient: 'Insuficiente',
            resultsResult: 'Resultado: {pct}% — {label}',
            resultsObservations: 'Observações:',
            resultsCriteria: 'Critério',
            resultsState: 'Estado',
            resultsDetail: 'Detalhe',
            examStatusCancelled: 'Exame cancelado (sem avaliação). Cenários desbloqueados.',
            examStatusRunning: 'EXAME EM ANDAMENTO · {group}{students} · Cen. {scenario} · Nív. {level} · Saúde ini.: {health}%',
            examStatusRestored: 'EXAME EM ANDAMENTO (restaurado após recarregar) · {group}{students} · Cen. {scenario} · Nív. {level} · Saúde ini.: {health}%',
            examStatusFinished: 'EXAME FINALIZADO · {mode}: {name} · {course}Nota: {score}% · Tempo: {time}',
            examBanner: '{group}{names} · Cen. {scenario} · Nív. {level}'
        }),
        cmd: {
            help: 'Comandos: help, tasklist, taskkill /PID <id>, taskkill /IM nome.exe, kill nome.exe, mem, defrag, systeminfo, ipconfig, netfix, coolfix, cls',
            notFound: "'{cmd}' não é reconhecido como um comando interno ou externo.",
            terminated: 'Processo finalizado com sucesso.',
            processNotFound: 'O processo especificado não foi encontrado.',
            mem: 'Memória Total: {ram} MB | Swap ativo: {swap} | Page Faults: {pf}',
            defragStart: 'Iniciando a desfragmentação pela linha de comando...',
            systeminfo: 'RetroOS 3.0 | RAM: {ram}MB | Disco: {disk} ({free}GB livres) | Temp CPU: {temp}°C | Rede: {net}',
            ipconfigOk: 'Adaptador Ethernet: IP 192.168.1.45 | Máscara 255.255.255.0 | Gateway 192.168.1.1 | DNS 8.8.8.8 [OK]',
            ipconfigFail: "Falha de rede detectada: {issue}. Use 'netfix' para reparar.",
            netOk: 'A rede já está funcionando corretamente.',
            netFixed: 'Reparo de rede concluído (ipconfig /renew + flushdns). Conectividade restaurada.',
            coolfix: 'Manutenção da refrigeração simulada. Eficiência agora: {eff}%. Temp: {temp}°C.'
        },
        log: Object.assign({}, es.log, {
            scenarioChanged: 'O professor mudou para o Cenário {name}.',
            scenarioInitial: 'Estado inicial: RAM {ram} MB | Disco {disk} | Frag {frag}% | Temp {temp}°C | Boot ~{boot}s | Livre {free} GB',
            faultOverheat: '[FALHA INJETADA PELO PROFESSOR] Superaquecimento da CPU provocado (+35°C). Temperatura atual: {temp}°C.',
            faultSwap: '[FALHA INJETADA PELO PROFESSOR] Memória Virtual / Swap saturada (+450 MB fictícios).',
            faultHeavy: "[FALHA INJETADA PELO PROFESSOR] Processo pesado 'RenderEngine3D_Benchmark.exe' iniciado (380 MB RAM, 40% CPU).",
            faultMalware: "[FALHA INJETADA PELO PROFESSOR] Processo 'svchost_fake.exe' (CryptoMiner) injetado / ativado.",
            gameRun: '[JOGOS] {name} foi executado consumindo {ram} MB de RAM extra.',
            correctionShown: 'O professor exibiu o Gabarito de Correção.',
            browserHeavy: 'O Navegador Web carregou um portal pesado (+350 MB de consumo).',
            ssdDefragAvoided: '[DIAGNÓSTICO] Evitou-se desfragmentar uma unidade SSD; a ação apropriada seria otimização/TRIM.',
            defragStart: 'Desfragmentação de HDD iniciada com {frag}% de fragmentação.',
            defragDone: 'Desfragmentação de HDD concluída. Fragmentação: {from}% → {to}%.',
            cleanerScan: 'Análise de arquivos temporários concluída.',
            cleanerDone: 'Arquivos temporários removidos pelo aluno. Recuperados {mb} MB.',
            msconfigToggle: "MSConfig: configuração de inicialização alterada para '{name}' (Estado: {state}).",
            killProcess: "[AÇÃO DO ALUNO] Finalizou o processo '{name}' (PID {pid}) pelo Gerenciador de Tarefas.",
            killHeavy: "[AÇÃO DO ALUNO] Finalizou o processo pesado '{name}' pelo Gerenciador de Tarefas.",
            purchaseRejected: '[AÇÃO DO ALUNO] Compra rejeitada por orçamento: {label} (${cost}). Disponível: ${remaining}.',
            purchase: '[AÇÃO DO ALUNO] Compra realizada: {label} (${cost}).{extra}',
            purchaseRemaining: ' Orçamento restante: ${remaining}.',
            ramUpgrade: '[AÇÃO DO ALUNO] Hardware atualizado: RAM física ampliada para {mb} MB.',
            diskSSD: '[AÇÃO DO ALUNO] Disco migrado para SSD. A fragmentação já não é crítica. Tempo de inicialização reduzido.',
            diskHDD: '[AÇÃO DO ALUNO] Disco configurado como HDD.',
            cooling: '[AÇÃO DO ALUNO] Manutenção da refrigeração realizada. Eficiência: {eff}%. Temp: {temp}°C.',
            networkFix: '[AÇÃO DO ALUNO] Rede reparada (ipconfig /renew + DNS flush simulado).',
            killProcessCmd: '[AÇÃO DO ALUNO] Processo finalizado via CMD: {name} (PID {pid})',
            killHeavyCmd: '[AÇÃO DO ALUNO] Processo pesado finalizado via CMD: {name}',
            cmdExec: '[CMD] Comando executado: "{cmd}"',
            snapshot: '[MONITOR] Snapshot capturado ({time}): RAM {ramUsed}/{ram} MB, CPU {cpu}%, Temp {temp}°C, Saúde {health}',
            snapshotsCleared: '[MONITOR] Snapshots de comparação limpos.',
            difficulty: 'Nível de dificuldade definido: {level}',
            examStarted: '[EXAME] Iniciado. Curso: {course} Turma: {division}. Alunos: {students}. Cenário {scenario}.',
            examCancelled: '[EXAME] Cancelado. Alunos: "{students}". Sem avaliação.',
            examFinished: '[EXAME] Finalizado. Pontuação: {score}% ({points}/{max}). Duração: {duration}s.',
            exportTxt: '[EXAME] Relatório exportado (.txt) — {name}',
            exportCsv: '[EXAME] Relatório CSV exportado — Aluno: {name}',
            exportPdf: '[EXAME] Relatório PDF exportado — {name}',
            helpPdf: '[AJUDA] Manual de uso exportado para PDF.',
            teacherLogout: '[PROFESSOR] Sessão encerrada. A senha é necessária novamente.',
            studentOnly: '[PROFESSOR] Modo somente aluno: {state}',
            studentOnlyOn: 'ativado (ícone da área de trabalho oculto)',
            studentOnlyOff: 'desativado',
            sessionRestored: '[EXAME] Sessão restaurada após recarregar o navegador (inativa ~{seconds}s). O cronômetro continua desde o início original.',
            historyCleared: '[PROFESSOR] Histórico de avaliações apagado.',
            teacherAuth: 'Painel do Professor autenticado com sucesso.',
            windowOpen: "Abriu a janela '{name}'.",
            windowClose: "Fechou a janela '{name}'.",
            windowMinimize: "Minimizou a janela '{name}'. O processo continua ativo.",
            aboutOpen: 'Abriu a janela Sobre o RetroOS 3.0.'
        }),
        exam: {
            crit: Object.assign({}, es.exam.crit, {
                healthHigh: 'Saúde do sistema ≥ 85%',
                healthNotable: 'A saúde do sistema melhorou bastante',
                healthSlight: 'A saúde do sistema melhorou levemente',
                healthBase: 'Saúde do sistema',
                healthNoImprove: '{start}% → {end}% (sem melhoria suficiente)',
                malware: 'Malware eliminado',
                malwareKilled: 'svchost_fake.exe finalizado',
                malwareActive: 'Continua ativo',
                persist: 'Persistência do malware eliminada (MSConfig)',
                persistDisabled: 'Desabilitado na inicialização',
                persistNotDisabled: 'Processo encerrado, mas não desabilitado na inicialização',
                persistNotFixed: 'Não corrigido',
                memory: 'Pressão de memória / thrashing resolvido',
                memoryResolved: 'RAM {used}/{total} MB, swap desligado',
                memorySwap: 'Continua em swap',
                memoryRam: 'RAM {used}/{total} MB',
                ramUpgrade: 'Ampliação de RAM adequada',
                ramUpgradeDetail: '{start} → {end} MB',
                ramStill: 'Continua em {end} MB',
                pf: 'Page Faults controlados',
                pfOk: 'PF início ~{start}, fim {end}',
                pfBad: 'PF continuam subindo ({end})',
                frag: 'Fragmentação do HDD corrigida',
                fragDetail: '{start}% → {end}%',
                ssd: 'Migração para SSD (opcional)',
                ssdOk: 'HDD → SSD',
                ssdNo: 'Continua em HDD',
                temp: 'Temperatura e refrigeração normalizadas',
                tempOk: '{start}°C → {end}°C, refrig. {cool}%',
                tempDetail: '{start}°C → {end}°C',
                disk: 'Espaço em disco recuperado',
                diskOk: 'Livre {start}→{end} GB',
                diskBad: 'Livre {end} GB, lixo {junk} MB',
                net: 'Conectividade de rede restaurada',
                netOk: 'Rede OK',
                netBad: 'Continua sem conexão',
                boot: 'Inicialização otimizada',
                bootPartial: 'Inicialização parcialmente otimizada',
                bootDetail: 'Boot {start}s → {end}s',
                bootDetailPartial: '{boot}s, processos problemáticos ativos',
                heavy: 'Processos pesados desnecessários controlados',
                heavyOk: 'CPU final ~{cpu}%',
                heavyBad: 'CPU ~{cpu}%',
                diag: 'Uso de ferramentas de diagnóstico',
                diagOk: '{n} ferramentas: {tools}',
                diagSome: 'Apenas: {tool}',
                diagNone: 'Não foram usadas ferramentas de diagnóstico',
                before: 'Diagnóstico antes de intervir',
                beforeOk: 'Observou o sistema antes de corrigir',
                beforeBad: 'Usou ferramentas, mas corrigiu antes de diagnosticar',
                beforeNone: 'Não há evidência de diagnóstico prévio',
                verify: 'Verificação após o reparo',
                verifySnapshots: 'Usou snapshots',
                verifyMetrics: 'Revisou métricas depois',
                verifyBad: 'Não verificou o resultado',
                budget: 'Gestão do orçamento',
                budgetOk: 'Gastou ${spent} de ${total} sem exceder',
                budgetNo: 'Não investiu o orçamento em nenhuma melhoria',
                budgetRam: 'Priorizou a melhoria de maior impacto (RAM)',
                budgetRamOk: 'RAM {start} → {end} MB',
                budgetRamBad: 'O principal gargalo era a RAM',
                wrong: 'Evitar ações incorretas',
                wrongOk: 'Nenhuma intervenção prejudicial detectada',
                wrongKilled: 'fechou o antivírus',
                wrongSSD: 'tentou desfragmentar o SSD',
                eff: 'Eficiência da intervenção',
                effOk: '{actions} ações em {minutes}m {seconds}s',
                effSome: '{actions} ações (revisar se houve passos extras)',
                effNone: 'Nenhuma ação registrada'
            }),
            report: Object.assign({}, es.exam.report, {
                title: 'RetroOS 3.0 — Relatório de Avaliação',
                data: 'Dados do exame',
                course: 'Curso:',
                division: 'Turma:',
                modality: 'Modalidade:',
                groupMode: 'Em grupo ({n} alunos)',
                individual: 'Individual',
                students: 'Aluno(s):',
                scenario: 'Cenário:',
                difficulty: 'Nível de dificuldade:',
                start: 'Início:',
                end: 'Fim:',
                duration: 'Duração:',
                score: 'PONTUAÇÃO:',
                scoreLine: 'PONTUAÇÃO: {score}% ({points}/{max} pontos) — Saúde {start}% → {end}%',
                shared: 'A pontuação é compartilhada por todos os integrantes do grupo.',
                observations: 'Observações do professor',
                noObservations: '(sem observações)',
                criteria: 'Critérios de avaliação',
                actions: 'Ações registradas ({n})',
                none: '(nenhuma)',
                generated: 'Gerado pelo RetroOS 3.0 — {date}',
                noName: 'Sem nome',
                group: 'Grupo',
                student: 'Aluno',
                manualTitle: 'RetroOS 3.0 — Manual de Uso e Diagnóstico',
                manualS1: '1. Guia para Alunos',
                manualS2: '2. Guia para Professores',
                manualS3: '3. Ferramentas do Sistema',
                manualS4: '4. Cenários Didáticos (1 a 12)',
                txtCourse: 'Curso:',
                txtDivision: 'Turma:',
                txtLevel: 'Nível de dificuldade:',
                txtDuration: 'Duração:',
                txtStartHealth: 'Saúde inicial:',
                txtFinalHealth: 'Saúde final:',
                txtScore: 'PONTUAÇÃO:',
                txtPoints: 'pontos',
                txtObservations: '--- Observações do professor ---',
                txtCriteria: '--- Critérios ---',
                txtActions: '--- Ações registradas ({n}) ---',
                txtInitial: '--- Estado inicial ---',
                txtFinal: '--- Estado final ---',
                txtGenerated: 'Gerado pelo RetroOS 3.0',
                csvGroup: 'Em grupo',
                csvIndividual: 'Individual'
            })
        }
    });
})();
