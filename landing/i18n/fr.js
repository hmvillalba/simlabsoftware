// landing/i18n/fr.js — Textes de la page en français.
//
// Le dictionnaire espagnol (landing/i18n/es.js) est la source de vérité et le
// repli : chaque clé ici doit exister là-bas avec le même nom.
window.LANDING_DICTS = window.LANDING_DICTS || {};
window.LANDING_DICTS.fr = {
    _meta: { name: 'Français', dir: 'ltr' },

    meta: {
        title: 'SimLab Software — Simulateur de dépannage de systèmes d\'exploitation',
        description: 'Simulateur pédagogique, gratuit et sans installation : diagnostiquez un PC avec des pannes de RAM, CPU, disque, température, malware et réseau. 12 scénarios, panneau enseignant et mode examen.',
        ogImageAlt: 'Bureau du simulateur avec les fenêtres du Gestionnaire des tâches et du Moniteur matériel ouvertes'
    },

    nav: {
        langLabel: 'Langue',
        features: 'Contenu',
        scenarios: 'Scénarios',
        teachers: 'Pour les enseignants',
        start: 'Commencer',
        support: 'Soutenir',
        repo: 'Dépôt',
        simulator: 'Ouvrir le simulateur'
    },

    hero: {
        badge: 'Gratuit · Sans installation · Fonctionne hors ligne',
        title: 'Apprendre le dépannage en cassant un peu les choses',
        lead: 'SimLab Software est un simulateur de bureau à l\'allure de Windows 98 : les élèves ouvrent un PC en panne, lisent la RAM, le CPU, le disque et la température, puis réparent avec de vrais outils de maintenance.',
        ctaPrimary: 'Ouvrir le simulateur',
        ctaSecondary: 'Voir le code',
        note: 'Fonctionne dans le navigateur, mais aussi depuis un dossier ou une clé USB, sans serveur ni connexion.'
    },

    features: {
        title: 'Contenu',
        lead: 'Un laboratoire de maintenance complet dans le navigateur, sans licences ni comptes.',
        f1Title: 'Un système d\'exploitation simulé',
        f1Text: 'Bureau, fenêtres déplaçables, barre des tâches et sons rétro générés en direct. Chaque action est consignée dans un journal d\'audit.',
        f2Title: 'Des métriques qui réagissent',
        f2Text: 'RAM et swap avec défauts de page et thrashing, température et throttling thermique, fragmentation du disque, trafic réseau et indice de santé du système.',
        f3Title: 'Outils de technicien',
        f3Text: 'Gestionnaire des tâches, Table des pages, Moniteur matériel, Défragmenteur, Disk Cleaner, MSConfig, Boutique matériel et console CMD.',
        f4Title: 'Prêt pour la classe',
        f4Text: '12 scénarios en panne, un injecteur de pannes pour l\'enseignant, un mode examen chronométré et un rapport exporté en PDF, CSV ou TXT.'
    },

    shots: {
        title: 'À quoi ça ressemble',
        lead: 'Captures du vrai simulateur, sur ordinateur et sur téléphone.',
        desktopCaption: 'Le bureau de RetroOS 3.0 avec le Gestionnaire des tâches, la Table des pages et le Moniteur matériel ouverts.',
        mobileCaption: 'La même interface sur téléphone : les fenêtres se réorganisent et la barre se compacte.',
        altDesktop: 'Bureau du simulateur avec les fenêtres des processus, de la pagination et du moniteur matériel',
        altMobile: 'Vue du simulateur sur téléphone avec les fenêtres empilées'
    },

    scenarios: {
        title: 'Douze pannes à diagnostiquer',
        lead: 'Chaque scénario arrive avec ses symptômes, des métriques altérées et une grille de correction attendue.',
        s1Title: 'Cas complet',
        s1Text: 'Peu de RAM, malware, disque fragmenté et température élevée sur la même machine.',
        s2Title: 'Thrashing',
        s2Text: 'Défauts de page en hausse et swap saturé : la mémoire physique manque.',
        s3Title: 'Cybersécurité',
        s3Text: 'Un processus qui imite le système consomme CPU et réseau en arrière-plan.',
        s4Title: 'Matériel et disque',
        s4Text: 'Fragmentation extrême, fichiers temporaires et refroidissement insuffisant.',
        s5Title: 'Démarrage lent',
        s5Text: 'Trop de programmes au démarrage : la machine met des minutes à être utilisable.',
        s6Title: 'CPU saturé',
        s6Text: 'Un processus lourd accapare le processeur même si la RAM est libre.',
        more: 'Les scénarios 7 à 12 couvrent HDD contre SSD, surchauffe, disque presque plein, conflit logiciel, pannes réseau et une mise à niveau à budget limité.',
        tableTitle: 'Comment un cas se résout',
        colSymptom: 'Symptôme',
        colTool: 'Outil',
        colFix: 'Réparation',
        r1Symptom: 'Le PC rame et le disque ne s\'arrête jamais',
        r1Tool: 'Table des pages',
        r1Fix: 'Ajouter de la RAM physique dans la Boutique matériel et vérifier la baisse des défauts de page',
        r2Symptom: 'CPU et réseau élevés sans activité de l\'utilisateur',
        r2Tool: 'Gestionnaire des tâches / CMD',
        r2Fix: 'Identifier et arrêter le processus malveillant, puis le retirer du démarrage avec MSConfig',
        r3Symptom: 'Il s\'éteint ou ralentit après quelques minutes',
        r3Tool: 'Moniteur matériel',
        r3Fix: 'Vérifier l\'efficacité du refroidissement et confirmer la baisse de température',
        r4Symptom: 'Le disque est plein et tout est lent',
        r4Tool: 'Disk Cleaner / Défragmenteur',
        r4Fix: 'Supprimer les fichiers temporaires, défragmenter le HDD et contrôler l\'espace libre'
    },

    teachers: {
        title: 'Pour les enseignants',
        lead: 'Le matériel pour faire cours est déjà livré avec le simulateur.',
        p1Title: 'Accès protégé',
        p1Text: 'Le panneau enseignant s\'ouvre avec un mot de passe stocké en hachage SHA-256, modifiable à la première connexion.',
        p2Title: 'Injecteur de pannes',
        p2Text: 'Pendant le cours, vous pouvez provoquer une surchauffe, de la pagination, un processus lourd ou un malware et observer chaque groupe.',
        p3Title: 'Correction automatique',
        p3Text: 'Le mode examen note les résultats et la procédure : ce qui a été diagnostiqué, réparé et dans quel ordre.',
        classTitle: 'Un cours de 45 minutes',
        class1: 'Choisissez un scénario, chargez-le et projetez le bureau pendant que vous expliquez les symptômes.',
        class2: 'Chaque groupe mesure avec le Moniteur matériel et la Table des pages avant de toucher à quoi que ce soit.',
        class3: 'Les élèves réparent avec les outils et vérifient le résultat dans la console CMD.',
        class4: 'Terminez avec la grille de correction et les observations laissées par le panneau enseignant.',
        rubricTitle: 'La grille appliquée par l\'examen',
        rubric1: 'Résultats : malware supprimé, RAM suffisante, température et disque dans la plage, réseau opérationnel.',
        rubric2: 'Procédure : utiliser les bons outils et ne jamais défragmenter un SSD.',
        rubric3: 'Ordre : diagnostiquer avant de réparer et vérifier après chaque changement.',
        rubric4: 'Travail de groupe : jusqu\'à 8 élèves par équipe, avec classe et division dans le rapport.'
    },


    start: {
        title: 'Commencer en une minute',
        lead: 'Sans inscription, sans installation et sans dépendre de la connexion de la salle.',
        s1Title: 'Ouvrir le simulateur',
        s1Text: 'Il s\'ouvre dans le navigateur, c\'est tout : ni comptes ni téléchargements.',
        s2Title: 'Choisir un scénario',
        s2Text: 'Le scénario 1 est déjà chargé au démarrage ; les autres se choisissent dans le panneau de mission.',
        s3Title: 'Enregistrer son travail',
        s3Text: 'La progression reste dans le navigateur et le rapport d\'examen s\'exporte en PDF, CSV ou TXT.',
        cmdTitle: 'Une console pour pratiquer',
        cmdText: 'La console du simulateur comprend les commandes d\'un vrai atelier de réparation :'
    },

    repo: {
        title: 'Open source',
        lead: 'Le projet est sous MIT : utilisez-le en classe, modifiez-le et partagez-le.',
        license: 'Licence MIT',
        contribute: 'Comment contribuer',
        issues: 'Signaler un bug',
        support: 'Soutenir le projet',
        star: 'Mettre une étoile sur GitHub'
    },

    support: {
        title: 'Soutenir le projet',
        lead: 'Le simulateur est gratuit et sans publicité. S\'il vous aide à enseigner, voici comment rendre la pareille.',
        mentionTitle: 'Mentionner le projet',
        mentionText: 'Dites à vos collègues et élèves d\'où il vient, ou partagez le lien dans votre matériel de cours.',
        starTitle: 'Laisser une étoile',
        starText: 'Une étoile sur GitHub aide d\'autres enseignants à le trouver.',
        donateTitle: 'Don (facultatif)',
        donateText: 'Si vous aimez le simulateur, une mention ou un don pour l\'auteur reste à votre appréciation.',
        cafecito: 'Offrez-moi un café',
        kofi: 'Soutenir sur Ko-fi',
        donateNote: 'Cafecito : Argentine et Mercado Pago · Ko-fi : international.'
    },

    rights: {
        title: 'Licence et droits',
        license: 'Distribué sous licence MIT',
        donation: 'Si vous aimez le simulateur, une mention ou un don pour l\'auteur reste à votre appréciation.',
        mit: 'Le code peut être utilisé, copié, modifié et redistribué, y compris en classe, en conservant l\'avis de copyright. Il est fourni tel quel, sans garantie.',
        read: 'Lire la licence complète'
    },

    footer: {
        madeBy: 'Réalisé par Hugo Martín Villalba',
        rights: '© {year} Hugo Martín Villalba · Licence MIT',
        otherLanguages: 'Autres langues'
    }
};

