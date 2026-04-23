# Research Proposal (EEE498)

Bachelor of Science / Bachelor of Engineering in Electrical and Electronic Engineering

**Date of Submission**: April 1, 2025

**1. Student Information**
- **Name**: MD Ibtehaz Kabir
- **Student ID**: 21121001
- **Academic Year**: 2025
- **Semester**: Fall

**2. Contact Information**
- **Email**: [mohammad.ibtehaz.kabir@g.bracu.ac.bd](mailto:mohammad.ibtehaz.kabir@g.bracu.ac.bd)
- **Phone**: +880 1869303518

**3. Academic Supervision**
- **Supervisor**: Dr. Tarek Aziz, BSRM School of Engineering, BRAC University

**4. Research Title**

**Hybrid Vehicle-to-Vehicle and Vehicle-to-Grid Demand-Side Management Framework for Electric Vehicle Charging Integration Using Lean Project Management Principles**

**5. Background and Problem Context**

**5.1 Motivating Challenges**

Rapid electrification of the transportation sector presents significant challenges to modern power distribution systems. The accelerating adoption of electric vehicles (EVs) introduces large concentrations of flexible but temporally-correlated electrical demand that, if unmanaged, can amplify evening peak loads, increase feeder-level losses, and degrade local voltage stability. These technical challenges are particularly acute in developing power systems such as Bangladesh, where grid flexibility remains constrained, generation capacity is fossil-fuel dependent, and distribution network infrastructure has limited headroom for demand volatility.

**5.2 Current State of Demand-Side Management Literature**

Demand-Side Management (DSM) has been extensively investigated as a principal mechanism for mitigating EV integration challenges through coordinated control of charging timing and power exchange rates. Vehicle-to-Grid (V2G) technology enables bidirectional power flow, positioning EVs as dispatchable storage assets capable of delivering grid support services—including peak demand reduction, load leveling, and voltage stability enhancement—through centralized dispatch logic. Contemporary research has documented empirically optimized and consumer-centric DSM schemes that achieve V2G objectives while preserving user comfort constraints.

Conversely, Vehicle-to-Vehicle (V2V) energy transfer has recently emerged as a decentralized coordination paradigm enabling localized peer-to-peer energy balancing with reduced dependence on upstream grid infrastructure. While V2V operation enhances local feeder flexibility and system resilience, its inherently localized scope limits its capacity to address system-wide peak demand reduction independently.

**5.3 Research Gap and Proposed Contribution**

Current literature predominantly addresses V2G and V2V technologies in isolation, with limited rigorous analysis of hierarchical hybrid coordination frameworks that systematically integrate both modalities. This research fills that analytical gap by proposing a comprehensive three-layer hierarchical DSM architecture that prioritizes V2V for localized energy balancing while strategically deploying V2G for system-level grid support. The framework is substantiated by Lean Project Management principles—specifically waste elimination in energy transport and inventory utilization—providing operational logic transferable to both developed and developing power systems.

**6. Research Objectives and Expected Outcomes**

**6.1 Primary Research Objectives**

This research is structured around five coordinated and measurable objectives:

1. **Quantitative Impact Assessment**: Characterize the temporal and spatial impact of uncoordinated EV charging behavior on distribution-level power system demand profiles, loss distributions, and voltage stability metrics across heterogeneous load conditions.

2. **Comparative Strategy Development**: Formulate and implement three distinct DSM control paradigms—V2G-only centralized dispatch, V2V-only decentralized peer exchange, and hybrid V2V-first coordination—under identical simulation assumptions to enable rigorous comparative analysis.

3. **Hierarchical Framework Architecture**: Develop a formal three-layer hierarchical DSM framework that operationalizes V2V-priority logic for localized energy balancing while reserving V2G discharge for system-critical grid stress periods, with explicit mathematical formulation of coordination constraints.

4. **Multi-Objective Performance Evaluation**: Evaluate DSM strategy effectiveness across a comprehensive metric portfolio including peak load reduction (% improvement), system energy losses, battery cycling frequency, voltage profile quality, and operational fairness indices.

5. **Lean Principles Integration**: Apply Lean Project Management waste-elimination logic to systematically identify and quantify operational waste in EV charging systems, specifically transportation waste (avoidable network circulation) and inventory waste (suboptimal battery reserve buffering).

**6.2 Specific Research Outcomes**

This investigation will produce the following tangible research artifacts:

1. **Comparative Performance Report**: Quantitative benchmarking analysis contrasting V2G-only, V2V-only, and hybrid DSM strategies across peak reduction, system losses, battery degradation indicators, and feasibility metrics.

2. **Peak Demand Characterization**: Precise quantification of peak load reduction percentages achievable through coordinated V2G dispatch, with confidence intervals and sensitivity analysis across operational scenarios.

3. **Localized Efficiency Identification**: Systematic identification and characterization of operational regimes where V2V-priority control delivers measurable local efficiency gains while maintaining or improving aggregate system performance indicators.

4. **Waste Reduction Quantification**: Quantitative demonstration of transportation and inventory waste reduction through Lean-based DSM policy optimization, with explicit mapping to energy economics and operational cost savings.

5. **Scalable Implementation Framework**: Delivery of a technically validated, scalable DSM coordination framework demonstrating viability for deployment in both developed and emerging power systems, with explicit attention to computational tractability and communication requirements.

**7. Methodology and Experimental Design**

**7.1 System Modeling Architecture**

A comprehensive smart grid simulation environment will be developed in MATLAB encompassing three principal system components:

- **Distribution Network Model**: IEEE 33-bus radial distribution system (benchmark topology) with detailed line impedance parameters, capacity constraints, and voltage regulation characteristics.
- **EV Fleet Representation**: Heterogeneous fleet of 100 electric vehicles with individual state-of-charge (SoC) dynamics, charging/discharging power limits, battery capacity ratings, efficiency losses, and arrival/departure time profiles.
- **Aggregation and Control Infrastructure**: Centralized aggregator entity implementing dispatching logic, supported by fast communication channels and real-time measurement feedback for state estimation.

EV battery dynamics shall be modeled through discrete-time state equations incorporating efficiency factors, capacity constraints, and thermal limitations consistent with industrial Li-ion battery characteristics.

**7.2 DSM Control Strategy Formulation**

Three alternative DSM control paradigms will be implemented under common mathematical framework:

**Strategy 1: Centralized V2G-Only Control**
Implement centralized optimal dispatch where EVs execute valley-filling logic during off-peak periods and deliver coordinated discharge support during forecasted peak demand intervals. Control objective minimizes system peak demand while satisfying all operational constraints.

**Strategy 2: Decentralized V2V-Only Control**
Implement fully decentralized peer-to-peer energy coordination where individual vehicles make autonomous transfer decisions based on local SoC differentials and network proximity. Coordination relies on minimal centralized signaling.

**Strategy 3: Hierarchical Hybrid V2V-First Control**
Implement a formal three-tier control hierarchy:
- **Tier 1 (V2V-Primary)**: Activate vehicle-to-vehicle energy transfer among SoC-complementary pairs within geographic zones when feasibility constraints are satisfied.
- **Tier 2 (Coordinated G2V)**: Schedule remaining charging demand into valley periods via constraint-aware load-shifting optimization.
- **Tier 3 (Conditional V2G)**: Activate battery discharge only when real-time or forecasted grid stress indicators exceed operator-defined threshold values.

**7.3 Mathematical Problem Formulation**

The optimization framework shall employ multi-objective formulation:

**State Dynamics** (battery SoC evolution):
- SoC_i(t+1) = SoC_i(t) + (η × P_i(t) × Δt) / E_i
- Subject to constraints: SoC_min,i ≤ SoC_i(t) ≤ SoC_max,i
- Power bounds: -P_dis,max,i ≤ P_i(t) ≤ P_ch,max,i

**V2V Activation Logic**:
- u_ij(t) ∈ {0,1}: activation binary variable
- Activated when SoC_i(t) - SoC_j(t) > ε AND network feasibility verified

**Multi-Objective Function**:
- Minimize: J = w₁·Peak + w₂·Loss + w₃·Degradation + w₄·UserDiscomfort
- Where weights w₁, w₂, w₃, w₄ are operator-adjustable policy parameters
- Degradation term incorporates cycle-counting and throughput penalties

Optimization will employ metaheuristic solution methods (Genetic Wolf Optimizer / Black-Widow Optimization Algorithm) capable of navigating mixed-integer non-convex decision spaces characteristic of distribution-level EV coordination problems.

**7.4 Experimental Simulation Protocol**

**Simulation Parameters**:
- **Temporal Horizon**: 24-hour operational period
- **Time Resolution**: 15-minute discrete intervals (96 total intervals)
- **EV Fleet Composition**: 100 vehicles (100 kW aggregate charging capacity)
- **Battery Specifications**: 50 kWh nominal capacity per vehicle; 95% round-trip efficiency
- **Initial Conditions**: Random SoC initialization in range [30%-80%]; operational SoC bounds [20%-95%]
- **Residential Load**: Synthetic base-load profile representative of urban residential demand patterns

**Scenario Specification**:
1. **Baseline Scenario**: Uncontrolled charging (immediate charging upon vehicle arrival)
2. **Centralized V2G Scenario**: Valley-filling plus peak-period dispatch optimization
3. **Proposed Hybrid Scenario**: V2V-first logic with conditional V2G activation

All scenarios shall operate under identical load profiles, EV penetration rates, and temporal availability patterns to ensure methodological validity of comparative analysis.

**7.5 Performance Evaluation Metrics**

Comprehensive performance assessment shall employ the following technical indicators:

- **Peak Load Management**: Absolute peak demand (kW); percentage peak reduction relative to baseline
- **Network Efficiency**: Total system losses (kWh); loss reduction percentage
- **Battery Health**: Average cycling frequency; cumulative cycle-equivalents; SoC persistence distribution
- **Energy Exchange**: V2V transferred energy volume (kWh); V2G injected energy volume (kWh)
- **Voltage Stability**: Voltage deviation distributions; constraint violations frequency
- **Operational Fairness**: SoC distribution equity; per-vehicle cycling variance; user comfort satisfaction metrics
- **System Resilience**: Local congestion relief indicators; feeder-level stress reduction metrics

Confidence intervals and sensitivity analysis will be computed across 10 independent Monte Carlo replications with varying initial conditions.

**8. Literature Foundation and References**

**Primary Supervisor Contributions**:

[1] Aziz, T., "A Consumer-Friendly Electric Vehicle Charging Scheme," BRAC University research publication.

[2] Aziz, T., "A Time-of-Use Tariff Scheme for Demand Side Management of Residential Load," BRAC University research publication.

[3] Aziz, T., "A Novel Consumer-Friendly Electric Vehicle Charging Scheme with Vehicle-to-Grid Capability," BRAC University research publication.

**Foundational V2G and Grid Integration Literature**:

[4] Kempton, W., and Tomić, J., "Vehicle-to-grid power fundamentals: Calculating capacity and net revenue," *Journal of Power Sources*, 2005.

[5] Lund, H., et al., "The role of electric vehicles in smart grids," *Energy*, 2012.

[6] Sortomme, E., and El-Sharkawi, M., "Optimal charging strategies for unidirectional and bidirectional electric vehicles," *IEEE Transactions on Smart Grid*, vol. 2, no. 1, pp. 131–141, 2011.

**Contemporary Multi-Objective DSM and Optimization**:

[7] Khan et al., "Distributed optimization for EV charging coordination," *Applied Energy*, 2024.

[8] Alsharif et al., "Black-Widow Optimization Algorithm for smart grid scheduling," *Applied Sciences*, vol. 14, no. 12, 2025.

[9] Xu et al., "Demand-side management optimization using metaheuristics," *Frontiers in Energy Research*, vol. 11, 2023.

[10] Zhao et al., "Comparative study of metaheuristic approaches for DSM in microgrids," *Scientific Reports*, 2025.

**Battery Degradation and Health Management**:

[11] Ahmed et al., "Battery degradation under vehicle-to-grid cycling conditions," *Electronics*, vol. 14, no. 23, 2025.

[12] DriVe2X Consortium, "Battery Degradation Assessment Report for EV Applications," Technical Report D6.1, European Union Horizon research program, 2026.

**Standards, Interoperability, and Cybersecurity**:

[13] CharIN (Combined Charging System Initiative), "CCS ecosystem and V2G standardization framework," https://www.charin.global, 2024.

[14] International Organization for Standardization (ISO), "ISO 15118-20: Vehicle-to-Grid Communication Standard," 2024.

[15] National Institute of Standards and Technology (NIST), "NISTIR 8473: Cybersecurity Framework Profile for Electric Vehicle Extreme Fast Charging Infrastructure," 2024.

**Lean Project Management in Energy Systems**:

[16] Project Management Institute (PMI), "Lean Project Management: From Theory to Practice," PMI Library, 2020.

**Energy and Transportation Policy Context**:

[17] International Energy Agency (IEA), "Global EV Outlook 2024: Trends in Electric Vehicle Charging Infrastructure," https://www.iea.org/reports/global-ev-outlook-2024/, 2024.

