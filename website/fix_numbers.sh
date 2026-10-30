sed -i 's/`\[ HARDWARE & ARCHITECTURE \]/`\[01\] HARDWARE \& ARCHITECTURE \]/g' src/components/TerminalModal.tsx
sed -i 's/`\[01\] HARDWARE & ARCHITECTURE \]\\n-------------------------------------------------------------------/`\[01\] HARDWARE \& ARCHITECTURE \]\\n===================================================================/g' src/components/TerminalModal.tsx
sed -i 's/\[ RAID 1 \\/ LUKS Encrypted \]/\[ RAID 1 \\/ LUKS Encrypted \]\\n===================================================================/g' src/components/TerminalModal.tsx

sed -i 's/\[ OS & KERNEL ENVIRONMENT \]/\[02\] OS \& KERNEL ENVIRONMENT \]/g' src/components/TerminalModal.tsx
sed -i 's/\[02\] OS & KERNEL ENVIRONMENT \]\\n-------------------------------------------------------------------/\[02\] OS \& KERNEL ENVIRONMENT \]\\n===================================================================/g' src/components/TerminalModal.tsx
sed -i 's/Compilers    : gcc 13.2.1, clang 17.0.6, go 1.22.0/Compilers    : gcc 13.2.1, clang 17.0.6, go 1.22.0\\n===================================================================/g' src/components/TerminalModal.tsx

sed -i 's/\[ SECURITY & TELEMETRY \]/\[03\] SECURITY \& TELEMETRY \]/g' src/components/TerminalModal.tsx
sed -i 's/\[03\] SECURITY & TELEMETRY \]\\n-------------------------------------------------------------------/\[03\] SECURITY \& TELEMETRY \]\\n===================================================================/g' src/components/TerminalModal.tsx
sed -i 's/Status       : DEFCON 5 (ALL SYSTEMS NOMINAL)`/Status       : DEFCON 5 (ALL SYSTEMS NOMINAL)\\n===================================================================`/g' src/components/TerminalModal.tsx

