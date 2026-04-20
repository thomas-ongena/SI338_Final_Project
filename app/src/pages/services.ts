// Define the type for a service
type serviceType = {
  title: string;
  description: string;
  type: 'On Site Solutions' | 'Technology Offerings';
  image: string; // Path or URL to the image
};

export enum TabOption {
  Services = 'On Site Solutions',
  Technology = 'Technology Offerings',
}

// Define services
export const services: serviceType[] = [
  {
    title: 'Asset Digitalization and Control',
    description:
      "Tooling records are often scattered across spreadsheets, supplier systems, and paper logs. Incomplete, inconsistent, and disconnected from the physical assets they represent. TMG deploys field teams and data specialists to build a clean, centralized digital record of every tool in your program: cataloging asset tags, mapping part numbers, capturing physical condition, and linking each record to its full operational history. The result is a single source of truth that gives your organization clear visibility into what you own, where it is, and what condition it's in. ",
    type: 'Technology Offerings',
    image: require('../assets/tooling_tracking.jpg'),
  },
  {
    title: 'ToolSight Platform',
    description:
      "Managing tooling programs at scale requires more than spreadsheets and email,  it requires purpose-built infrastructure. ToolSight is TMG's proprietary cloud platform, designed specifically for automotive tooling lifecycle management: it centralizes tool records, automates disposition analysis, supports offline-capable mobile field operations, and provides role-based portals for OEM staff, TMG teams, and suppliers. Every service TMG delivers runs through ToolSight, giving clients a single platform for real-time visibility, data exchange, and auditable decision-making across their entire tooling portfolio. ",
    type: 'Technology Offerings',
    image: require('../assets/toolsight.jpg'),
  },
  {
    title: 'Disposal Review',
    description:
      "When production parts go obsolete, OEMs need to determine which supporting tools can be safely scrapped, a process that traditionally requires hours of manual cross-referencing across part status databases, supplier records, and internal systems. TMG's disposal review combines proprietary data-matching algorithms with 20+ years of automotive tooling expertise to analyze tool eligibility at scale, delivering comprehensive disposition recommendations backed by multi-source validation. ",
    type: 'Technology Offerings',
    image: require('../assets/algorithm.jpg'),
  },
  {
    title: 'Lifecycle Management',
    description:
      'As tools age in production, the gap between current condition and end-of-warranty grows harder to track, especially across thousands of tools at hundreds of supplier sites. TMG monitors the full lifecycle of your tooling assets, tracking warranty capacity, production demand, condition assessments, and service change requests to calculate when each tool will reach end-of-useful-life. This proactive approach gives your team the lead time to plan replacements or refurbishments before a tool failure disrupts production. ',
    type: 'Technology Offerings',
    image: require('../assets/storeroom.png'),
  },
  {
    title: 'Confirmation Audit',
    description:
      "OEMs invest heavily in tooling but often lack independent verification that those assets are where they're supposed to be and in the condition they're reported to be. TMG conducts on-site physical audits confirming tool presence, location, condition, and identification, and produces a documented record with photo evidence and discrepancy flags for every asset reviewed. You get an auditable proof point that closes the gap between your records and reality on the ground. ",
    type: 'On Site Solutions',
    image: require('../assets/confirmation_audit.jpg'),
  },
  {
    title: 'Trucking',
    description:
      'Moving tooling assets between supplier sites, OEM facilities, and warehouses sounds straightforward until a missed pickup stalls a disposition approval or a mislabeled shipment creates a compliance gap. TMG coordinates the full transportation chain for tooling moves: scheduling pickups, managing carriers, handling shipping documentation, and processing weight tickets for scrap loads. Every move is tracked and tied back to the relevant tool records in ToolSight, so nothing gets lost in transit and every shipment produces an auditable paper trail your team can rely on. ',
    type: 'On Site Solutions',
    image: require('../assets/trucking.jpg'),
  },
  {
    title: 'Warehousing',
    description:
      "Tooling assets that outlive active production don't disappear, they accumulate at supplier sites where they consume floor space, create liability, and go untracked until an audit forces the issue. TMG provides secure indoor warehousing for service tooling, production parts, racks, end-of-arm tooling, and capital equipment, with every stored asset cataloged, photographed, and linked to its program record in ToolSight. Whether you need short-term staging during a supplier transition or long-term storage ahead of a disposition decision, your assets are accounted for, accessible, and ready for the next step in their lifecycle.",
    type: 'On Site Solutions',
    image: require('../assets/warehousing.jpg'),
  },
  {
    title: 'Service Tool Part Supply',
    description:
      'When a service part order arrives and the original production supplier is no longer viable, OEMs face the difficult task of sourcing low-volume, short-run production with little lead time and limited supplier visibility. TMG steps in as supplier of record, managing service part production through its established network of Tier 2 and Tier 3 suppliers, handling quality control, production coordination, and OEM compliance requirements from initial order through final delivery. At end of product lifecycle, TMG manages all related disposal processes and documentation, so the program closes cleanly without loose ends in your supply chain.',
    type: 'On Site Solutions',
    image: require('../assets/empty_factory.png'),
  },
];