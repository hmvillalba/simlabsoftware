// lang/runtime/en.js — runtime texts in English.
//
// Starts from the Spanish base and overrides the sections that are translated,
// so a missing override never leaves a key undefined. tools/test_i18n.mjs
// checks key parity after js/runtime-dict.js flattens both dictionaries.
window.SIM_RUNTIME = window.SIM_RUNTIME || {};
(function () {
    var es = window.SIM_RUNTIME.es;
    window.SIM_RUNTIME.en = Object.assign({}, es, {
        scen: {
            1: {
                name: '1 (Full Case)',
                s: [
                    'Extreme generalized slowdown across the system.',
                    'High CPU usage and a congested graphical interface.',
                    'Constant hard drive reads (continuous scratching).',
                    'CPU temperature above the safe threshold.'
                ],
                p: [
                    "1. Open Task Manager or the CMD Console and end the malicious process 'svchost_fake.exe' (PID 666).",
                    '2. Go to the Hardware Shop and expand RAM to 1.5 GB or 2.5 GB.',
                    '3. Open the C: Disk Defragmenter and run a full defragmentation.',
                    '4. Open Disk Cleaner to scan for and remove temporary files.',
                    '5. Open MSConfig and disable unnecessary startup services.'
                ]
            },
            2: {
                name: '2 (Thrashing and Virtual Memory)',
                s: [
                    'Slow response times when switching between windows.',
                    'Continuously high page fault count.',
                    'Extremely full swap mapping in the Page Table.',
                    'The hard drive never stops transferring data.'
                ],
                p: [
                    "1. Diagnose the saturation in the 'Page Table / VMem Inspector' window.",
                    '2. Open Task Manager to identify excessive RAM usage.',
                    '3. Go to the Hardware Shop and increase physical RAM to 1.5 GB or more.',
                    '4. Verify in the VMem Inspector that page faults stop.'
                ]
            },
            3: {
                name: '3 (Cybersecurity and Audit)',
                s: [
                    'Anomalous, high background network traffic (>100 KB/s).',
                    'A suspicious process running while imitating a system binary.',
                    'Persistent 45% or higher processor usage or spikes.'
                ],
                p: [
                    '1. Open Task Manager or CMD and check the Network Traffic / CPU column.',
                    "2. Identify the process 'svchost_fake.exe' (PID 666).",
                    '3. End the process via the GUI or CMD: taskkill /PID 666.',
                    "4. Open MSConfig and uncheck 'svchost_fake.exe' from the startup list."
                ]
            },
            4: {
                name: '4 (Hardware and Disk Maintenance)',
                s: [
                    'Critical processor temperature warning (>80°C).',
                    'Extremely slow file reads due to scattered sectors.',
                    'Storage capacity occupied by massive temporary junk.'
                ],
                p: [
                    '1. Inspect System Properties / Metrics to detect the critical temperature.',
                    "2. Run 'Disk Cleaner' to clean temporary files.",
                    "3. Run 'Defragmenter C:' to reorganize fragmented blocks.",
                    '4. Confirm the temperature drop and restored system health.'
                ]
            },
            5: {
                name: '5 (Slow Windows Startup)',
                s: [
                    'The system takes more than 2 minutes to become usable after logging in.',
                    'Several processes load automatically at startup.',
                    'High CPU usage during the first minutes.',
                    'The disk shows intense activity at startup.'
                ],
                p: [
                    '1. Open MSConfig and review the startup program list.',
                    "2. Disable 'LegacyUpdater98.exe' and other unnecessary services.",
                    '3. Verify in Task Manager that startup consumption dropped.',
                    '4. Confirm that the simulated boot time is significantly reduced.'
                ]
            },
            6: {
                name: '6 (CPU Saturation)',
                s: [
                    'The computer responds slowly even though RAM is available.',
                    'CPU near 100% for prolonged periods.',
                    'One process concentrates most of the processor usage.',
                    'Applications take a long time to respond to clicks and window changes.'
                ],
                p: [
                    '1. Open Task Manager and sort/review the CPU column.',
                    '2. Identify the heavy process (RenderEngine3D or similar) saturating the CPU.',
                    '3. End the unnecessary process via the GUI or CMD.',
                    '4. Verify that CPU usage and temperature drop to normal levels.'
                ]
            },
            7: {
                name: '7 (Slow HDD vs SSD)',
                s: [
                    'Very high program and file loading times.',
                    'High latency in random read/write operations.',
                    'Disk access becomes expensive during paging.',
                    'RAM is not saturated; storage is the bottleneck.'
                ],
                p: [
                    '1. Check System Properties and confirm the disk is an HDD.',
                    '2. Observe fragmentation and disk response times.',
                    '3. Go to the Hardware Shop and simulate the switch to SSD (if the budget allows).',
                    '4. Compare before/after behavior: boot and load times.'
                ]
            },
            8: {
                name: '8 (Cooling-related Overheating)',
                s: [
                    'The processor temperature exceeds 85-90°C under moderate load.',
                    'The system automatically reduces frequency (thermal throttling).',
                    'Applications become slower after several minutes.',
                    'The simulated fan runs below what is needed.'
                ],
                p: [
                    '1. Observe the temperature in the Mission Panel and System Properties.',
                    '2. Identify that the problem is cooling-related (low coolingEfficiency).',
                    '3. Simulate cooling maintenance (command or thermal cleaning action).',
                    '4. Verify that the temperature drops and the thermal throttle disappears.'
                ]
            },
            9: {
                name: '9 (Disk Almost Full)',
                s: [
                    'The disk has less than 10% free space.',
                    'Some write operations fail or are very slow.',
                    'There are hundreds of MB of temporary files and junk.',
                    'The system warns about insufficient space.'
                ],
                p: [
                    '1. Open Disk Cleaner and run the temporary file analysis.',
                    '2. Clean the junk files found.',
                    '3. Check the recovered free space in System Properties / metrics.',
                    '4. Confirm that write operations work normally again.'
                ]
            },
            10: {
                name: '10 (Software Conflict)',
                s: [
                    'Two applications cause intermittent delays when run together.',
                    'One of them works fine in isolation.',
                    'CPU spikes and frequent disk accesses appear.',
                    'The problem is not a lack of RAM or disk space.'
                ],
                p: [
                    "1. Open Task Manager and observe the process 'OldOfficeHelper.exe'.",
                    '2. Compare behavior with and without that process running.',
                    '3. End or disable the conflicting process from MSConfig or Task Manager.',
                    '4. Verify that the intermittent delays disappear.'
                ]
            },
            11: {
                name: '11 (Network Problems)',
                s: [
                    'Websites cannot be reached even though the cable/network seems connected.',
                    'Network traffic is irregular or absent in some cases.',
                    'Possible DNS, gateway or IP configuration problem.',
                    'The rest of the system (CPU/RAM/Disk) works normally.'
                ],
                p: [
                    "1. Open the CMD Console and run 'ipconfig' or 'network' to view the status.",
                    '2. Identify the type of failure (DNS / Gateway / IP).',
                    '3. Run the simulated network repair command (netfix or repair).',
                    '4. Verify that connectivity is restored and traffic returns to normal.'
                ]
            },
            12: {
                name: '12 (Upgrade on a Limited Budget)',
                s: [
                    'The computer is slow due to a combination of low RAM and an HDD.',
                    'Slightly high temperature and moderate fragmentation.',
                    'The upgrade budget is limited (only one main component can be improved).',
                    'You must choose the upgrade with the best cost-benefit ratio.'
                ],
                p: [
                    '1. Diagnose the main bottleneck (RAM vs Disk vs Temp).',
                    '2. Check the available budget in the Hardware Shop.',
                    '3. Choose the most effective upgrade based on the diagnosis (RAM is the priority here).',
                    '4. Apply the improvement and verify the real impact on performance metrics.'
                ]
            }
        },
        help: {
            alumno: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Student Guide</h2>
        <p><b>What is RetroOS?</b> It is a Windows 98-style virtual lab. The simulated PC has problems (low RAM, malware, full disk, high temperature, etc.). Your job is to <b>diagnose</b>, <b>repair</b> and <b>verify</b> that it improved.</p>
        <p class="font-bold text-emerald-800">Recommended method</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Read the symptoms in the <b>Mission Panel</b> (if visible).</li>
            <li>Open tools: Task Manager, HW Monitor, Page Table, Properties, CMD.</li>
            <li>Form a hypothesis (is it RAM? malware? disk? heat?).</li>
            <li>Apply a concrete solution.</li>
            <li>Verify the metrics or capture a snapshot in the HW Monitor.</li>
        </ol>
        <p class="font-bold text-emerald-800">What you can do</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>End processes (Task Manager or <code>taskkill</code> in CMD).</li>
            <li>Expand RAM, migrate to SSD or improve cooling (Hardware Shop).</li>
            <li>Defragment the HDD, clean temporary files, disable startup programs (MSConfig).</li>
            <li>Repair the network with <code>ipconfig</code> / <code>netfix</code>.</li>
            <li>Play games or open heavy programs to see the impact on memory.</li>
        </ul>
        <p class="font-bold text-amber-800">In exam mode</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>The Mission Panel is hidden: investigate on your own.</li>
            <li>You cannot change scenarios.</li>
            <li>There is a red timer at the top.</li>
            <li>No need to guess: use the tools and leave evidence of what you did.</li>
        </ul>
        <p class="text-gray-600">Tip: do not expand RAM without first checking whether there is a malicious process or the CPU is saturated. Every problem has its cause.</p>
    `,
            docente: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Teacher Guide</h2>
        <p><b>Access:</b> Teacher Panel icon or Start menu. Initial password <code>1234</code> (it must be changed on first access). It is stored encrypted (SHA-256 with salt) in the browser. For a password students cannot erase, define <code>FIXED_TEACHER_HASH</code> in the file.</p>
        <p class="font-bold text-emerald-800">Teacher panel — features</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li><b>Change</b> the access <b>password</b>.</li>
            <li><b>Sign out as teacher</b> (it asks for the password again).</li>
            <li><b>Student-only mode</b>: hides the desktop icon; access remains through Start + password.</li>
            <li><b>12 teaching scenarios</b> with symptoms and correction guide.</li>
            <li><b>Fault injector</b>: overheating, swap, heavy process, malware.</li>
            <li><b>Exam mode</b>: student(s), course, division, level 1–3, timer, automatic evaluation.</li>
            <li><b>Teacher observations</b> in the report.</li>
            <li><b>Export</b> the report as TXT, CSV or PDF.</li>
            <li><b>Evaluation history</b> (stored in this browser; view / re-export).</li>
        </ul>
        <p class="font-bold text-emerald-800">Suggested exam flow</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Choose a scenario and load it.</li>
            <li>Fill in course, division and add student(s) (up to 8 per group).</li>
            <li>Level: 1 guided · 2 technical · 3 professional (no hints).</li>
            <li>Start Exam → mission panel hidden, scenarios locked, banner + timer.</li>
            <li>When finished: Finish and Grade → score and criteria.</li>
            <li>Optional: observations → Export PDF.</li>
            <li>Cancel / Unlock exits without a score.</li>
        </ol>
        <p class="font-bold text-amber-800">Automatic evaluation</p>
        <p>It scores results (malware, RAM, temp, disk, network, etc.) and procedure (tool usage, diagnosing before repairing, verifying afterwards, avoiding mistakes such as defragmenting an SSD).</p>
    `,
            herramientas: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">System Tools</h2>
        <ul class="list-disc list-inside space-y-1">
            <li><b>Task Manager:</b> processes, RAM, CPU, network; end tasks.</li>
            <li><b>Page Table / VMem:</b> RAM vs SWAP frames and page faults (thrashing).</li>
            <li><b>Hardware Monitor:</b> RAM/CPU/temp/disk bars and sparklines, fan, before/after snapshots.</li>
            <li><b>Defragmenter:</b> HDD only. On SSD it warns that it does not apply.</li>
            <li><b>Disk Cleaner:</b> analyzes and cleans temporary files; recovers space.</li>
            <li><b>MSConfig:</b> startup programs (includes malware and heavy services).</li>
            <li><b>Hardware Shop:</b> RAM, SSD, cooling.</li>
            <li><b>CMD:</b> help, tasklist, taskkill, mem, systeminfo, defrag, ipconfig, netfix, coolfix.</li>
            <li><b>Browser / Games / Player:</b> generate real resource load.</li>
            <li><b>Mission Panel:</b> symptoms and metrics (hidden during exams).</li>
            <li><b>Manual / Help:</b> this window; exportable to PDF.</li>
        </ul>
        <p class="font-bold text-emerald-800">Useful CMD commands</p>
        <p class="font-mono text-[11px] bg-gray-100 p-2 border">help · tasklist · taskkill /PID 666 · mem · systeminfo · defrag · ipconfig · netfix · coolfix · cls</p>
    `,
            escenarios: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Scenarios 1 to 12</h2>
        <ol class="list-decimal list-inside space-y-1">
            <li><b>Full case:</b> RAM + malware + fragmentation + temperature.</li>
            <li><b>Thrashing / VMem:</b> low RAM, page faults, full swap.</li>
            <li><b>Cybersecurity:</b> svchost_fake.exe, anomalous CPU and network.</li>
            <li><b>Hardware and disk:</b> high frag., junk, overheating.</li>
            <li><b>Slow startup:</b> many startup programs.</li>
            <li><b>Saturated CPU:</b> heavy process; RAM is not the bottleneck.</li>
            <li><b>HDD vs SSD:</b> disk latency; option to migrate to SSD.</li>
            <li><b>Overheating:</b> poor cooling and thermal throttle.</li>
            <li><b>Disk almost full:</b> little free space and temporary files.</li>
            <li><b>Software conflict:</b> applications interfering with each other.</li>
            <li><b>Network problems:</b> DNS/IP; repair with CMD.</li>
            <li><b>Limited budget:</b> choose the best hardware upgrade.</li>
        </ol>
        <p class="text-gray-600 mt-2">In level 3 exams the student does not see the guide or the symptom panel: they must discover the cause with the tools.</p>
    `
        },
        alert: {
            scenarioLocked: 'Scenarios are locked during the exam.\nUse "Cancel / Unlock" or "Finish and Grade" to change scenarios.',
            gameStarted: 'Starting {name}... Watch the impact on RAM/Swap in the Mission Panel and Task Manager.',
            ssdDefrag: 'The simulated drive is an SSD. Defragmenting it like an HDD is not recommended; use the system optimization/TRIM instead.',
            budgetInsufficient: 'Insufficient budget.\n{label} costs ${cost} and only ${remaining} is left.',
            auditCopied: 'Step-by-step audit report copied to the clipboard.',
            auditCopyManual: 'Copied manually:\n{report}',
            teacherExamActive: 'An exam is in progress. Finish or cancel it before signing out of the teacher session.',
            teacherLoggedOut: 'Teacher session closed.\nThe password is required to sign in again.',
            historySaveFailed: 'Could not save the history in this browser. Export the reports (PDF/CSV) so you do not lose them.',
            clearHistory: 'Clear the ENTIRE evaluation history stored in this browser? This action cannot be undone.',
            teacherPassSaveFailed: 'Could not save the password in this browser (localStorage blocked).',
            initialPass: 'You are using the initial password (1234).\nChange it now: you will not be able to start exams until you do.',
            loginLocked: 'Too many attempts. Wait {seconds} s.',
            loginWrong: 'Wrong password. Try again.',
            examNoAddStudents: 'Students cannot be added during the exam.',
            examStudentName: 'Enter the student name.',
            examStudentDuplicate: 'That student is already in the list.',
            examStudentMax: 'Maximum 8 students per group exam.',
            examChangePass: 'Change the initial teacher password before starting an exam.',
            examAlreadyRunning: 'An exam is already in progress. Finish or cancel it first.',
            examNeedStudent: 'Add at least one student (or a group) before starting the exam.',
            examStarted: 'Exam Mode enabled\n\n{group}Students:\n• {students}\n\n• Red banner + timer\n• Mission Panel hidden\n• Scenarios locked',
            examNoRunning: 'There is no exam in progress.',
            examCancelConfirm: 'Cancel the exam without grading?\n\nThe Mission Panel will be restored and scenarios unlocked.\nNo score will be generated.',
            examCancelled: 'Exam cancelled.\nMission Panel restored.\nScenarios unlocked.',
            examNoReport: 'There is no exam report. Start and finish an exam first.',
            pdfUnavailable: 'The PDF library could not be loaded. Check the internet connection or use Export Report (.txt).',
            pdfUnavailableSimple: 'The PDF library could not be loaded. Check the internet connection.'
        },
        app: {
            'win-browser': 'Web Browser',
            'win-player': 'Retro Player',
            'win-games': 'Games',
            'win-calc': 'Calculator',
            'win-sysprops': 'My Computer',
            'win-taskmgr': 'Task Admin',
            'win-vmem': 'Page Table',
            'win-defrag': 'Defrag Disk',
            'win-cleaner': 'Disk Cleaner',
            'win-msconfig': 'MSConfig',
            'win-nanoedit': 'Notepad',
            'win-ramshop': 'Hardware RAM',
            'win-cmd': 'CMD Console',
            'win-teacher': 'Teacher Panel',
            'win-hwmon': 'HW Monitor',
            'win-help': 'Manual / Help'
        },
        ui: Object.assign({}, es.ui, {
            resizeGrip: 'Drag to resize',
            playerPause: 'Pause',
            playerPlay: 'Play',
            defragProcessing: 'Processing...',
            defragOptimized: '{pct}% (Optimized)',
            cleanerFound: 'Found {mb} MB of temporary and junk files.',
            cleanerFree: 'Current estimated free space: {gb} GB',
            cleanerDone: 'Cleanup finished. Recovered ~{mb} MB.',
            vmemUsed: '{used} MB Used ({usedFrames}/{totalFrames} Frames)',
            vmemPaged: '{mb} MB Paged to Disk',
            vmemFreeFrame: 'FREE',
            taskmgrEnd: 'End',
            taskmgrClose: 'Close',
            budgetLimited: 'Budget: ${remaining} of ${total} available (spent: ${spent})',
            budgetUnlimited: 'No budget limit in this scenario. Spent: ${spent}',
            shopCooling: 'Cooling maintenance',
            correctionHide: 'Hide Guide',
            correctionShow: 'View Guide',
            lockedDuringExam: 'Locked during the exam',
            examCourseDiv: 'Course/Div: ',
            on: 'Enabled',
            off: 'Disabled',
            disconnected: 'disconnected',
            hwmonHigh: 'High',
            hwmonMedium: 'Medium',
            hwmonLow: 'Low',
            hwmonYes: 'YES ⚠',
            hwmonNo: 'No',
            statusNoConnection: 'NO CONNECTION',
            statusOk: 'OK',
            statusFail: 'FAIL',
            statusYes: 'YES',
            statusNo: 'NO',
            propsRam: 'RAM: {mb} MB SDRAM',
            propsDisk: 'Disk {type}: Frag {frag}% | Free {free} GB',
            propsTemp: 'Temperature: {temp}°C | Cooling: {cool}%',
            browserHomeTitle: 'SuperSearch 98',
            browserSearchPlaceholder: 'Search the web...',
            browserSearchBtn: 'Search',
            browserSites: 'Recommended Sites:',
            browserNewsLink: '90s Tech News',
            browserHeavyLink: '3D/HD Web Portal (heavy RAM load +350MB)',
            browserNewsTitle: 'Tech News Portal',
            browserNewsBody1: 'New SDRAM modules promise to eliminate paging (swapping) problems!',
            browserNewsBody2: 'Tip: keep an eye on Task Manager if you notice slowdowns.',
            browserHeavyTitle: 'Loading a heavy web portal with scripts and 3D rendering!',
            browserHeavyBody1: 'This tab is consuming {mb} MB of additional RAM.',
            browserHeavyBody2: 'See how the system starts paging to disk (Swap/PageFaults) when there is not enough physical memory.',
            compareEmpty: 'Capture an initial state and another after intervening to compare.',
            compareOne: 'State captured at <b>{time}</b> — Health: {health}<br>RAM {ramUsed}/{ram} MB | CPU {cpu}% | Temp {temp}°C | Frag {frag}% | Free {free} GB | Boot {boot}s',
            compareSecond: 'Capture a second state to see the comparison.',
            compareMetric: 'Metric',
            compareBefore: 'Before ({time})',
            compareAfter: 'After ({time})',
            compareHealth: 'Health',
            compareRamUsed: 'RAM used',
            compareTemp: 'Temperature',
            compareFrag: 'Fragmentation',
            compareFree: 'Free space',
            compareBoot: 'Boot time',
            compareCool: 'Cooling',
            historyEmpty: 'No evaluations saved yet.',
            historyView: 'View',
            historyLoaded: 'History #{n} loaded — ready to re-export.',
            historyCourseDivision: 'Course/Division: {course} {division}',
            historyGroup: 'Group',
            historyStudent: 'Student',
            historyScore: 'Score: {score}% · Scenario {scenario} · {time}',
            historyObservations: 'Observations:',
            studentsNone: 'No students added',
            studentsRemove: 'Remove',
            studentsCount: '{n} students',
            groupDiv: 'Div. {div}',
            resultsCourseDivision: 'Course/Division: {course} {division}',
            resultsGroup: 'Group ({n})',
            resultsStudent: 'Student',
            resultsExcellent: 'Excellent',
            resultsPassed: 'Passed',
            resultsRegular: 'Fair',
            resultsInsufficient: 'Insufficient',
            resultsResult: 'Result: {pct}% — {label}',
            resultsObservations: 'Observations:',
            resultsCriteria: 'Criterion',
            resultsState: 'Status',
            resultsDetail: 'Detail',
            examStatusCancelled: 'Exam cancelled (no evaluation). Scenarios unlocked.',
            examStatusRunning: 'EXAM IN PROGRESS · {group}{students} · Sc. {scenario} · Lv {level} · Initial health: {health}%',
            examStatusRestored: 'EXAM IN PROGRESS (restored after reload) · {group}{students} · Sc. {scenario} · Lv {level} · Initial health: {health}%',
            examStatusFinished: 'EXAM FINISHED · {mode}: {name} · {course}Score: {score}% · Time: {time}',
            examBanner: '{group}{names} · Sc. {scenario} · Lv {level}'
        }),
        cmd: {
            help: 'Commands: help, tasklist, taskkill /PID <id>, taskkill /IM name.exe, kill name.exe, mem, defrag, systeminfo, ipconfig, netfix, coolfix, cls',
            notFound: "'{cmd}' is not recognized as an internal or external command.",
            terminated: 'Process terminated successfully.',
            processNotFound: 'The specified process was not found.',
            mem: 'Total Memory: {ram} MB | Swap active: {swap} | Page Faults: {pf}',
            defragStart: 'Starting defragmentation from the command line...',
            systeminfo: 'RetroOS 3.0 | RAM: {ram}MB | Disk: {disk} ({free}GB free) | CPU Temp: {temp}°C | Network: {net}',
            ipconfigOk: 'Ethernet adapter: IP 192.168.1.45 | Mask 255.255.255.0 | Gateway 192.168.1.1 | DNS 8.8.8.8 [OK]',
            ipconfigFail: "Network failure detected: {issue}. Use 'netfix' to repair.",
            netOk: 'The network is already working correctly.',
            netFixed: 'Network repair completed (ipconfig /renew + flushdns). Connectivity restored.',
            coolfix: 'Simulated cooling maintenance. Efficiency now: {eff}%. Temp: {temp}°C.'
        },
        log: Object.assign({}, es.log, {
            scenarioChanged: 'Teacher switched to Scenario {name}.',
            scenarioInitial: 'Initial state: RAM {ram} MB | Disk {disk} | Frag {frag}% | Temp {temp}°C | Boot ~{boot}s | Free {free} GB',
            faultOverheat: '[TEACHER FAULT INJECTED] CPU overheating triggered (+35°C). Current temp: {temp}°C.',
            faultSwap: '[TEACHER FAULT INJECTED] Virtual Memory / Swap saturated (+450 MB simulated).',
            faultHeavy: "[TEACHER FAULT INJECTED] Heavy process 'RenderEngine3D_Benchmark.exe' launched (380 MB RAM, 40% CPU).",
            faultMalware: "[TEACHER FAULT INJECTED] Process 'svchost_fake.exe' (CryptoMiner) injected / enabled.",
            gameRun: '[GAMES] {name} was run, consuming {ram} MB of extra RAM.',
            correctionShown: 'Teacher displayed the Correction Guide.',
            browserHeavy: 'Web Browser loaded a heavy portal (+350 MB consumption).',
            ssdDefragAvoided: '[DIAGNOSIS] Defragmenting an SSD was avoided; the right action would be optimization/TRIM.',
            defragStart: 'HDD defragmentation started at {frag}% fragmentation.',
            defragDone: 'HDD defragmentation completed. Fragmentation: {from}% → {to}%.',
            cleanerScan: 'Temporary file scan finished.',
            cleanerDone: 'Temporary files removed by the student. Recovered {mb} MB.',
            msconfigToggle: "MSConfig: startup configuration changed for '{name}' (State: {state}).",
            killProcess: "[STUDENT ACTION] Ended process '{name}' (PID {pid}) via Task Manager.",
            killHeavy: "[STUDENT ACTION] Ended heavy process '{name}' via Task Manager.",
            purchaseRejected: '[STUDENT ACTION] Purchase rejected by budget: {label} (${cost}). Available: ${remaining}.',
            purchase: '[STUDENT ACTION] Purchase completed: {label} (${cost}).{extra}',
            purchaseRemaining: ' Remaining budget: ${remaining}.',
            ramUpgrade: '[STUDENT ACTION] Hardware updated: physical RAM expanded to {mb} MB.',
            diskSSD: '[STUDENT ACTION] Disk migrated to SSD. Fragmentation is no longer critical. Boot time reduced.',
            diskHDD: '[STUDENT ACTION] Disk configured as HDD.',
            cooling: '[STUDENT ACTION] Cooling maintenance performed. Efficiency: {eff}%. Temp: {temp}°C.',
            networkFix: '[STUDENT ACTION] Network repaired (ipconfig /renew + simulated DNS flush).',
            killProcessCmd: '[STUDENT ACTION] Process ended via CMD: {name} (PID {pid})',
            killHeavyCmd: '[STUDENT ACTION] Heavy process ended via CMD: {name}',
            cmdExec: '[CMD] Command executed: "{cmd}"',
            snapshot: '[MONITOR] Snapshot captured ({time}): RAM {ramUsed}/{ram} MB, CPU {cpu}%, Temp {temp}°C, Health {health}',
            snapshotsCleared: '[MONITOR] Comparison snapshots cleared.',
            difficulty: 'Difficulty level set: {level}',
            examStarted: '[EXAM] Started. Course: {course} Div: {division}. Students: {students}. Scenario {scenario}.',
            examCancelled: '[EXAM] Cancelled. Students: "{students}". No evaluation.',
            examFinished: '[EXAM] Finished. Score: {score}% ({points}/{max}). Duration: {duration}s.',
            exportTxt: '[EXAM] Report exported (.txt) — {name}',
            exportCsv: '[EXAM] CSV report exported — Student: {name}',
            exportPdf: '[EXAM] PDF report exported — {name}',
            helpPdf: '[HELP] User manual exported to PDF.',
            teacherLogout: '[TEACHER] Session closed. Password required again.',
            studentOnly: '[TEACHER] Student-only mode: {state}',
            studentOnlyOn: 'enabled (desktop icon hidden)',
            studentOnlyOff: 'disabled',
            sessionRestored: '[EXAM] Session restored after browser reload (idle ~{seconds}s). The timer continues from the original start.',
            historyCleared: '[TEACHER] Evaluation history cleared.',
            teacherAuth: 'Teacher Panel authenticated successfully.',
            windowOpen: "Opened window '{name}'.",
            windowClose: "Closed window '{name}'.",
            windowMinimize: "Minimized window '{name}'. The process is still running.",
            aboutOpen: 'Opened the About RetroOS 3.0 window.'
        }),
        exam: {
            crit: Object.assign({}, es.exam.crit, {
                healthHigh: 'System health ≥ 85%',
                healthNotable: 'System health improved notably',
                healthSlight: 'System health improved slightly',
                healthBase: 'System health',
                healthNoImprove: '{start}% → {end}% (not enough improvement)',
                malware: 'Malware removed',
                malwareKilled: 'svchost_fake.exe ended',
                malwareActive: 'Still active',
                persist: 'Malware persistence removed (MSConfig)',
                persistDisabled: 'Disabled at startup',
                persistNotDisabled: 'Process dead but not disabled at startup',
                persistNotFixed: 'Not fixed',
                memory: 'Memory pressure / thrashing resolved',
                memoryResolved: 'RAM {used}/{total} MB, swap off',
                memorySwap: 'Still swapping',
                memoryRam: 'RAM {used}/{total} MB',
                ramUpgrade: 'Adequate RAM upgrade',
                ramUpgradeDetail: '{start} → {end} MB',
                ramStill: 'Still at {end} MB',
                pf: 'Page faults under control',
                pfOk: 'PF start ~{start}, end {end}',
                pfBad: 'PF still rising ({end})',
                frag: 'HDD fragmentation fixed',
                fragDetail: '{start}% → {end}%',
                ssd: 'Migration to SSD (optional)',
                ssdOk: 'HDD → SSD',
                ssdNo: 'Still on HDD',
                temp: 'Temperature and cooling normalized',
                tempOk: '{start}°C → {end}°C, cool {cool}%',
                tempDetail: '{start}°C → {end}°C',
                disk: 'Disk space recovered',
                diskOk: 'Free {start}→{end} GB',
                diskBad: 'Free {end} GB, junk {junk} MB',
                net: 'Network connectivity restored',
                netOk: 'Network OK',
                netBad: 'Still offline',
                boot: 'Startup optimized',
                bootPartial: 'Startup partially optimized',
                bootDetail: 'Boot {start}s → {end}s',
                bootDetailPartial: '{boot}s, problematic processes still active',
                heavy: 'Unnecessary heavy processes controlled',
                heavyOk: 'CPU end ~{cpu}%',
                heavyBad: 'CPU ~{cpu}%',
                diag: 'Use of diagnostic tools',
                diagOk: '{n} tools: {tools}',
                diagSome: 'Only: {tool}',
                diagNone: 'No diagnostic tools were used',
                before: 'Diagnosis before intervening',
                beforeOk: 'Observed the system before repairing',
                beforeBad: 'Used tools but repaired before diagnosing',
                beforeNone: 'No evidence of prior diagnosis',
                verify: 'Verification after repair',
                verifySnapshots: 'Used snapshots',
                verifyMetrics: 'Reviewed metrics afterwards',
                verifyBad: 'Did not verify the result',
                budget: 'Budget management',
                budgetOk: 'Spent ${spent} of ${total} without exceeding it',
                budgetNo: 'Did not invest the budget in any improvement',
                budgetRam: 'Prioritized the highest-impact upgrade (RAM)',
                budgetRamOk: 'RAM {start} → {end} MB',
                budgetRamBad: 'The main bottleneck was RAM',
                wrong: 'Avoiding incorrect actions',
                wrongOk: 'No harmful interventions detected',
                wrongKilled: 'closed antivirus',
                wrongSSD: 'tried to defragment SSD',
                eff: 'Intervention efficiency',
                effOk: '{actions} actions in {minutes}m {seconds}s',
                effSome: '{actions} actions (check for extra steps)',
                effNone: 'No actions recorded'
            }),
            report: Object.assign({}, es.exam.report, {
                title: 'RetroOS 3.0 — Evaluation Report',
                data: 'Exam data',
                course: 'Course:',
                division: 'Division:',
                modality: 'Mode:',
                groupMode: 'Group ({n} students)',
                individual: 'Individual',
                students: 'Student(s):',
                scenario: 'Scenario:',
                difficulty: 'Difficulty level:',
                start: 'Start:',
                end: 'End:',
                duration: 'Duration:',
                score: 'SCORE:',
                scoreLine: 'SCORE: {score}%  ({points}/{max} points)  —  Health {start}% → {end}%',
                shared: 'The score is shared by all group members.',
                observations: 'Teacher observations',
                noObservations: '(no observations)',
                criteria: 'Evaluation criteria',
                actions: 'Recorded actions ({n})',
                none: '(none)',
                generated: 'Generated by RetroOS 3.0 — {date}',
                noName: 'No name',
                group: 'Group',
                student: 'Student',
                manualTitle: 'RetroOS 3.0 — User and Diagnostics Manual',
                manualS1: '1. Student Guide',
                manualS2: '2. Teacher Guide',
                manualS3: '3. System Tools',
                manualS4: '4. Teaching Scenarios (1 to 12)',
                txtCourse: 'Course:',
                txtDivision: 'Division:',
                txtLevel: 'Difficulty level:',
                txtDuration: 'Duration:',
                txtStartHealth: 'Initial health:',
                txtFinalHealth: 'Final health:',
                txtScore: 'SCORE:',
                txtPoints: 'points',
                txtObservations: '--- Teacher observations ---',
                txtCriteria: '--- Criteria ---',
                txtActions: '--- Recorded actions ({n}) ---',
                txtInitial: '--- Initial state ---',
                txtFinal: '--- Final state ---',
                txtGenerated: 'Generated by RetroOS 3.0',
                csvGroup: 'Group',
                csvIndividual: 'Individual'
            })
        }
    });
})();
