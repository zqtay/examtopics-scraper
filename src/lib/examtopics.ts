import { fetchPage } from "./fetcher";
import { Question } from "./scraper";

export type ExamState = {
  provider?: string;
  examCode?: string;
  questions?: Question[];
};

export const providerOptions = [
  {
    "label": "Microsoft",
    "value": "microsoft"
  },
  {
    "label": "Cisco",
    "value": "cisco"
  },
  {
    "label": "CompTIA",
    "value": "comptia"
  },
  {
    "label": "Amazon",
    "value": "amazon"
  },
  {
    "label": "Oracle",
    "value": "oracle"
  },
  {
    "label": "Isaca",
    "value": "isaca"
  },
  {
    "label": "VMware",
    "value": "vmware"
  },
  {
    "label": "Salesforce",
    "value": "salesforce"
  },
  {
    "label": "Google",
    "value": "google"
  },
  {
    "label": "PMI",
    "value": "pmi"
  },
  {
    "label": "ECCouncil",
    "value": "eccouncil"
  },
  {
    "label": "ServiceNow",
    "value": "servicenow"
  },
  {
    "label": "Fortinet",
    "value": "fortinet"
  },
  {
    "label": "Dell",
    "value": "dell"
  },
  {
    "label": "Juniper",
    "value": "juniper"
  },
  {
    "label": "Checkpoint",
    "value": "checkpoint"
  },
  {
    "label": "Palo Alto Networks",
    "value": "palo-alto-networks"
  },
  {
    "label": "ISC",
    "value": "isc"
  },
  {
    "label": "HP",
    "value": "hp"
  },
  {
    "label": "Snowflake",
    "value": "snowflake"
  },
  {
    "label": "Citrix",
    "value": "citrix"
  },
  {
    "label": "IBM",
    "value": "ibm"
  },
  {
    "label": "The Open Group",
    "value": "the-open-group"
  },
  {
    "label": "Splunk",
    "value": "splunk"
  },
  {
    "label": "Netapp",
    "value": "netapp"
  },
  {
    "label": "IIA",
    "value": "iia"
  },
  {
    "label": "IIBA",
    "value": "iiba"
  },
  {
    "label": "LPI",
    "value": "lpi"
  },
  {
    "label": "PRINCE2",
    "value": "prince2"
  },
  {
    "label": "CyberArk",
    "value": "cyberark"
  },
  {
    "label": "APICS",
    "value": "apics"
  },
  {
    "label": "IAPP",
    "value": "iapp"
  },
  {
    "label": "Huawei",
    "value": "huawei"
  },
  {
    "label": "ACAMS",
    "value": "acams"
  },
  {
    "label": "Avaya",
    "value": "avaya"
  },
  {
    "label": "HashiCorp",
    "value": "hashicorp"
  },
  {
    "label": "Pegasystems",
    "value": "pegasystems"
  },
  {
    "label": "Databricks",
    "value": "databricks"
  },
  {
    "label": "Nutanix",
    "value": "nutanix"
  },
  {
    "label": "ITIL",
    "value": "itil"
  },
  {
    "label": "UiPath",
    "value": "uipath"
  },
  {
    "label": "Test Prep",
    "value": "test-prep"
  },
  {
    "label": "GIAC",
    "value": "giac"
  },
  {
    "label": "Scrum",
    "value": "scrum"
  },
  {
    "label": "Adobe",
    "value": "adobe"
  },
  {
    "label": "F5",
    "value": "f5"
  },
  {
    "label": "Mulesoft",
    "value": "mulesoft"
  },
  {
    "label": "Veeam",
    "value": "veeam"
  },
  {
    "label": "SAP",
    "value": "sap"
  },
  {
    "label": "CrowdStrike",
    "value": "crowdstrike"
  },
  {
    "label": "Alcatel-Lucent",
    "value": "alcatel-lucent"
  },
  {
    "label": "CSA",
    "value": "csa"
  },
  {
    "label": "Nokia",
    "value": "nokia"
  },
  {
    "label": "Six Sigma",
    "value": "six-sigma"
  },
  {
    "label": "NetSuite",
    "value": "netsuite"
  },
  {
    "label": "Blue Prism",
    "value": "blue-prism"
  },
  {
    "label": "Python Institute",
    "value": "python-institute"
  },
  {
    "label": "Linux Foundation",
    "value": "linux-foundation"
  },
  {
    "label": "Genesys",
    "value": "genesys"
  },
  {
    "label": "AHIMA",
    "value": "ahima"
  },
  {
    "label": "API",
    "value": "api"
  },
  {
    "label": "RedHat",
    "value": "redhat"
  },
  {
    "label": "SAS Institute",
    "value": "sas-institute"
  },
  {
    "label": "Tableau",
    "value": "tableau"
  },
  {
    "label": "ISTQB",
    "value": "istqb"
  },
  {
    "label": "CWNP",
    "value": "cwnp"
  },
  {
    "label": "ASQ",
    "value": "asq"
  },
  {
    "label": "Atlassian",
    "value": "atlassian"
  },
  {
    "label": "AndroidATC",
    "value": "androidatc"
  },
  {
    "label": "ASIS",
    "value": "asis"
  },
  {
    "label": "BICSI",
    "value": "bicsi"
  },
  {
    "label": "Exin",
    "value": "exin"
  },
  {
    "label": "CIW",
    "value": "ciw"
  },
  {
    "label": "iSQI",
    "value": "isqi"
  },
  {
    "label": "Appian",
    "value": "appian"
  },
  {
    "label": "GAQM",
    "value": "gaqm"
  },
  {
    "label": "WatchGuard",
    "value": "watchguard"
  },
  {
    "label": "Veritas",
    "value": "veritas"
  },
  {
    "label": "Vmedu",
    "value": "vmedu"
  },
  {
    "label": "Zend",
    "value": "zend"
  },
  {
    "label": "Arista",
    "value": "arista"
  },
  {
    "label": "Blockchain",
    "value": "blockchain"
  },
  {
    "label": "HRCI",
    "value": "hrci"
  },
  {
    "label": "GARP",
    "value": "garp"
  },
  {
    "label": "QlikView",
    "value": "qlikview"
  },
  {
    "label": "Alibaba",
    "value": "alibaba"
  },
  {
    "label": "ISA",
    "value": "isa"
  },
  {
    "label": "English Test Preparation",
    "value": "english-test-preparation"
  },
  {
    "label": "NFPA",
    "value": "nfpa"
  },
  {
    "label": "Axis Communications",
    "value": "axis-communications"
  },
  {
    "label": "IAAP",
    "value": "iaap"
  },
  {
    "label": "Scaled Agile",
    "value": "scaled-agile"
  },
  {
    "label": "BACB",
    "value": "bacb"
  },
  {
    "label": "Sitecore",
    "value": "sitecore"
  },
  {
    "label": "Teradata",
    "value": "teradata"
  },
  {
    "label": "NADCA",
    "value": "nadca"
  },
  {
    "label": "SOA",
    "value": "soa"
  },
  {
    "label": "Versa Networks",
    "value": "versa-networks"
  },
  {
    "label": "ABA",
    "value": "aba"
  },
  {
    "label": "CertNexus",
    "value": "certnexus"
  },
  {
    "label": "Hitachi",
    "value": "hitachi"
  },
  {
    "label": "iSAQB",
    "value": "isaqb"
  },
  {
    "label": "ACSM",
    "value": "acsm"
  },
  {
    "label": "DSCI",
    "value": "dsci"
  },
  {
    "label": "SolarWinds",
    "value": "solarwinds"
  },
  {
    "label": "Symantec",
    "value": "symantec"
  },
  {
    "label": "AAPC",
    "value": "aapc"
  },
  {
    "label": "FINRA",
    "value": "finra"
  },
  {
    "label": "BCS",
    "value": "bcs"
  },
  {
    "label": "CNCF",
    "value": "cncf"
  },
  {
    "label": "ACFE",
    "value": "acfe"
  },
  {
    "label": "Mirantis",
    "value": "mirantis"
  },
  {
    "label": "SANS",
    "value": "sans"
  },
  {
    "label": "Infor",
    "value": "infor"
  },
  {
    "label": "Magento",
    "value": "magento"
  },
  {
    "label": "Novell",
    "value": "novell"
  },
  {
    "label": "nCino",
    "value": "ncino"
  },
  {
    "label": "NI",
    "value": "ni"
  },
  {
    "label": "A10 Networks",
    "value": "a10-networks"
  },
  {
    "label": "Apple",
    "value": "apple"
  },
  {
    "label": "Riverbed",
    "value": "riverbed"
  },
  {
    "label": "AAFM India",
    "value": "aafm-india"
  },
  {
    "label": "McAfee",
    "value": "mcafee"
  },
  {
    "label": "DMI",
    "value": "dmi"
  },
  {
    "label": "Meta",
    "value": "meta"
  },
  {
    "label": "SNIA",
    "value": "snia"
  },
  {
    "label": "WorldatWork",
    "value": "worldatwork"
  },
  {
    "label": "AHIP",
    "value": "ahip"
  },
  {
    "label": "AHLEI",
    "value": "ahlei"
  },
  {
    "label": "Guidance Software",
    "value": "guidance-software"
  },
  {
    "label": "HCL Software Academy",
    "value": "hcl-software-academy"
  },
  {
    "label": "NCMA",
    "value": "ncma"
  },
  {
    "label": "Netskope",
    "value": "netskope"
  },
  {
    "label": "CA Technologies",
    "value": "ca-technologies"
  },
  {
    "label": "C++ Institute",
    "value": "c-plus-plus-institute"
  },
  {
    "label": "Tibco",
    "value": "tibco"
  },
  {
    "label": "Aruba",
    "value": "aruba"
  },
  {
    "label": "Cloudera",
    "value": "cloudera"
  },
  {
    "label": "FileMaker",
    "value": "filemaker"
  },
  {
    "label": "PEOPLECERT",
    "value": "peoplecert"
  },
  {
    "label": "USGBC",
    "value": "usgbc"
  },
  {
    "label": "AICPA",
    "value": "aicpa"
  },
  {
    "label": "AIWMI",
    "value": "aiwmi"
  },
  {
    "label": "APSE",
    "value": "apse"
  },
  {
    "label": "Autodesk",
    "value": "autodesk"
  },
  {
    "label": "Blue Coat",
    "value": "blue-coat"
  },
  {
    "label": "Certinia",
    "value": "certinia"
  },
  {
    "label": "GMAC",
    "value": "gmac"
  },
  {
    "label": "HAAD",
    "value": "haad"
  },
  {
    "label": "Logical Operations",
    "value": "logical-operations"
  },
  {
    "label": "NACVA",
    "value": "nacva"
  },
  {
    "label": "Unlimited",
    "value": "unlimited"
  }
];

export const getProviderOptions = async () => {
  const regex = /discussions\/(.*?)((\/|$))/;
  const doc = await fetchPage("/api/examtopics/discussions");
  const list = Array.from(doc.getElementsByClassName("dicussion-title-container"));
  const providers = list.map(e => {
    const link = e.getElementsByTagName("a")[0];
    return {
      label: link.innerHTML.trim(),
      value: link.getAttribute('href')?.match(regex)?.[1] ?? "",
    };
  });
  return providers;
};