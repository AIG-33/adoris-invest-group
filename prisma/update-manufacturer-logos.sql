-- Update manufacturer logos in Supabase
-- Run this script in Supabase SQL Editor

-- Ted Pella
UPDATE "Manufacturer" 
SET logo = '/logos/ted-pella.png' 
WHERE LOWER(name) = LOWER('Ted Pella');

-- Teknova
UPDATE "Manufacturer" 
SET logo = '/logos/teknova.png' 
WHERE LOWER(name) = LOWER('Teknova');

-- Texwipe
UPDATE "Manufacturer" 
SET logo = '/logos/texwipe.png' 
WHERE LOWER(name) = LOWER('Texwipe');

-- TFS
UPDATE "Manufacturer" 
SET logo = '/logos/tfs.png' 
WHERE LOWER(name) = LOWER('TFS');

-- The Native Antigen Company
UPDATE "Manufacturer" 
SET logo = '/logos/the-native-antigen-company.png' 
WHERE LOWER(name) = LOWER('The Native Antigen Company');

-- Thermo Fisher Scientific
UPDATE "Manufacturer" 
SET logo = '/logos/thermo-fisher-scientific.png' 
WHERE LOWER(name) = LOWER('Thermo Fisher Scientific');

-- Thermo
UPDATE "Manufacturer" 
SET logo = '/logos/thermo.png' 
WHERE LOWER(name) = LOWER('Thermo');

-- Tocris Bioscience
UPDATE "Manufacturer" 
SET logo = '/logos/tocris-bioscience.png' 
WHERE LOWER(name) = LOWER('Tocris Bioscience');

-- TOKU-e
UPDATE "Manufacturer" 
SET logo = '/logos/toku-e.png' 
WHERE LOWER(name) = LOWER('TOKU-e');

-- Toronto Research Chemicals
UPDATE "Manufacturer" 
SET logo = '/logos/toronto-research-chemicals.png' 
WHERE LOWER(name) = LOWER('Toronto Research Chemicals');

-- TOSOH
UPDATE "Manufacturer" 
SET logo = '/logos/tosoh.png' 
WHERE LOWER(name) = LOWER('TOSOH');

-- TPP
UPDATE "Manufacturer" 
SET logo = '/logos/tpp.png' 
WHERE LOWER(name) = LOWER('TPP');

-- Trajan
UPDATE "Manufacturer" 
SET logo = '/logos/trajan.png' 
WHERE LOWER(name) = LOWER('Trajan');

-- Transcat
UPDATE "Manufacturer" 
SET logo = '/logos/transcat.png' 
WHERE LOWER(name) = LOWER('Transcat');

-- TransGen
UPDATE "Manufacturer" 
SET logo = '/logos/transgen.png' 
WHERE LOWER(name) = LOWER('TransGen');

-- TRC
UPDATE "Manufacturer" 
SET logo = '/logos/trc.png' 
WHERE LOWER(name) = LOWER('TRC');

-- TRC-Canada
UPDATE "Manufacturer" 
SET logo = '/logos/trc-canada.png' 
WHERE LOWER(name) = LOWER('TRC-Canada');

-- United States Biological
UPDATE "Manufacturer" 
SET logo = '/logos/united-states-biological.png' 
WHERE LOWER(name) = LOWER('United States Biological');

-- Unknown (empty logo - set to NULL or empty string)
UPDATE "Manufacturer" 
SET logo = NULL 
WHERE LOWER(name) = LOWER('Unknown');

-- Upchurch
UPDATE "Manufacturer" 
SET logo = '/logos/upchurch.png' 
WHERE LOWER(name) = LOWER('Upchurch');

-- USBio
UPDATE "Manufacturer" 
SET logo = '/logos/usbio.png' 
WHERE LOWER(name) = LOWER('USBio');

-- USBiological
UPDATE "Manufacturer" 
SET logo = '/logos/usbiological.png' 
WHERE LOWER(name) = LOWER('USBiological');

-- USP
UPDATE "Manufacturer" 
SET logo = '/logos/usp.png' 
WHERE LOWER(name) = LOWER('USP');

-- Vazyme
UPDATE "Manufacturer" 
SET logo = '/logos/vazyme.png' 
WHERE LOWER(name) = LOWER('Vazyme');

-- Vector Laboratories
UPDATE "Manufacturer" 
SET logo = '/logos/vector-laboratories.png' 
WHERE LOWER(name) = LOWER('Vector Laboratories');

-- VMD
UPDATE "Manufacturer" 
SET logo = '/logos/vmd.png' 
WHERE LOWER(name) = LOWER('VMD');

-- VWR
UPDATE "Manufacturer" 
SET logo = '/logos/vwr.png' 
WHERE LOWER(name) = LOWER('VWR');

-- Wako
UPDATE "Manufacturer" 
SET logo = '/logos/wako.png' 
WHERE LOWER(name) = LOWER('Wako');

-- Waters
UPDATE "Manufacturer" 
SET logo = '/logos/waters.png' 
WHERE LOWER(name) = LOWER('Waters');

-- Welch
UPDATE "Manufacturer" 
SET logo = '/logos/welch.png' 
WHERE LOWER(name) = LOWER('Welch');

-- Whatman
UPDATE "Manufacturer" 
SET logo = '/logos/whatman.png' 
WHERE LOWER(name) = LOWER('Whatman');

-- Wilmad
UPDATE "Manufacturer" 
SET logo = '/logos/wilmad.png' 
WHERE LOWER(name) = LOWER('Wilmad');

-- Worthington
UPDATE "Manufacturer" 
SET logo = '/logos/worthington.png' 
WHERE LOWER(name) = LOWER('Worthington');

-- Wuhan
UPDATE "Manufacturer" 
SET logo = '/logos/wuhan.png' 
WHERE LOWER(name) = LOWER('Wuhan');

-- XpressBio
UPDATE "Manufacturer" 
SET logo = '/logos/xpressbio.png' 
WHERE LOWER(name) = LOWER('XpressBio');

-- ZenBio
UPDATE "Manufacturer" 
SET logo = '/logos/zenbio.png' 
WHERE LOWER(name) = LOWER('ZenBio');

-- Zeptometrix
UPDATE "Manufacturer" 
SET logo = '/logos/zeptometrix.png' 
WHERE LOWER(name) = LOWER('Zeptometrix');

-- Zymo Research
UPDATE "Manufacturer" 
SET logo = '/logos/zymo-research.png' 
WHERE LOWER(name) = LOWER('Zymo Research');

-- ZytoLight
UPDATE "Manufacturer" 
SET logo = '/logos/zytolight.png' 
WHERE LOWER(name) = LOWER('ZytoLight');

-- Zytomed
UPDATE "Manufacturer" 
SET logo = '/logos/zytomed.png' 
WHERE LOWER(name) = LOWER('Zytomed');

-- Verify updates
SELECT name, logo 
FROM "Manufacturer" 
WHERE LOWER(name) IN (
  'ted pella', 'teknova', 'texwipe', 'tfs', 'the native antigen company',
  'thermo fisher scientific', 'thermo', 'tocris bioscience', 'toku-e',
  'toronto research chemicals', 'tosoh', 'tpp', 'trajan', 'transcat',
  'transgen', 'trc', 'trc-canada', 'united states biological', 'unknown',
  'upchurch', 'usbio', 'usbiological', 'usp', 'vazyme', 'vector laboratories',
  'vmd', 'vwr', 'wako', 'waters', 'welch', 'whatman', 'wilmad', 'worthington',
  'wuhan', 'xpressbio', 'zenbio', 'zeptometrix', 'zymo research', 'zytolight', 'zytomed'
)
ORDER BY name;

