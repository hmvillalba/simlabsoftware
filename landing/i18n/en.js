// landing/i18n/en.js — Landing page texts in English.
//
// The Spanish dictionary (landing/i18n/es.js) is the source of truth and the
// fallback. Every key here must exist there with the same name.
window.LANDING_DICTS = window.LANDING_DICTS || {};
window.LANDING_DICTS.en = {
    _meta: { name: 'English', dir: 'ltr' },

    meta: {
        title: 'SimLab Software — Operating system troubleshooting simulator',
        description: 'Free educational simulator, no install needed: troubleshoot a PC with RAM, CPU, disk, heat, malware and network faults. 12 scenarios, teacher panel and exam mode.',
        ogImageAlt: 'Simulator desktop with the Task Manager and Hardware Monitor windows open'
    },

    nav: {
        langLabel: 'Language',
        features: 'Features',
        scenarios: 'Scenarios',
        teachers: 'For teachers',
        start: 'Get started',
        support: 'Support',
        repo: 'Repository',
        simulator: 'Open simulator'
    },

    hero: {
        badge: 'Free · No install · Works offline',
        title: 'Learn PC troubleshooting by breaking things a little',
        lead: 'SimLab Software is a desktop simulator with a Windows 98 look: students open a faulty PC, read RAM, CPU, disk and temperature, and fix the problem with real maintenance tools.',
        ctaPrimary: 'Open simulator',
        ctaSecondary: 'View the code',
        note: 'Runs in the browser, and also from a folder or a USB stick, with no server and no connection.'
    },

    features: {
        title: 'What you get',
        lead: 'A full maintenance lab inside the browser, with no licences or accounts.',
        f1Title: 'A simulated operating system',
        f1Text: 'Desktop, draggable windows, taskbar and live-generated retro sounds. Every action is written to an audit log.',
        f2Title: 'Metrics that react',
        f2Text: 'RAM and swap with page faults and thrashing, temperature and thermal throttling, disk fragmentation, network traffic and a system health score.',
        f3Title: 'Technician tools',
        f3Text: 'Task Manager, Page Table, Hardware Monitor, Defragmenter, Disk Cleaner, MSConfig, Hardware Shop and a CMD console.',
        f4Title: 'Ready for the classroom',
        f4Text: '12 faulty scenarios, a fault injector for the teacher, a timed exam mode and reports exported to PDF, CSV or TXT.'
    },

    shots: {
        title: 'How it looks',
        lead: 'Screenshots of the real simulator, on desktop and on a phone.',
        desktopCaption: 'The RetroOS 3.0 desktop with Task Manager, Page Table and Hardware Monitor open.',
        mobileCaption: 'The same interface on a phone: windows rearrange and the bar gets compact.',
        altDesktop: 'Simulator desktop with the process, paging and hardware monitor windows',
        altMobile: 'Simulator view on a phone with the windows stacked'
    },

    scenarios: {
        title: 'Twelve faults to diagnose',
        lead: 'Each scenario ships with symptoms, altered metrics and an expected correction guide.',
        s1Title: 'Full case',
        s1Text: 'Low RAM, malware, a fragmented disk and high temperature on the same machine.',
        s2Title: 'Thrashing',
        s2Text: 'Rising page faults and a full swap file: there is not enough physical memory.',
        s3Title: 'Cybersecurity',
        s3Text: 'A process imitating a system binary eats CPU and network in the background.',
        s4Title: 'Hardware and disk',
        s4Text: 'Extreme fragmentation, temporary files and poor cooling.',
        s5Title: 'Slow boot',
        s5Text: 'Too many startup programs: the machine takes minutes to become usable.',
        s6Title: 'CPU saturation',
        s6Text: 'A heavy process takes the whole CPU even though plenty of RAM is free.',
        more: 'Scenarios 7 to 12 cover HDD versus SSD, overheating, a nearly full disk, software conflicts, network faults and an upgrade on a limited budget.',
        tableTitle: 'How a case is solved',
        colSymptom: 'Symptom',
        colTool: 'Tool',
        colFix: 'Fix',
        r1Symptom: 'The PC crawls and the disk never stops working',
        r1Tool: 'Page Table',
        r1Fix: 'Add physical RAM in the Hardware Shop and check that page faults drop',
        r2Symptom: 'High CPU and network with no user activity',
        r2Tool: 'Task Manager / CMD',
        r2Fix: 'Find and kill the malicious process, then remove it from startup with MSConfig',
        r3Symptom: 'It shuts down or slows after a few minutes',
        r3Tool: 'Hardware Monitor',
        r3Fix: 'Check cooling efficiency and confirm the temperature comes down',
        r4Symptom: 'The disk is full and everything is slow',
        r4Tool: 'Disk Cleaner / Defragmenter',
        r4Fix: 'Delete temporary files, defragment the HDD and verify the free space'
    },

    teachers: {
        title: 'For teachers',
        lead: 'The material to teach with already ships inside the simulator.',
        p1Title: 'Protected access',
        p1Text: 'The teacher panel opens with a password stored as a SHA-256 hash, and it can be changed on first login.',
        p2Title: 'Fault injector',
        p2Text: 'During class you can trigger overheating, swap pressure, a heavy process or malware and watch each group react.',
        p3Title: 'Automatic grading',
        p3Text: 'Exam mode scores both results and procedure: what was diagnosed, what was fixed and in which order.',
        classTitle: 'A 45-minute lesson',
        class1: 'Pick a scenario, load it and project the desktop while you explain the symptoms.',
        class2: 'Each group measures with the Hardware Monitor and the Page Table before touching anything.',
        class3: 'Students fix the fault with the tools and verify the result in CMD.',
        class4: 'Close with the correction guide and the notes the teacher panel leaves behind.',
        rubricTitle: 'The rubric the exam applies',
        rubric1: 'Results: malware removed, enough RAM, temperature and disk in range, network working.',
        rubric2: 'Procedure: use the right tools and never defragment an SSD.',
        rubric3: 'Order: diagnose before fixing and verify after every change.',
        rubric4: 'Group work: up to 8 students per team, with course and division in the report.'
    },


    start: {
        title: 'Get started in a minute',
        lead: 'No sign-up, no install and no dependency on the classroom connection.',
        s1Title: 'Open the simulator',
        s1Text: 'It opens in the browser and that is it: no accounts, no downloads.',
        s2Title: 'Pick a scenario',
        s2Text: 'Scenario 1 is already loaded at startup; the rest are picked from the mission panel.',
        s3Title: 'Save your work',
        s3Text: 'Progress stays in the browser and the exam report exports to PDF, CSV or TXT.',
        cmdTitle: 'A console to practise',
        cmdText: 'The simulator CMD understands the commands a real repair shop uses:'
    },

    repo: {
        title: 'Open source',
        lead: 'The project is MIT: use it in class, change it and share it.',
        license: 'MIT licence',
        contribute: 'How to contribute',
        issues: 'Report a bug',
        support: 'Support the project',
        star: 'Star it on GitHub'
    },

    support: {
        title: 'Support the project',
        lead: 'The simulator is free and ad-free. If it helps you teach, these are the ways to give back.',
        mentionTitle: 'Mention the project',
        mentionText: 'Tell colleagues and students where you got it, or share the link in your class material.',
        starTitle: 'Leave a star',
        starText: 'A star on GitHub helps other teachers find it.',
        donateTitle: 'Donation (optional)',
        donateText: 'If you like the simulator, a mention or a donation for the author is up to you.',
        cafecito: 'Buy me a coffee',
        kofi: 'Support on Ko-fi',
        donateNote: 'Cafecito: Argentina and Mercado Pago · Ko-fi: international.'
    },

    rights: {
        title: 'Licence and rights',
        license: 'Distributed under the MIT License',
        donation: 'If you like the simulator, a mention or a donation for the author is up to you.',
        mit: 'The code may be used, copied, modified and redistributed, including in class, keeping the copyright notice. It is provided as is, without warranty.',
        read: 'Read the full licence'
    },

    footer: {
        madeBy: 'Made by Hugo Martín Villalba',
        rights: '© {year} Hugo Martín Villalba · MIT licence',
        otherLanguages: 'Other languages'
    }
};

