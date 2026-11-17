// lang/runtime/fr.js — textes d'exécution en français.
//
// Part de la base espagnole et remplace les sections traduites. Le test de
// parité s'exécute après l'aplatissement des dictionnaires par runtime-dict.js.
window.SIM_RUNTIME = window.SIM_RUNTIME || {};
(function () {
    var es = window.SIM_RUNTIME.es;
    window.SIM_RUNTIME.fr = Object.assign({}, es, {
        scen: {
            1: {
                name: '1 (Cas complet)',
                s: [
                    'Ralentissement extrême généralisé du système.',
                    'Utilisation élevée du CPU et interface graphique congestionnée.',
                    'Lectures continues sur le disque dur (grattage constant).',
                    'Température du processeur au-dessus du seuil de sécurité.'
                ],
                p: [
                    "1. Ouvrir le Gestionnaire des tâches ou la Console CMD et terminer le processus malveillant 'svchost_fake.exe' (PID 666).",
                    '2. Aller dans la Boutique matériel et étendre la mémoire RAM à 1,5 Go ou 2,5 Go.',
                    '3. Ouvrir le Défragmenteur de disque C: et lancer une défragmentation complète.',
                    '4. Ouvrir Disk Cleaner pour analyser et supprimer les fichiers temporaires.',
                    '5. Ouvrir MSConfig et désactiver les services inutiles au démarrage.'
                ]
            },
            2: {
                name: '2 (Thrashing et mémoire virtuelle)',
                s: [
                    'Temps de réponse lents lors du changement de fenêtre.',
                    'Nombre de défauts de page (Page Faults) continuellement élevé.',
                    'Mappage de swap extrêmement plein dans la Table des pages.',
                    'Le disque dur ne cesse de transférer des données.'
                ],
                p: [
                    "1. Diagnostiquer la saturation dans la fenêtre 'Table des pages / Inspecteur VMem'.",
                    '2. Ouvrir le Gestionnaire des tâches pour identifier la surconsommation de RAM.',
                    '3. Aller dans la Boutique matériel et augmenter la RAM physique à 1,5 Go ou plus.',
                    '4. Vérifier dans l’Inspecteur VMem que les défauts de page s’arrêtent.'
                ]
            },
            3: {
                name: '3 (Cybersécurité et audit)',
                s: [
                    'Trafic réseau anormal et élevé en arrière-plan (>100 Ko/s).',
                    'Processus suspect en cours d’exécution imitant un binaire système.',
                    'Consommation ou pic de processeur persistant à 45 % ou plus.'
                ],
                p: [
                    '1. Ouvrir le Gestionnaire des tâches ou CMD et vérifier la colonne Trafic réseau / CPU.',
                    "2. Identifier le processus 'svchost_fake.exe' (PID 666).",
                    '3. Terminer le processus via l’interface graphique ou CMD : taskkill /PID 666.',
                    "4. Ouvrir MSConfig et décocher 'svchost_fake.exe' de la liste de démarrage."
                ]
            },
            4: {
                name: '4 (Maintenance matériel et disque)',
                s: [
                    'Avertissement de température critique du processeur (>80 °C).',
                    'Lecture de fichiers extrêmement lente en raison de la dispersion des secteurs.',
                    'Capacité de stockage occupée par des fichiers temporaires massifs.'
                ],
                p: [
                    '1. Inspecter les Propriétés du système / Métriques pour détecter la température critique.',
                    "2. Exécuter 'Disk Cleaner' pour nettoyer les fichiers temporaires.",
                    "3. Exécuter 'Défragmenteur C:' pour réorganiser les blocs fragmentés.",
                    '4. Confirmer la baisse de température et la santé du système restaurée.'
                ]
            },
            5: {
                name: '5 (Démarrage lent de Windows)',
                s: [
                    'Le système met plus de 2 minutes à devenir utilisable après la connexion.',
                    'Plusieurs processus se chargent automatiquement au démarrage.',
                    'Utilisation élevée du CPU pendant les premières minutes.',
                    'Le disque enregistre une activité intense au démarrage.'
                ],
                p: [
                    '1. Ouvrir MSConfig et examiner la liste des programmes de démarrage.',
                    "2. Désactiver 'LegacyUpdater98.exe' et d’autres services inutiles.",
                    '3. Vérifier dans le Gestionnaire des tâches que la consommation au démarrage a baissé.',
                    '4. Confirmer que le temps de démarrage simulé est nettement réduit.'
                ]
            },
            6: {
                name: '6 (Saturation du CPU)',
                s: [
                    'L’ordinateur répond lentement même si la mémoire RAM est disponible.',
                    'CPU proche de 100 % pendant des périodes prolongées.',
                    'Un processus concentre une grande partie de la consommation du processeur.',
                    'Les applications mettent du temps à répondre aux clics et aux changements de fenêtre.'
                ],
                p: [
                    '1. Ouvrir le Gestionnaire des tâches et trier/examiner la colonne CPU.',
                    '2. Identifier le processus lourd (RenderEngine3D ou similaire) qui sature le CPU.',
                    '3. Terminer le processus inutile via l’interface graphique ou CMD.',
                    '4. Vérifier que l’utilisation du CPU et la température redescendent à des niveaux normaux.'
                ]
            },
            7: {
                name: '7 (HDD lent vs SSD)',
                s: [
                    'Temps de chargement des programmes et fichiers très élevés.',
                    'Latence élevée lors des opérations de lecture/écriture aléatoires.',
                    'L’accès au disque devient coûteux pendant la pagination.',
                    'La RAM n’est pas saturée ; le goulot d’étranglement est le stockage.'
                ],
                p: [
                    '1. Vérifier les Propriétés du système et confirmer que le disque est un HDD.',
                    '2. Observer la fragmentation et les temps de réponse du disque.',
                    '3. Aller dans la Boutique matériel et simuler le passage au SSD (si le budget le permet).',
                    '4. Comparer le comportement avant/après : temps de démarrage et de chargement.'
                ]
            },
            8: {
                name: '8 (Surchauffe par refroidissement)',
                s: [
                    'La température du processeur dépasse 85-90 °C sous charge modérée.',
                    'Le système réduit automatiquement la fréquence (thermal throttling).',
                    'Les applications deviennent plus lentes après plusieurs minutes.',
                    'Le ventilateur simulé fonctionne en dessous du nécessaire.'
                ],
                p: [
                    '1. Observer la température dans le Panneau de mission et les Propriétés du système.',
                    '2. Identifier que le problème vient du refroidissement (coolingEfficiency bas).',
                    '3. Simuler une maintenance du refroidissement (commande ou action de nettoyage thermique).',
                    '4. Vérifier que la température baisse et que le thermal throttle disparaît.'
                ]
            },
            9: {
                name: '9 (Disque presque plein)',
                s: [
                    'Le disque a moins de 10 % d’espace libre.',
                    'Certaines opérations d’écriture échouent ou sont très lentes.',
                    'Il y a des centaines de Mo de fichiers temporaires et de déchets.',
                    'Le système avertit d’un espace insuffisant.'
                ],
                p: [
                    '1. Ouvrir Disk Cleaner et lancer l’analyse des fichiers temporaires.',
                    '2. Nettoyer les fichiers inutiles trouvés.',
                    '3. Vérifier dans les Propriétés du système / métriques l’espace libre récupéré.',
                    '4. Confirmer que les opérations d’écriture fonctionnent à nouveau normalement.'
                ]
            },
            10: {
                name: '10 (Conflit logiciel)',
                s: [
                    'Deux applications provoquent des ralentissements intermittents lorsqu’elles sont exécutées ensemble.',
                    'L’une d’elles fonctionne bien isolément.',
                    'Des pics de CPU et des accès disque fréquents apparaissent.',
                    'Le problème n’est pas un manque de RAM ni d’espace disque.'
                ],
                p: [
                    "1. Ouvrir le Gestionnaire des tâches et observer le processus 'OldOfficeHelper.exe'.",
                    '2. Comparer le comportement avec et sans ce processus actif.',
                    '3. Terminer ou désactiver le processus en conflit depuis MSConfig ou le Gestionnaire des tâches.',
                    '4. Vérifier que les ralentissements intermittents disparaissent.'
                ]
            },
            11: {
                name: '11 (Problèmes réseau)',
                s: [
                    'Impossible de naviguer sur les sites web même si le câble/réseau semble connecté.',
                    'Le trafic réseau est irrégulier ou nul dans certains cas.',
                    'Problème possible de DNS, de passerelle ou de configuration IP.',
                    'Le reste du système (CPU/RAM/Disque) fonctionne normalement.'
                ],
                p: [
                    "1. Ouvrir la Console CMD et exécuter 'ipconfig' ou 'network' pour voir l’état.",
                    '2. Identifier le type de panne (DNS / Passerelle / IP).',
                    '3. Exécuter la commande de réparation réseau simulée (netfix ou repair).',
                    '4. Vérifier que la connectivité est restaurée et que le trafic revient à la normale.'
                ]
            },
            12: {
                name: '12 (Mise à niveau avec budget limité)',
                s: [
                    'L’ordinateur est lent à cause d’une combinaison de peu de RAM et d’un disque HDD.',
                    'Température un peu élevée et fragmentation modérée.',
                    'Le budget de mise à niveau est limité (un seul composant principal peut être amélioré).',
                    'Il faut choisir l’amélioration avec le meilleur rapport coût-bénéfice.'
                ],
                p: [
                    '1. Diagnostiquer le principal goulot d’étranglement (RAM vs Disque vs Température).',
                    '2. Vérifier le budget disponible dans la Boutique matériel.',
                    '3. Choisir la mise à niveau la plus efficace selon le diagnostic (RAM prioritaire ici).',
                    '4. Appliquer l’amélioration et vérifier l’impact réel sur les métriques de performance.'
                ]
            }
        },
        help: {
            alumno: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Guide pour les élèves</h2>
        <p><b>Qu’est-ce que RetroOS ?</b> C’est un laboratoire virtuel de style Windows 98. Le PC simulé a des problèmes (peu de RAM, malware, disque plein, température élevée, etc.). Votre travail consiste à <b>diagnostiquer</b>, <b>réparer</b> et <b>vérifier</b> que cela s’est amélioré.</p>
        <p class="font-bold text-emerald-800">Méthode recommandée</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Lisez les symptômes du <b>Panneau de mission</b> (s’il est visible).</li>
            <li>Ouvrez les outils : Gestionnaire des tâches, Moniteur HW, Table des pages, Propriétés, CMD.</li>
            <li>Formulez une hypothèse (est-ce la RAM ? un malware ? le disque ? la chaleur ?).</li>
            <li>Appliquez une solution concrète.</li>
            <li>Vérifiez les métriques ou capturez un instantané dans le Moniteur HW.</li>
        </ol>
        <p class="font-bold text-emerald-800">Ce que vous pouvez faire</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>Terminer des processus (Gestionnaire des tâches ou <code>taskkill</code> dans CMD).</li>
            <li>Étendre la RAM, migrer vers SSD ou améliorer le refroidissement (Boutique matériel).</li>
            <li>Défragmenter le HDD, nettoyer les fichiers temporaires, désactiver des programmes au démarrage (MSConfig).</li>
            <li>Réparer le réseau avec <code>ipconfig</code> / <code>netfix</code>.</li>
            <li>Jouer ou ouvrir des programmes lourds pour voir l’impact sur la mémoire.</li>
        </ul>
        <p class="font-bold text-amber-800">En mode examen</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>Le Panneau de mission est masqué : enquêtez par vous-même.</li>
            <li>Impossible de changer de scénario.</li>
            <li>Un chronomètre rouge est affiché en haut.</li>
            <li>Pas besoin de deviner : utilisez les outils et laissez des preuves de ce que vous avez fait.</li>
        </ul>
        <p class="text-gray-600">Conseil : n’étendez pas la RAM sans vérifier d’abord s’il y a un processus malveillant ou si le CPU est saturé. Chaque problème a sa cause.</p>
    `,
            docente: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Guide pour les enseignants</h2>
        <p><b>Accès :</b> icône Panneau enseignant ou menu Démarrer. Mot de passe initial <code>1234</code> (à changer à la première connexion). Il est stocké chiffré (SHA-256 avec sel) dans le navigateur. Pour un mot de passe que l’élève ne peut pas effacer, définissez <code>FIXED_TEACHER_HASH</code> dans le fichier.</p>
        <p class="font-bold text-emerald-800">Panneau enseignant — fonctions</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li><b>Changer</b> le <b>mot de passe</b> d’accès.</li>
            <li><b>Fermer la session enseignant</b> (le mot de passe est redemandé).</li>
            <li><b>Mode élève uniquement</b> : masque l’icône du bureau ; l’accès reste par Démarrer + mot de passe.</li>
            <li><b>12 scénarios</b> pédagogiques avec symptômes et grille de correction.</li>
            <li><b>Injecteur de pannes</b> : surchauffe, swap, processus lourd, malware.</li>
            <li><b>Mode évaluation</b> : élève(s), cours, classe, niveau 1–3, chronomètre, évaluation automatique.</li>
            <li><b>Observations</b> de l’enseignant dans le rapport.</li>
            <li><b>Exporter</b> le rapport en TXT, CSV ou PDF.</li>
            <li><b>Historique</b> des évaluations (enregistré dans ce navigateur ; consulter / réexporter).</li>
        </ul>
        <p class="font-bold text-emerald-800">Déroulement suggéré</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Choisissez un scénario et chargez-le.</li>
            <li>Remplissez cours, classe et ajoutez élève(s) (jusqu’à 8 par groupe).</li>
            <li>Niveau : 1 guidé · 2 technique · 3 professionnel (sans indices).</li>
            <li>Démarrer l’examen → panneau de mission masqué, scénarios verrouillés, bannière + chronomètre.</li>
            <li>À la fin : Terminer et évaluer → note et critères.</li>
            <li>Optionnel : observations → Exporter en PDF.</li>
            <li>Annuler / Déverrouiller quitte sans note.</li>
        </ol>
        <p class="font-bold text-amber-800">Évaluation automatique</p>
        <p>Elle note les résultats (malware, RAM, température, disque, réseau, etc.) et la procédure (utilisation des outils, diagnostic avant réparation, vérification après, éviter les erreurs comme défragmenter un SSD).</p>
    `,
            herramientas: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Outils système</h2>
        <ul class="list-disc list-inside space-y-1">
            <li><b>Gestionnaire des tâches :</b> processus, RAM, CPU, réseau ; terminer des tâches.</li>
            <li><b>Table des pages / VMem :</b> cadres RAM vs SWAP et défauts de page (thrashing).</li>
            <li><b>Moniteur matériel :</b> barres et sparklines RAM/CPU/temp/disque, ventilateur, instantanés avant/après.</li>
            <li><b>Défragmenteur :</b> HDD uniquement. Sur SSD, il avertit que ce n’est pas applicable.</li>
            <li><b>Disk Cleaner :</b> analyse et nettoie les temporaires ; récupère de l’espace.</li>
            <li><b>MSConfig :</b> programmes de démarrage (inclut malware et services lourds).</li>
            <li><b>Boutique matériel :</b> RAM, SSD, refroidissement.</li>
            <li><b>CMD :</b> help, tasklist, taskkill, mem, systeminfo, defrag, ipconfig, netfix, coolfix.</li>
            <li><b>Navigateur / Jeux / Player :</b> génèrent une charge réelle de ressources.</li>
            <li><b>Panneau de mission :</b> symptômes et métriques (masqué en examen).</li>
            <li><b>Manuel / Aide :</b> cette fenêtre ; exportable en PDF.</li>
        </ul>
        <p class="font-bold text-emerald-800">Commandes CMD utiles</p>
        <p class="font-mono text-[11px] bg-gray-100 p-2 border">help · tasklist · taskkill /PID 666 · mem · systeminfo · defrag · ipconfig · netfix · coolfix · cls</p>
    `,
            escenarios: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Scénarios 1 à 12</h2>
        <ol class="list-decimal list-inside space-y-1">
            <li><b>Cas complet :</b> RAM + malware + fragmentation + température.</li>
            <li><b>Thrashing / VMem :</b> peu de RAM, défauts de page, swap plein.</li>
            <li><b>Cybersécurité :</b> svchost_fake.exe, CPU et réseau anormaux.</li>
            <li><b>Matériel et disque :</b> fragmentation élevée, déchets, surchauffe.</li>
            <li><b>Démarrage lent :</b> nombreux programmes au démarrage.</li>
            <li><b>CPU saturé :</b> processus lourd ; la RAM n’est pas le goulot d’étranglement.</li>
            <li><b>HDD vs SSD :</b> latence disque ; option de migration vers SSD.</li>
            <li><b>Surchauffe :</b> refroidissement insuffisant et thermal throttle.</li>
            <li><b>Disque presque plein :</b> peu d’espace libre et fichiers temporaires.</li>
            <li><b>Conflit logiciel :</b> applications qui interfèrent entre elles.</li>
            <li><b>Problèmes réseau :</b> DNS/IP ; réparer avec CMD.</li>
            <li><b>Budget limité :</b> choisir la meilleure mise à niveau matérielle.</li>
        </ol>
        <p class="text-gray-600 mt-2">En examen niveau 3, l’élève ne voit ni la grille ni le panneau de symptômes : il doit découvrir la cause avec les outils.</p>
    `
        },
        alert: {
            scenarioLocked: 'Scénarios verrouillés pendant l’examen.\nUtilisez « Annuler / Déverrouiller » ou « Terminer et évaluer » pour changer de scénario.',
            gameStarted: 'Démarrage de {name}... Observez l’impact sur la RAM/Swap dans le Panneau de mission et le Gestionnaire des tâches.',
            ssdDefrag: 'L’unité simulée est un SSD. La défragmentation comme un HDD n’est pas recommandée ; utilisez l’optimisation/TRIM du système.',
            budgetInsufficient: 'Budget insuffisant.\n{label} coûte ${cost} et il ne reste que ${remaining}.',
            auditCopied: 'Rapport d’audit étape par étape copié dans le presse-papiers.',
            auditCopyManual: 'Copié manuellement :\n{report}',
            teacherExamActive: 'Un examen est en cours. Terminez-le ou annulez-le avant de fermer la session enseignant.',
            teacherLoggedOut: 'Session enseignant fermée.\nLe mot de passe est nécessaire pour se reconnecter.',
            historySaveFailed: 'Impossible d’enregistrer l’historique dans ce navigateur. Exportez les rapports (PDF/CSV) pour ne pas les perdre.',
            clearHistory: 'Effacer TOUT l’historique des évaluations enregistré dans ce navigateur ? Cette action est irréversible.',
            teacherPassSaveFailed: 'Impossible d’enregistrer le mot de passe dans ce navigateur (localStorage bloqué).',
            initialPass: 'Vous utilisez le mot de passe initial (1234).\nChangez-le maintenant : vous ne pourrez pas lancer d’examen avant.',
            loginLocked: 'Trop de tentatives. Attendez {seconds} s.',
            loginWrong: 'Mot de passe incorrect. Réessayez.',
            examNoAddStudents: 'Impossible d’ajouter des élèves pendant l’examen.',
            examStudentName: 'Saisissez le nom de l’élève.',
            examStudentDuplicate: 'Cet élève est déjà dans la liste.',
            examStudentMax: 'Maximum 8 élèves par examen de groupe.',
            examChangePass: 'Changez le mot de passe initial de l’enseignant avant de lancer un examen.',
            examAlreadyRunning: 'Un examen est déjà en cours. Terminez-le ou annulez-le d’abord.',
            examNeedStudent: 'Ajoutez au moins un élève (ou un groupe) avant de lancer l’examen.',
            examStarted: 'Mode Examen activé\n\n{group}Élèves :\n• {students}\n\n• Bannière rouge + chronomètre\n• Panneau de mission masqué\n• Scénarios verrouillés',
            examNoRunning: 'Aucun examen en cours.',
            examCancelConfirm: 'Annuler l’examen sans évaluation ?\n\nLe Panneau de mission sera restauré et les scénarios déverrouillés.\nAucune note ne sera générée.',
            examCancelled: 'Examen annulé.\nPanneau de mission restauré.\nScénarios déverrouillés.',
            examNoReport: 'Aucun rapport d’examen. Lancez et terminez d’abord un examen.',
            pdfUnavailable: 'Impossible de charger la bibliothèque PDF. Vérifiez la connexion Internet ou utilisez Exporter le rapport (.txt).',
            pdfUnavailableSimple: 'Impossible de charger la bibliothèque PDF. Vérifiez la connexion Internet.'
        },
        app: {
            'win-browser': 'Navigateur Web',
            'win-player': 'Retro Player',
            'win-games': 'Jeux',
            'win-calc': 'Calculatrice',
            'win-sysprops': 'Mon PC',
            'win-taskmgr': 'Admin. tâches',
            'win-vmem': 'Table des pages',
            'win-defrag': 'Défrag. disque',
            'win-cleaner': 'Nettoyage de disque',
            'win-msconfig': 'MSConfig',
            'win-nanoedit': 'Bloc-notes',
            'win-ramshop': 'Hardware RAM',
            'win-cmd': 'Console CMD',
            'win-teacher': 'Panneau enseignant',
            'win-hwmon': 'Moniteur HW',
            'win-help': 'Manuel / Aide'
        },
        ui: Object.assign({}, es.ui, {
            resizeGrip: 'Faites glisser pour redimensionner',
            playerPause: 'Pause',
            playerPlay: 'Lecture',
            defragProcessing: 'Traitement...',
            defragOptimized: '{pct}% (Optimisé)',
            cleanerFound: '{mb} Mo de fichiers temporaires et inutiles trouvés.',
            cleanerFree: 'Espace libre actuel estimé : {gb} Go',
            cleanerDone: 'Nettoyage terminé. ~{mb} Mo récupérés.',
            vmemUsed: '{used} Mo utilisés ({usedFrames}/{totalFrames} cadres)',
            vmemPaged: '{mb} Mo paginés sur disque',
            vmemFreeFrame: 'LIBRE',
            taskmgrEnd: 'Terminer',
            taskmgrClose: 'Fermer',
            budgetLimited: 'Budget : ${remaining} disponibles sur ${total} (dépensé : ${spent})',
            budgetUnlimited: 'Aucune limite de budget dans ce scénario. Dépensé : ${spent}',
            shopCooling: 'Maintenance du refroidissement',
            correctionHide: 'Masquer la grille',
            correctionShow: 'Voir la grille',
            lockedDuringExam: 'Verrouillé pendant l’examen',
            examCourseDiv: 'Cours/Classe : ',
            on: 'Activé',
            off: 'Désactivé',
            disconnected: 'déconnecté',
            hwmonHigh: 'Élevé',
            hwmonMedium: 'Moyen',
            hwmonLow: 'Faible',
            hwmonYes: 'OUI ⚠',
            hwmonNo: 'Non',
            statusNoConnection: 'SANS CONNEXION',
            statusOk: 'OK',
            statusFail: 'ÉCHEC',
            statusYes: 'OUI',
            statusNo: 'NON',
            propsRam: 'RAM : {mb} Mo SDRAM',
            propsDisk: 'Disque {type} : Frag {frag} % | Libre {free} Go',
            propsTemp: 'Température : {temp} °C | Refroidissement : {cool} %',
            browserHomeTitle: 'MégaRecherche 98',
            browserSearchPlaceholder: 'Rechercher sur le Web...',
            browserSearchBtn: 'Rechercher',
            browserSites: 'Sites recommandés :',
            browserNewsLink: 'Actualités technologiques des années 90',
            browserHeavyLink: 'Portail Web 3D/HD (charge RAM massive +350 Mo)',
            browserNewsTitle: 'Portail d’actualités tech',
            browserNewsBody1: 'De nouveaux modules SDRAM promettent d’éliminer les problèmes d’échange de pages (swapping) !',
            browserNewsBody2: 'Recommandation : surveillez le Gestionnaire des tâches en cas de ralentissement.',
            browserHeavyTitle: 'Chargement d’un portail Web lourd avec scripts et rendu 3D !',
            browserHeavyBody1: 'Cet onglet consomme {mb} Mo de RAM supplémentaires.',
            browserHeavyBody2: 'Voyez comment le système commence à paginer sur disque (Swap/PageFaults) s’il n’y a pas assez de mémoire physique.',
            compareEmpty: 'Capturez un état initial puis un autre après intervention pour comparer.',
            compareOne: 'État capturé à <b>{time}</b> — Santé : {health}<br>RAM {ramUsed}/{ram} Mo | CPU {cpu} % | Temp {temp} °C | Frag {frag} % | Libre {free} Go | Boot {boot} s',
            compareSecond: 'Capturez un second état pour voir la comparaison.',
            compareMetric: 'Métrique',
            compareBefore: 'Avant ({time})',
            compareAfter: 'Après ({time})',
            compareHealth: 'Santé',
            compareRamUsed: 'RAM utilisée',
            compareTemp: 'Température',
            compareFrag: 'Fragmentation',
            compareFree: 'Espace libre',
            compareBoot: 'Temps de démarrage',
            compareCool: 'Refroidissement',
            historyEmpty: 'Aucune évaluation enregistrée pour l’instant.',
            historyView: 'Voir',
            historyLoaded: 'Historique #{n} chargé — prêt à réexporter.',
            historyCourseDivision: 'Cours/Classe : {course} {division}',
            historyGroup: 'Groupe',
            historyStudent: 'Élève',
            historyScore: 'Note : {score}% · Scénario {scenario} · {time}',
            historyObservations: 'Observations :',
            studentsNone: 'Aucun élève ajouté',
            studentsRemove: 'Retirer',
            studentsCount: '{n} élèves',
            groupDiv: 'Classe {div}',
            resultsCourseDivision: 'Cours/Classe : {course} {division}',
            resultsGroup: 'Groupe ({n})',
            resultsStudent: 'Élève',
            resultsExcellent: 'Excellent',
            resultsPassed: 'Admis',
            resultsRegular: 'Passable',
            resultsInsufficient: 'Insuffisant',
            resultsResult: 'Résultat : {pct}% — {label}',
            resultsObservations: 'Observations :',
            resultsCriteria: 'Critère',
            resultsState: 'État',
            resultsDetail: 'Détail',
            examStatusCancelled: 'Examen annulé (sans évaluation). Scénarios déverrouillés.',
            examStatusRunning: 'EXAMEN EN COURS · {group}{students} · Scén. {scenario} · Niv. {level} · Santé init. : {health}%',
            examStatusRestored: 'EXAMEN EN COURS (restauré après rechargement) · {group}{students} · Scén. {scenario} · Niv. {level} · Santé init. : {health}%',
            examStatusFinished: 'EXAMEN TERMINÉ · {mode} : {name} · {course}Note : {score}% · Temps : {time}',
            examBanner: '{group}{names} · Scén. {scenario} · Niv. {level}'
        }),
        cmd: {
            help: 'Commandes : help, tasklist, taskkill /PID <id>, taskkill /IM nom.exe, kill nom.exe, mem, defrag, systeminfo, ipconfig, netfix, coolfix, cls',
            notFound: "'{cmd}' n’est pas reconnu comme une commande interne ou externe.",
            terminated: 'Processus terminé avec succès.',
            processNotFound: 'Le processus spécifié est introuvable.',
            mem: 'Mémoire totale : {ram} Mo | Swap actif : {swap} | Page Faults : {pf}',
            defragStart: 'Lancement de la défragmentation depuis la ligne de commande...',
            systeminfo: 'RetroOS 3.0 | RAM : {ram} Mo | Disque : {disk} ({free} Go libres) | Temp CPU : {temp} °C | Réseau : {net}',
            ipconfigOk: 'Adaptateur Ethernet : IP 192.168.1.45 | Masque 255.255.255.0 | Passerelle 192.168.1.1 | DNS 8.8.8.8 [OK]',
            ipconfigFail: "Panne réseau détectée : {issue}. Utilisez 'netfix' pour réparer.",
            netOk: 'Le réseau fonctionne déjà correctement.',
            netFixed: 'Réparation réseau terminée (ipconfig /renew + flushdns). Connectivité restaurée.',
            coolfix: 'Maintenance du refroidissement simulée. Efficacité maintenant : {eff} %. Temp : {temp} °C.'
        },
        log: Object.assign({}, es.log, {
            scenarioChanged: 'L’enseignant est passé au scénario {name}.',
            scenarioInitial: 'État initial : RAM {ram} Mo | Disque {disk} | Frag {frag} % | Temp {temp} °C | Boot ~{boot} s | Libre {free} Go',
            faultOverheat: '[PANNE INJECTÉE PAR L’ENSEIGNANT] Surchauffe du CPU provoquée (+35 °C). Température actuelle : {temp} °C.',
            faultSwap: '[PANNE INJECTÉE PAR L’ENSEIGNANT] Mémoire virtuelle / Swap saturée (+450 Mo fictifs).',
            faultHeavy: "[PANNE INJECTÉE PAR L’ENSEIGNANT] Processus lourd 'RenderEngine3D_Benchmark.exe' lancé (380 Mo RAM, 40 % CPU).",
            faultMalware: "[PANNE INJECTÉE PAR L’ENSEIGNANT] Processus 'svchost_fake.exe' (CryptoMiner) injecté / activé.",
            gameRun: '[JEUX] {name} a été exécuté en consommant {ram} Mo de RAM supplémentaires.',
            correctionShown: 'L’enseignant a affiché la grille de correction.',
            browserHeavy: 'Le navigateur Web a chargé un portail lourd (+350 Mo de consommation).',
            ssdDefragAvoided: '[DIAGNOSTIC] La défragmentation d’un SSD a été évitée ; l’action appropriée serait l’optimisation/TRIM.',
            defragStart: 'Défragmentation du HDD lancée avec {frag} % de fragmentation.',
            defragDone: 'Défragmentation du HDD terminée. Fragmentation : {from} % → {to} %.',
            cleanerScan: 'Analyse des fichiers temporaires terminée.',
            cleanerDone: 'Fichiers temporaires supprimés par l’élève. {mb} Mo récupérés.',
            msconfigToggle: "MSConfig : configuration de démarrage modifiée pour '{name}' (État : {state}).",
            killProcess: "[ACTION ÉLÈVE] Processus '{name}' terminé (PID {pid}) via le Gestionnaire des tâches.",
            killHeavy: "[ACTION ÉLÈVE] Processus lourd '{name}' terminé via le Gestionnaire des tâches.",
            purchaseRejected: '[ACTION ÉLÈVE] Achat refusé pour budget : {label} (${cost}). Disponible : ${remaining}.',
            purchase: '[ACTION ÉLÈVE] Achat effectué : {label} (${cost}).{extra}',
            purchaseRemaining: ' Budget restant : ${remaining}.',
            ramUpgrade: '[ACTION ÉLÈVE] Matériel mis à jour : RAM physique étendue à {mb} Mo.',
            diskSSD: '[ACTION ÉLÈVE] Disque migré vers SSD. La fragmentation n’est plus critique. Temps de démarrage réduit.',
            diskHDD: '[ACTION ÉLÈVE] Disque configuré en HDD.',
            cooling: '[ACTION ÉLÈVE] Maintenance du refroidissement effectuée. Efficacité : {eff} %. Temp : {temp} °C.',
            networkFix: '[ACTION ÉLÈVE] Réseau réparé (ipconfig /renew + vidage DNS simulé).',
            killProcessCmd: '[ACTION ÉLÈVE] Processus terminé via CMD : {name} (PID {pid})',
            killHeavyCmd: '[ACTION ÉLÈVE] Processus lourd terminé via CMD : {name}',
            cmdExec: '[CMD] Commande exécutée : "{cmd}"',
            snapshot: '[MONITEUR] Instantané capturé ({time}) : RAM {ramUsed}/{ram} Mo, CPU {cpu} %, Temp {temp} °C, Santé {health}',
            snapshotsCleared: '[MONITEUR] Instantanés de comparaison effacés.',
            difficulty: 'Niveau de difficulté défini : {level}',
            examStarted: '[EXAMEN] Lancé. Cours : {course} Classe : {division}. Élèves : {students}. Scénario {scenario}.',
            examCancelled: '[EXAMEN] Annulé. Élèves : "{students}". Sans évaluation.',
            examFinished: '[EXAMEN] Terminé. Score : {score} % ({points}/{max}). Durée : {duration} s.',
            exportTxt: '[EXAMEN] Rapport exporté (.txt) — {name}',
            exportCsv: '[EXAMEN] Rapport CSV exporté — Élève : {name}',
            exportPdf: '[EXAMEN] Rapport PDF exporté — {name}',
            helpPdf: '[AIDE] Manuel d’utilisation exporté en PDF.',
            teacherLogout: '[ENSEIGNANT] Session fermée. Le mot de passe est à nouveau requis.',
            studentOnly: '[ENSEIGNANT] Mode élève uniquement : {state}',
            studentOnlyOn: 'activé (icône du bureau masquée)',
            studentOnlyOff: 'désactivé',
            sessionRestored: '[EXAMEN] Session restaurée après rechargement du navigateur (inactive ~{seconds} s). Le chronomètre continue depuis le début d’origine.',
            historyCleared: '[ENSEIGNANT] Historique des évaluations effacé.',
            teacherAuth: 'Panneau enseignant authentifié avec succès.',
            windowOpen: "Fenêtre '{name}' ouverte.",
            windowClose: "Fenêtre '{name}' fermée.",
            windowMinimize: "Fenêtre '{name}' réduite. Le processus est toujours actif.",
            aboutOpen: 'Fenêtre À propos de RetroOS 3.0 ouverte.'
        }),
        exam: {
            crit: Object.assign({}, es.exam.crit, {
                healthHigh: 'Santé du système ≥ 85 %',
                healthNotable: 'La santé du système s’est nettement améliorée',
                healthSlight: 'La santé du système s’est légèrement améliorée',
                healthBase: 'Santé du système',
                healthNoImprove: '{start} % → {end} % (amélioration insuffisante)',
                malware: 'Malware supprimé',
                malwareKilled: 'svchost_fake.exe terminé',
                malwareActive: 'Toujours actif',
                persist: 'Persistance du malware supprimée (MSConfig)',
                persistDisabled: 'Désactivé au démarrage',
                persistNotDisabled: 'Processus tué mais non désactivé au démarrage',
                persistNotFixed: 'Non corrigé',
                memory: 'Pression mémoire / thrashing résolu',
                memoryResolved: 'RAM {used}/{total} Mo, swap désactivé',
                memorySwap: 'Toujours en swap',
                memoryRam: 'RAM {used}/{total} Mo',
                ramUpgrade: 'Extension de RAM adéquate',
                ramUpgradeDetail: '{start} → {end} Mo',
                ramStill: 'Toujours à {end} Mo',
                pf: 'Défauts de page maîtrisés',
                pfOk: 'PF début ~{start}, fin {end}',
                pfBad: 'PF continuent d’augmenter ({end})',
                frag: 'Fragmentation du HDD corrigée',
                fragDetail: '{start} % → {end} %',
                ssd: 'Migration vers SSD (facultative)',
                ssdOk: 'HDD → SSD',
                ssdNo: 'Toujours en HDD',
                temp: 'Température et refroidissement normalisés',
                tempOk: '{start} °C → {end} °C, refroid. {cool} %',
                tempDetail: '{start} °C → {end} °C',
                disk: 'Espace disque récupéré',
                diskOk: 'Libre {start}→{end} Go',
                diskBad: 'Libre {end} Go, déchets {junk} Mo',
                net: 'Connectivité réseau restaurée',
                netOk: 'Réseau OK',
                netBad: 'Toujours hors ligne',
                boot: 'Démarrage optimisé',
                bootPartial: 'Démarrage partiellement optimisé',
                bootDetail: 'Boot {start} s → {end} s',
                bootDetailPartial: '{boot} s, processus problématiques actifs',
                heavy: 'Processus lourds inutiles maîtrisés',
                heavyOk: 'CPU fin ~{cpu} %',
                heavyBad: 'CPU ~{cpu} %',
                diag: 'Utilisation des outils de diagnostic',
                diagOk: '{n} outils : {tools}',
                diagSome: 'Seulement : {tool}',
                diagNone: 'Aucun outil de diagnostic utilisé',
                before: 'Diagnostic avant intervention',
                beforeOk: 'A observé le système avant de réparer',
                beforeBad: 'A utilisé des outils mais a réparé avant de diagnostiquer',
                beforeNone: 'Aucune preuve de diagnostic préalable',
                verify: 'Vérification après réparation',
                verifySnapshots: 'A utilisé des instantanés',
                verifyMetrics: 'A revu les métriques ensuite',
                verifyBad: 'N’a pas vérifié le résultat',
                budget: 'Gestion du budget',
                budgetOk: 'A dépensé ${spent} sur ${total} sans dépasser',
                budgetNo: 'N’a investi le budget dans aucune amélioration',
                budgetRam: 'A priorisé l’amélioration la plus efficace (RAM)',
                budgetRamOk: 'RAM {start} → {end} Mo',
                budgetRamBad: 'Le principal goulot d’étranglement était la RAM',
                wrong: 'Éviter les actions incorrectes',
                wrongOk: 'Aucune intervention nuisible détectée',
                wrongKilled: 'a fermé l’antivirus',
                wrongSSD: 'a tenté de défragmenter le SSD',
                eff: 'Efficacité de l’intervention',
                effOk: '{actions} actions en {minutes} min {seconds} s',
                effSome: '{actions} actions (vérifier les étapes superflues)',
                effNone: 'Aucune action enregistrée'
            }),
            report: Object.assign({}, es.exam.report, {
                title: 'RetroOS 3.0 — Rapport d’évaluation',
                data: 'Données de l’examen',
                course: 'Cours :',
                division: 'Classe :',
                modality: 'Modalité :',
                groupMode: 'Groupe ({n} élèves)',
                individual: 'Individuel',
                students: 'Élève(s) :',
                scenario: 'Scénario :',
                difficulty: 'Niveau de difficulté :',
                start: 'Début :',
                end: 'Fin :',
                duration: 'Durée :',
                score: 'SCORE :',
                scoreLine: 'SCORE : {score} % ({points}/{max} points) — Santé {start} % → {end} %',
                shared: 'Le score est partagé par tous les membres du groupe.',
                observations: 'Observations de l’enseignant',
                noObservations: '(sans observations)',
                criteria: 'Critères d’évaluation',
                actions: 'Actions enregistrées ({n})',
                none: '(aucune)',
                generated: 'Généré par RetroOS 3.0 — {date}',
                noName: 'Sans nom',
                group: 'Groupe',
                student: 'Élève',
                manualTitle: 'RetroOS 3.0 — Manuel d’utilisation et de diagnostic',
                manualS1: '1. Guide pour les élèves',
                manualS2: '2. Guide pour les enseignants',
                manualS3: '3. Outils système',
                manualS4: '4. Scénarios pédagogiques (1 à 12)',
                txtCourse: 'Cours :',
                txtDivision: 'Classe :',
                txtLevel: 'Niveau de difficulté :',
                txtDuration: 'Durée :',
                txtStartHealth: 'Santé initiale :',
                txtFinalHealth: 'Santé finale :',
                txtScore: 'SCORE :',
                txtPoints: 'points',
                txtObservations: '--- Observations de l’enseignant ---',
                txtCriteria: '--- Critères ---',
                txtActions: '--- Actions enregistrées ({n}) ---',
                txtInitial: '--- État initial ---',
                txtFinal: '--- État final ---',
                txtGenerated: 'Généré par RetroOS 3.0',
                csvGroup: 'Groupe',
                csvIndividual: 'Individuel'
            })
        }
    });
})();
