/* ERA CODES:
  - "Paleolithic"           (pre–10,000 BCE)
  - "Holocene/Ancient"      (10,000 BCE – 1500 CE)
  - "EarlyModern/Modern"    (1500 CE – 2025 CE)
*/

const SOURCES = {
  NATURE_Hublin2017_JebelIrhoud: {
    label: "Hublin et al. 2017 (Nature): Jebel Irhoud ~315±34 ka",
    url: "https://www.nature.com/articles/nature22336"
  },
  NatureNews2017_PanAfrican: {
    label: "Nature News (2017): Pan‑African emergence of H. sapiens",
    url: "https://www.nature.com/articles/nature.2017.22114"
  },
  NATURE_2022_Vidal_OmoI: {
    label: "Vidal et al. 2022 (Nature): Omo I ≥233 ka (Ethiopia)",
    url: "https://www.nature.com/articles/s41586-021-04275-8"
  },
  SCIENCE_2018_Hershkovitz_Misliya: {
    label: "Hershkovitz et al. 2018 (Science): Misliya (Israel) 177–194 ka",
    url: "https://www.science.org/doi/10.1126/science.aap8369"
  },
  REVIEW_Bae2017_Science: {
    label: "Bae, Douka & Petraglia 2017 (Science): Dispersals into Asia",
    url: "https://www.science.org/doi/10.1126/science.aai9067"
  },
  PNAS_Henn2012_GreatExpansion: {
    label: "Henn et al. 2012 (PNAS): ‘Great Expansion’ out of Africa",
    url: "https://www.pnas.org/doi/10.1073/pnas.1212380109"
  },
  NATURE_Clarkson2017_Australia65k: {
    label: "Clarkson et al. 2017 (Nature): Australia (Madjedbebe) ~65 ka",
    url: "https://www.nature.com/articles/nature22968"
  },
  NATURE_BachoKiro2020: {
    label: "Hublin et al. 2020 (Nature): Bacho Kiro (Europe) ~45 ka",
    url: "https://www.nature.com/articles/s41586-020-2259-z"
  },
  NATURE_BachoKiro2021_Genomes: {
    label: "Hajdinjak et al. 2021 (Nature): genomes 45.9–42.6 ka",
    url: "https://www.nature.com/articles/s41586-021-03335-3"
  },
  SCIENCE_2023_WhiteSands: {
    label: "Pigati et al. 2023 (Science): White Sands footprints 21–23 ka",
    url: "https://www.science.org/doi/10.1126/science.adh5007"
  },
  USGS_2023_WhiteSands: {
    label: "USGS 2023: confirmation of footprint ages",
    url: "https://www.usgs.gov/news/national-news-release/study-confirms-age-oldest-fossil-human-footprints-north-america"
  },
  PNAS_Dillehay2015_MonteVerde: {
    label: "Dillehay et al. 2015 (PNAS OA): Monte Verde II ~14.5 ka",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4651426/"
  },
  PNAS_Wilmshurst2011_EastPolynesia: {
    label: "Wilmshurst et al. 2011 (PNAS): East Polynesia AD 1190–1290",
    url: "https://pubmed.ncbi.nlm.nih.gov/21187404/"
  },
  UHM_2011_PolynesiaSummary: {
    label: "Univ. Hawai‘i summary: two‑pulse East Polynesian colonization",
    url: "https://www.hawaii.edu/news/article.php?aId=4097"
  },
  PNAS_Pierron2014_Madagascar: {
    label: "Pierron et al. 2014 (PNAS): Austronesian–Bantu admixture (Madagascar)",
    url: "https://www.pnas.org/doi/10.1073/pnas.1321860111"
  },
  PNAS_Pierron2017_Madagascar: {
    label: "Pierron et al. 2017 (PNAS): genomic landscape across Madagascar",
    url: "https://www.pnas.org/doi/10.1073/pnas.1704906114"
  },
  PNAS_Grollemund2015_Bantu: {
    label: "Grollemund et al. 2015 (PNAS): Bantu expansion routes",
    url: "https://www.pnas.org/doi/10.1073/pnas.1503793112"
  },
  NATURE_Haak2015_Yamnaya: {
    label: "Haak et al. 2015 (Nature): Steppe (Yamnaya) migration to Europe",
    url: "https://www.nature.com/articles/nature14317"
  },
  SCIENCE_Narasimhan2019_SouthAsia: {
    label: "Narasimhan et al. 2019 (Science): Steppe ancestry in South Asia",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6822619/"
  },
  NATURE_Lazaridis2016_Neolithic: {
    label: "Lazaridis et al. 2016 (Nature): spread of early farmers (Anatolia→Europe)",
    url: "https://pubmed.ncbi.nlm.nih.gov/27459054/"
  },
  IOM_WMR2024_Corridors: {
    label: "IOM World Migration Report 2024: largest corridors (e.g., MX→US ~11M)",
    url: "https://worldmigrationreport.iom.int/sites/g/files/tmzbdl1691/files/documents/2024-05/data-snapshot-largest-migration-corridors.pdf"
  },
  UNDESA_IMS2020: {
    label: "UN DESA International Migrant Stock 2020 (281M global migrants)",
    url: "https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/files/documents/2021/Jan/undesa_pd_2020_international_migrant_stock_documentation.pdf"
  },
  IOM_WMR2022: {
    label: "IOM World Migration Report 2022",
    url: "https://publications.iom.int/books/world-migration-report-2022"
  },
  SlaveVoyages: {
    label: "Voyages: The Trans‑Atlantic Slave Trade Database (~12.5M embarked)",
    url: "https://www.slavevoyages.org/"
  },
  US_Census_GreatMigration: {
    label: "U.S. Census: Great Migration (≈6 million, 1910–1970)",
    url: "https://www.census.gov/dataviz/visualizations/020/"
  },
  Britannica_GreatMigration: {
    label: "Britannica: Great Migration summary",
    url: "https://www.britannica.com/event/Great-Migration"
  },
  UNHCR_2000_Partition14M: {
    label: "UNHCR (2000): Partition of India ≈14 million displaced",
    url: "https://www.unhcr.org/sites/default/files/legacy-pdf/3ebf9bab0.pdf"
  },
  Britannica_Partition: {
    label: "Britannica: Partition of India (12–20 M displaced)",
    url: "https://www.britannica.com/event/Partition-of-India"
  }
};

// Utility to make a route with sequential waypoints become multiple arc segments
function route(id, name, category, start, end, magnitude, confidence, waypoints, sources, description){
  return { id, name, category, start, end, magnitude, confidence, waypoints, sources, description };
}

// --- ROUTE DATA ---
const ROUTES = [
  // Paleolithic: emergence & Africa-wide movements
  route(
    "pan_africa_315_200ka",
    "Early H. sapiens mosaic across Africa",
    "Paleolithic",
    -315000, -200000,
    1, "medium",
    [
      [31.7,-7.1],   // Jebel Irhoud region (Morocco)
      [9.4,40.5],    // Omo/Herto, Ethiopia
      [-29,24],      // S. Africa interior
      [7,-1]         // W. Africa
    ],
    ["NATURE_Hublin2017_JebelIrhoud","NatureNews2017_PanAfrican","NATURE_2022_Vidal_OmoI"],
    "Earliest fossils and tools suggest a pan‑African emergence with gene flow among regional populations."
  ),

  // Early dispersals into Levant
  route(
    "levant_early_180_90ka",
    "Early excursions into the Levant",
    "Paleolithic",
    -180000, -90000,
    1, "medium",
    [
      [26.0,31.0],   // NE Africa
      [32.6,35.0]    // Levant (Skhul/Qafzeh/Misliya)
    ],
    ["SCIENCE_2018_Hershkovitz_Misliya","REVIEW_Bae2017_Science"],
    "Multiple early forays from NE Africa into the Levant, not all enduring."
  ),

  // Main southern dispersal
  route(
    "southern_oa_85_55ka",
    "Major Out‑of‑Africa via Arabia (southern route)",
    "Paleolithic",
    -85000, -55000,
    2, "medium",
    [
      [10,45],   // Horn of Africa
      [18,47],   // Arabia
      [20,75]    // Indian subcontinent
    ],
    ["REVIEW_Bae2017_Science","PNAS_Henn2012_GreatExpansion"],
    "Main sustained dispersal of H. sapiens into Arabia and South Asia."
  ),

  route(
    "to_se_asia_70_50ka",
    "Into Southeast Asia",
    "Paleolithic",
    -70000, -50000,
    2, "medium",
    [
      [20,75],     // India
      [15,100],    // SE Asia mainland
      [1,114]      // Borneo/Wallacea gateway
    ],
    ["REVIEW_Bae2017_Science"],
    "Expansion across the Indian subcontinent into SE Asia and Island SE Asia."
  ),

  route(
    "to_sahul_65ka",
    "Sahul (Australia/New Guinea) reached",
    "Paleolithic",
    -65000, -50000,
    3, "high",
    [
      [1,124],     // Wallacea region
      [-10,135],   // N Australia
      [-6,147]     // New Guinea
    ],
    ["NATURE_Clarkson2017_Australia65k"],
    "Archaeology at Madjedbebe supports human presence in Australia ~65 ka."
  ),

  route(
    "e_asia_50_40ka",
    "East Asia",
    "Paleolithic",
    -50000, -40000,
    2, "medium",
    [
      [20,100],   // SE Asia
      [35,105]    // China interior
    ],
    ["REVIEW_Bae2017_Science"],
    "Widespread presence across East Asia by ~45–40 ka."
  ),

  route(
    "japan_38_30ka",
    "Japanese Islands (EUP)",
    "Paleolithic",
    -38000, -30000,
    1, "medium",
    [
      [35,135],   // East China/Korea region
      [36,138]    // Honshu
    ],
    ["REVIEW_Bae2017_Science"],
    "Early Upper Paleolithic arrival in the Japanese archipelago ca. 39–38 ka."
  ),

  route(
    "europe_45_40ka",
    "Into Europe (Initial Upper Paleolithic)",
    "Paleolithic",
    -45000, -40000,
    2, "high",
    [
      [37,36],   // Anatolia/Levant gateway
      [42,22],   // Balkans
      [48,2]     // W Europe
    ],
    ["NATURE_BachoKiro2020","NATURE_BachoKiro2021_Genomes"],
    "Initial modern human presence in Europe by ~45 ka (e.g., Bacho Kiro)."
  ),

  route(
    "siberia_35_25ka",
    "Across Siberia",
    "Paleolithic",
    -35000, -25000,
    1, "medium",
    [
      [46,103],  // Mongolia
      [65,110]   // Arctic Siberia
    ],
    ["REVIEW_Bae2017_Science"],
    "Adaptations into northern Eurasia prior to the Last Glacial Maximum."
  ),

  route(
    "beringia_25_16ka",
    "Beringia occupation",
    "Paleolithic",
    -25000, -16000,
    1, "medium",
    [
      [66,170],    // NE Siberia/Beringia W
      [64,-165]    // Beringia E/Alaska
    ],
    ["REVIEW_Bae2017_Science"],
    "Populations persisted in Beringia during glacial phases."
  ),

  route(
    "americas_coastal_16_13ka",
    "Into the Americas (coastal & widespread)",
    "Paleolithic",
    -16000, -13000,
    3, "medium",
    [
      [64,-165],   // Alaska
      [49,-123],   // Pacific NW
      [19,-99],    // Mesoamerica
      [-13,-72]    // Andes/Chile
    ],
    ["SCIENCE_2023_WhiteSands","USGS_2023_WhiteSands","PNAS_Dillehay2015_MonteVerde"],
    "Presence by ~16–14.5 ka; footprints at White Sands ~23–21 ka indicate earlier incursions."
  ),

  // Holocene & Ancient expansions
  route(
    "neolithic_europe_7000_4500bce",
    "Neolithic farmers into Europe",
    "Holocene/Ancient",
    -7000, -4500,
    2, "high",
    [
      [39,34],   // Anatolia
      [41,22],   // Balkans
      [50,10]    // Central Europe
    ],
    ["NATURE_Lazaridis2016_Neolithic"],
    "Demic diffusion of early farmers from Anatolia into Europe."
  ),

  route(
    "bantu_core_2000bce_1500ce_central",
    "Bantu expansion → Central Africa",
    "Holocene/Ancient",
    -2000, 1500,
    3, "high",
    [
      [3,12],    // Cameroon/Nigeria homeland
      [0,25]     // Congo Basin
    ],
    ["PNAS_Grollemund2015_Bantu"],
    "Bantu language and farming expansions through rainforest corridors."
  ),

  route(
    "bantu_east_1000bce_1000ce",
    "Bantu expansion → East Africa",
    "Holocene/Ancient",
    -1000, 1000,
    2, "high",
    [
      [3,12],
      [1,36]     // Kenya/Tanzania
    ],
    ["PNAS_Grollemund2015_Bantu"],
    "Eastern stream through the Great Lakes region."
  ),

  route(
    "bantu_south_500bce_1500ce",
    "Bantu expansion → Southern Africa",
    "Holocene/Ancient",
    -500, 1500,
    2, "high",
    [
      [3,12],
      [-20,25]   // Southern Africa
    ],
    ["PNAS_Grollemund2015_Bantu"],
    "Southern sweep reaching modern South Africa by the 1st–2nd millennium CE."
  ),

  // Austronesian & Madagascar
  route(
    "austronesian_3000_1500bce_taiwan_philippines",
    "Austronesian: Taiwan → Philippines",
    "Holocene/Ancient",
    -3000, -1500,
    2, "high",
    [
      [24,121],  // Taiwan
      [15,121]   // Luzon/Philippines
    ],
    ["REVIEW_Bae2017_Science"],
    "Out‑of‑Taiwan model for the Austronesian dispersal."
  ),
  route(
    "austronesian_2000_1000bce_seasia",
    "Austronesian: Philippines → Island SE Asia",
    "Holocene/Ancient",
    -2000, -1000,
    2, "high",
    [
      [15,121],
      [0,120]     // Indonesia
    ],
    ["REVIEW_Bae2017_Science"],
    "Maritime expansion across Island SE Asia."
  ),
  route(
    "lapita_1500_500bce",
    "Lapita: into Near Oceania",
    "Holocene/Ancient",
    -1500, -500,
    2, "high",
    [
      [0,150],    // Bismarcks/Solomons vicinity (schematic)
      [-13.8, -171.8] // Samoa (later staging)
    ],
    ["REVIEW_Bae2017_Science"],
    "Austronesian‑associated Lapita horizon spreads into Melanesia/Western Polynesia."
  ),
  route(
    "east_polynesia_1025_1290ce",
    "East Polynesia pulse (Societies → region)",
    "Holocene/Ancient",
    1025, 1290,
    2, "high",
    [
      [-17.6, -149.4], // Societies (Tahiti)
      [20.7,-157.8],   // Hawai‘i
      [-27.1,-109.4],  // Rapa Nui
      [-41.3,174.7]    // Aotearoa NZ
    ],
    ["PNAS_Wilmshurst2011_EastPolynesia","UHM_2011_PolynesiaSummary"],
    "High‑precision dating shows rapid East Polynesian settlement AD 1190–1290."
  ),
  route(
    "madagascar_500_800ce",
    "Madagascar (Austronesian + Bantu)",
    "Holocene/Ancient",
    500, 800,
    2, "high",
    [
      [0,114],       // Borneo proxy
      [-18.9,47.5],  // Madagascar
      [-6,39]        // East African coast (Bantu stream)
    ],
    ["PNAS_Pierron2014_Madagascar","PNAS_Pierron2017_Madagascar"],
    "Dual ancestry from Island SE Asia (Austronesian) and East Africa (Bantu)."
  ),

  // Steppe & South Asia
  route(
    "yamnaya_3300_2500bce",
    "Steppe (Yamnaya) → Europe",
    "Holocene/Ancient",
    -3300, -2500,
    3, "high",
    [
      [48,45],  // Pontic‑Caspian steppe
      [52,15]   // Central Europe
    ],
    ["NATURE_Haak2015_Yamnaya"],
    "Ancient DNA shows a massive steppe influx into Late Neolithic/BA Europe."
  ),
  route(
    "indo_aryan_1500_1000bce",
    "Steppe‑related ancestry → South Asia",
    "Holocene/Ancient",
    -1500, -1000,
    2, "high",
    [
      [50,70],  // Central steppe
      [28,75]   // NW India
    ],
    ["SCIENCE_Narasimhan2019_SouthAsia"],
    "Post‑Indus admixture dynamics include Steppe‑related ancestry component."
  ),

  // Early modern & modern
  route(
    "slave_trade_1501_1867",
    "Trans‑Atlantic slave trade (macro flows)",
    "EarlyModern/Modern",
    1501, 1867,
    5, "high",
    [
      [6,-3],    // West Africa macro
      [-12,-55], // Brazil
      [18.5,-72],// Caribbean
      [29,-90]   // US Gulf
    ],
    ["SlaveVoyages"],
    "≈12.5 million Africans embarked; ~10.7 million landed in the Americas."
  ),
  route(
    "euro_settler_1600_1900",
    "European settler migrations (macro)",
    "EarlyModern/Modern",
    1600, 1900,
    3, "high",
    [
      [52,-1.5],   // Britain/Ireland
      [40,-74],    // USA (Atlantic)
      [45,-73],    // Canada
      [-33.9,151.2], // Australia
      [-41.3,174.7]  // New Zealand
    ],
    ["UNDESA_IMS2020","IOM_WMR2022"],
    "Large‑scale transoceanic settlement flows from Europe."
  ),
  route(
    "us_great_migration_1910_1970",
    "U.S. Great Migration (South → North/West)",
    "EarlyModern/Modern",
    1910, 1970,
    3, "high",
    [
      [33,-90],    // U.S. Deep South
      [41.8,-87.6],// Chicago
      [42.3,-83],  // Detroit
      [40.7,-74],  // NYC
      [34.0,-118.2] // Los Angeles
    ],
    ["US_Census_GreatMigration","Britannica_GreatMigration"],
    "≈6 million African Americans relocated out of the U.S. South."
  ),
  route(
    "partition_india_pakistan_1947_1950",
    "Partition of India/Pakistan (bidirectional)",
    "EarlyModern/Modern",
    1947, 1950,
    4, "high",
    [
      [31.5,74.3], // Lahore
      [28.6,77.2]  // Delhi
    ],
    ["UNHCR_2000_Partition14M","Britannica_Partition"],
    "≈14–20 million displaced; one of the largest population transfers in history."
  ),
  // Largest modern corridors (illustrative)
  route(
    "corridor_mex_usa",
    "Largest corridor: Mexico → USA (~11M)",
    "EarlyModern/Modern",
    1965, 2025,
    4, "high",
    [
      [19.4,-99.1], // Mexico City proxy
      [34.05,-118.25] // Los Angeles proxy (visual)
    ],
    ["IOM_WMR2024_Corridors","UNDESA_IMS2020"],
    "Per IOM/UN DESA, Mexico→USA has been the world’s largest migration corridor."
  ),
  route(
    "corridor_ind_uae",
    "India → UAE",
    "EarlyModern/Modern",
    1990, 2025,
    3, "high",
    [
      [19.1,72.9], // Mumbai proxy
      [25.2,55.3]  // Dubai proxy
    ],
    ["IOM_WMR2024_Corridors","UNDESA_IMS2020"],
    "A top South Asia → Gulf labour corridor."
  ),
  route(
    "corridor_ind_usa",
    "India → USA",
    "EarlyModern/Modern",
    1990, 2025,
    3, "high",
    [
      [28.6,77.2], // Delhi proxy
      [37.77,-122.42] // SF Bay proxy
    ],
    ["IOM_WMR2024_Corridors","UNDESA_IMS2020"],
    "High‑skill and family corridors expanded rapidly since the 1990s."
  ),
  route(
    "corridor_syr_tur",
    "Syria → Türkiye",
    "EarlyModern/Modern",
    2011, 2025,
    3, "high",
    [
      [33.5,36.3], // Damascus proxy
      [36.8,30.7]  // Antalya/Anatolia proxy
    ],
    ["IOM_WMR2024_Corridors","UNDESA_IMS2020"],
    "One of the largest refugee corridors of the 2010s."
  )
];

// Expose for app.js
window.SOURCES = SOURCES;
window.ROUTES = ROUTES;
