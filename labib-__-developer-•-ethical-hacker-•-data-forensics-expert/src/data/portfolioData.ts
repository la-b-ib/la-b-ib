import {
  Skill,
  Mission,
  Casefile,
  Dispatch,
  Credential,
  VerifiedBadge,
  CredentialProfile,
  Recommendation,
  EducationData,
  ThesisData,
  PublicationData,
  AwardData,
  OrganizationGroup,
} from '../types';

export const SKILLS_DATA: Skill[] = [
  // --- PROGRAMMING LANGUAGES ---
  {
    id: 'java',
    title: 'Java',
    category: 'languages',
    level: 86,
    levelLabel: 'ENTERPRISE SYSTEMS ENG',
    expYears: '3.5 YRS',
    command: 'mvn clean package -DskipTests && java -jar target/app.jar',
    icon: 'ri-java-line',
    description: 'Modern Java 21+ features, Virtual Threads (Project Loom), Spring Boot microservices, JVM profiling, Garbage Collection tuning, & robust enterprise architectures.',
    tags: ['Java 21', 'Spring Boot', 'JVM', 'Hibernate'],
    ecosystem: 'OpenJDK 21',
  },
  {
    id: 'python',
    title: 'Python',
    category: 'languages',
    level: 88,
    levelLabel: 'ADVANCED PRACTITIONER',
    expYears: '4+ YRS',
    command: 'python3 -m cProfile -s time engine_core.py',
    icon: 'ri-terminal-window-line',
    description: 'Asyncio event loops, high-performance concurrency, CPython bytecode internals, security tooling, data processing, & ML integrations.',
    tags: ['Asyncio', 'FastAPI', 'CPython', 'Pytest', 'Scapy'],
    ecosystem: 'Python 3.12+',
  },
  {
    id: 'golang',
    title: 'Go (Golang)',
    category: 'languages',
    level: 84,
    levelLabel: 'DISTRIBUTED SYSTEMS ENG',
    expYears: '3+ YRS',
    command: 'go build -ldflags="-s -w" -race ./cmd/server',
    icon: 'ri-connector-line',
    description: 'High-throughput goroutine architectures, lockless memory structures, microservices, gRPC, eBPF probe handlers, & zero-copy network pipelines.',
    tags: ['Goroutines', 'gRPC', 'eBPF', 'Gin', 'Pprof'],
    ecosystem: 'Go 1.23',
  },
  {
    id: 'rust',
    title: 'Rust',
    category: 'languages',
    level: 78,
    levelLabel: 'SYSTEMS DEVELOPER',
    expYears: '2.5 YRS',
    command: 'cargo test --release --workspace -- --nocapture',
    icon: 'ri-file-code-line',
    description: 'Memory safety without GC, Tokio async runtime, fearless concurrency, zero-cost abstractions, FFI bindings, & low-level vulnerability research tools.',
    tags: ['Tokio', 'Memory Safety', 'Wasm', 'FFI', 'Actix'],
    ecosystem: 'Rust 2024',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    category: 'languages',
    level: 89,
    levelLabel: 'SENIOR DEVELOPER',
    expYears: '4.5 YRS',
    command: 'tsc --noEmit --strict --isolatedModules',
    icon: 'ri-text-to-speech-line',
    description: 'Advanced conditional types, template literal types, AST manipulation, full-stack typed contracts, React 19 architecture, & high-perf Node/Bun.',
    tags: ['Strict Typing', 'Generics', 'AST', 'Zod', 'ESNext'],
    ecosystem: 'TypeScript 5.6+',
  },

  // --- WEB DEVELOPMENT ---
  {
    id: 'react',
    title: 'React',
    category: 'web',
    level: 89,
    levelLabel: 'SENIOR FRONTEND ENG',
    expYears: '4+ YRS',
    command: 'npx vite build --minify terser',
    icon: 'ri-reactjs-line',
    description: 'React 19 Server Components, concurrent rendering hooks, custom memory-conscious state stores, WebGL integrations, & accessible micro-frontends.',
    tags: ['React 19', 'Zustand', 'React Query', 'WebGL'],
    ecosystem: 'React 19',
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    category: 'web',
    level: 85,
    levelLabel: 'FULL-STACK SPECIALIST',
    expYears: '3.5 YRS',
    command: 'next build --turbopack --experimental-app-only',
    icon: 'ri-pages-line',
    description: 'App Router architecture, edge middleware runtime, ISR, streaming SSR with Suspense, SEO optimization, & high-throughput CDN edge distribution.',
    tags: ['App Router', 'Edge Runtime', 'Turbopack', 'SSR'],
    ecosystem: 'Next.js 15',
  },
  {
    id: 'tailwindcss',
    title: 'Tailwind CSS',
    category: 'web',
    level: 90,
    levelLabel: 'UI/UX SYSTEM SPECIALIST',
    expYears: '4+ YRS',
    command: 'npx @tailwindcss/cli -i ./input.css -o ./dist.css --minify',
    icon: 'ri-palette-line',
    description: 'Tailwind v4 architecture, modern design token pipelines, dark-mode tokens, fluid typography, hardware-accelerated animations, & zero-runtime CSS.',
    tags: ['Tailwind v4', 'Design Tokens', 'CSS Grid'],
    ecosystem: 'Tailwind v4',
  },
  {
    id: 'graphql',
    title: 'GraphQL',
    category: 'web',
    level: 76,
    levelLabel: 'API INTEGRATION ENG',
    expYears: '2.5 YRS',
    command: 'graphql-codegen --config codegen.yml',
    icon: 'ri-node-tree',
    description: 'Federated schema design (Apollo / GraphQL Mesh), dataloader N+1 batching, AST query complexity limiters, subscriptions, & type-safe clients.',
    tags: ['Apollo Federation', 'Type-Safe Queries', 'DataLoader'],
    ecosystem: 'GraphQL / Apollo',
  },

  // --- BACKEND & DATABASES ---
  {
    id: 'nodejs',
    title: 'Node.js',
    category: 'backend',
    level: 87,
    levelLabel: 'SENIOR BACKEND ENG',
    expYears: '4+ YRS',
    command: 'node --max-old-space-size=4096 --experimental-strip-types app.ts',
    icon: 'ri-server-line',
    description: 'Event loop tuning, libuv threadpools, V8 heap profiling, fastify/express pipelines, worker threads, & resilient microservice orchestrations.',
    tags: ['Event Loop', 'Fastify', 'Streams', 'Worker Threads'],
    ecosystem: 'Node.js 22 LTS',
  },
  {
    id: 'springboot',
    title: 'Spring Boot',
    category: 'backend',
    level: 74,
    levelLabel: 'ENTERPRISE SERVICE ENG',
    expYears: '2.5 YRS',
    command: 'mvn clean package -DskipTests=false spring-boot:run',
    icon: 'ri-leaf-line',
    description: 'Spring Security 6 with OAuth2/OIDC, Spring Cloud distributed configurations, Reactive WebFlux, JPA/Hibernate indexing, & resilient CQRS.',
    tags: ['WebFlux', 'Hibernate/JPA', 'OAuth2/OIDC'],
    ecosystem: 'Spring Boot 3.3',
  },
  {
    id: 'postgresql',
    title: 'PostgreSQL',
    category: 'backend',
    level: 86,
    levelLabel: 'DATABASE SPECIALIST',
    expYears: '4+ YRS',
    command: 'psql -h cluster-01.db -U secops -d primary -c "EXPLAIN ANALYZE..."',
    icon: 'ri-database-2-line',
    description: 'Relational data modeling, ACID isolation levels, B-tree/BRIN/GIN indexing, partitioning, WAL replication streams, & pgvector similarity search.',
    tags: ['pgvector', 'GIN/BRIN Indexing', 'ACID'],
    ecosystem: 'PostgreSQL 16',
  },
  {
    id: 'redis',
    title: 'Redis',
    category: 'backend',
    level: 82,
    levelLabel: 'CACHING & PUBSUB ENG',
    expYears: '3+ YRS',
    command: 'redis-cli --latency-history -h cache-cluster -p 6379',
    icon: 'ri-flashlight-line',
    description: 'In-memory data structures, distributed locks (Redlock), Redis Streams, Pub/Sub messaging, TTL eviction policies, & sub-millisecond cluster caching.',
    tags: ['Redis Streams', 'Redlock', 'Cluster Sharding'],
    ecosystem: 'Redis 7.2',
  },

  // --- DATA SCIENCE & AI ---
  {
    id: 'pytorch',
    title: 'PyTorch',
    category: 'datascience',
    level: 75,
    levelLabel: 'ML RESEARCH ENG',
    expYears: '2.5 YRS',
    command: 'torchrun --nproc_per_node=4 train_transformer.py',
    icon: 'ri-brain-line',
    description: 'Deep neural network training, transformer fine-tuning, CUDA kernel acceleration, distributed data parallelism, & anomaly detection models for telemetry.',
    tags: ['CUDA Acceleration', 'TorchScript', 'DDP', 'LLMs'],
    ecosystem: 'PyTorch 2.4',
  },
  {
    id: 'tensorflow',
    title: 'TensorFlow',
    category: 'datascience',
    level: 70,
    levelLabel: 'ML APPLIED ENG',
    expYears: '2 YRS',
    command: 'python3 -m tf.keras.models.export --saved_model_dir=./model',
    icon: 'ri-bubble-chart-line',
    description: 'Production model serving (TF Serving), TFLite edge quantization, computational graph optimization, & automated SOC event classification pipelines.',
    tags: ['Keras', 'TF Serving', 'TFLite', 'Quantization'],
    ecosystem: 'TensorFlow 2.16',
  },
  {
    id: 'scikitlearn',
    title: 'scikit-learn',
    category: 'datascience',
    level: 83,
    levelLabel: 'DATA SCIENCE PRACTITIONER',
    expYears: '3.5 YRS',
    command: 'python3 fit_ensemble_classifier.py --dataset=network_logs.parquet',
    icon: 'ri-line-chart-line',
    description: 'Statistical feature extraction, random forest/XGBoost ensembles, PCA dimensionality reduction, clustering anomaly vectors, & ROC-AUC hyper-tuning.',
    tags: ['XGBoost', 'PCA & Clustering', 'ROC-AUC'],
    ecosystem: 'scikit-learn',
  },
  {
    id: 'kafka',
    title: 'Apache Kafka',
    category: 'datascience',
    level: 79,
    levelLabel: 'STREAMING PIPELINE ENG',
    expYears: '3 YRS',
    command: 'kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe',
    icon: 'ri-brush-ai-3-line',
    description: 'High-throughput distributed event streaming, Kafka Connect, partitioned topic design, exactly-once processing semantics, & live cyber event pipelines.',
    tags: ['Event Streaming', 'Kafka Connect', 'Schema Registry'],
    ecosystem: 'Kafka / KRaft',
  },

  // --- CLOUD & DEVOPS ---
  {
    id: 'aws',
    title: 'Amazon Web Services (AWS)',
    category: 'cloud',
    level: 86,
    levelLabel: 'SOLUTIONS PRACTITIONER',
    expYears: '4+ YRS',
    command: 'aws sts get-caller-identity && aws eks update-kubeconfig',
    icon: 'ri-cloud-line',
    description: 'IAM Zero-Trust least-privilege, VPC peering, AWS GuardDuty, EKS clusters, Lambda serverless, S3 security policies, KMS encryption, & CloudWatch.',
    tags: ['EKS', 'IAM Zero-Trust', 'KMS Encryption', 'GuardDuty'],
    ecosystem: 'AWS Cloud',
  },
  {
    id: 'docker',
    title: 'Docker',
    category: 'cloud',
    level: 89,
    levelLabel: 'CONTAINERIZATION ENG',
    expYears: '4.5 YRS',
    command: 'docker buildx build --platform linux/amd64,linux/arm64 --push .',
    icon: 'ri-stack-line',
    description: 'Multi-stage rootless builds, distroless minimal base images, Docker Compose orchestration, cgroups isolation, & vulnerability scanning with Trivy.',
    tags: ['Rootless', 'Docker Compose', 'Trivy Scanning'],
    ecosystem: 'Docker Engine',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    category: 'cloud',
    level: 81,
    levelLabel: 'K8S CLUSTER OPERATOR',
    expYears: '3 YRS',
    command: 'kubectl get pods -A -o wide --watch',
    icon: 'ri-fediverse-line',
    description: 'Enterprise cluster architecture, Helm charts, CRDs, Istio service mesh, NetworkPolicies, Horizontal Pod Autoscaling, & RBAC zero-trust policies.',
    tags: ['Istio Mesh', 'Helm Charts', 'HPA', 'RBAC Enforce'],
    ecosystem: 'Kubernetes 1.31',
  },
  {
    id: 'terraform',
    title: 'Terraform',
    category: 'cloud',
    level: 77,
    levelLabel: 'IAC DEPLOYMENT ENG',
    expYears: '2.5 YRS',
    command: 'terraform plan -out=tfplan.binary && terraform apply',
    icon: 'ri-box-3-line',
    description: 'Declarative multi-cloud provisioning, modular state management, remote backend S3/DynamoDB locking, Sentinel policy enforcement, & drift detection.',
    tags: ['HCL Modules', 'Drift Detection', 'Multi-Cloud'],
    ecosystem: 'Terraform',
  },

  // --- OPERATING SYSTEMS ---
  {
    id: 'ubuntu',
    title: 'Ubuntu Linux',
    category: 'os',
    level: 90,
    levelLabel: 'LINUX SYSADMIN',
    expYears: '5 YRS',
    command: 'lsb_release -a && uname -r && systemctl status auditd',
    icon: 'ri-coreos-line',
    description: 'Kernel tuning (sysctl), systemd service unit hardening, AppArmor profiling, eBPF tracing, package management (APT), & automated cloud-init setup.',
    tags: ['Kernel Tuning', 'systemd Hardening', 'eBPF Tracing'],
    ecosystem: 'Ubuntu 24.04 LTS',
  },
  {
    id: 'rhel',
    title: 'Red Hat Enterprise Linux',
    category: 'os',
    level: 82,
    levelLabel: 'RHEL ENTERPRISE ADMIN',
    expYears: '3.5 YRS',
    command: 'sestatus && dnf check-update && subscription-manager status',
    icon: 'ri-centos-line',
    description: 'SELinux mandatory access control policy enforcement, PAM auth integration, Firewalld packet filtering, & enterprise compliance hardening (FIPS 140-3).',
    tags: ['Firewalld', 'FIPS Compliance', 'RPM/DNF'],
    ecosystem: 'RHEL 9.x',
  },
  {
    id: 'debian',
    title: 'Debian GNU/Linux',
    category: 'os',
    level: 85,
    levelLabel: 'DEBIAN SYSADMIN',
    expYears: '4 YRS',
    command: 'apt-get install -y linux-image-rt-amd64 && dpkg -l',
    icon: 'ri-command-line',
    description: 'Minimal debian server installations, kernel recompilation, unattended upgrades, deb package creation, & immutable production operating systems.',
    tags: ['dpkg / APT', 'Kernel Rebuild', 'Stability'],
    ecosystem: 'Debian 12',
  },
  {
    id: 'windows-server',
    title: 'Microsoft Windows Server',
    category: 'os',
    level: 73,
    levelLabel: 'SERVER & AD ADMIN',
    expYears: '2.5 YRS',
    command: 'powershell -Command "Get-ADUser -Filter * | Export-Csv"',
    icon: 'ri-windows-line',
    description: 'Active Directory / Group Policy (GPO) hardening, Kerberos ticket management, PowerShell automation, Windows Event Log forwarding, & Defender ATP.',
    tags: ['GPO Hardening', 'PowerShell Core', 'Kerberos'],
    ecosystem: 'WinServer 2022',
  },

  // --- DEVELOPMENT TOOLS ---
  {
    id: 'git',
    title: 'Git',
    category: 'tools',
    level: 90,
    levelLabel: 'VCS SPECIALIST',
    expYears: '5 YRS',
    command: 'git log --graph --oneline --decorate --all -n 20',
    icon: 'ri-git-branch-line',
    description: 'Advanced git internals, rebasing workflows, interactive bisect debugging, signed GPG commits, submodules, & trunk-based CI branching strategies.',
    tags: ['GPG Signing', 'Git Bisect', 'Hooks & CI'],
    ecosystem: 'Git 2.46+',
  },
  {
    id: 'vscode',
    title: 'Visual Studio Code',
    category: 'tools',
    level: 89,
    levelLabel: 'IDE WORKFLOW POWER-USER',
    expYears: '4.5 YRS',
    command: 'code --list-extensions --show-versions',
    icon: 'ri-code-box-line',
    description: 'Custom extension dev, LSP integration, devcontainers, remote SSH debugging, multi-target debugging configurations, & keyboard-driven ergonomics.',
    tags: ['Devcontainers', 'Remote SSH', 'LSP Integration'],
    ecosystem: 'VS Code',
  },
  {
    id: 'jetbrains',
    title: 'JetBrains IDEs',
    category: 'tools',
    level: 80,
    levelLabel: 'IDE TOOLING ENG',
    expYears: '3.5 YRS',
    command: 'idea . --diff file_original.go file_patched.go',
    icon: 'ri-keyboard-line',
    description: 'IntelliJ IDEA, GoLand, CLion, PyCharm: structural search & replace, memory snapshot profilers, database tool windows, & JVM/native profiling.',
    tags: ['IntelliJ', 'GoLand', 'CLion', 'PyCharm'],
    ecosystem: 'JetBrains Suite',
  },
  {
    id: 'postman',
    title: 'Postman',
    category: 'tools',
    level: 86,
    levelLabel: 'API TESTING PRACTITIONER',
    expYears: '4 YRS',
    command: 'newman run api_collection.json -e staging.env.json',
    icon: 'ri-send-plane-line',
    description: 'Automated REST/gRPC/WebSocket test collections, environment variables, Newman CI/CD integration, mock servers, & OAuth 2.0 auth flows.',
    tags: ['Newman CLI', 'gRPC Testing', 'OAuth2 Automation'],
    ecosystem: 'Postman v11',
  },

  // --- CYBERSECURITY & OFFENSE ---
  {
    id: 'metasploit',
    title: 'Metasploit & Exploit Dev',
    category: 'offsec',
    level: 85,
    levelLabel: 'SECURITY RESEARCHER',
    expYears: '3.5 YRS',
    command: 'msfconsole -q -x "use exploit/multi/handler"',
    icon: 'ri-file-shield-2-line',
    description: 'Custom exploit payload development, buffer overflow crafting, shellcode injection, ROP chain assembly, & post-exploitation persistence.',
    tags: ['ROP Chains', 'Buffer Overflow', 'Persistence'],
    ecosystem: 'Metasploit',
  },
  {
    id: 'burpsuite',
    title: 'Burp Suite Pro & WebSec',
    category: 'offsec',
    level: 88,
    levelLabel: 'WEB APP AUDITOR',
    expYears: '4 YRS',
    command: 'burpsuite --config-file=secops.json',
    icon: 'ri-bug-2-line',
    description: 'Deep web application auditing: SQLi, XSS, SSRF, IDOR, GraphQL payload manipulation, WebSockets inspection, & auth bypass.',
    tags: ['Burp Extender', 'SSRF/XSS', 'IDOR', 'Turbo Intruder'],
    ecosystem: 'Burp Suite Pro',
  },
  {
    id: 'nmap',
    title: 'Nmap & Network Recon',
    category: 'offsec',
    level: 87,
    levelLabel: 'RECON SPECIALIST',
    expYears: '4 YRS',
    command: 'nmap -sS -sV -sC -p- -T4 10.0.0.0/24',
    icon: 'ri-base-station-line',
    description: 'Advanced stealth port scanning, NSE script development, OS fingerprinting, firewall evasion, & raw packet crafting.',
    tags: ['NSE Scripting', 'Stealth Scan', 'OS Fingerprint'],
    ecosystem: 'Nmap / NSE',
  },
  {
    id: 'volatility',
    title: 'Volatility 3 & RAM Forensics',
    category: 'dfir',
    level: 81,
    levelLabel: 'MEMORY FORENSIC ENG',
    expYears: '3 YRS',
    command: 'vol -f memory.raw windows.pslist.PsList',
    icon: 'ri-ram-2-line',
    description: 'Physical RAM memory dump extraction, kernel process tree rebuilding, SSDT/IDT hook detection, & unlinked VAD analysis.',
    tags: ['RAM Extraction', 'Kernel Hooks', 'Malfind'],
    ecosystem: 'Volatility 3',
  },
  {
    id: 'ghidra',
    title: 'Ghidra & Reverse Eng',
    category: 'dfir',
    level: 72,
    levelLabel: 'BINARY RE ANALYST',
    expYears: '2.5 YRS',
    command: 'ghidraRun /project/rootkit_sample.gpr',
    icon: 'ri-fingerprint-2-line',
    description: 'Decompiling x86/x64 assembly binaries, analyzing obfuscated C2 payloads, control flow graph dissection, & dynamic debugging.',
    tags: ['CFG Analysis', 'x86/x64 Assembly', 'C2 Payloads'],
    ecosystem: 'Ghidra / Sleigh',
  },
  {
    id: 'yara',
    title: 'YARA Rules & Threat Hunting',
    category: 'dfir',
    level: 80,
    levelLabel: 'DETECTION AUTHOR',
    expYears: '3 YRS',
    command: 'yara -r -m -s rules/malware_apt.yar /tmp',
    icon: 'ri-crosshair-2-line',
    description: 'Authoring high-precision YARA detection signatures targeting entropy spikes, opcode sequences, and binary header artifacts.',
    tags: ['Byte Signatures', 'Entropy Scans', 'Opcode Matching'],
    ecosystem: 'YARA-X',
  },
  {
    id: 'crypto',
    title: 'Applied Cryptography & ZK',
    category: 'crypto',
    level: 76,
    levelLabel: 'SECURITY CRYPTO ENG',
    expYears: '3 YRS',
    command: 'openssl req -x509 -newkey rsa:4096 -keyout sec.key',
    icon: 'ri-git-repository-private-line',
    description: 'AES-256-GCM, RSA/ECDSA P-256 signature verification, WebCrypto API, TLS 1.3 handshakes, & Zero-Knowledge Proof primitives.',
    tags: ['AES-GCM', 'ECDSA P-256', 'WebCrypto', 'ZK Proofs'],
    ecosystem: 'OpenSSL / ZK',
  },
  {
    id: 'wireshark',
    title: 'TCP/IP Internals & Wireshark',
    category: 'crypto',
    level: 85,
    levelLabel: 'PACKET ANALYSIS ENG',
    expYears: '4 YRS',
    command: 'tshark -i eth0 -Y "http.request.method == POST"',
    icon: 'ri-rfid-line',
    description: 'Deep packet inspection, raw socket manipulation, custom binary protocol dissection, & TLS session key decryption.',
    tags: ['PCAP Dissection', 'Raw Sockets', 'TLS Decrypt'],
    ecosystem: 'Wireshark / TShark',
  },
];

export const MISSIONS_DATA: Mission[] = [
  {
    id: 'ieee-cs-bdc-president',
    title: 'President',
    company: 'IEEE CSBDC Secretariat',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/secretariat.JPEG',
    icon: 'ri-government-line',
    location: 'DHK, BD',
    period: '1/25-3/26',
    category: 'offsec',
    isCurrent: true,
    summary: 'Directing chapter vision, strategic partnerships, technical event management, branding, and member development across Bangladesh.',
    bullets: [
      'Strategic Leadership: Shape chapter vision and align strategic goals with IEEE CS BDC Executive Committee directives.',
      'Event & Program Management: Design, execute, and evaluate technical events to advance computer science education and innovation.',
      'Stakeholder Engagement: Establish partnerships across academia, industry leaders, and professional networks.',
      'Operations & Branding: Manage chapter resources, secure operational funding, and lead branding and sustainability initiatives.',
      'Member Development: Establish initiatives for member skill-building, career advancement, and professional recognition.',
    ],
    tech: ['IEEE CS BDC', 'Strategic Leadership', 'Event Management', 'Operations & Branding', 'Member Development'],
  },
  {
    id: 'bueec-director-editorial',
    title: 'Director, Editorial',
    company: 'BUEEC',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/bueec.JPEG',
    icon: 'ri-team-line',
    location: 'DHK, BD',
    period: '8/21-2/25',
    category: 'fullstack',
    summary: 'Progressed from General Member to Director over 3+ years, advancing EE initiatives, editorial publications, showcases, and workshops.',
    bullets: [
      'Leadership Progression: Progressed from General Member to Director over 3+ years, advancing EE initiatives.',
      'Editorial & Media Leadership: Directed editorial content (Jul ’24–Feb ’25), led Atomisation showcase & Media Committee.',
      'Publication & Content Development: As Assistant Director (Oct ’23–Jun ’24), developed Dhrubok magazine & event content.',
      'Workshop & Event Management: Managed robotics workshops & social media as General Member, boosting club visibility.',
    ],
    tech: ['Editorial Leadership', 'Dhrubok Magazine', 'Atomisation Showcase', 'Media Committee', 'Robotics Workshops'],
  },
  {
    id: 'bracu-express-journalist',
    title: 'Journalist',
    company: 'BRACU Express',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/be.jpg',
    icon: 'ri-news-line',
    location: 'DHK, BD',
    period: '4/23-1/25',
    category: 'fullstack',
    summary: 'In-depth investigative reporting, multimedia graphic production, and editorial collaboration across campus publication topics.',
    bullets: [
      'Investigative Reporting: Conducted in-depth research and expert interviews to publish timely, insightful news coverage.',
      'Multimedia Production: Produced graphics and photography to complement written articles and boost reader engagement.',
      'Editorial Collaboration: Worked alongside the editorial team to edit, refine, and maintain high publication standards across campus topics.',
    ],
    tech: ['Investigative Reporting', 'Multimedia Production', 'Editorial Standards', 'Journalism', 'Research'],
  },
  {
    id: 'tachyon-science-writer',
    title: 'Writer-202301003',
    company: 'Tachyon',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/tachyon.JPEG',
    icon: 'ri-poker-clubs-line',
    location: 'DHK, BD',
    period: '5/23-5/24',
    category: 'dfir',
    summary: 'Translating complex academic literature in physics and environmental science into educational public content for STEM literacy.',
    bullets: [
      'Science Communication: Analyzed research papers to author accessible articles on complex topics in physics and environmental science.',
      'Editorial Alignment: Collaborated with editors to transform academic literature into educational public content.',
      'STEM Outreach: Contributed to the nonprofit’s core mission of improving public science literacy and critical thinking across Bangladesh.',
    ],
    tech: ['Science Communication', 'Academic Literature', 'Physics', 'Environmental Science', 'STEM Outreach'],
  },
  {
    id: 'ieee-pes-day-ambassador',
    title: 'AMB-PESDAY24-217',
    company: 'PES Day 24',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/pes.JPEG',
    icon: 'ri-lightbulb-line',
    location: 'DHK, BD',
    period: '2/24-5/24',
    category: 'offsec',
    summary: 'Global advocacy and event organization for electric mobility innovation during IEEE PES Day in collaboration with 700+ international ambassadors.',
    bullets: [
      'Global Advocacy: Selected as Ambassador for the theme "Empowering Electric Mobility Innovation," collaborating with 700+ international ambassadors during IEEE PES Day (Apr 22–24, 2024).',
      'Event Organization: Spearheaded the webinar "Future Trends in Electric Mobility: Challenges and Opportunities" (Apr 23, 2024) in partnership with the IEEE PES BRACU Student Branch Chapter.',
      'Industry Collaboration: Featured guest speakers from Team Crack Platoon and SAE teams from RUET to promote sustainable transport solutions.',
    ],
    tech: ['Electric Mobility', 'Global Advocacy', 'IEEE PES', 'Webinar Organization', 'Industry Collaboration'],
  },
  {
    id: 'bts-blood-donor',
    title: 'Community Volunteer',
    company: 'Thalassaemia Samity',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/bts.jpg',
    icon: 'ri-hand-heart-line',
    location: 'DHK, BD',
    period: '1/21-Act',
    category: 'dfir',
    summary: 'Contributing to lifesaving healthcare initiatives through regular voluntary blood donations, campus outreach, and institutional partnerships to support thalassaemia patients.',
    bullets: [
      'Direct Health Impact: Donated 13 bags of blood, providing vital transfusion support for individuals undergoing long term thalassaemia care.',
      'Campus Engagement & Emergency Response: Actively participate in on campus blood drives co hosted by the BRAC University Response Team and serve as an on call emergency donor for urgent, group-specific patient needs.',
      'On-Ground Engagement: Actively participate in in person donation drives, engaging with prospective donors and supporting operational activities.',
      'Awareness & Advocacy: Champion regular blood donation campaigns to foster sustainable donor networks and ensure consistent supply for critical patient needs.',
    ],
    tech: ['Healthcare Advocacy', 'Blood Donation', 'Community Outreach', 'Emergency Response', 'Thalassaemia Support'],
  },
  {
    id: 'ieee-csbdc-team-spark',
    title: 'Publication Volunteer',
    company: 'Team Spark',
    logo: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/missions/spark.JPEG',
    icon: 'ri-sparkling-line',
    location: 'DHK, BD',
    period: '4/23-4/24',
    category: 'fullstack',
    summary: 'Served as Content Writer for IEEE CSBDC Team Spark, creating impactful articles, social posts, and promotional campaigns for technical initiatives.',
    bullets: [
      'Recognition & Impact: Served as Content Writer for IEEE CSBDC Team Spark (Apr ’23–Apr ’24), earning a Certificate of Appreciation for outstanding contributions.',
      'Content & Digital Communications: Wrote articles, social posts, and promotional content boosting visibility for workshops and technology initiatives.',
      'Resource Collaboration: Collaborated on educational resources and digital communications, strengthening knowledge-sharing and member engagement.',
    ],
    tech: ['Content Writing', 'IEEE CS BDC', 'Technical Communications', 'Digital Outreach', 'Community Engagement'],
  },
];

export const RECOMMENDATIONS_DATA: Recommendation[] = [
  {
    id: 'rec-km-shariat-ullah',
    name: 'K M Shariat Ullah',
    role: 'Founder, Tachyon',
    linkedIn: 'https://www.linkedin.com/in/kmshariat?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    quote: 'Labib worked as a science content writer at Tachyon. He consistently delivered quality work, transforming complex scientific research into accessible content that actually gets read—something most science writers struggle with. He strikes the right balance, making sophisticated concepts understandable without dumbing them down. I confidently endorse Labib for his proven writing skills, scientific understanding, and his ability to produce content that serves its purpose effectively.',
    badgeColor: 'border-teal-500/40 text-teal-300 bg-teal-500/10',
    imageUrl: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/recommendation/kmsu.jpg',
  },
  {
    id: 'rec-branca-boson',
    name: 'Branca Boson',
    role: 'Storyteller | Writer | Editor',
    linkedIn: 'https://www.linkedin.com/in/brancaboson?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    quote: 'Labib and I had a nice conversation that gave me a lot of precious insights about my professional strategy. He was very generous and friendly. I expect to always count on his helpful and wise point of view.',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    imageUrl: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/recommendation/bb.jpg',
  },
  {
    id: 'rec-rashedul-arefin',
    name: 'Rashedul Arefin',
    role: 'Former Joint Secretary, IEEE CS BDC',
    linkedIn: 'https://www.linkedin.com/in/ifty1011/',
    quote: "It is with great pleasure that I recommend Labib Bin Shahed, with whom I've had the privilege of working for two years at IEEE CS BDC Secretariat. Labib is an experienced content writer whose work has significantly contributed to our organization's success. As my Vice President, he has demonstrated exceptional leadership, often taking charge in my absence and ensuring tasks are completed to perfection. Labib's ability to manage teams and persuade others makes him an invaluable asset to any project. I confidently endorse Labib for his dedication, proficiency, and outstanding leadership skills.",
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
    imageUrl: 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/recommendation/rai.jpg',
  },
];

export const CASEFILES_DATA: Casefile[] = [
  {
    id: 'duskprobe',
    caseId: 'CASEFILE #001',
    title: 'DuskProbe // Web Security Testing & Reconnaissance Framework',
    category: 'offsec',
    badge: 'ACTIVE RECON ENGINE',
    badgeColor: 'red',
    repoName: 'la-b-ib/DuskProbe',
    stars: 28,
    forks: 7,
    status: 'PRODUCTION SCANNER',
    version: 'v2.4.0',
    summary: 'An advanced asynchronous web application vulnerability assessment & reconnaissance engine built with Python, aiohttp, and Streamlit. Automates OWASP Top 10 surface testing, SQL injection fuzzing, reflected XSS payloads, SSRF vector discovery, sensitive headers auditing, and passive DNS mapping.',
    details: [
      'Asynchronous vulnerability scanning engine powered by aiohttp with concurrency pool throttling.',
      'Comprehensive OWASP Top 10 coverage: SQLi, Reflected/DOM XSS, SSRF, IDOR, and open redirects.',
      'Passive reconnaissance pipeline: WHOIS intelligence, SSL/TLS cipher audit, and DNS sub-domain enumeration.',
      'Interactive Streamlit web console generating structured executive vulnerability reports.',
    ],
    codeSnippet: `import aiohttp
import asyncio
from bs4 import BeautifulSoup

async def scan_owasp_vector(session: aiohttp.ClientSession, target_url: str, payload_dict: dict) -> dict:
    """Async worker evaluating XSS / SQLi reflection & status variances."""
    results = {"target": target_url, "vulnerabilities": []}
    for category, payloads in payload_dict.items():
        for payload in payloads:
            test_url = f"{target_url}?q={payload}"
            async with session.get(test_url, timeout=5, allow_redirects=False) as resp:
                text = await resp.text()
                if payload in text or resp.status == 500:
                    results["vulnerabilities"].append({
                        "category": category,
                        "payload": payload,
                        "status_code": resp.status,
                        "reflected": payload in text
                    })
    return results`,
    language: 'python',
    tech: ['Python 3.11', 'aiohttp', 'Streamlit', 'AsyncIO', 'BeautifulSoup4', 'OWASP Top 10'],
    githubUrl: 'https://github.com/la-b-ib/DuskProbe',
    liveUrl: 'https://duskprobe.streamlit.app/',
  },
  {
    id: 'ouroboros',
    caseId: 'CASEFILE #002',
    title: 'OUROBOROS // Multi-Signal Binary Analysis & Forensic Toolkit',
    category: 'dfir',
    badge: 'FORENSIC TOOLKIT',
    badgeColor: 'purple',
    repoName: 'la-b-ib/OUROBOROS',
    stars: 34,
    forks: 9,
    status: 'RESEARCH ARTIFACT',
    version: 'v1.8.2',
    summary: 'An interdisciplinary digital forensics & binary analysis engine. Fuses mathematical Shannon entropy metrics, statistical byte distribution curves, structural PE/ELF section disassembly, and explainable ML ensemble signals for malware detection, anomaly scoring, and obfuscated shellcode isolation.',
    details: [
      'Calculates sliding-window Shannon entropy to identify high-density packed or encrypted payload segments.',
      'Extracts PE / ELF header structures, section characteristics, imported DLL signatures, and suspicious API imports.',
      'Multi-signal ensemble classifier fusing statistical heuristics and structural disassembly for anomaly verdicts.',
      'Generates interactive byte-distribution visualizers and exportable DFIR forensic evidence bundles.',
    ],
    codeSnippet: `import math
from collections import Counter
import pefile

def calculate_shannon_entropy(byte_sequence: bytes) -> float:
    """Calculates mathematical Shannon entropy across byte array."""
    if not byte_sequence:
        return 0.0
    entropy = 0.0
    length = len(byte_sequence)
    byte_counts = Counter(byte_sequence)
    for count in byte_counts.values():
        p_x = count / length
        entropy -= p_x * math.log2(p_x)
    return entropy

def inspect_pe_sections(file_path: str) -> list:
    """Detects suspicious packed code sections with entropy > 7.0."""
    pe = pefile.PE(file_path)
    flagged_sections = []
    for section in pe.sections:
        ent = section.get_entropy()
        if ent > 7.0 or section.Characteristics & 0x20000000: # IMAGE_SCN_MEM_EXECUTE
            flagged_sections.append({
                "name": section.Name.decode().strip('\\x00'),
                "entropy": round(ent, 3),
                "is_executable": bool(section.Characteristics & 0x20000000)
            })
    return flagged_sections`,
    language: 'python',
    tech: ['Python', 'PEfile', 'NumPy / SciPy', 'Capstone Engine', 'Shannon Entropy', 'Streamlit'],
    githubUrl: 'https://github.com/la-b-ib/OUROBOROS',
    liveUrl: 'https://ouroboros-forensics.streamlit.app/',
  },
  {
    id: 'ciphersky',
    caseId: 'CASEFILE #003',
    title: 'CipherSky // Physics & ML-Infused Packet Flow Defense Framework',
    category: 'dfir',
    badge: 'PACKET DEFENSE ENG',
    badgeColor: 'cyan',
    repoName: 'la-b-ib/CipherSky',
    stars: 22,
    forks: 6,
    status: 'DEFENSIVE CORE',
    version: 'v1.2.0',
    summary: 'A defensive network telemetry framework integrating statistical physics, machine learning, and packet capture forensics. Captures and evaluates real-time packet bursts through thermodynamic entropy, geo-spatial flow distribution, and cryptographic randomness tests to uncover zero-day anomaly signatures.',
    details: [
      'Real-time packet ingestion and dissection using Scapy and asynchronous raw socket rings.',
      'Physic-inspired thermodynamic burst clustering to detect microsecond-scale DDoS and beaconing patterns.',
      'Geographic origin clustering and cryptographic entropy verification on transport payload segments.',
      'Generates dynamic network topology graphs and automated firewall mitigation rule sets.',
    ],
    codeSnippet: `import scapy.all as scapy
import numpy as np

class PacketFlowDefenseAnalyzer:
    def __init__(self, sample_window: int = 1000):
        self.sample_window = sample_window
        self.flow_deltas = []

    def process_packet_burst(self, packet) -> float:
        """Computes statistical variance and temporal delta of packet arrivals."""
        if packet.haslayer(scapy.IP):
            src_ip = packet[scapy.IP].src
            payload_len = len(packet[scapy.IP].payload)
            self.flow_deltas.append(payload_len)
            
            if len(self.flow_deltas) >= self.sample_window:
                variance = float(np.var(self.flow_deltas))
                self.flow_deltas.clear()
                return variance # Anomaly trigger if variance collapses (botnet beaconing)
        return 0.0`,
    language: 'python',
    tech: ['Python', 'Scapy', 'PyTorch / Scikit-Learn', 'NetworkX', 'PCAP Telemetry', 'Streamlit'],
    githubUrl: 'https://github.com/la-b-ib/CipherSky',
  },
  {
    id: 'vitasort',
    caseId: 'CASEFILE #004',
    title: 'VitaSort // AI-Powered Resume Screening & NLP Ranking Platform',
    category: 'fullstack',
    badge: 'AI / NLP PLATFORM',
    badgeColor: 'amber',
    repoName: 'la-b-ib/VitaSort',
    stars: 42,
    forks: 14,
    status: 'LIVE APPLICATION',
    version: 'v3.1.0',
    summary: 'Production-ready automated talent intelligence platform revolutionizing hiring workflows. Features high-throughput PDF parsing, TF-IDF semantic vectorization, cosine similarity ranking matrices, custom job-role weight tuning, and real-time candidate scorecards via Streamlit UI.',
    details: [
      'Multi-threaded PDF text extraction and optical layout normalization using PyPDF2 / PDFMiner.',
      'TF-IDF n-gram tokenization and cosine similarity calculation against customizable job descriptions.',
      'Interactive Streamlit web portal with dynamic score distributions, skills gap charts, and CSV exporting.',
      'Eliminates hiring bias with blinded candidate evaluation filters and transparent match criteria.',
    ],
    codeSnippet: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pypdf

def rank_candidates(job_description: str, resume_texts: list[str]) -> list[float]:
    """Generates normalized cosine similarity scores across candidate corpus."""
    corpus = [job_description] + resume_texts
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(corpus)
    
    # Compare job description (index 0) against all resumes (indices 1..N)
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
    return [round(float(score) * 100, 2) for score in similarity_scores]`,
    language: 'python',
    tech: ['Python', 'Streamlit', 'scikit-learn', 'PyPDF2 / PDFMiner', 'TF-IDF / NLP', 'Pandas'],
    githubUrl: 'https://github.com/la-b-ib/VitaSort',
    liveUrl: 'https://vitasort.streamlit.app/',
  },
  {
    id: 'litgrid',
    caseId: 'CASEFILE #005',
    title: 'LitGrid // Streamlit & SQLite High-Concurrency Library Core',
    category: 'fullstack',
    badge: 'FULL-STACK CORE',
    badgeColor: 'teal',
    repoName: 'la-b-ib/LitGrid',
    stars: 18,
    forks: 4,
    status: 'STABLE RELEASE',
    version: 'v2.0.1',
    summary: 'Modern reactive library information system built for transactional integrity and rapid search indexing. Implements SQLite ACID-compliant schema relations, patron checkout pipelines, automated fine calculation algorithms, and dynamic analytics dashboards.',
    details: [
      'ACID-compliant relational database architecture built with SQLite3 and SQLAlchemy connection pooling.',
      'Real-time patron management: book lending, return verification, reservation queues, and automated overdue fines.',
      'Reactive Streamlit UI with live inventory search, catalog filtering, and operational metric cards.',
      'Role-based access controls separating librarian administrative privileges from patron self-service browsing.',
    ],
    codeSnippet: `import sqlite3
from datetime import datetime, timedelta

def process_book_checkout(conn: sqlite3.Connection, book_id: int, member_id: int) -> bool:
    """Executes atomic book checkout with schema validation and due date calculation."""
    cursor = conn.cursor()
    try:
        cursor.execute("BEGIN TRANSACTION")
        # Check stock availability
        cursor.execute("SELECT available_copies FROM books WHERE id = ? FOR UPDATE", (book_id,))
        copies = cursor.fetchone()[0]
        if copies <= 0:
            return False
            
        due_date = (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d')
        cursor.execute("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?", (book_id,))
        cursor.execute("INSERT INTO loans (book_id, member_id, due_date, status) VALUES (?, ?, ?, 'ACTIVE')", 
                       (book_id, member_id, due_date))
        conn.commit()
        return True
    except sqlite3.Error:
        conn.rollback()
        return False`,
    language: 'python',
    tech: ['Python', 'Streamlit', 'SQLite3', 'SQLAlchemy', 'Pandas', 'Plotly', 'ACID Engine'],
    githubUrl: 'https://github.com/la-b-ib/LitGrid',
  },
];

export const EDUCATION_DATA: EducationData = {
  institution: 'BRAC University',
  degree: 'B.Sc. in CSE',
  duration: 'Jan 22 – Ongoing',
  cgpa: '3.12 / 4.00 (US Scale)',
  locationCoords: '23.77°N, 90.42°E',
  coreCoursework: [
    'Data Structures',
    'Algorithms',
    'Discrete Mathematics',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Web Technologies',
    'Natural Language Processing (NLP)',
    'Cybersecurity',
    'Cryptography & Network Security',
  ],
};

export const THESIS_DATA: ThesisData = {
  title: 'Adversarial Machine Learning in Malware Detection',
  type: 'Undergraduate Thesis',
  summary: 'Investigating adversarial attack vectors and perturbation techniques against ML-based automated malware detection models.',
};

export const PUBLICATIONS_DATA: PublicationData[] = [
  {
    id: 'pub-iceic-2025',
    title: 'Blockchain in Project Management for Information Security, Transparency and Accountability',
    conference: 'ICEIC 25',
    icon: 'ri-trello-line',
    headerDate: '19–22/01/25',
    recordType: 'RESEARCH_PUBLICATION // PEER-REVIEWED',
    venueFull: 'IEEE ICEIC 2025 (Intl. Conf. on Electronics, Info & Comm)',
    location: 'Osaka, Japan',
    date: '19–22 Jan 2025',
    isbn: '979-8-3315-1075-6',
    doi: 'https://doi.org/10.1109/ICEIC64972.2025.10879668',
  },
  {
    id: 'pub-icrpset-2024',
    title: 'Crop Prediction Using Machine Learning and IoT: A Comparative Analysis of Algorithms',
    conference: 'ICRPSET 24',
    icon: 'ri-profile-line',
    headerDate: '07–08/12/24',
    recordType: 'RESEARCH_PUBLICATION // PEER-REVIEWED',
    venueFull: 'IEEE ICRPSET 2024 (Intl. Conf. on Recent Progresses in Science, Eng & Tech)',
    location: 'Rajshahi, Bangladesh',
    date: '07–08 Dec 2024',
    isbn: '979-8-3315-0947-7',
    doi: 'https://doi.org/10.1109/ICRPSET64863.2024.10955896',
  },
];

export const HONORS_DATA: AwardData[] = [
  {
    id: 'award-duke-of-edinburgh',
    title: 'Duke of Edinburgh Gold Award',
    issuer: 'The Duke of Edinburgh\'s International Award Foundation',
  },
];

export const ORGANIZATIONS_DATA: OrganizationGroup[] = [
  {
    category: 'Technical & Security',
    items: ['OWASP', 'Trace Labs', 'IEEE', 'BUEEC'],
  },
  {
    category: 'Research, Editorial & Social',
    items: ['Osmosis Institute', 'BRACU Express', '3Zero Club'],
  },
];

export const ACADEMIC_PORTALS_DATA: CredentialProfile[] = [
  {
    name: 'Xplore',
    platform: 'IEEE Author Profile',
    username: '428150838708730',
    url: 'https://ieeexplore.ieee.org/author/428150838708730',
    icon: 'ri-book-read-line',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    status: 'AUTHOR',
    description: 'Indexed peer-reviewed IEEE conference publications and conference proceedings.',
  },
  {
    name: 'Scholar',
    platform: 'Google Scholar',
    username: 'xg04A5kAAAAJ',
    url: 'https://scholar.google.com/citations?user=xg04A5kAAAAJ&hl=en',
    icon: 'ri-google-line',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    status: 'RES. PROFILE',
    description: 'Academic citations, co-authorships, and indexed computer science publications.',
  },
  {
    name: 'ORCIDiD',
    platform: 'ORCID Repository',
    username: '0009-0007-4656-8709',
    url: 'https://orcid.org/0009-0007-4656-8709',
    icon: 'ri-fingerprint-line',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    status: 'RESEARCHER',
    description: 'Persistent digital identifier distinguishing academic research contributions.',
  },
  {
    name: 'ResGate',
    platform: 'ResearchGate',
    username: 'Labib-Bin-Shahed',
    url: 'https://www.researchgate.net/profile/Labib-Bin-Shahed',
    icon: 'ri-article-line',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    status: 'RESEARCHER',
    description: 'Pre-prints, research network metrics, citations, and conference presentations.',
  },
];

export const PROFILES_DATA: CredentialProfile[] = [
  {
    name: 'HackerRank',
    platform: 'HackerRank Profile',
    username: '@la_b_ib',
    url: 'https://www.hackerrank.com/profile/la_b_ib',
    icon: 'ri-code-s-slash-line',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    status: 'VERIFIED DEVELOPER',
    description: 'Verified problem solving, software engineering certifications & algorithms badges.',
  },
  {
    name: 'LeetCode',
    platform: 'LeetCode Profile',
    username: 'la-b-ib',
    url: 'https://leetcode.com/u/la-b-ib/',
    icon: 'ri-code-box-line',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    status: 'ALGORITHMS & DS',
    description: 'Competitive programming solutions, data structures, algorithms solving, and coding practice.',
  },
  {
    name: 'GitHub',
    platform: 'GitHub Repositories',
    username: 'la-b-ib',
    url: 'https://github.com/la-b-ib',
    icon: 'ri-github-fill',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
    status: 'OPEN SOURCE DEV',
    description: 'Public security repositories, exploit research, full-stack microservices, and offensive tooling.',
  },
  {
    name: 'TryHackMe',
    platform: 'TryHackMe Profile',
    username: 'labib',
    url: 'https://tryhackme.com',
    icon: 'ri-skull-2-line',
    badgeColor: 'border-red-500/40 text-red-300 bg-red-500/10',
    status: 'OFFSEC LABS',
    description: 'Hands-on cyber security training, CTF room completions, and offensive/defensive labs.',
  },
  {
    name: 'Credly Profile',
    platform: 'Credly Wallet',
    username: 'la-b-ib',
    url: 'https://www.credly.com/users/la-b-ib/edit/badges/credly',
    icon: 'ri-verified-badge-line',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    status: 'OFFICIAL BADGE ISSUER',
    description: 'Digital credential wallet verifying proctored certifications from Cisco, Fortinet, Acronis.',
  },
];

export const CERTIFICATIONS_DATA: Credential[] = [
  // Cybersecurity & Forensics
  {
    id: 'macquarie-forensics',
    title: 'Cyber Security Essentials for Forensics',
    issuer: 'Macquarie University',
    category: 'cybersecurity',
    description: 'Focuses on fundamental digital forensics techniques, evidence gathering, and incident response procedures.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/2HJVSX2DOD1V?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-fingerprint-2-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'eccouncil-sec-analyst',
    title: 'Information Security Analyst',
    issuer: 'EC-Council',
    category: 'cybersecurity',
    description: 'Validates core skills in risk assessment, vulnerability analysis, and enterprise security defense strategies.',
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/EB64405KWGE9?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=prof',
    icon: 'ri-body-scan-line',
    status: 'PROFESSIONAL CERTIFICATE',
  },
  {
    id: 'pearson-ceh',
    title: 'Certified Ethical Hacker',
    issuer: 'Pearson',
    category: 'cybersecurity',
    description: 'Demonstrates knowledge of offensive security, penetration testing methodologies, and threat assessment techniques.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/YTHMK66Q6SR0?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-id-card-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'ibm-open-source-hacking',
    title: 'Ethical Hacking with Open Source Tools',
    issuer: 'IBM',
    category: 'cybersecurity',
    description: 'Focuses on applying open-source security tools to perform penetration testing and vulnerability assessments.',
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/R37O7OWRRMH9?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=prof',
    icon: 'ri-terminal-window-line',
    status: 'PROFESSIONAL CERTIFICATE',
  },
  {
    id: 'google-cybersecurity',
    title: 'Google Cybersecurity',
    issuer: 'Google',
    category: 'cybersecurity',
    description: 'Comprehensive program covering SIEM tools, Python scripting, SQL, and threat response fundamentals.',
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/V75MTSQSOHCB?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=prof',
    icon: 'ri-google-line',
    status: 'PROFESSIONAL CERTIFICATE',
  },

  // Software Engineering & Cloud
  {
    id: 'meta-react',
    title: 'Meta React : Frontend Development',
    issuer: 'Meta',
    category: 'cloud',
    description: 'Professional training in building modern, interactive user interfaces using React, JavaScript, and Web APIs.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/EXU5V29NHS6C?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-mixtral-line',
    status: 'PROFESSIONAL CERTIFICATE',
  },
  {
    id: 'redhat-cloud-native',
    title: 'Cloud Native Development with OpenShift & Kubernetes',
    issuer: 'RedHat',
    category: 'cloud',
    description: 'Teaches cloud-native application deployment, container orchestration, and microservice management.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/SP2T8W1UDZPV?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-apps-2-ai-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'hackerrank-swe',
    title: 'Software Engineer Certificate',
    issuer: 'HackerRank',
    category: 'cloud',
    description: 'Validates core computer science concepts, algorithm design, software architecture, and problem-solving.',
    link: 'https://www.hackerrank.com/certificates/0185beaeedaa',
    icon: 'ri-friendica-line',
    credentialId: '0185beaeedaa',
    status: 'HACKERRANK VERIFIED',
  },
  {
    id: 'lambdatest-automation',
    title: 'Test Automation',
    issuer: 'LambdaTest',
    category: 'cloud',
    description: 'Demonstrates practical skill in automated software testing, QA methodologies, and test execution platforms.',
    link: 'https://www.linkedin.com/learning/certificates/243b5362e2fc213ce658d04d6c21856b9ab9628a3e81b375927773cd8618fd49',
    icon: 'ri-qwen-ai-line',
    status: 'VERIFIED CERTIFICATE',
  },

  // Automation, Hardware & Systems
  {
    id: 'twilio-messaging-voice',
    title: 'Programmable Messaging and Voice',
    issuer: 'Twilio',
    category: 'automation',
    description: 'Focuses on integrating messaging and voice communication capabilities using Twilio API architectures.',
    link: 'https://www.linkedin.com/learning/certificates/759119dcc46bdb4e63fb82dc49ed0ad4288a97d9031dd360fdb0686f65b0b398',
    icon: 'ri-chat-voice-ai-line',
    status: 'VERIFIED CERTIFICATE',
  },
  {
    id: 'blue-prism-rpa',
    title: 'Robotic Process Automation - RPA',
    issuer: 'SS&C Blue Prism',
    category: 'automation',
    description: 'Covers business process automation, workflow design, and bot implementation with SS&C Blue Prism.',
    link: 'https://www.linkedin.com/learning/certificates/6f99e870b41beae081989894b502a48e94af71cf8806e54a994cad682d092c5f',
    icon: 'ri-finder-line',
    status: 'VERIFIED CERTIFICATE',
  },
  {
    id: 'asu-semiconductor',
    title: 'Semiconductor Characterization',
    issuer: 'Arizona State University',
    category: 'automation',
    description: 'Examines semiconductor device physics, measurement techniques, and integrated circuit testing methods.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/FB36UC27KZ02?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-token-swap-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },

  // Data Science & Strategic Analytics
  {
    id: 'hp-data-science',
    title: 'Data Science & Analytics',
    issuer: 'HP',
    category: 'analytics',
    description: 'Covers fundamental data analysis methodologies, statistical modeling, and data-driven decision-making.',
    link: 'https://www.life-global.org/certificate/98bb96cd-0f2b-4e49-9a12-1aa257e3fcc4',
    icon: 'ri-gitbook-line',
    status: 'VERIFIED CERTIFICATE',
  },
  {
    id: 'cambridge-mind-decision',
    title: 'The Science of Mind & Decision Making',
    issuer: 'University of Cambridge',
    category: 'analytics',
    description: 'Explores cognitive processes, psychological frameworks, and behavioral insights influencing decisions.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/OLR1J6JPF3PV?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-brain-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'oxford-finance-strategy',
    title: 'The Intersection of Finance, Strategy, and Sustainability',
    issuer: 'Saïd Business School, University of Oxford',
    category: 'analytics',
    description: 'Analyzes how sustainable corporate practices intersect with financial strategy and business leadership.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/F4JPIBGZRAI9?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-shopping-basket-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'ieee-energy-power',
    title: 'Conference on Energy & Power Engineering',
    issuer: 'IEEE Power and Energy Society',
    category: 'analytics',
    description: 'Covers academic research and technical advancements in modern energy networks and power systems engineering.',
    link: 'https://drive.google.com/file/d/17SxPVFYELRmTnL-ottL5zVR29rsvGYBD/view?usp=drivesdk',
    icon: 'ri-flashlight-line',
    status: 'ACADEMIC RESEARCH',
  },
];

export const BADGES_DATA: VerifiedBadge[] = [
  {
    id: 'badge-cisco-security-learning-path',
    title: 'Cisco Cyber Security Credentials',
    issuer: 'Cisco',
    issueDate: '11/11/2025',
    credentialId: 'd2ffc0c2-fe99-4901-8bea-b604c700ba98',
    description: 'Cisco Learning Track: Comprehensive security training track covering fundamental cyber defense, privacy, threat analysis, and ethical hacking methodologies.',
    link: 'https://www.credly.com/badges/d2ffc0c2-fe99-4901-8bea-b604c700ba98/public_url',
    icon: 'ri-folder-shield-line',
    learningPath: [
      {
        id: 'cisco-intro',
        name: 'Intro',
        title: 'Introduction to Cybersecurity',
        issuer: 'Cisco',
        issueDate: '11/10/2025',
        credentialId: 'ffd2edbd-9a26-46c2-90e8-9947b0f5392d',
        description: 'Introduction to Cybersecurity: Basic overview of network privacy, data protection principles, and common cyber attack vectors.',
        link: 'https://www.credly.com/badges/ffd2edbd-9a26-46c2-90e8-9947b0f5392d/public_url',
      },
      {
        id: 'cisco-ethical-hacker',
        name: 'Ethical Hacker',
        title: 'Ethical Hacker',
        issuer: 'Cisco',
        issueDate: '11/11/2025',
        credentialId: 'd2ffc0c2-fe99-4901-8bea-b604c700ba98',
        description: 'Ethical Hacker: Demonstrates understanding of security threats, ethical hacking strategies, and network defense measures.',
        link: 'https://www.credly.com/badges/d2ffc0c2-fe99-4901-8bea-b604c700ba98/public_url',
      },
    ],
  },
  {
    id: 'badge-fortinet-nse-learning-path',
    title: 'Fortinet Security Credentials',
    issuer: 'Fortinet',
    issueDate: '11/1/2025',
    credentialId: '4f4d6acc-b0ae-4417-af77-7f7ffe9afa47',
    description: 'Fortinet Learning Track: Comprehensive certification track covering foundational threat landscapes, network security solutions, security fabric operations, and FortiGate firewall administration.',
    link: 'https://www.credly.com/badges/4f4d6acc-b0ae-4417-af77-7f7ffe9afa47/public_url',
    icon: 'ri-base-station-line',
    learningPath: [
      {
        id: 'nse-1',
        name: 'NSE 1',
        title: 'Fortinet NSE 1 Certified in Cybersecurity',
        issuer: 'Fortinet',
        issueDate: '10/30/2025',
        credentialId: '394becdf-2442-48a7-b46c-4a7f54feeb63',
        description: 'Information Security Awareness: Foundational overview of threat landscapes, social engineering attacks, and cyber hygiene principles.',
        link: 'https://www.credly.com/badges/394becdf-2442-48a7-b46c-4a7f54feeb63/public_url',
      },
      {
        id: 'nse-2',
        name: 'NSE 2',
        title: 'Fortinet NSE 2 Certified in Cybersecurity',
        issuer: 'Fortinet',
        issueDate: '10/30/2025',
        credentialId: '574efe1b-b6a5-4913-a1e8-70c1985b5bd6',
        description: 'The Evolution of Cybersecurity: Examines key security solutions designed to address evolving digital threat vectors, SIEM, and next-gen firewalls.',
        link: 'https://www.credly.com/badges/574efe1b-b6a5-4913-a1e8-70c1985b5bd6/public_url',
      },
      {
        id: 'nse-3',
        name: 'NSE 3',
        title: 'Fortinet NSE 3 Certified in Cybersecurity',
        issuer: 'Fortinet',
        issueDate: '11/1/2025',
        credentialId: '4f4d6acc-b0ae-4417-af77-7f7ffe9afa47',
        description: 'Fortinet Security Fabric: In-depth overview of Fortinet security product portfolios, FortiGate ecosystem, and enterprise deployment strategies.',
        link: 'https://www.credly.com/badges/4f4d6acc-b0ae-4417-af77-7f7ffe9afa47/public_url',
      },
      {
        id: 'fcf',
        name: 'FCF',
        title: 'Fortinet Certified Fundamentals Cybersecurity',
        issuer: 'Fortinet',
        issueDate: '10/30/2025',
        credentialId: '306ecf66-619a-4564-83fd-f067761ff0f1',
        description: 'Certified Fundamentals: Covers essential cybersecurity threat vectors and basic defensive strategies across network infrastructures.',
        link: 'https://www.credly.com/badges/306ecf66-619a-4564-83fd-f067761ff0f1/public_url',
      },
      {
        id: 'fca',
        name: 'FCA',
        title: 'Fortinet Certified Associate Cybersecurity',
        issuer: 'Fortinet',
        issueDate: '11/1/2025',
        credentialId: '29b9393a-e4ca-4b8e-b844-3daaaa5e17c1',
        description: 'Certified Associate: Validates practical skills in navigating, operating, and configuring Fortinet security fabrics and appliances.',
        link: 'https://www.credly.com/badges/29b9393a-e4ca-4b8e-b844-3daaaa5e17c1/public_url',
      },
      {
        id: 'fortigate-76',
        name: 'FGT',
        title: 'Fortinet FortiGate 7.6 Operator',
        issuer: 'Fortinet',
        issueDate: '11/1/2025',
        credentialId: 'b5224109-403d-47f2-b3ad-24aa6872dd29',
        description: 'FortiGate Operator: Hands-on operational capability in configuring, managing, and monitoring FortiGate firewall devices.',
        link: 'https://www.credly.com/badges/b5224109-403d-47f2-b3ad-24aa6872dd29/public_url',
      },
    ],
  },
  {
    id: 'badge-acronis-cloud-tech',
    title: 'Cloud Tech Professional Advanced Backup',
    issuer: 'Acronis',
    issueDate: '10/29/2025',
    credentialId: '29749e1f-421a-4a86-9f77-882b8eba0328',
    description: 'Covers technical concepts for enterprise cloud data protection, system recovery, and backup management.',
    link: 'https://www.credly.com/badges/29749e1f-421a-4a86-9f77-882b8eba0328/public_url',
    icon: 'ri-soundcloud-line',
  },
];

export const CREDENTIALS_DATA = CERTIFICATIONS_DATA;

export { DISPATCHES_DATA } from './dispatchesData';



