// landing/i18n/pt.js — Textos da landing em português.
//
// O dicionário espanhol (landing/i18n/es.js) é a fonte da verdade e o fallback:
// todas as chaves daqui precisam existir lá com o mesmo nome.
window.LANDING_DICTS = window.LANDING_DICTS || {};
window.LANDING_DICTS.pt = {
    _meta: { name: 'Português', dir: 'ltr' },

    meta: {
        title: 'SimLab Software — Simulador de diagnóstico de sistemas operacionais',
        description: 'Simulador educativo, gratuito e sem instalação: diagnostique um PC com falhas de RAM, CPU, disco, temperatura, malware e rede. 12 cenários, painel do professor e modo prova.',
        ogImageAlt: 'Área de trabalho do simulador com as janelas do Gerenciador de Tarefas e do Monitor de Hardware abertas'
    },

    nav: {
        langLabel: 'Idioma',
        features: 'O que inclui',
        scenarios: 'Cenários',
        teachers: 'Para professores',
        start: 'Começar',
        support: 'Apoiar',
        repo: 'Repositório',
        simulator: 'Abrir simulador'
    },

    hero: {
        badge: 'Grátis · Sem instalação · Funciona sem internet',
        title: 'Aprenda a diagnosticar computadores quebrando um pouco',
        lead: 'SimLab Software é um simulador de desktop com visual de Windows 98: os alunos abrem um PC com falhas, medem RAM, CPU, disco e temperatura, e corrigem o problema com ferramentas reais de manutenção.',
        ctaPrimary: 'Abrir simulador',
        ctaSecondary: 'Ver o código',
        note: 'Roda no navegador e também abrindo o arquivo de uma pasta ou de um pendrive, sem servidor e sem conexão.'
    },

    features: {
        title: 'O que inclui',
        lead: 'Um laboratório de manutenção completo dentro do navegador, sem licenças nem contas.',
        f1Title: 'Sistema operacional simulado',
        f1Text: 'Área de trabalho, janelas arrastáveis, barra de tarefas e sons retrô gerados ao vivo. Cada ação fica registrada em um log de auditoria.',
        f2Title: 'Métricas que reagem',
        f2Text: 'RAM e swap com page faults e thrashing, temperatura e thermal throttling, fragmentação do disco, tráfego de rede e um índice de saúde do sistema.',
        f3Title: 'Ferramentas de técnico',
        f3Text: 'Gerenciador de Tarefas, Tabela de Páginas, Monitor de Hardware, Desfragmentador, Disk Cleaner, MSConfig, Loja de Hardware e console CMD.',
        f4Title: 'Pronto para a sala de aula',
        f4Text: '12 cenários com falhas, injetor de falhas para o professor, modo prova cronometrado e relatório exportado em PDF, CSV ou TXT.'
    },

    shots: {
        title: 'Como é',
        lead: 'Capturas do simulador real, no computador e no celular.',
        desktopCaption: 'Área de trabalho do RetroOS 3.0 com o Gerenciador de Tarefas, a Tabela de Páginas e o Monitor de Hardware abertos.',
        mobileCaption: 'A mesma interface no celular: as janelas se reorganizam e a barra fica compacta.',
        altDesktop: 'Área de trabalho do simulador com as janelas de processos, paginação e monitor de hardware',
        altMobile: 'Vista do simulador no celular com as janelas empilhadas'
    },

    scenarios: {
        title: 'Doze falhas para diagnosticar',
        lead: 'Cada cenário traz sintomas, métricas alteradas e um roteiro de correção esperado.',
        s1Title: 'Caso completo',
        s1Text: 'Pouca RAM, malware, disco fragmentado e temperatura alta na mesma máquina.',
        s2Title: 'Thrashing',
        s2Text: 'Page faults crescendo e swap lotado: falta memória física.',
        s3Title: 'Segurança',
        s3Text: 'Um processo que imita o sistema consome CPU e rede em segundo plano.',
        s4Title: 'Hardware e disco',
        s4Text: 'Fragmentação extrema, arquivos temporários e refrigeração deficiente.',
        s5Title: 'Inicialização lenta',
        s5Text: 'Programas de inicialização demais: a máquina leva minutos para ficar utilizável.',
        s6Title: 'CPU saturada',
        s6Text: 'Um processo pesado domina o processador mesmo com RAM sobrando.',
        more: 'Os cenários 7 a 12 cobrem HDD contra SSD, superaquecimento, disco quase cheio, conflito de software, falhas de rede e uma atualização com orçamento limitado.',
        tableTitle: 'Como um caso é resolvido',
        colSymptom: 'Sintoma',
        colTool: 'Ferramenta',
        colFix: 'Correção',
        r1Symptom: 'O PC fica lento e o disco não para de trabalhar',
        r1Tool: 'Tabela de Páginas',
        r1Fix: 'Ampliar a RAM física na Loja de Hardware e verificar se os page faults caem',
        r2Symptom: 'CPU e rede altas sem o usuário fazer nada',
        r2Tool: 'Gerenciador de Tarefas / CMD',
        r2Fix: 'Identificar e encerrar o processo malicioso e removê-lo da inicialização com o MSConfig',
        r3Symptom: 'Desliga ou fica lento depois de alguns minutos',
        r3Tool: 'Monitor de Hardware',
        r3Fix: 'Revisar a eficiência da refrigeração e confirmar que a temperatura cai',
        r4Symptom: 'O disco está cheio e tudo fica lento',
        r4Tool: 'Disk Cleaner / Desfragmentador',
        r4Fix: 'Excluir temporários, desfragmentar o HDD e conferir o espaço livre'
    },

    teachers: {
        title: 'Para professores',
        lead: 'O material para dar aula já vem dentro do simulador.',
        p1Title: 'Acesso protegido',
        p1Text: 'O painel do professor abre com uma senha guardada em hash SHA-256, que pode ser trocada no primeiro acesso.',
        p2Title: 'Injetor de falhas',
        p2Text: 'Durante a aula você pode provocar superaquecimento, swap, um processo pesado ou malware e ver a reação de cada grupo.',
        p3Title: 'Correção automática',
        p3Text: 'O modo prova pontua resultados e procedimento: o que foi diagnosticado, o que foi corrigido e em que ordem.',
        classTitle: 'Uma aula de 45 minutos',
        class1: 'Escolha um cenário, carregue e projete a área de trabalho enquanto explica os sintomas.',
        class2: 'Cada grupo mede com o Monitor de Hardware e a Tabela de Páginas antes de mexer em qualquer coisa.',
        class3: 'Os alunos corrigem com as ferramentas e conferem o resultado pelo CMD.',
        class4: 'Feche com o roteiro de correção e as observações que o painel do professor registra.',
        rubricTitle: 'A rubrica que a prova aplica',
        rubric1: 'Resultados: malware removido, RAM suficiente, temperatura e disco na faixa, rede funcionando.',
        rubric2: 'Procedimento: usar as ferramentas certas e nunca desfragmentar um SSD.',
        rubric3: 'Ordem: diagnosticar antes de corrigir e verificar depois de cada mudança.',
        rubric4: 'Trabalho em grupo: até 8 alunos por equipe, com curso e turma no relatório.'
    },


    start: {
        title: 'Começar em um minuto',
        lead: 'Sem cadastro, sem instalação e sem depender da conexão da sala.',
        s1Title: 'Abra o simulador',
        s1Text: 'Abre no navegador e pronto: sem contas e sem downloads.',
        s2Title: 'Escolha um cenário',
        s2Text: 'O cenário 1 já vem carregado ao iniciar; os outros são escolhidos no painel da missão.',
        s3Title: 'Salve seu trabalho',
        s3Text: 'O progresso fica no navegador e o relatório da prova é exportado em PDF, CSV ou TXT.',
        cmdTitle: 'Console para praticar',
        cmdText: 'O CMD do simulador entende os comandos usados em uma assistência técnica real:'
    },

    repo: {
        title: 'Código aberto',
        lead: 'O projeto é MIT: use em aula, modifique e compartilhe.',
        license: 'Licença MIT',
        contribute: 'Como colaborar',
        issues: 'Relatar um erro',
        support: 'Apoiar o projeto',
        star: 'Dar uma estrela no GitHub'
    },

    support: {
        title: 'Apoiar o projeto',
        lead: 'O simulador é gratuito e sem publicidade. Se ele ajuda nas suas aulas, estas são as formas de retribuir.',
        mentionTitle: 'Mencione o projeto',
        mentionText: 'Conte a colegas e alunos de onde você tirou, ou compartilhe o link no seu material de aula.',
        starTitle: 'Deixe uma estrela',
        starText: 'Uma estrela no GitHub ajuda outros professores a encontrá-lo.',
        donateTitle: 'Doação (opcional)',
        donateText: 'Se você gosta do simulador, fica a seu critério uma menção ou doação para o autor.',
        cafecito: 'Me pague um cafezinho',
        kofi: 'Apoiar no Ko-fi',
        donateNote: 'Cafecito: Argentina e Mercado Pago · Ko-fi: internacional.'
    },

    rights: {
        title: 'Licença e direitos',
        license: 'Distribuído sob a Licença MIT',
        donation: 'Se você gosta do simulador, fica a seu critério uma menção ou doação para o autor.',
        mit: 'O código pode ser usado, copiado, modificado e redistribuído, inclusive em aula, mantendo o aviso de copyright. É fornecido como está, sem garantias.',
        read: 'Ler a licença completa'
    },

    footer: {
        madeBy: 'Feito por Hugo Martín Villalba',
        rights: '© {year} Hugo Martín Villalba · Licença MIT',
        otherLanguages: 'Outros idiomas'
    }
};

