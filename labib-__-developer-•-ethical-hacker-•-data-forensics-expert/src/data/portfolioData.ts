import {
  Skill,
  Mission,
  Casefile,
  Credential,
  VerifiedBadge,
  CredentialProfile,
  Dispatch,
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
    ecosystem: 'OpenJDK 21 / Maven / Gradle',
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
    ecosystem: 'Python 3.12+ / Poetry / NumPy',
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
    ecosystem: 'Go 1.23 / Fiber / Zero-Alloc',
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
    ecosystem: 'Rust Edition 2024 / Cargo',
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
    ecosystem: 'TypeScript 5.6+ / Node / Vite',
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
    ecosystem: 'React Ecosystem / Vite / Fiber',
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
    ecosystem: 'Next.js 15 / Vercel Edge',
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
    ecosystem: 'Tailwind CSS 4.0 / PostCSS',
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
    ecosystem: 'GraphQL / Apollo / Yoga',
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
    ecosystem: 'Node.js 22 LTS / Bun',
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
    ecosystem: 'Spring Boot 3.3 / Java 21',
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
    ecosystem: 'PostgreSQL 16 / TimescaleDB',
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
    ecosystem: 'Redis 7.2 / Dragonfly',
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
    ecosystem: 'PyTorch 2.4 / HuggingFace',
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
    ecosystem: 'TensorFlow 2.16 / TFLite',
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
    ecosystem: 'scikit-learn / Pandas / Polars',
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
    ecosystem: 'Apache Kafka / KRaft / Schema Registry',
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
    ecosystem: 'AWS Cloud / CDK / Serverless',
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
    ecosystem: 'Docker Engine / Buildx / containerd',
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
    ecosystem: 'Kubernetes v1.31 / Helm / K9s',
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
    ecosystem: 'Terraform / OpenTofu',
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
    ecosystem: 'Ubuntu 24.04 LTS / Debian-base',
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
    ecosystem: 'RHEL 9.x / Rocky Linux',
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
    ecosystem: 'Debian 12 Bookworm',
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
    ecosystem: 'Windows Server 2022 / Azure AD',
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
    ecosystem: 'Git 2.46+ / GitHub Enterprise',
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
    ecosystem: 'VS Code Insiders',
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
    ecosystem: 'JetBrains Toolbox / Ultimate Suite',
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
    ecosystem: 'Postman v11 / Newman Runner',
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
    ecosystem: 'Metasploit Framework / Ruby',
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
    ecosystem: 'Burp Suite Professional / Java',
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
    ecosystem: 'Nmap / Ncat / Lua',
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
    ecosystem: 'Volatility 3 / Python 3',
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
    ecosystem: 'NSA Ghidra / Sleigh',
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
    ecosystem: 'YARA-X / Libyara',
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
    ecosystem: 'OpenSSL / libsodium',
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
    ecosystem: 'Wireshark / TShark / Scapy',
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
    id: 'spectre-x',
    caseId: 'CASEFILE #001',
    title: 'Spectre-X // RAM Forensics & Kernel Rootkit Detector',
    category: 'dfir',
    badge: 'CRITICAL FORENSIC TOOL',
    badgeColor: 'red',
    summary: 'An open-source physical memory analysis engine built in Python and Volatility 3 API that scans uncompressed Windows/Linux RAM dumps for hidden kernel hooks, unlinked DLLs, and injected shellcode.',
    details: [
      'Integrates directly with Volatility 3 framework API for deep physical address space translation.',
      'Detects SSDT/IDT kernel hook modifications, direct kernel object manipulation (DKOM), and unlinked VAD tree structures.',
      'Automatically extracts injected shellcode blocks and queries hashes against VirusTotal API.',
    ],
    codeSnippet: `def scan_kernel_hooks(vol_context, memory_dump_path):
    """Parses unlinked VAD tree nodes to uncover kernel rootkit injection."""
    plugin = vol_context.plugins.get('windows.pslist.PsList')
    tree_nodes = plugin.build_vad_tree(memory_dump_path)
    
    suspicious_blocks = []
    for process in tree_nodes:
        if process.is_unlinked_from_vad() or process.has_executable_heap():
            shellcode = process.dump_memory_region()
            sha256_hash = hashlib.sha256(shellcode).hexdigest()
            suspicious_blocks.append({
                'pid': process.pid,
                'name': process.name,
                'hash': sha256_hash
            })
    return suspicious_blocks`,
    language: 'python',
    tech: ['Python 3.11', 'Volatility 3', 'Ghidra API', 'YARA Engine', 'Win32 Internals'],
    githubUrl: 'https://github.com/la-b-ib',
  },
  {
    id: 'aegisguard',
    caseId: 'CASEFILE #002',
    title: 'AegisGuard // WebAuthn & Passkey Zero-Trust Engine',
    category: 'auth',
    badge: 'ZERO-TRUST PLATFORM',
    badgeColor: 'teal',
    summary: 'A high-availability microservice built to replace password authentication with cryptographic FIDO2/WebAuthn hardware key credentials and biometric passkeys.',
    details: [
      'Enforces ECDSA P-256 signature verification directly at the microservices gateway layer.',
      'Prevents adversary-in-the-middle (AiTM) phishing by binding origin signatures to TLS certificates.',
      'Handles biometric passkey enrollment with zero-knowledge fallback recovery tokens.',
    ],
    codeSnippet: `export async function verifyPasskeySignature(
  credentialResponse: AuthenticatorAssertionResponse,
  expectedChallenge: string,
  expectedOrigin: string
): Promise<{ verified: boolean; userHandle?: string }> {
  const result = await verifyAuthenticationResponse({
    response: credentialResponse,
    expectedChallenge,
    expectedOrigin,
    expectedRPID: 'sec-ops.io',
    requireUserVerification: true,
  });
  
  if (!result.verified) {
    throw new Error('SEC_ERR_PASSKEY_INVALID_SIGNATURE');
  }
  return { verified: true, userHandle: result.authenticationInfo.userHandle };
}`,
    language: 'typescript',
    tech: ['TypeScript', 'Node.js', 'React', 'WebAuthn API', 'Redis', 'WebCrypto'],
    githubUrl: 'https://github.com/la-b-ib',
  },
  {
    id: 'vortex-fuzz',
    caseId: 'CASEFILE #003',
    title: 'Vortex-Fuzz // 100k req/sec Parallel Web API Fuzzer',
    category: 'offsec',
    badge: 'HIGH-THROUGHPUT RUST ENGINE',
    badgeColor: 'red',
    summary: 'Written in pure Rust with Tokio async runtime, Vortex-Fuzz blasts HTTP/2 endpoints with mutation-based fuzzing payloads to isolate logic flaws and crash points.',
    details: [
      'Custom HTTP/2 multiplexing pipeline bypassing standard threadpool bottleneck limits.',
      'Automatic parameter discovery using dynamic dictionary mutation algorithms.',
      'Outputs structured JSON reports mapping response codes, response time variance, & stacktraces.',
    ],
    codeSnippet: `#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::builder()
        .http2_prior_knowledge()
        .pool_max_idle_per_host(1000)
        .build()?;
        
    let payloads = load_mutation_dictionary("payloads/sqli_xss.txt")?;
    let target_url = "https://target-api.internal/v1/user";
    
    let handles: Vec<_> = payloads.into_iter().map(|p| {
        let client_clone = client.clone();
        tokio::spawn(async move {
            fuzz_worker(client_clone, target_url, p).await
        })
    }).collect();
    
    futures::future::join_all(handles).await;
    Ok(())
}`,
    language: 'rust',
    tech: ['Rust', 'Tokio Async', 'HTTP/2', 'WebSockets', 'Clap CLI'],
    githubUrl: 'https://github.com/la-b-ib',
  },
  {
    id: 'ciphertrace',
    caseId: 'CASEFILE #004',
    title: 'CipherTrace // Ransomware Detonation Chamber & YARA Generator',
    category: 'dfir',
    badge: 'SANDBOX ISOLATION',
    badgeColor: 'purple',
    summary: 'An isolated detonation chamber using Linux kernel eBPF probes to record syscall events, file write activity, and network sockets during executable sample detonation.',
    details: [
      'Captures kernel syscall write() and mmap() telemetry without triggering EDR detection.',
      'Auto-generates YARA rules based on unique byte entropy spikes and obfuscated strings.',
      'Generates interactive timeline visualization of ransomware file encryption loops.',
    ],
    codeSnippet: `SEC("kprobe/sys_enter_write")
int bpf_prog_sys_write(struct pt_regs *ctx) {
    u64 pid_tgid = bpf_get_current_pid_tgid();
    u32 pid = pid_tgid >> 32;
    
    struct event_t event = {};
    event.pid = pid;
    bpf_get_current_comm(&event.comm, sizeof(event.comm));
    
    // Check for high-frequency mass file modification pattern
    events.perf_submit(ctx, &event, sizeof(event));
    return 0;
}`,
    language: 'c',
    tech: ['C / eBPF', 'Linux Kernel', 'Python', 'YARA', 'Docker Isolation'],
    githubUrl: 'https://github.com/la-b-ib',
  },
  {
    id: 'cyberpulse',
    caseId: 'CASEFILE #005',
    title: 'CyberPulse // 3D Threat Telemetry & SIEM Dashboard',
    category: 'fullstack',
    badge: 'REAL-TIME ANALYTICS',
    badgeColor: 'cyan',
    summary: 'A real-time SIEM dashboard featuring a 3D WebGL globe visualizing global intrusion attempts, DDoS vectors, and active honeypot logs with sub-second latency.',
    details: [
      'Rendered with Three.js / WebGL with custom GLSL shaders for glowing pulse arcs.',
      'Receives live event streams over WebSockets from distributed honeypot nodes.',
      'Supports geo-IP resolution, threat actor categorization, & automated alert firing.',
    ],
    codeSnippet: `export function renderPulseArc(sourceGeo: [number, number], targetGeo: [number, number]) {
  const curve = createGeodesicCurve(sourceGeo, targetGeo);
  const geometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x2dd4bf) } },
    vertexShader: pulseVertexShader,
    fragmentShader: pulseFragmentShader,
  });
  return new THREE.Mesh(geometry, material);
}`,
    language: 'typescript',
    tech: ['React', 'TypeScript', 'Three.js / WebGL', 'WebSockets', 'Tailwind CSS'],
    githubUrl: 'https://github.com/la-b-ib',
  },
  {
    id: 'keystrokevault',
    caseId: 'CASEFILE #006',
    title: 'KeystrokeVault // Zero-Knowledge Encrypted Messaging',
    category: 'auth',
    badge: 'ZERO-KNOWLEDGE CRYPTO',
    badgeColor: 'green',
    summary: 'A client-side zero-knowledge encrypted messaging portal where keys never leave browser RAM, protecting communications against server-side compromises.',
    details: [
      'Generates ECDH key pairs locally using WebCrypto API with Double Ratchet encryption.',
      'Messages are encrypted with AES-256-GCM before transport across WebSocket relays.',
      'Supports auto-destructing ephemerality timers and cryptographic identity verification.',
    ],
    codeSnippet: `export async function encryptZeroKnowledgePayload(
  plaintext: string,
  recipientPublicKey: CryptoKey
): Promise<{ cipherText: string; iv: string }> {
  const ephemeralKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: recipientPublicKey },
    ephemeralKeyPair.privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sharedKey, encoded);
  return {
    cipherText: bufferToBase64(cipherBuffer),
    iv: bufferToBase64(iv.buffer)
  };
}`,
    language: 'typescript',
    tech: ['TypeScript', 'WebCrypto API', 'React', 'Signal Double Ratchet', 'WebSockets'],
    githubUrl: 'https://github.com/la-b-ib',
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

export const PROFILES_DATA: CredentialProfile[] = [
  {
    name: 'IEEE Xplore',
    platform: 'IEEE Author Profile',
    username: '428150838708730',
    url: 'https://ieeexplore.ieee.org/author/428150838708730',
    icon: 'ri-book-read-line',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    status: 'VERIFIED AUTHOR',
    description: 'Indexed peer-reviewed IEEE conference publications and conference proceedings.',
  },
  {
    name: 'Google Scholar',
    platform: 'Google Scholar',
    username: 'xg04A5kAAAAJ',
    url: 'https://scholar.google.com/citations?user=xg04A5kAAAAJ&hl=en',
    icon: 'ri-google-line',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    status: 'RESEARCH PROFILE',
    description: 'Academic citations, co-authorships, and indexed computer science publications.',
  },
  {
    name: 'ORCID iD',
    platform: 'ORCID Repository',
    username: '0009-0007-4656-8709',
    url: 'https://orcid.org/0009-0007-4656-8709',
    icon: 'ri-fingerprint-line',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    status: 'VERIFIED RESEARCHER',
    description: 'Persistent digital identifier distinguishing academic research contributions.',
  },
  {
    name: 'ResearchGate',
    platform: 'ResearchGate',
    username: 'Labib-Bin-Shahed',
    url: 'https://www.researchgate.net/profile/Labib-Bin-Shahed',
    icon: 'ri-article-line',
    badgeColor: 'border-teal-500/40 text-teal-300 bg-teal-500/10',
    status: 'ACADEMIC NETWORK',
    description: 'Pre-prints, research network metrics, citations, and conference presentations.',
  },
  {
    name: 'HackerRank',
    platform: 'HackerRank Profile',
    username: '@la_b_ib',
    url: 'https://www.hackerrank.com/profile/la_b_ib',
    icon: 'ri-code-s-slash-line',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
    status: 'VERIFIED DEVELOPER',
    description: 'Verified problem solving, software engineering certifications & algorithms badges.',
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
    icon: 'ri-search-eye-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'eccouncil-sec-analyst',
    title: 'Information Security Analyst',
    issuer: 'EC-Council',
    category: 'cybersecurity',
    description: 'Validates core skills in risk assessment, vulnerability analysis, and enterprise security defense strategies.',
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/EB64405KWGE9?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=prof',
    icon: 'ri-shield-user-line',
    status: 'PROFESSIONAL CERTIFICATE',
  },
  {
    id: 'fortinet-associate',
    title: 'Certified Associate Cybersecurity',
    issuer: 'Fortinet',
    category: 'cybersecurity',
    description: 'Covers entry-level security concepts, network defense fundamentals, and Fortinet security architecture.',
    link: 'https://www.credly.com/badges/29b9393a-e4ca-4b8e-b844-3daaaa5e17c1',
    icon: 'ri-shield-keyhole-line',
    credentialId: '29b9393a-e4ca-4b8e-b844-3daaaa5e17c1',
    status: 'CREDLY VERIFIED',
  },
  {
    id: 'pearson-ceh',
    title: 'Certified Ethical Hacker [CEH]',
    issuer: 'Pearson',
    category: 'cybersecurity',
    description: 'Demonstrates knowledge of offensive security, penetration testing methodologies, and threat assessment techniques.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/YTHMK66Q6SR0?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-bug-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'cisco-ethical-hacker',
    title: 'Ethical Hacker',
    issuer: 'CISCO',
    category: 'cybersecurity',
    description: 'Validates fundamental skills in network scanning, exploitation vectors, and core offensive security concepts.',
    link: 'https://www.credly.com/badges/d2ffc0c2-fe99-4901-8bea-b604c700ba98/public_url',
    icon: 'ri-sword-line',
    credentialId: 'd2ffc0c2-fe99-4901-8bea-b604c700ba98',
    status: 'CREDLY VERIFIED',
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
    icon: 'ri-google-fill',
    status: 'PROFESSIONAL CERTIFICATE',
  },
  {
    id: 'comptia-sec-plus',
    title: 'CompTIA Security+',
    issuer: 'CompTIA',
    category: 'cybersecurity',
    description: 'Industry-standard certification covering baseline cybersecurity principles, threat management, and compliance.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/PGQKACYAM30A?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-shield-star-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },

  // Software Engineering & Cloud
  {
    id: 'meta-react',
    title: 'Meta React (Frontend Development)',
    issuer: 'Meta',
    category: 'cloud',
    description: 'Professional training in building modern, interactive user interfaces using React, JavaScript, and Web APIs.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/EXU5V29NHS6C?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-reactjs-line',
    status: 'PROFESSIONAL CERTIFICATE',
  },
  {
    id: 'redhat-cloud-native',
    title: 'Cloud Native Development with OpenShift & Kubernetes',
    issuer: 'RedHat',
    category: 'cloud',
    description: 'Teaches cloud-native application deployment, container orchestration, and microservice management.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/SP2T8W1UDZPV?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-cloud-line',
    status: 'SPECIALIZATION CERTIFICATE',
  },
  {
    id: 'hackerrank-swe',
    title: 'Software Engineer Certificate',
    issuer: 'HackerRank',
    category: 'cloud',
    description: 'Validates core computer science concepts, algorithm design, software architecture, and problem-solving.',
    link: 'https://www.hackerrank.com/certificates/0185beaeedaa',
    icon: 'ri-code-box-line',
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
    icon: 'ri-play-circle-line',
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
    icon: 'ri-message-3-line',
    status: 'VERIFIED CERTIFICATE',
  },
  {
    id: 'blue-prism-rpa',
    title: 'Robotic Process Automation (RPA)',
    issuer: 'SS&C Blue Prism',
    category: 'automation',
    description: 'Covers business process automation, workflow design, and bot implementation with SS&C Blue Prism.',
    link: 'https://www.linkedin.com/learning/certificates/6f99e870b41beae081989894b502a48e94af71cf8806e54a994cad682d092c5f',
    icon: 'ri-robot-line',
    status: 'VERIFIED CERTIFICATE',
  },
  {
    id: 'asu-semiconductor',
    title: 'Semiconductor Characterization',
    issuer: 'Arizona State University',
    category: 'automation',
    description: 'Examines semiconductor device physics, measurement techniques, and integrated circuit testing methods.',
    link: 'https://www.coursera.org/account/accomplishments/specialization/FB36UC27KZ02?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n',
    icon: 'ri-cpu-line',
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
    icon: 'ri-bar-chart-box-line',
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
    icon: 'ri-funds-box-line',
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
    id: 'badge-cisco-ethical-hacker',
    title: 'Ethical Hacker',
    issuer: 'Cisco',
    issueDate: '11/11/2025',
    credentialId: 'd2ffc0c2-fe99-4901-8bea-b604c700ba98',
    description: 'Demonstrates understanding of security threats, ethical hacking strategies, and network defense measures.',
    link: 'https://www.credly.com/earner/earned/badge/d2ffc0c2-fe99-4901-8bea-b604c700ba98',
    icon: 'ri-shield-keyhole-line',
  },
  {
    id: 'badge-cisco-intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco',
    issueDate: '11/10/2025',
    credentialId: 'ffd2edbd-9a26-46c2-90e8-9947b0f5392d',
    description: 'Basic overview of network privacy, data protection principles, and common cyber attack vectors.',
    link: 'https://www.credly.com/earner/earned/badge/ffd2edbd-9a26-46c2-90e8-9947b0f5392d',
    icon: 'ri-global-line',
  },
  {
    id: 'badge-fortinet-certified-associate',
    title: 'Fortinet Certified Associate Cybersecurity',
    issuer: 'Fortinet',
    issueDate: '11/1/2025',
    credentialId: '29b9393a-e4ca-4b8e-b844-3daaaa5e17c1',
    description: 'Validates practical skills in navigating and operating Fortinet security fabrics and appliances.',
    link: 'https://www.credly.com/earner/earned/badge/29b9393a-e4ca-4b8e-b844-3daaaa5e17c1',
    icon: 'ri-shield-check-line',
  },
  {
    id: 'badge-fortinet-certified-fundamentals',
    title: 'Fortinet Certified Fundamentals Cybersecurity',
    issuer: 'Fortinet',
    issueDate: '10/30/2025',
    credentialId: '306ecf66-619a-4564-83fd-f067761ff0f1',
    description: 'Covers essential cybersecurity threat vectors and basic defensive strategies across network infrastructures.',
    link: 'https://www.credly.com/earner/earned/badge/306ecf66-619a-4564-83fd-f067761ff0f1',
    icon: 'ri-lock-line',
  },
  {
    id: 'badge-fortinet-fortigate-76',
    title: 'Fortinet FortiGate 7.6 Operator',
    issuer: 'Fortinet',
    issueDate: '11/1/2025',
    credentialId: 'b5224109-403d-47f2-b3ad-24aa6872dd29',
    description: 'Hands-on operational capability in configuring, managing, and monitoring FortiGate firewall devices.',
    link: 'https://www.credly.com/earner/earned/badge/b5224109-403d-47f2-b3ad-24aa6872dd29',
    icon: 'ri-settings-4-line',
  },
  {
    id: 'badge-acronis-cloud-tech',
    title: 'Cloud Tech Professional Advanced Backup',
    issuer: 'Acronis',
    issueDate: '10/29/2025',
    credentialId: '29749e1f-421a-4a86-9f77-882b8eba0328',
    description: 'Covers technical concepts for enterprise cloud data protection, system recovery, and backup management.',
    link: 'https://www.credly.com/earner/earned/badge/29749e1f-421a-4a86-9f77-882b8eba0328',
    icon: 'ri-cloud-line',
  },
  {
    id: 'badge-fortinet-nse-1',
    title: 'Fortinet NSE 1 Certified in Cybersecurity',
    issuer: 'Fortinet',
    issueDate: '10/30/2025',
    credentialId: '394becdf-2442-48a7-b46c-4a7f54feeb63',
    description: 'Entry-level overview of threat landscapes and foundational network security principles.',
    link: 'https://www.credly.com/earner/earned/badge/394becdf-2442-48a7-b46c-4a7f54feeb63',
    icon: 'ri-medal-2-line',
  },
  {
    id: 'badge-fortinet-nse-2',
    title: 'Fortinet NSE 2 Certified in Cybersecurity',
    issuer: 'Fortinet',
    issueDate: '10/30/2025',
    credentialId: '574efe1b-b6a5-4913-a1e8-70c1985b5bd6',
    description: 'Examines key security solutions designed to address evolving digital threat vectors.',
    link: 'https://www.credly.com/earner/earned/badge/574efe1b-b6a5-4913-a1e8-70c1985b5bd6',
    icon: 'ri-medal-line',
  },
  {
    id: 'badge-fortinet-nse-3',
    title: 'Fortinet NSE 3 Certified in Cybersecurity',
    issuer: 'Fortinet',
    issueDate: '11/1/2025',
    credentialId: '4f4d6acc-b0ae-4417-af77-7f7ffe9afa47',
    description: 'In-depth overview of Fortinet security product portfolios and specialized enterprise deployment strategies.',
    link: 'https://www.credly.com/earner/earned/badge/4f4d6acc-b0ae-4417-af77-7f7ffe9afa47',
    icon: 'ri-award-fill',
  },
];

export const CREDENTIALS_DATA = CERTIFICATIONS_DATA;

export const DISPATCHES_DATA: Dispatch[] = [
  {
    id: 'dispatch-ebpf',
    title: 'Deep Dive: Using eBPF Probes to Detect Kernel Rootkit Syscall Tampering',
    date: 'OCTOBER 24, 2025',
    readTime: '12 MIN READ',
    author: 'LABIB B. SHAHED',
    category: 'dfir',
    threatLevel: 'HIGH',
    cveReference: 'CVE-2025-21689',
    viewsCount: 1420,
    tags: ['eBPF', 'Linux Kernel', 'Rootkits', 'Syscalls', 'Telemetry'],
    excerpt: 'Modern rootkits bypass user-land EDR agents by intercepting sys_enter and hooking kernel table pointers. Discover how eBPF kprobes allow security engineers to capture un-tampered kernel events in real time.',
    keyTakeaways: [
      'Bypasses SSDT hook overrides by tapping directly into raw kernel tracepoints.',
      'Streams zero-copy ring buffer event telemetry down to user-land SOAR daemons.',
      'Provides microsecond-granularity execution verification without triggering kernel panic or system instability.'
    ],
    codeSnippet: `// eBPF Remediation Probe Handler
SEC("kprobe/sys_enter_execve")
int trace_execve(struct pt_regs *ctx) {
    u64 pid_tgid = bpf_get_current_pid_tgid();
    u32 pid = pid_tgid >> 32;
    
    struct event_t event = {};
    event.pid = pid;
    bpf_get_current_comm(&event.comm, sizeof(event.comm));
    
    // Check for high-entropy executable memory buffer allocation
    events.perf_submit(ctx, &event, sizeof(event));
    return 0;
}`,
    fullMarkdown: `## Executive Technical Summary

Traditional Endpoint Detection & Response (EDR) agents operate primarily in user-space or install standard filesystem filter drivers. Sophisticated adversaries bypass these detection layers using Direct Kernel Object Manipulation (DKOM) or SSDT hook overrides.

By leveraging **Extended Berkeley Packet Filter (eBPF)** program probes attached directly to kernel tracepoints (\`kprobes\` and \`tracepoints\`), security teams achieve complete observability without risking kernel panics.

### Key Implementation Architecture
1. **Tracepoint Attachment**: Attach \`kprobe/sys_enter_write\` and \`kprobe/sys_enter_execve\` to monitor high-entropy buffer outputs and process creation.
2. **Ring Buffer Streams**: Build lock-free ring buffer maps to stream thread execution telemetry directly to user-land telemetry daemons.
3. **Executable Signature Verification**: Validate ELF executable header signatures before memory page transition completes.

### Defense-in-Depth Considerations
When deploying eBPF probes in production environments:
- Enforce \`kernel.unprivileged_bpf_disabled=1\` via \`sysctl\` to prevent unprivileged users from loading arbitrary BPF programs.
- Enable BPF JIT hardening with \`net.core.bpf_jit_harden=2\` to mitigate JIT spraying attacks.`
  },
  {
    id: 'dispatch-webauthn',
    title: 'Architecting Zero-Trust Identity: Migrating Passwords to FIDO2 / WebAuthn',
    date: 'JANUARY 15, 2026',
    readTime: '9 MIN READ',
    author: 'LABIB B. SHAHED',
    category: 'arch',
    threatLevel: 'CRITICAL',
    cveReference: 'CWE-306',
    viewsCount: 2890,
    tags: ['WebAuthn', 'Zero-Trust', 'Passkeys', 'Cryptography', 'TypeScript'],
    excerpt: 'Password-based authentication remains the single weakest link in enterprise security. Learn how to implement ECDSA P-256 WebAuthn passkey verification using TypeScript & WebCrypto API.',
    keyTakeaways: [
      'Eliminates AiTM reverse proxy phishing (Evilginx) by cryptographically binding origin domains.',
      'Stores private keys exclusively within hardware Secure Enclaves (YubiKey, Apple TouchID).',
      'Significantly reduces credential stuffing and account takeover risks to near-zero.'
    ],
    codeSnippet: `// Server Signature Verification using WebCrypto API
export async function verifyWebAuthnSignature(
  publicKeyBuffer: ArrayBuffer,
  signatureBuffer: ArrayBuffer,
  signedDataBuffer: ArrayBuffer
): Promise<boolean> {
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );

  return await crypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    publicKey,
    signatureBuffer,
    signedDataBuffer
  );
}`,
    fullMarkdown: `## Why Passwords Must Die

Phishing attacks and credential stuffing account for over 80% of enterprise breaches. Even multi-factor SMS or TOTP tokens can be intercepted by modern adversary-in-the-middle (AiTM) reverse proxy tools like Evilginx2.

**WebAuthn / FIDO2** solves this problem permanently by cryptographically binding the authentication request to the exact TLS origin domain.

### Cryptographic Workflow
1. **Challenge Generation**: Client browser requests a cryptographically secure 32-byte challenge nonce from server.
2. **Hardware Attestation**: Hardware authenticator (YubiKey / TouchID) prompts user gesture and signs challenge using ECDSA P-256 private key stored in Secure Enclave.
3. **Domain Binding Verification**: Server verifies signature using stored public key against \`origin\` and \`rpId\` parameters.`
  },
  {
    id: 'dispatch-rust-fuzzing',
    title: 'High-Throughput API Fuzzing in Rust: Reaching 100,000 HTTP/2 Requests/Sec',
    date: 'MARCH 02, 2026',
    readTime: '15 MIN READ',
    author: 'LABIB B. SHAHED',
    category: 'offsec',
    threatLevel: 'MEDIUM',
    cveReference: 'CVE-2025-48190',
    viewsCount: 3120,
    tags: ['Rust', 'Fuzzing', 'Tokio', 'HTTP/2', 'OffSec'],
    excerpt: 'Standard web fuzzers like Dirbuster and Gobuster bottleneck on synchronous thread pools. Discover how Rust async multiplexing with Tokio enables blasting target APIs at maximum bandwidth.',
    keyTakeaways: [
      'Leverages HTTP/2 stream multiplexing over persistent single-socket TCP connections.',
      'Achieves 100k req/s per single compute node without thread starvation.',
      'Employs lock-free ring buffer telemetry output for minimal CPU overhead.'
    ],
    codeSnippet: `// High-Performance Tokio HTTP/2 Async Worker Loop
pub async fn send_fuzz_payload(client: &Client<HttpConnector>, target_url: &str, payload: &str) -> Result<u16> {
    let uri = format!("{}/{}", target_url, payload).parse::<Uri>()?;
    let req = Request::builder()
        .method(Method::GET)
        .uri(uri)
        .header("User-Agent", "CyberPulse-Security-Fuzzer/2.0")
        .body(Body::empty())?;

    let res = client.request(req).await?;
    Ok(res.status().as_u16())
}`,
    fullMarkdown: `## The Performance Wall of Legacy Fuzzers

When conducting pentests against complex microservice APIs, standard Python or Go fuzzers often saturate thread limits or fail to leverage HTTP/2 frame multiplexing.

By writing a custom fuzzer in **Rust** using \`tokio\` and \`hyper\` HTTP/2 prior knowledge options, we achieve **100,000 requests per second** per node.

### Core Architecture Principles
- **Zero-Copy Mutability**: Zero-copy string mutations using \`Bytes\` buffer pools.
- **Pre-warmed Connections**: Keep-alive socket connection pooling with pre-warmed TCP TLS handshakes.
- **Lock-Free Logging**: Lock-free MPMC ring buffer telemetry output.`
  },
  {
    id: 'dispatch-llm-injection',
    title: 'Defending GenAI Microservices: Indirect Prompt Injection & SSRF Inversion',
    date: 'APRIL 18, 2026',
    readTime: '11 MIN READ',
    author: 'LABIB B. SHAHED',
    category: 'ai_security',
    threatLevel: 'CRITICAL',
    cveReference: 'OWASP-LLM01',
    viewsCount: 4180,
    tags: ['AI Security', 'Prompt Injection', 'LLM Guardrails', 'SSRF', 'Python'],
    excerpt: 'Autonomous AI agents with tool-calling capabilities are susceptible to Indirect Prompt Injection embedded in external web data, leading to unauthorized API execution and SSRF breaches.',
    keyTakeaways: [
      'Isolates tool-execution agents inside zero-trust container sandboxes with network egress filtering.',
      'Implements dual-pass semantic verification on model output function parameters before execution.',
      'Uses AST-based prompt sanitization to strip invisible Unicode control characters and system overrides.'
    ],
    codeSnippet: `def validate_agent_tool_call(tool_name: str, args: dict, allowed_schema: dict) -> bool:
    """Validates LLM tool call arguments against strict schema and egress domain allowlists."""
    if tool_name not in allowed_schema:
        raise SecurityException(f"Unauthorized tool execution attempt: {tool_name}")
    
    if "url" in args:
        target_domain = urlparse(args["url"]).hostname
        if not is_domain_whitelisted(target_domain):
            raise SSRFPreventionException(f"Blocked SSRF attempt to unauthorized host: {target_domain}")
            
    return True`,
    fullMarkdown: `## The Rise of Indirect Prompt Injection

As enterprise applications grant Large Language Model agents access to corporate knowledge bases, email streams, and web scrapers, a critical vulnerability vector has emerged: **Indirect Prompt Injection**.

An attacker embeds hidden system prompt overrides inside external web pages or PDFs retrieved by an AI agent. When parsed by the model, the instructions hijack the agent's context and trick it into executing malicious tool calls.

### Defense Mitigation Blueprint
1. **Strict Context Segregation**: Never concatenate user data directly into system instructions.
2. **Deterministic Egress Controls**: Enforce strict domain whitelisting on any network fetch tools exposed to the agent.
3. **Human-in-the-Loop Thresholds**: Require explicit user confirmation for high-risk write/delete operations.`
  },
  {
    id: 'dispatch-cloud-kms',
    title: 'Hardening Multi-Cloud Infrastructure with Envelope Encryption & HSM KMS',
    date: 'MAY 30, 2026',
    readTime: '10 MIN READ',
    author: 'LABIB B. SHAHED',
    category: 'cloud',
    threatLevel: 'HIGH',
    cveReference: 'CWE-311',
    viewsCount: 1950,
    tags: ['Cloud Security', 'GCP KMS', 'AWS KMS', 'Envelope Encryption', 'AES-GCM'],
    excerpt: 'Storing plaintext keys or static encryption tokens in environment variables creates fatal exposure risks. Explore how to implement hardware-backed envelope encryption with rotating KMS keys.',
    keyTakeaways: [
      'Uses ephemeral Data Encryption Keys (DEKs) wrapped by root Key Encryption Keys (KEKs) in HSM.',
      'Ensures root private keys never leave Hardware Security Modules.',
      'Automates 90-day cryptographic key rotation with zero service downtime.'
    ],
    codeSnippet: `// GCP KMS Envelope Encryption Pattern
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const kmsClient = new KeyManagementServiceClient();

async function encryptPayloadWithKMS(plaintextBuffer, keyName) {
  const [response] = await kmsClient.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
  });
  return response.ciphertext;
}`,
    fullMarkdown: `## Envelope Encryption Architecture

In modern multi-cloud architectures (GCP / AWS), encrypting large data payloads directly with root KMS keys creates bandwidth bottlenecks and excessive API costs.

**Envelope Encryption** solves this by generating a local Data Encryption Key (DEK) for the data payload, while using the HSM-backed Key Encryption Key (KEK) only to wrap the DEK itself.

### Key Lifecycle Management
- **DEK Generation**: Local AES-256-GCM key generated in RAM per payload.
- **KEK Wrapping**: DEK sent to GCP KMS / AWS KMS for hardware wrapping.
- **Zero-Storage RAM Purge**: Plaintext DEK wiped from memory immediately after encryption.`
  }
];
