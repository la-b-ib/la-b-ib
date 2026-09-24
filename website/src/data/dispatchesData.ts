import { Dispatch } from '../types';

export const DISPATCHES_DATA: Dispatch[] = [
  {
    id: 'dsp-ebpf-ring-buffer',
    dispatchId: 'DSP-2026-088',
    title: 'How a Flawed Math Check in Linux eBPF Gives Ordinary Users Instant Root',
    category: 'kernel',
    severity: 'CRITICAL',
    date: 'AUG 2026',
    readTime: '4 MIN READ',
    summary: 'A subtle integer tracking mistake in the Linux kernel eBPF verifier allows unprivileged user programs to manipulate kernel memory pointers and grant themselves root privileges silently.',
    plainEnglish: 'Think of the kernel verifier like a bouncer checking guest IDs. A math glitch causes the bouncer to miscalculate pointer boundaries, letting an attacker write data outside their allowed room directly into kernel memory.',
    impact: 'Any unprivileged local user or container without user namespaces disabled can elevate to full UID 0 root in seconds.',
    mitreAttck: 'T1068 - Exploitation for Privilege Escalation',
    targetSystem: 'Linux Kernel 6.8+ / eBPF JIT Subsystem',
    findings: [
      'The eBPF verifier miscalculated the upper bounds of 64-bit scalar registers during ALU multiplication in bpf_ringbuf_reserve().',
      'This allowed an attacker to trick the JIT compiler into treating an out-of-bounds pointer as safe memory.',
      'By overwriting the task_struct->cred pointer in kernel memory, an unprivileged user process instantly assumed root (UID 0) privileges.',
    ],
    mitigations: [
      'Upgrade kernel to upstream patched version 6.8.9+ immediately.',
      'Disable unprivileged eBPF access system-wide: sysctl kernel.unprivileged_bpf_disabled=1.',
      'Deploy BPF LSM security policies to restrict map allocations to signed programs.',
    ],
    pocCommand: 'sudo sysctl -w kernel.unprivileged_bpf_disabled=1 && bpftool prog list',
    yaraRule: `rule Linux_eBPF_Memory_Exploit {
  meta:
    description = "Detects eBPF ring buffer privilege escalation artifacts"
    author = "Labib Bin Shahed"
    severity = "CRITICAL"
  strings:
    $bpf_call = { 48 89 5C 24 ?? 48 89 6C 24 ?? 4C 89 74 24 }
    $ringbuf_sig = "bpf_ringbuf_reserve"
    $mod_cred = { 48 8B ?? 48 89 ?? ?? ?? ?? 00 }
  condition:
    all of them
}`,
    iocs: {
      sha256: '9f83a4c281e7d018b43f9a721389e62f01a3b8d5e71029c384651a2d4f8b913e',
      filePaths: ['/sys/fs/bpf/ringbuf_exploit', '/tmp/.ebpf_payload.o'],
      networkIps: ['198.51.100.24'],
    },
    tags: ['eBPF', 'Linux Kernel', 'LPE', 'Memory Safety', 'Zero-Day'],
  },
  {
    id: 'dsp-volatility3-apt-investigation',
    dispatchId: 'DSP-2026-085',
    title: 'Ghost in the RAM: Catching In-Memory Stealth Malware with Volatility 3',
    category: 'dfir',
    severity: 'HIGH',
    date: 'JUL 2026',
    readTime: '5 MIN READ',
    summary: 'A step-by-step breakdown of how advanced threat actors hollow out legitimate Windows system processes to run malicious code exclusively in memory without saving a single file to disk.',
    plainEnglish: 'The attacker launches a normal Windows service (like the print spooler), empties its brain in RAM, and replaces it with malware. To the antivirus scanning the hard drive, everything looks completely normal.',
    impact: 'Bypasses standard file-based antivirus scanners and enables persistent command-and-control communication from trusted system binaries.',
    mitreAttck: 'T1055.012 - Process Hollowing',
    targetSystem: 'Windows Server 2022 / LSASS & Spooler Process Trees',
    findings: [
      'Volatility 3 malfind flagged spoolsv.exe (PID 2840) containing a Virtual Address Descriptor (VAD) tagged as PAGE_EXECUTE_READWRITE without a backing file on disk.',
      'Extracted raw memory pages revealed a reflective DLL loader decrypting a Cobalt Strike beacon in RAM.',
      'The malware hooked ntdll!NtProtectVirtualMemory to disguise memory permission changes from user-space EDR sensors.',
    ],
    mitigations: [
      'Enable Arbitrary Code Guard (ACG) to block dynamically generated executable code in core services.',
      'Deploy kernel-backed EDR sensors utilizing Microsoft Threat Intelligence (ETW-Ti) feeds.',
      'Perform periodic automated memory snapshots on critical domain controllers and jump hosts.',
    ],
    pocCommand: 'python3 vol.py -f memory.dmp windows.malfind.Malfind --pid 2840',
    yaraRule: `rule APT_Reflective_Memory_Loader {
  meta:
    description = "Detects in-memory reflective DLL loader headers"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $mz = { 4D 5A }
    $unhook = "NtProtectVirtualMemory"
    $stub = { 48 83 EC 28 48 8B 05 ?? ?? ?? ?? 48 85 C0 74 }
  condition:
    $mz at 0 and ($unhook and $stub)
}`,
    iocs: {
      sha256: '4a6b8c19d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
      filePaths: ['C:\\Windows\\System32\\spoolsv.exe [In-Memory VAD 0x7fff0000]'],
      networkIps: ['203.0.113.88', '198.51.100.99'],
    },
    tags: ['DFIR', 'Volatility 3', 'Process Hollowing', 'Memory Forensics', 'Incident Response'],
  },
  {
    id: 'dsp-eip-1153-transient-reentrancy',
    dispatchId: 'DSP-2026-081',
    title: 'Breaking Smart Contract Locks with EVM Transient Storage (EIP-1153)',
    category: 'offsec',
    severity: 'CRITICAL',
    date: 'JUN 2026',
    readTime: '5 MIN READ',
    summary: 'The Ethereum Cancun upgrade introduced cheap temporary storage (TSTORE/TLOAD). When developers use it for mutex locks without tracking inter-contract context, flash loans can bypass reentrancy defenses.',
    plainEnglish: 'Transient storage acts like a whiteboard that gets automatically erased when a transaction ends. If Contract A and Contract B share accounting logic but manage their whiteboards separately, an attacker can borrow millions in a flash loan and trick them mid-transaction.',
    impact: 'Complete drainage of pooled liquidity and multi-vault collateral in decentralized lending protocols.',
    mitreAttck: 'T1587.001 - Exploit PoC / Smart Contract Arbitrage',
    targetSystem: 'Ethereum EVM Cancun / Solidity 0.8.24+ / DeFi Vaults',
    findings: [
      'Developers assumed TSTORE locks would automatically isolate cross-contract function calls within the same transaction.',
      'A callback hook during vault balance rebalancing allowed the attacker to re-enter a secondary lending pool before transient state synchronized.',
      'Demonstrated an atomic flash-loan exploit extracting $4.2M testnet liquidity in a single transaction block.',
    ],
    mitigations: [
      'Enforce the classic Checks-Effects-Interactions pattern regardless of gas optimization techniques.',
      'Never rely exclusively on transient mutex locks for multi-contract accounting flows.',
      'Add formal verification invariants checking net balance changes before and after external calls in Foundry/Certora.',
    ],
    pocCommand: 'forge test --match-test testTransientStorageReentrancy -vvvv',
    yaraRule: `rule Solidity_Transient_Reentrancy_Pattern {
  meta:
    description = "Detects vulnerable TSTORE/TLOAD reentrancy bypass sequences"
    author = "Labib Bin Shahed"
    severity = "CRITICAL"
  strings:
    $tstore = { 5F 35 5C } /* PUSH0 CALLDATALOAD TSTORE */
    $callback = { F1 50 } /* CALL POP */
  condition:
    all of them
}`,
    iocs: {
      sha256: '7c8b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
      filePaths: ['contracts/vault/TransientVault.sol', 'test/ExploitPoC.t.sol'],
      networkIps: ['0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'],
    },
    tags: ['Web3', 'EVM', 'Solidity', 'EIP-1153', 'DeFi Security'],
  },
  {
    id: 'dsp-zero-trust-microsegmentation',
    dispatchId: 'DSP-2026-077',
    title: 'The Stale Identity Glitch: Bypassing Zero-Trust Firewalls in Kubernetes',
    category: 'architecture',
    severity: 'HIGH',
    date: 'MAY 2026',
    readTime: '4 MIN READ',
    summary: 'When Kubernetes pods restart rapidly, eBPF-based network filters can fail to synchronize connection tables fast enough, allowing untrusted pods to inherit permissions from trusted ones.',
    plainEnglish: 'Imagine checking into a hotel where the previous VIP guest just checked out, and the front desk accidentally hands you their master key before resetting the system. That is what happens when IP connection tables lag behind container terminations.',
    impact: 'Untrusted microservices can bypass network security policies and send unauthenticated requests directly into protected database backends.',
    mitreAttck: 'T1557 - Adversary-in-the-Middle',
    targetSystem: 'Kubernetes 1.30+ / Cilium CNI / Envoy Service Mesh',
    findings: [
      'Identified a 350-millisecond synchronization race condition between Cilium node agents and Linux conntrack tables during rapid pod recycling.',
      'A freshly created public-facing pod was allocated an IP that still held an active Security Identity (SecID) from a decommissioned payment service.',
      'The new pod successfully queried internal PostgreSQL clusters, completely ignoring CiliumNetworkPolicy egress rules.',
    ],
    mitigations: [
      'Enable strict identity synchronization flags (enable-identity-mark=true) across Cilium daemonsets.',
      'Enforce mutual TLS (mTLS) with SPIFFE/SPIRE cryptographic workload identity so IP spoofing alone cannot grant access.',
      'Configure egress gateways with deep packet inspection (DPI) to validate application-layer identity tokens.',
    ],
    pocCommand: 'cilium monitor --type drop -v && kubectl get ciliumnetworkpolicies -A',
    yaraRule: `rule K8s_Stale_Identity_Bypass {
  meta:
    description = "Detects Cilium SecID race condition probes"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $secid_probe = "cilium_identity="
    $rapid_cycle = "pod_restart_rate_exceeded"
  condition:
    all of them
}`,
    iocs: {
      sha256: '5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      filePaths: ['/etc/cni/net.d/05-cilium.conflist', '/var/run/cilium/state.json'],
      networkIps: ['10.244.3.15', '10.244.3.16'],
    },
    tags: ['Zero-Trust', 'Kubernetes', 'Cilium', 'eBPF', 'Cloud Security'],
  },
  {
    id: 'dsp-kernel-rootkit-vmi',
    dispatchId: 'DSP-2026-073',
    title: 'Spotting the Invisible: Hunting Linux Rootkits from Outside the Operating System',
    category: 'kernel',
    severity: 'HIGH',
    date: 'APR 2026',
    readTime: '5 MIN READ',
    summary: 'Stealth rootkits hide by modifying kernel task lists so commands like ps or top never see them. By using Virtual Machine Introspection (VMI), we can scan guest memory directly from the hypervisor.',
    plainEnglish: 'If a burglar breaks into a house and rewires the security cameras to erase their image, the indoor monitor sees nothing. But a satellite looking in through the skylight from outside can see the burglar clearly.',
    impact: 'Exposes stealth malware and nation-state kernel implants that are mathematically undetectable by software running inside the infected machine.',
    mitreAttck: 'T1014 - Rootkit / Direct Kernel Object Manipulation',
    targetSystem: 'KVM/QEMU Hypervisor / Ubuntu Linux 22.04 LTS Guest',
    findings: [
      'Advanced rootkits unlink their process structure (task_struct) from the active process list (tasks.prev / tasks.next) to hide from all in-guest monitoring tools.',
      'Hypervisor-level introspection (LibVMI) traverses CPU hardware scheduling runqueues and page tables, exposing unlinked malicious threads with zero guest-side trace.',
      'Automated scanner flagged and isolated active kernel implants within 120 milliseconds of execution.',
    ],
    mitigations: [
      'Enforce Kernel Module Signing (CONFIG_MODULE_SIG_FORCE) and UEFI Secure Boot on all cloud instances.',
      'Lock down kernel runtime modification with Linux Security Modules (LSM lockdown mode).',
      'Implement out-of-band hypervisor memory introspection for high-value banking and infrastructure servers.',
    ],
    pocCommand: 'sudo vmi-process-list -n debian-sandbox-target',
    yaraRule: `rule Linux_DKOM_Rootkit_Unhook {
  meta:
    description = "Detects task_struct unlinking DKOM artifacts"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $dkom_unlink = { 48 8B 40 ?? 48 8B 50 ?? 48 89 42 ?? 48 89 50 ?? }
    $hidden_proc = "hide_pid"
  condition:
    all of them
}`,
    iocs: {
      sha256: '2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
      filePaths: ['/lib/modules/6.5.0-generic/kernel/drivers/char/sys_hook.ko'],
      networkIps: ['192.0.2.45'],
    },
    tags: ['Rootkit', 'VMI', 'Hypervisor', 'DKOM', 'Forensics'],
  },
  {
    id: 'dsp-post-quantum-tls-analysis',
    dispatchId: 'DSP-2026-069',
    title: 'Quantum-Proofing the Web: What Happens When You Turn on Kyber-768?',
    category: 'architecture',
    severity: 'MEDIUM',
    date: 'MAR 2026',
    readTime: '4 MIN READ',
    summary: 'A real-world benchmark of post-quantum cryptography (ML-KEM/Kyber-768) in high-volume microservices, exploring handshake overhead, packet fragmentation, and network middlebox compatibility.',
    plainEnglish: 'Quantum computers will eventually be able to crack today’s encryption algorithms. We tested the new quantum-safe mathematical formulas in high-speed banking systems to see if they slow down internet traffic.',
    impact: 'Validates that enterprises can migrate to quantum-resistant encryption without noticeable user latency, while revealing legacy network appliances that need firmware updates.',
    mitreAttck: 'T1557.001 - LLM / Network Eavesdropping Resistance',
    targetSystem: 'Nitro Enclaves / Thales Luna HSM / OpenSSL 3.3',
    findings: [
      'Hybrid ML-KEM-768 + X25519 key exchange introduced only a modest 4.2% increase in handshake latency under heavy load.',
      'Older corporate firewalls and middleboxes occasionally dropped connections because the new quantum keys make the initial TLS ClientHello packet larger than standard MTU sizes.',
      'Enabling TLS session resumption eliminated 92% of the computational overhead on repeat connections.',
    ],
    mitigations: [
      'Enable TLS session resumption and ClientHello padding to prevent packet fragmentation issues.',
      'Deploy dual-certificate chains supporting both classical ECDSA and post-quantum Dilithium/Falcon signatures.',
      'Audit legacy corporate network routers to ensure they handle TLS records larger than 1.5 KB cleanly.',
    ],
    pocCommand: 'openssl s_client -connect api.banking.internal:443 -curves X25519Kyber768Draft00',
    yaraRule: `rule PQC_Hybrid_KeyExchange {
  meta:
    description = "Matches ML-KEM TLS handshake client hello artifacts"
    author = "Labib Bin Shahed"
    severity = "INFORMATIONAL"
  strings:
    $kyber_curve = { 63 99 } /* X25519Kyber768 draft */
  condition:
    all of them
}`,
    iocs: {
      sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      filePaths: ['/etc/ssl/certs/pqc-ca-chain.crt', '/etc/nginx/conf.d/pqc-tls.conf'],
      networkIps: ['198.51.100.12'],
    },
    tags: ['Cryptography', 'Post-Quantum', 'TLS 1.3', 'HSM', 'Zero-Trust'],
  },
  {
    id: 'dsp-hyperv-vmswitch-rce',
    dispatchId: 'DSP-2026-065',
    title: 'Breaking Out of the Virtual Machine: A Race Condition in Windows Hyper-V',
    category: 'kernel',
    severity: 'CRITICAL',
    date: 'FEB 2026',
    readTime: '6 MIN READ',
    summary: 'Dissecting a timing flaw in the Hyper-V virtual network switch that allows an attacker inside a guest virtual machine to escape and execute arbitrary code on the host server.',
    plainEnglish: 'Virtual machines are supposed to be soundproof jail cells. By sending rapid, specially crafted network packets from inside the cell, we triggered a split-second confusion in the guard tower, taking over the entire prison facility.',
    impact: 'A malicious tenant in a shared cloud environment could escape their rented virtual server and take complete control of the physical host and all other customers on it.',
    mitreAttck: 'T1611 - Escape to Host',
    targetSystem: 'Windows Server 2025 Hyper-V / vmswitch.sys Ring 0',
    findings: [
      'A multi-threaded race condition in vmswitch!VmsMpSendNetBufferLists caused a double-free vulnerability during network packet reassembly.',
      'Exploited the heap layout in the host kernel pool to create an arbitrary memory write primitive.',
      'Achieved full Ring 0 kernel execution on the host machine from an unprivileged guest VM in 340 milliseconds.',
    ],
    mitigations: [
      'Apply Microsoft Security Update KB5039211 across all virtualization host clusters immediately.',
      'Enable Virtualization-Based Security (VBS) and Hypervisor-Enforced Code Integrity (HVCI).',
      'Isolate untrusted multi-tenant workloads onto dedicated physical hardware nodes.',
    ],
    pocCommand: './hyperv_rndis_poc --adapter eth0 --trigger race',
    yaraRule: `rule HyperV_Vmswitch_Race_Exploit {
  meta:
    description = "Detects Hyper-V synthetic NIC exploit payloads"
    author = "Labib Bin Shahed"
    severity = "CRITICAL"
  strings:
    $rndis_hdr = { 01 00 00 00 ?? ?? 00 00 00 00 00 00 }
    $vmswitch_leak = "vmswitch.sys"
  condition:
    all of them
}`,
    iocs: {
      sha256: '8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
      filePaths: ['C:\\Windows\\System32\\drivers\\vmswitch.sys', '/tmp/rndis_fuzzer'],
      networkIps: ['10.0.4.19'],
    },
    tags: ['Hyper-V', 'VM Escape', 'Kernel Exploit', 'Double-Free', 'Zero-Day'],
  },
  {
    id: 'dsp-edr-unhooking-ntdll-syscalls',
    dispatchId: 'DSP-2026-061',
    title: 'How Attackers Blind Corporate Antivirus Using Direct Syscalls',
    category: 'offsec',
    severity: 'HIGH',
    date: 'JAN 2026',
    readTime: '4 MIN READ',
    summary: 'Most Endpoint Detection and Response (EDR) agents monitor programs by intercepting standard Windows API calls. Attackers bypass this completely by speaking directly to the kernel using unhooked syscalls.',
    plainEnglish: 'When a program asks Windows to allocate memory, it normally talks to a middleman (the API) where antivirus sits listening. Direct syscalls let the program bypass the middleman and whisper directly into the kernel’s ear.',
    impact: 'Allows malicious code execution, credential dumping, and lateral movement without generating alerts in corporate Security Operations Centers (SOC).',
    mitreAttck: 'T1562.001 - Impair Defenses: Disable or Modify Tools',
    targetSystem: 'CrowdStrike Falcon / SentinelOne / Windows 11 23H2',
    findings: [
      'EDR software inserts JMP instructions (hooks) into ntdll.dll functions to inspect arguments before allowing execution.',
      'By reading a clean copy of ntdll.dll from disk or dynamically discovering syscall numbers using the Halo’s Gate technique, attacker tools evade all user-space hooks.',
      'Successfully dumped memory from protected processes without triggering a single EDR alert.',
    ],
    mitigations: [
      'Rely on kernel-level telemetry callbacks (PsSetCreateProcessNotifyRoutineEx) rather than fragile user-mode hooks.',
      'Enable Event Tracing for Windows Threat Intelligence (ETW-Ti) to capture direct kernel syscall invocations.',
      'Correlate call stacks to verify that system calls originate from legitimate Windows libraries rather than raw memory.',
    ],
    pocCommand: './sys_invoker --ssn-heuristic dynamic --target lsass.exe',
    yaraRule: `rule Halos_Gate_Dynamic_Syscall {
  meta:
    description = "Detects Halos Gate dynamic syscall stub resolvers"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $stub = { 4C 8B D1 B8 ?? ?? 00 00 0F 05 C3 }
    $ntdll = "ntdll.dll"
  condition:
    all of them
}`,
    iocs: {
      sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      filePaths: ['C:\\Windows\\System32\\ntdll.dll', 'C:\\Users\\Public\\loader.exe'],
      networkIps: ['198.51.100.77'],
    },
    tags: ['EDR Evasion', 'Direct Syscalls', 'Halos Gate', 'Red Team', 'Windows Internals'],
  },
  {
    id: 'dsp-aws-iam-role-chain-privesc',
    dispatchId: 'DSP-2026-057',
    title: 'Cloud Shadow Admins: Finding Secret Backdoors in Complex AWS IAM Policies',
    category: 'architecture',
    severity: 'HIGH',
    date: 'DEC 2025',
    readTime: '5 MIN READ',
    summary: 'In large multi-account AWS environments, chaining minor cross-account permissions can create an unintended escalation path from a simple low-privilege Lambda worker all the way to Organization SuperAdmin.',
    plainEnglish: 'Think of a building where keycard A opens office B, office B contains keycard C, and keycard C opens the vault. Individually, each card seems harmless, but together they grant total control.',
    impact: 'Allows an attacker who compromises a low-privilege development server to take over the entire cloud infrastructure of an enterprise.',
    mitreAttck: 'T1078.004 - Cloud Accounts',
    targetSystem: 'AWS IAM / Organizations / Cross-Account AssumeRole Policies',
    findings: [
      'Mapped a 4-hop cross-account role assumption chain starting from a read-only logging Lambda function.',
      'Identified overly permissive ExternalId configurations in cross-account trust relationships.',
      'Demonstrated complete takeover of root organization accounts using automated graph-traversal analysis.',
    ],
    mitigations: [
      'Enforce aws:PrincipalOrgID condition keys in all cross-account trust relationships.',
      'Run automated graph-based permission audits (like AWS IAM Access Analyzer) on every policy commit.',
      'Eliminate wildcard sts:AssumeRole permissions on all machine and service execution roles.',
    ],
    pocCommand: 'python3 iam_graph_traverse.py --start-role LambdaWorker --target OrganizationAdmin',
    yaraRule: `rule AWS_Wildcard_AssumeRole_Policy {
  meta:
    description = "Detects insecure AWS AssumeRole trust policy configurations"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $action = "sts:AssumeRole"
    $wildcard = "*"
    $effect = "Allow"
  condition:
    all of them
}`,
    iocs: {
      sha256: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      filePaths: ['/root/.aws/credentials', 'policies/shadow_admin.json'],
      networkIps: ['54.239.28.85'],
    },
    tags: ['AWS', 'Cloud Security', 'IAM', 'Privilege Escalation', 'Graph Theory'],
  },
  {
    id: 'dsp-shimcache-amcache-anti-forensics',
    dispatchId: 'DSP-2026-053',
    title: 'Resurrecting Deleted Evidence: Forensic Recovery from Windows Registry Logs',
    category: 'dfir',
    severity: 'MEDIUM',
    date: 'NOV 2025',
    readTime: '4 MIN READ',
    summary: 'When sophisticated attackers use secure file shredders and registry cleaners to cover their tracks, digital forensic investigators can still reconstruct exact execution timelines from raw registry transaction logs.',
    plainEnglish: 'Deleting an entry from the Windows registry is like tearing a page out of a ledger. The journal logs (.LOG1/.LOG2) retain the uncommitted transaction history, allowing us to read the torn-out page anyway.',
    impact: 'Enables incident responders to prove exactly when an attacker ran their malware, which files were stolen, and how the breach started, even after anti-forensic wiping.',
    mitreAttck: 'T1070.004 - File Deletion & Indicator Removal',
    targetSystem: 'Windows Registry / SYSTEM Hive / AppCompatCache / Amcache.hve',
    findings: [
      'Threat actors executed anti-forensics wiping scripts targeting the AppCompatFlags\\Compatibility Assistant registry key.',
      'Recovered deleted registry cell blocks from unallocated space in SYSTEM.LOG1 transaction logs.',
      'Successfully reconstructed 14 distinct malware execution timestamps that matched the initial phishing email delivery.',
    ],
    mitigations: [
      'Stream endpoint event logs (Sysmon Event ID 1 & 13) immediately to an off-site, immutable SIEM.',
      'Lock down permissions to prevent user-level processes from wiping Volume Shadow Copies.',
      'Preserve raw disk images before shutting down compromised endpoints to protect unallocated RAM and disk clusters.',
    ],
    pocCommand: 'AppCompatCacheParser.exe -f C:\\Windows\\System32\\config\\SYSTEM --csv out/',
    yaraRule: `rule AntiForensics_Shimcache_Wiper {
  meta:
    description = "Detects Shimcache registry wiping batch scripts"
    author = "Labib Bin Shahed"
    severity = "MEDIUM"
  strings:
    $reg_del = "reg delete"
    $shim = "AppCompatCache"
    $sdel = "sdelete.exe -z"
  condition:
    all of them
}`,
    iocs: {
      sha256: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      filePaths: ['C:\\Windows\\AppCompat\\Programs\\Amcache.hve', 'C:\\Windows\\System32\\config\\SYSTEM.LOG1'],
      networkIps: ['198.51.100.44'],
    },
    tags: ['DFIR', 'Shimcache', 'Amcache', 'Anti-Forensics', 'NTFS Carving'],
  },
  {
    id: 'dsp-bluetooth-l2cap-rce',
    dispatchId: 'DSP-2026-049',
    title: 'Hacking Connected Cars Over the Air: A Zero-Click Bluetooth Vulnerability',
    category: 'offsec',
    severity: 'CRITICAL',
    date: 'OCT 2025',
    readTime: '5 MIN READ',
    summary: 'A memory corruption flaw in the Linux Bluetooth stack allows an attacker within wireless range to execute arbitrary code on a vehicle’s dashboard infotainment system without requiring any pairing or user interaction.',
    plainEnglish: 'Your phone usually asks your permission before connecting to Bluetooth. This vulnerability exploits a bug in how Bluetooth messages are unpacked, allowing an attacker to take over the dashboard computer just by driving near the target car.',
    impact: 'Full remote control over the in-vehicle infotainment system, potentially serving as a pivot to send commands across internal automotive CAN bus networks.',
    mitreAttck: 'T1210 - Exploitation of Remote Services',
    targetSystem: 'Automotive In-Vehicle Infotainment (IVI) / Linux BlueZ 5.66',
    findings: [
      'Discovered an integer underflow vulnerability during BlueZ L2CAP configuration packet reassembly.',
      'Crafted a zero-click wireless payload triggering a heap overflow without triggering pairing dialogs.',
      'Obtained a root shell on the infotainment computer, enabling direct communication with internal CAN bus controllers.',
    ],
    mitigations: [
      'Update the BlueZ Bluetooth stack to version 5.72+ with strict packet bounds checking.',
      'Physically and logically isolate the infotainment system from safety-critical powertrain CAN buses.',
      'Automatically disable Bluetooth discoverability when the vehicle is in drive.',
    ],
    pocCommand: 'python3 ble_l2cap_fuzz.py -i hci0 --target 00:1A:7D:DA:71:13',
    yaraRule: `rule BLE_L2CAP_Heap_Exploit {
  meta:
    description = "Detects malformed L2CAP config packets"
    author = "Labib Bin Shahed"
    severity = "CRITICAL"
  strings:
    $ble_sig = { 02 00 00 ?? 06 00 ?? 00 }
    $l2cap_cfg = { 03 01 ?? 00 ?? 00 02 00 }
  condition:
    all of them
}`,
    iocs: {
      sha256: '1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
      filePaths: ['/etc/bluetooth/main.conf', '/usr/libexec/bluetooth/bluetoothd'],
      networkIps: ['00:1A:7D:DA:71:13 (BLE MAC)'],
    },
    tags: ['Automotive', 'Bluetooth', 'Zero-Click', 'L2CAP', 'RCE'],
  },
  {
    id: 'dsp-container-escape-cgroups-v2',
    dispatchId: 'DSP-2026-045',
    title: 'Escaping Docker: How Misconfigured Permissions Let Containers Take Over Hosts',
    category: 'kernel',
    severity: 'HIGH',
    date: 'SEP 2025',
    readTime: '4 MIN READ',
    summary: 'Containers rely on Linux cgroups to limit CPU and memory usage. When a container runs with elevated capabilities, an attacker can abuse the release_agent notification trigger to execute commands on the underlying host.',
    plainEnglish: 'Containers are supposed to be self-contained boxes. If you give the container permission to manage its own resource limits, it can leave a note for the host operating system saying: "When I finish, please run this root script for me on your computer."',
    impact: 'Complete compromise of the physical or virtual host node hosting the container, putting all neighboring containers at risk.',
    mitreAttck: 'T1611 - Escape to Host',
    targetSystem: 'Docker / containerd 1.7 / Linux cgroups v2',
    findings: [
      'Containers started with CAP_SYS_ADMIN capabilities could remount cgroups filesystems in read-write mode.',
      'By writing a malicious script path to release_agent and triggering a notification event, the kernel executed the script outside the container as host root.',
      'Gained full root access to the host server in under 1.5 seconds from inside a standard Docker container.',
    ],
    mitigations: [
      'Never run containers with --privileged or CAP_SYS_ADMIN in production environments.',
      'Enforce security profiles using AppArmor or SELinux to block access to cgroup release_agent files.',
      'Use lightweight microVM runtimes like gVisor or Kata Containers for running untrusted workloads.',
    ],
    pocCommand: 'mkdir /tmp/cgrp && mount -t cgroup -o rdma cgroup /tmp/cgrp',
    yaraRule: `rule Container_Cgroup_Escape_Artifact {
  meta:
    description = "Detects container cgroup release_agent manipulation"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $cgrp = "release_agent"
    $notify = "notify_on_release"
    $sh = "#!/bin/sh"
  condition:
    all of them
}`,
    iocs: {
      sha256: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
      filePaths: ['/sys/fs/cgroup/release_agent', '/cmd/escape.sh'],
      networkIps: ['172.17.0.2'],
    },
    tags: ['Container Escape', 'Docker', 'cgroups', 'Linux Kernel', 'Kubernetes'],
  },
  {
    id: 'dsp-kerberos-unconstrained-delegation',
    dispatchId: 'DSP-2026-041',
    title: 'Taking Over an Entire Corporate Domain in 3 Clicks with Kerberos Delegation',
    category: 'offsec',
    severity: 'CRITICAL',
    date: 'AUG 2025',
    readTime: '5 MIN READ',
    summary: 'Kerberos Unconstrained Delegation allows servers to impersonate users to access backend databases. By tricking a Domain Controller into connecting to a compromised server, an attacker can capture the master keys to the entire corporate network.',
    plainEnglish: 'When you ask a travel agent to book a hotel for you, you might give them temporary permission to use your credit card. Unconstrained delegation is like giving the travel agent a blank signed check that they can use anywhere forever.',
    impact: 'Immediate escalation from an entry-level compromised web server to Enterprise Domain Admin with total network control.',
    mitreAttck: 'T1558.001 - Steal or Forge Kerberos Tickets',
    targetSystem: 'Active Directory Domain Services / Windows Server 2022',
    findings: [
      'Identified an internal IIS web server configured with TRUSTED_FOR_DELEGATION permissions.',
      'Used the MS-RPRN Print Spooler RPC (SpoolSample) to coerce the Domain Controller into authenticating back to the web server.',
      'Extracted the Domain Controller’s Ticket Granting Ticket (TGT) directly from RAM, forging a Golden Ticket in minutes.',
    ],
    mitigations: [
      'Migrate legacy Unconstrained Delegation servers to Resource-Based Constrained Delegation (RBCD).',
      'Add all Domain Controllers and high-privilege administrative accounts to the "Protected Users" group.',
      'Disable the Print Spooler service on all Domain Controllers system-wide.',
    ],
    pocCommand: 'Rubeus.exe dump /luid:0x3e7 /service:krbtgt /nowrap',
    yaraRule: `rule AD_SpoolSample_Coerce_Auth {
  meta:
    description = "Detects MS-RPRN Spooler RPC coercion binaries"
    author = "Labib Bin Shahed"
    severity = "CRITICAL"
  strings:
    $rpc = "RpcRemoteFindFirstPrinterChangeNotification"
    $spool = "\\\\pipe\\\\spoolss"
  condition:
    all of them
}`,
    iocs: {
      sha256: '8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
      filePaths: ['C:\\Windows\\Temp\\ticket.kirbi', 'C:\\Tools\\Rubeus.exe'],
      networkIps: ['10.10.10.1', '10.10.10.200'],
    },
    tags: ['Active Directory', 'Kerberos', 'Delegation', 'SpoolSample', 'Privilege Escalation'],
  },
  {
    id: 'dsp-tls-session-ticket-reuse',
    dispatchId: 'DSP-2026-037',
    title: 'The Double Charge Bug: How TLS 1.3 0-RTT Allows Replay Attacks on Payment APIs',
    category: 'architecture',
    severity: 'HIGH',
    date: 'JUL 2025',
    readTime: '4 MIN READ',
    summary: 'TLS 1.3 includes a speed feature called 0-RTT that sends data before the cryptographic handshake finishes. When applied to payment webhooks without replay protection, attackers can duplicate financial transactions.',
    plainEnglish: 'TLS 1.3 0-RTT is like an express lane that lets you order coffee before you finish scanning your loyalty card. If the coffee shop doesn’t check transaction IDs, someone who records your order can replay it to charge you twice.',
    impact: 'Financial fraud, double billing, and unintended duplicate operations on non-idempotent web services.',
    mitreAttck: 'T1557 - Adversary-in-the-Middle',
    targetSystem: 'Payment Gateway APIs / Envoy Reverse Proxy / TLS 1.3 0-RTT',
    findings: [
      'Discovered that an API gateway permitted POST /v1/charge requests inside early data TLS ClientHello packets.',
      'Re-sent captured network packets across a secondary connection, successfully triggering duplicate credit card charges.',
      'Built and deployed a Redis Bloom filter cache to validate unique ticket nonces in under 2 milliseconds.',
    ],
    mitigations: [
      'Strictly disable 0-RTT early data for all non-idempotent HTTP methods (POST, PUT, DELETE).',
      'Implement single-use ticket nonces and client timestamp verification on reverse proxies.',
      'Enforce idempotent request keys across all financial and state-modifying backend APIs.',
    ],
    pocCommand: 'python3 tls_0rtt_replay.py --pcap capture.pcap --target api.stripe-sandbox.internal',
    yaraRule: `rule TLS13_EarlyData_Replay_Probe {
  meta:
    description = "Detects duplicate TLS 1.3 early_data extension handshakes"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $early_data = { 00 2A 00 00 } /* TLS extension early_data */
    $http_post = "POST /v1/charge"
  condition:
    all of them
}`,
    iocs: {
      sha256: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      filePaths: ['/etc/envoy/tls_config.yaml', '/var/log/envoy/access.log'],
      networkIps: ['198.51.100.199'],
    },
    tags: ['TLS 1.3', '0-RTT', 'Replay Attack', 'FinTech', 'Network Security'],
  },
  {
    id: 'dsp-windows-defender-tamper-blind',
    dispatchId: 'DSP-2026-033',
    title: 'Killing Antivirus from Within: The Rise of BYOVD (Bring Your Own Vulnerable Driver)',
    category: 'dfir',
    severity: 'HIGH',
    date: 'JUN 2025',
    readTime: '5 MIN READ',
    summary: 'Windows prevents malware from loading unsigned drivers. Instead, attackers bring legitimate, older drivers signed by reputable companies that contain known security flaws to forcefully disable security software.',
    plainEnglish: 'If the front door requires a verified badge, the attacker brings an old employee who still has a valid badge but left their keys in the door, using their access to turn off the security alarm.',
    impact: 'Disables Microsoft Defender, CrowdStrike, and SentinelOne without triggering tamper alarms, leaving the system completely defenseless.',
    mitreAttck: 'T1562.001 - Impair Defenses: Disable or Modify Tools',
    targetSystem: 'Windows 11 / Microsoft Defender Antivirus / WdFilter.sys',
    findings: [
      'Threat actors dropped a legitimately signed, vulnerable Capcom.sys driver file to gain arbitrary Ring 0 kernel read/write.',
      'Overwrote kernel callback tables to detach the Microsoft Defender file filter driver (WdFilter.sys).',
      'Neutralized real-time malware scanning completely without generating a Tamper Protection alert.',
    ],
    mitigations: [
      'Enable the Microsoft Recommended Driver Blocklist (HVCI Vulnerable Driver Blocklist) in Windows settings.',
      'Enforce Windows Defender Application Control (WDAC) policies to restrict unsigned or vulnerable kernel drivers.',
      'Monitor Windows Event ID 7045 and alert on unexpected driver load events across endpoints.',
    ],
    pocCommand: 'fltmc.exe instances -v WdFilter',
    yaraRule: `rule BYOVD_Capcom_Driver_Exploit {
  meta:
    description = "Detects vulnerable Capcom.sys driver drops used in BYOVD attacks"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $capcom_cert = "CAPCOM CO., LTD."
    $io_code = { 88 00 22 00 }
  condition:
    all of them
}`,
    iocs: {
      sha256: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      filePaths: ['C:\\Windows\\System32\\drivers\\Capcom.sys', 'C:\\Windows\\Temp\\wd_kill.exe'],
      networkIps: ['203.0.113.15'],
    },
    tags: ['BYOVD', 'EDR Evasion', 'Defender', 'Kernel Driver', 'DFIR'],
  },
  {
    id: 'dsp-graphql-batching-dos-amplification',
    dispatchId: 'DSP-2026-029',
    title: 'The 1KB Payload That Crashed a 16-Core Server: GraphQL Batching & Circular Loops',
    category: 'offsec',
    severity: 'MEDIUM',
    date: 'MAY 2025',
    readTime: '4 MIN READ',
    summary: 'GraphQL gives web apps the flexibility to request exactly what they need. Without query depth limits, an attacker can craft a tiny nested query that forces the server into millions of exponential calculations.',
    plainEnglish: 'Imagine ordering a pizza and asking for "a topping that consists of another pizza with toppings, each of which has toppings." A tiny order form causes the kitchen to collapse trying to make an infinite fractal pizza.',
    impact: 'Brings down public APIs and cloud microservices with a single unauthenticated HTTP POST request.',
    mitreAttck: 'T1499.003 - Endpoint Denial of Service',
    targetSystem: 'Apollo Server 4 / GraphQL / Node.js Microservices',
    findings: [
      'Recursive query fragment loops bypassed default schema validation rules before depth limits were checked.',
      'A single 1.2 KB payload pinned 16 Node.js cluster worker processes at 100% CPU utilization for over 4 minutes.',
      'Engineered a lightweight AST complexity analysis middleware to reject abusive queries in under 1 millisecond.',
    ],
    mitigations: [
      'Enforce strict Query Depth Limiting (e.g. max depth <= 5) using graphql-depth-limit.',
      'Implement Query Cost Analysis and reject requests exceeding 100 complexity units.',
      'Disable query batching for unauthenticated and public API endpoints.',
    ],
    pocCommand: 'curl -X POST https://api.target.internal/graphql -d \'[{"query":"{a:__schema{types{fields{type{fields{name}}}}}}"}, ...]\'',
    yaraRule: `rule GraphQL_Cyclic_DoS_Payload {
  meta:
    description = "Detects malicious nested GraphQL cyclic queries"
    author = "Labib Bin Shahed"
    severity = "MEDIUM"
  strings:
    $schema_bomb = "__schema{types{fields{type{fields"
    $frag_loop = "...on User{friends{friends{friends"
  condition:
    any of them
}`,
    iocs: {
      sha256: '9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      filePaths: ['/app/src/graphql/schema.ts', '/var/log/nginx/graphql_dos.log'],
      networkIps: ['198.51.100.220'],
    },
    tags: ['GraphQL', 'DoS', 'Node.js', 'AppSec', 'Web Security'],
  },
  {
    id: 'dsp-linux-pam-backdoor-forensics',
    dispatchId: 'DSP-2026-025',
    title: 'The Invisible Locksmith: Detecting Backdoored Linux PAM Login Modules',
    category: 'dfir',
    severity: 'HIGH',
    date: 'APR 2025',
    readTime: '5 MIN READ',
    summary: 'Pluggable Authentication Modules (PAM) handle user logins in Linux. Threat actors replace legitimate PAM libraries with modified versions that accept a secret master password while logging every real password.',
    plainEnglish: 'The attacker replaces the front door lock with one that opens for every regular key, but also opens for a secret skeleton key and quietly writes down everyone’s combination in a hidden notebook.',
    impact: 'Gives the attacker perpetual root access to Linux servers and captures administrative passwords as plain text whenever someone logs in via SSH.',
    mitreAttck: 'T1556.003 - Pluggable Authentication Modules',
    targetSystem: 'OpenSSH Server / Linux PAM (Pluggable Authentication Modules)',
    findings: [
      'Discovered a modified pam_unix.so library hooking the pam_sm_authenticate function with a hardcoded backdoor password hash.',
      'The backdoor recorded every legitimate user login and streamed plaintext credentials to a stealth UDP listening port.',
      'Reconstructed the attacker’s command history across 18 compromised production cloud servers.',
    ],
    mitigations: [
      'Regularly verify package file integrity using debsums -s (Debian/Ubuntu) or rpm -V (RHEL/CentOS).',
      'Enforce hardware security keys (FIDO2/WebAuthn) or SSH certificates instead of static passwords.',
      'Monitor changes to /etc/pam.d/ and /lib/security/ using auditd file integrity rules.',
    ],
    pocCommand: 'debsums -c libpam-modules && ls -la /lib/x86_64-linux-gnu/security/pam_unix.so',
    yaraRule: `rule Linux_PAM_Trojan_Backdoor {
  meta:
    description = "Detects hardcoded magic passwords in pam_unix.so"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $magic_hash = "$6$rounds=5000$magicpasswordhash"
    $pam_log = "/tmp/.pam_creds"
  condition:
    all of them
}`,
    iocs: {
      sha256: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      filePaths: ['/lib/x86_64-linux-gnu/security/pam_unix.so', '/tmp/.pam_creds'],
      networkIps: ['198.51.100.9'],
    },
    tags: ['DFIR', 'Linux', 'PAM', 'Backdoor', 'SSH Security'],
  },
  {
    id: 'dsp-oauth2-redirect-uri-subdomain-takeover',
    dispatchId: 'DSP-2026-021',
    title: 'How an Abandoned S3 Bucket Allowed Single Sign-On Hijacking for 2,400 Users',
    category: 'offsec',
    severity: 'HIGH',
    date: 'MAR 2025',
    readTime: '4 MIN READ',
    summary: 'A forgotten marketing subdomain pointing to a deleted Amazon S3 bucket combined with a wildcard OAuth redirect URI allowed an attacker to steal user authorization tokens silently.',
    plainEnglish: 'A company set up their login system to say "send user login tokens to any enterprise.com website." When an old promo blog was shut down but its DNS address remained, an attacker claimed the empty address and collected everyone’s login passes.',
    impact: 'Silent, full account takeover of corporate employee email, document, and admin portals without needing passwords.',
    mitreAttck: 'T1557 - Adversary-in-the-Middle / T1078.004',
    targetSystem: 'Enterprise OAuth 2.0 IdP / AWS Route 53 / S3 Static Web',
    findings: [
      'The company OAuth identity provider was configured with an insecure wildcard redirect URI (*.enterprise.com/callback).',
      'Claimed an abandoned Amazon S3 bucket linked to the dangling DNS record blog.enterprise.com.',
      'Intercepted authorization codes for over 2,400 active corporate users, demonstrating complete SSO account takeover.',
    ],
    mitigations: [
      'Enforce exact, explicit redirect_uri validation in OAuth identity providers with zero wildcard matching.',
      'Continuously audit DNS records to identify and delete dangling CNAME aliases pointing to unclaimed cloud resources.',
      'Mandate PKCE (Proof Key for Code Exchange) across all OAuth 2.0 authorization code flows.',
    ],
    pocCommand: 'python3 s3_subdomain_claim.py --domain blog.enterprise.com --bucket-name blog-bucket-corp',
    yaraRule: `rule OAuth_Wildcard_Redirect_Check {
  meta:
    description = "Detects wildcard redirect_uri registrations in OAuth configs"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $wildcard_uri = "https://*.enterprise.com"
    $response_type = "response_type=code"
  condition:
    all of them
}`,
    iocs: {
      sha256: '7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
      filePaths: ['/etc/oauth2/clients.json', 'dns/records_audit.csv'],
      networkIps: ['52.216.144.10'],
    },
    tags: ['OAuth 2.0', 'Account Takeover', 'Subdomain Takeover', 'AWS S3', 'AppSec'],
  },
  {
    id: 'dsp-zigbee-otau-firmware-reversing',
    dispatchId: 'DSP-2026-017',
    title: 'Hacking the Smart Grid: Extracting AES Encryption Keys with Voltage Glitching',
    category: 'kernel',
    severity: 'MEDIUM',
    date: 'FEB 2025',
    readTime: '5 MIN READ',
    summary: 'Smart electricity meters use Zigbee wireless mesh networks to communicate. By briefly dropping the power voltage on the chip during startup, we bypassed read protection and extracted the network master encryption keys.',
    plainEnglish: 'Chips have security gates that prevent outsiders from reading their internal memory. By causing a microsecond power dip (a glitch), we made the gate stumble and stay open, allowing us to read the stored encryption passwords.',
    impact: 'Enables an attacker to forge over-the-air firmware updates and alter meter readings across an entire neighborhood smart grid.',
    mitreAttck: 'T1542.001 - System Firmware Manipulation',
    targetSystem: 'Smart Energy Grid Meters / Nordic nRF52840 SoC / Zigbee 3.0',
    findings: [
      'Glitched the nRF52840 hardware APPROTECT security register using a precision power crowbar pulse.',
      'Dumped the internal flash memory, extracting the global Zigbee Trust Center network master key stored in plaintext.',
      'Created a rogue wireless node capable of broadcasting unsigned firmware updates across the local smart meter mesh.',
    ],
    mitigations: [
      'Enable hardware CryptoCell secure boot with cryptographic ECDSA-P256 firmware signature checks.',
      'Use unique install codes per device instead of sharing a single global Trust Center link key.',
      'Apply epoxy potting compound over hardware debug pads (SWD/JTAG) on physical circuit boards.',
    ],
    pocCommand: 'nrfjprog --recover && openocd -f interface/jlink.cfg -f target/nrf52.cfg',
    yaraRule: `rule Zigbee_OTAU_Header_Artifact {
  meta:
    description = "Detects forged Zigbee OTA upgrade binary images"
    author = "Labib Bin Shahed"
    severity = "MEDIUM"
  strings:
    $otau_magic = { 1E F1 EE 0B }
    $manuf_code = { 10 24 }
  condition:
    $otau_magic at 0
}`,
    iocs: {
      sha256: '0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      filePaths: ['/firmware/ota_payload.bin', '/etc/zigbee/trust_center.key'],
      networkIps: ['00:12:4B:00:14:D9:8A:2F (Zigbee IEEE)'],
    },
    tags: ['Hardware Security', 'Zigbee', 'Firmware Reversing', 'IoT', 'Hardware Glitching'],
  },
  {
    id: 'dsp-k8s-admission-webhook-bypass',
    dispatchId: 'DSP-2026-013',
    title: 'The Fail-Open Disaster: Bypassing Kubernetes Security by Flooding the API',
    category: 'architecture',
    severity: 'HIGH',
    date: 'JAN 2025',
    readTime: '4 MIN READ',
    summary: 'Kubernetes uses admission webhooks (like OPA Gatekeeper) to block insecure pods. If a webhook is set to "ignore errors" and the API server gets overloaded, Kubernetes lets unauthorized privileged containers straight in.',
    plainEnglish: 'Imagine a high-security building where a digital guard checks everyone’s badge. If the guard’s computer freezes, the door automatically unlocks and lets everyone in without checking. That is a fail-open configuration.',
    impact: 'Allows developers or attackers with basic deployment permissions to launch root-level containers that can take over entire cloud clusters.',
    mitreAttck: 'T1562.001 - Impair Defenses',
    targetSystem: 'Kubernetes 1.29+ / OPA Gatekeeper / Kyverno Admission Controllers',
    findings: [
      'Discovered that validating webhooks were configured with failurePolicy: Ignore to prevent breaking deployments during outages.',
      'Flooded the API server with batch requests, exhausting webhook worker queues.',
      'Successfully deployed high-privilege containers with hostPID: true and hostNetwork: true completely unchecked.',
    ],
    mitigations: [
      'Set failurePolicy: Fail on all security-critical validating webhooks.',
      'Configure dedicated Kubernetes FlowSchema and PriorityLevel queues to protect admission webhook traffic from starvation.',
      'Enforce Pod Security Standards (PSS) at the cluster level natively without relying solely on webhooks.',
    ],
    pocCommand: 'kubectl get validatingwebhookconfigurations -o jsonpath="{.items[*].webhooks[*].failurePolicy}"',
    yaraRule: `rule K8s_Privileged_Pod_Bypass {
  meta:
    description = "Detects privileged pod specs deployed via webhook bypass"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $host_pid = "hostPID: true"
    $host_ipc = "hostIPC: true"
    $priv = "privileged: true"
  condition:
    all of them
}`,
    iocs: {
      sha256: '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
      filePaths: ['/etc/kubernetes/manifests/kube-apiserver.yaml', 'k8s/priv_escape_pod.yaml'],
      networkIps: ['10.96.0.1'],
    },
    tags: ['Kubernetes', 'Admission Controller', 'OPA Gatekeeper', 'Cloud Security', 'Bypass'],
  },
  {
    id: 'dsp-smb-relay-mitm-ntlmv2',
    dispatchId: 'DSP-2025-098',
    title: 'How Unchecked IPv6 Settings Let Attackers Take Over Windows Corporate Networks',
    category: 'offsec',
    severity: 'HIGH',
    date: 'DEC 2024',
    readTime: '5 MIN READ',
    summary: 'Most corporate networks use IPv4, but Windows machines search for IPv6 servers by default. Attackers reply with fake IPv6 network settings and relay captured corporate login tokens to become Domain Admins.',
    plainEnglish: 'When Windows boots up, it yells: "Does anyone speak IPv6?" The attacker answers: "I do! Send all your web traffic and login requests through me." The attacker then hands those logins to the central server to create new admin accounts.',
    impact: 'Enables an attacker on guest Wi-Fi or a plugged-in laptop in a conference room to take over the Active Directory domain.',
    mitreAttck: 'T1557.001 - LLMNR/NBT-NS Poisoning and SMB Relay',
    targetSystem: 'Windows 11 Enterprise / Active Directory / mitm6 / ntlmrelayx',
    findings: [
      'Windows workstations preferred IPv6 DNS queries over IPv4, accepting rogue DHCPv6 server advertisements from mitm6.',
      'Forced automated WPAD proxy authentication, intercepting NTLMv2 challenge-response hashes without user knowledge.',
      'Relayed captured hashes directly to Active Directory LDAP to create new Domain Admin computer accounts via Resource-Based Constrained Delegation.',
    ],
    mitigations: [
      'Enforce SMB Signing (RequireSecuritySignature=True) across all Windows servers and workstations.',
      'Enable LDAP Signing and LDAP Channel Binding on all Domain Controllers.',
      'Disable IPv6 via Group Policy on internal networks where IPv6 is not actively routed.',
    ],
    pocCommand: 'mitm6 -d corp.internal && ntlmrelayx.py -t ldaps://dc01.corp.internal --delegate-access',
    yaraRule: `rule Mitm6_DHCPv6_Spoof_Artifact {
  meta:
    description = "Detects rogue DHCPv6 advertise packets"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $dhcp6_adv = { 02 ?? ?? ?? 00 01 00 0E }
    $wpad_str = "wpad.corp.internal"
  condition:
    all of them
}`,
    iocs: {
      sha256: '8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
      filePaths: ['C:\\Windows\\System32\\drivers\\etc\\hosts', '/tmp/loot_ntlm.txt'],
      networkIps: ['fe80::1', '10.0.10.55'],
    },
    tags: ['Active Directory', 'SMB Relay', 'NTLMv2', 'mitm6', 'MitM'],
  },
  {
    id: 'dsp-solana-account-confusion-cpi',
    dispatchId: 'DSP-2025-092',
    title: 'The Fake Vault Swap: Exploiting Solana Cross-Program Invocations (CPI)',
    category: 'offsec',
    severity: 'CRITICAL',
    date: 'NOV 2024',
    readTime: '5 MIN READ',
    summary: 'In Solana smart contracts, programs pass account data to other programs. If a contract forgets to verify that an account is actually owned by the official token program, attackers can swap in counterfeit vaults and drain funds.',
    plainEnglish: 'Imagine a bank teller who accepts a cardboard box marked "Official Vault" without checking if the bank’s security stamp is on it, cheerfully transferring real customer money into the attacker’s box.',
    impact: 'Direct drainage of millions of dollars in tokens from automated market makers and decentralized exchanges.',
    mitreAttck: 'T1587.001 - Exploit PoC / Smart Contract Arbitrage',
    targetSystem: 'Solana Sealevel Runtime / Rust Anchor Framework / SPL Tokens',
    findings: [
      'A liquidity swap contract failed to verify the owner field on an incoming token_vault account parameter.',
      'Constructed an attacker-owned program that mimicked the SPL Token binary layout to satisfy the Anchor framework deserializer.',
      'Extracted $1.8M in simulated collateral during an automated liquidity rebalancing routine on testnet.',
    ],
    mitigations: [
      'Use Anchor #[account(has_one = ...)] constraints and strongly-typed Account<\'info, TokenAccount> wrappers.',
      'Explicitly assert account.owner == &spl_token::ID on every external account reference.',
      'Enforce Program-Derived Address (PDA) seed verification for all protocol-owned storage accounts.',
    ],
    pocCommand: 'anchor test --run-single-test test_account_confusion_exploit',
    yaraRule: `rule Solana_Fake_Token_Account_Pattern {
  meta:
    description = "Detects unvalidated AccountInfo parameters in Solana Rust programs"
    author = "Labib Bin Shahed"
    severity = "CRITICAL"
  strings:
    $raw_acc = "AccountInfo<'info>"
    $missing_check = "next_account_info"
  condition:
    all of them
}`,
    iocs: {
      sha256: '2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
      filePaths: ['programs/liquidity_vault/src/lib.rs', 'tests/exploit.ts'],
      networkIps: ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'],
    },
    tags: ['Solana', 'Rust', 'Anchor', 'Smart Contracts', 'Web3 Security'],
  },
  {
    id: 'dsp-ntfs-usn-journal-ransomware-forensics',
    dispatchId: 'DSP-2025-086',
    title: 'Decoding LockBit: Reconstructing Ransomware Outbreaks with the Windows USN Journal',
    category: 'dfir',
    severity: 'HIGH',
    date: 'OCT 2024',
    readTime: '4 MIN READ',
    summary: 'When ransomware strikes, incident responders need to know exactly which files were encrypted and where the breach started. The NTFS Change Journal ($UsnJrnl) records every disk change with microsecond precision.',
    plainEnglish: 'The Windows filesystem keeps an un-deletable flight recorder ($UsnJrnl) that notes every single file creation, modification, and rename. Even when ransomware deletes backup files, the flight recorder reveals the exact timeline of the attack.',
    impact: 'Enables rapid identification of patient zero and recovery of partially encrypted or shadowed files before full disaster strikes.',
    mitreAttck: 'T1486 - Data Encrypted for Impact',
    targetSystem: 'Windows NTFS Volume / $UsnJrnl / LockBit 3.0 Ransomware',
    findings: [
      'Parsed 4.2 million USN journal records documenting rapid file rename events appending the .lockbit file extension.',
      'Traced patient zero back to a malicious macro in winword.exe launching a hidden PowerShell encrypter child process.',
      'Recovered 38,000 uncorrupted accounting documents from snapshot fragments before the ransomware wiped Volume Shadow Copies.',
    ],
    mitigations: [
      'Enable Controlled Folder Access (ransomware protection) in Windows Security settings.',
      'Maintain immutable, air-gapped backups requiring multi-party authorization to delete or modify.',
      'Block unauthorized vssadmin.exe and wmic.exe shadow copy deletion commands using EDR behavioral rules.',
    ],
    pocCommand: 'MFTECmd.exe -f C:\\$Extend\\$UsnJrnl:$J --csv out/ --csvf usn_timeline.csv',
    yaraRule: `rule LockBit3_Ransomware_Binary {
  meta:
    description = "Detects LockBit 3.0 (LockBit Black) ransomware artifacts"
    author = "Labib Bin Shahed"
    severity = "HIGH"
  strings:
    $lb3_magic = { 55 89 E5 53 83 EC 24 8B 45 08 }
    $cmd_del = "vssadmin delete shadows /all /quiet"
  condition:
    all of them
}`,
    iocs: {
      sha256: '6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      filePaths: ['C:\\$Extend\\$UsnJrnl', 'C:\\ProgramData\\lockbit_readme.txt'],
      networkIps: ['185.220.101.5'],
    },
    tags: ['DFIR', 'Ransomware', 'USN Journal', 'LockBit', 'Incident Response'],
  },
  {
    id: 'dsp-tls-sni-esni-ech-privacy',
    dispatchId: 'DSP-2025-078',
    title: 'Blinding the Censors: How Encrypted Client Hello (ECH) Protects Internet Freedom',
    category: 'architecture',
    severity: 'MEDIUM',
    date: 'SEP 2024',
    readTime: '4 MIN READ',
    summary: 'Standard HTTPS encrypts web page content, but the domain name you visit is still visible in plain text (the SNI). Encrypted Client Hello (ECH) seals this final privacy loophole to block nation-state snooping.',
    plainEnglish: 'HTTPS is like putting a letter inside an armored lockbox, but the mailing address on the outside is still written in plain English. ECH places that lockbox inside a secondary unmarked envelope so the mail carrier cannot see where it is going.',
    impact: 'Prevents Internet Service Providers (ISPs) and governments from snooping on browsing history and blocking independent journalism or sensitive services.',
    mitreAttck: 'T1041 - Exfiltration Over C2 Channel / T1557',
    targetSystem: 'Cloudflare Edge / Nginx 1.25 / DNS over HTTPS (DoH)',
    findings: [
      'Demonstrated how ISP deep packet inspection middleboxes inject TCP RST packets upon observing cleartext domain names in TLS handshakes.',
      'Configured ECH with outer SNI masquerading as an innocuous public cloud domain while negotiating the true destination securely inside.',
      'Achieved 100% censorship bypass across 4 heavily restricted international telecom networks.',
    ],
    mitigations: [
      'Enable Encrypted Client Hello (ECH) and DNS-over-HTTPS (DoH) across all public enterprise web endpoints.',
      'Publish HTTPS (Type 65) DNS resource records containing valid public ECH encryption keys.',
      'Rotate outer SNI covers regularly to prevent statistical traffic volume analysis by network monitors.',
    ],
    pocCommand: 'dig +https @1.1.1.1 ech.cloudflare.com TYPE65',
    yaraRule: `rule ECH_Encrypted_Client_Hello_Traffic {
  meta:
    description = "Detects ECH extension in TLS ClientHello packets"
    author = "Labib Bin Shahed"
    severity = "INFORMATIONAL"
  strings:
    $ech_ext = { FE 0D } /* ECH outer extension code */
    $doh_hdr = "application/dns-message"
  condition:
    all of them
}`,
    iocs: {
      sha256: '0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
      filePaths: ['/etc/bind/named.conf.options', '/etc/nginx/ech.conf'],
      networkIps: ['1.1.1.1', '1.0.0.1'],
    },
    tags: ['ECH', 'TLS 1.3', 'DoH', 'Privacy', 'Network Security'],
  },
  {
    id: 'dsp-firmware-spi-flash-chip-whisperer',
    dispatchId: 'DSP-2025-071',
    title: 'Sniffing Secrets from Hardware: Dumping Router Flash Memory over SPI',
    category: 'kernel',
    severity: 'MEDIUM',
    date: 'AUG 2024',
    readTime: '5 MIN READ',
    summary: 'When software passwords and firewalls block access, physical hardware interfaces tell the truth. By connecting directly to the SPI flash chip with a Raspberry Pi, we extracted firmware and discovered hardcoded vendor backdoors.',
    plainEnglish: 'If you lose the keys to your front door, you could spend hours picking the lock—or you could unscrew the hinge pins directly from the frame. Connecting a test clip to the memory chip lets you read all its stored secrets directly.',
    impact: 'Discovers hardcoded administrative backdoors, private encryption keys, and unpatched firmware vulnerabilities in commercial networking gear.',
    mitreAttck: 'T1542.001 - System Firmware',
    targetSystem: 'Cisco Small Business Routers / Winbond W25Q128 SPI Flash',
    findings: [
      'Attached an SOIC-8 test clip to the router’s SPI flash memory chip to intercept boot communications.',
      'Extracted a 16 MB raw flash binary containing bootloader configuration variables and password hashes.',
      'Identified a hardcoded factory diagnostic account with root privileges embedded inside the /bin/busybox binary.',
    ],
    mitigations: [
      'Enable hardware Cryptographic Secure Boot with burned hardware efuses (e.g. ARM TrustZone / TPM).',
      'Encrypt SPI flash contents with hardware on-the-fly decryption (OTFDEC) so raw chips cannot be dumped in plaintext.',
      'Conformal coat circuit boards and eliminate exposed test pads on production hardware.',
    ],
    pocCommand: 'flashrom -p linux_spi:dev=/dev/spidev0.0,spispeed=16000 -r router_firmware.bin',
    yaraRule: `rule Embedded_Router_Backdoor_String {
  meta:
    description = "Detects hardcoded backdoor accounts in router binaries"
    author = "Labib Bin Shahed"
    severity = "MEDIUM"
  strings:
    $dbg_user = "debug_admin_factory"
    $dbg_hash = "$1$dbg$abcdefghijklmnopqrstuv"
  condition:
    all of them
}`,
    iocs: {
      sha256: '4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
      filePaths: ['/dev/spidev0.0', 'router_firmware.bin'],
      networkIps: ['192.168.1.1'],
    },
    tags: ['Hardware Security', 'SPI Flash', 'Firmware', 'ChipWhisperer', 'Reverse Engineering'],
  },
];
