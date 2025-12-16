-- Update product manufacturers from CSV
-- Part 11 of 17
-- Run this script in Supabase SQL Editor
-- This script updates products with Unknown manufacturer to correct manufacturers

-- Jet Biofil (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_jet-biofil_3r1tds'
WHERE "sku" IN ('FPV403030')
  AND "manufacturerId" = 'mfr_unknown';

-- Karl Storz (15 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_karl-storz_rspcc3'
WHERE "sku" IN ('27054CO', '31162', '31132', '31217', '31151', '31168', '31167', '31140', '31767', '27054SL', '27054XB', '27040GP1', '28171KGN', '27054EB', '26003AA')
  AND "manufacturerId" = 'mfr_unknown';

-- Kementec (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_kementec_xwsb3w'
WHERE "sku" IN ('4380*500', '4380*1')
  AND "manufacturerId" = 'mfr_unknown';

-- Krishgen (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_krishgen_61l3ti'
WHERE "sku" IN ('KBI1024')
  AND "manufacturerId" = 'mfr_unknown';

-- Kyokuto (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_kyokuto_mim27p'
WHERE "sku" IN ('KYO-01212')
  AND "manufacturerId" = 'mfr_unknown';

-- Labor Diagnostika (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_labor-diagnostika_4du2z4'
WHERE "sku" IN ('BAE-1900')
  AND "manufacturerId" = 'mfr_unknown';

-- Larodan (9 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_larodan_2djt75'
WHERE "sku" IN ('37-1600', '37-1600', '37-1600', '20-2206-9', '34-3020_25', '78-3806-13', '37-1600', '34-3020_100', '34-3020_250')
  AND "manufacturerId" = 'mfr_unknown';

-- Leinco Technologies (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_leinco-technologies_bn32v8'
WHERE "sku" IN ('C547')
  AND "manufacturerId" = 'mfr_unknown';

-- LGC (48 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_lgc_mj1a2tzx'
WHERE "sku" IN ('DRE-C17668000', 'DRE-C12783100', 'DRE-C11352000', 'CDX-00006290-100', 'DRE-C17892600', 'TRC-D417555-1G', 'TRC-I721500-10MG', 'TRC-F591550-1MG', 'TRC-L177335-2.5MG', 'EPB1045000', 'EPC2163000', 'EPD0720000', 'EPY0001750', 'DRE-C13665020', 'TRC-B288600', 'DRE-C17947390', 'TRC-I721505-10MG', 'DRE-C10256500', 'DRE-C17923500', 'DRE-C17923550', 'MM0084.01-0025', 'CDX-00012240-005', 'DRE-C17947350', 'CDX-00016364-025', 'DRE-C17947400', 'TRC-B319000', 'TRC-B288600', 'MM0323.00-0250', 'MM0651.00-0250', 'MM0948.00-0250', 'MM3629.00', 'DRE-C11120100', 'MM0776.00', 'MM0133.03-0250', 'MM1038.00', 'MM3552.00', 'MM3441.00', 'KBS-1050-102', 'KBS-1050-122', 'MM0002.19', 'MM0947.00', 'KBS-1050-112', 'MM3645.00', 'MM1246.00', 'MM0224.03', 'TRC-B288600', 'ALK-PS-250-DG', 'TRC-Z270478-10MG')
  AND "manufacturerId" = 'mfr_unknown';

-- Life Technologies Corporation (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_life-technologies-corporation_xjbvrc'
WHERE "sku" IN ('782704', '781906')
  AND "manufacturerId" = 'mfr_unknown';

-- LKT (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_lkt_dhk5zc'
WHERE "sku" IN ('LKT-A5278', 'LKT-A1368')
  AND "manufacturerId" = 'mfr_unknown';

-- LKT Labs (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_lkt-labs_233tnt'
WHERE "sku" IN ('Z161022', 'C2960', 'Z161024')
  AND "manufacturerId" = 'mfr_unknown';

-- LOEWE (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_loewe_t7jl4a'
WHERE "sku" IN ('08198C/100', '07059C/480', '07070C/480')
  AND "manufacturerId" = 'mfr_unknown';

-- Logos (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_logos_o0ytya'
WHERE "sku" IN ('L12001', 'L12014', 'L12012')
  AND "manufacturerId" = 'mfr_unknown';

-- Lonza (14 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_lonza_zqst22'
WHERE "sku" IN ('BEBP17-516Q', 'BE13-668C', 'PT-7009', '02-053Q', '04-380q', 'LT07-818', 'CC-3202', 'CC-3162', '192060', 'CC-4107', 'BEBP18-936', 'PA-1503', 'N188', '50-650U')
  AND "manufacturerId" = 'mfr_unknown';

-- Lubio (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_lubio_2vx2lj'
WHERE "sku" IN ('10005151')
  AND "manufacturerId" = 'mfr_unknown';

-- Lucigen (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_lucigen_u51s2o'
WHERE "sku" IN ('E3101K', 'QE09050')
  AND "manufacturerId" = 'mfr_unknown';

-- Ludger (10 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_ludger_nabh5d'
WHERE "sku" IN ('CAB-MAN5-01', 'CAB-NA2F-01', 'CAB-NGA2-01', 'CAB-NGA2F-01', 'CAB-FA2G1-01', 'CAB-A2G1-01', 'LT-KAA-A2', 'LT-KAB-A2', 'LT-KDMB-A1', 'LS-N1-4.6x250')
  AND "manufacturerId" = 'mfr_unknown';

-- Mabtech (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mabtech_0h4l7a'
WHERE "sku" IN ('3650-10', '3654-WP-10', '3102-4HPW-2', '3420-2A')
  AND "manufacturerId" = 'mfr_unknown';

-- Macherey-Nagel (21 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_macherey-nagel_mj19htuw'
WHERE "sku" IN ('702284', '90725', '729227', '729261', '740414.10', '729028.400', '740410.50', '740523.250', '720014.46', '720040.40', '720149.46', '720949.46', '720133.46', '740410100', '740414.50', '740410.100', '740945.250', '760261.46', '15859097', '740472.250', '740414.100')
  AND "manufacturerId" = 'mfr_unknown';

-- MCE (18 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mce_1fd71r'
WHERE "sku" IN ('HY-P72908*10', 'HY-W040193*100', 'HY-134901', 'HY-107455', 'HY-P72908*50', 'HY-124696', 'HY-W040193*500', 'HY-P70653', 'HY-132283', 'HY-15887', 'HY-P72908*100', 'HY-108702', 'HY-P70644', 'HY-P7080', 'HY-124758-1mg', 'HY-P72908*500', 'HY-124758-5mg', 'HY-124758-10mg')
  AND "manufacturerId" = 'mfr_unknown';

-- medac (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_medac_6q24nh'
WHERE "sku" IN ('5140-0006', '50-76-03')
  AND "manufacturerId" = 'mfr_unknown';

-- MedChemExpress (35 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_medchemexpress_66qzyo'
WHERE "sku" IN ('HY-101410-5MG', 'HY-Y1893-10g', 'HY-101410', 'K0225-1mL', 'HY-K1002', 'HY-101410-10MG', 'HY-101410-1ML', 'HY-101410', 'HY-50904', 'HY-101410', 'HY-10440', 'HY-70002', 'HY-110251-5mg', 'HY-10496', 'HY-N6716-10MG', 'HY-10174', 'HY-10230', 'HY-107433-10MG', 'HY-101410', 'HY-N1724-25μg', 'HY-N6740*5', 'HY-101461-25G', 'HY-101410', 'HY-111407', 'HY-N1724-50μg', 'HY-N6740*10', 'HY-N6716-50MG', 'HY-101410', 'HY-141902S', 'HY-P99406', 'HY-P991028', 'HY-P99675', '23007-85-4-500mg', 'HY-N6740S', 'HY-P99909')
  AND "manufacturerId" = 'mfr_unknown';

-- Megazyme (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_megazyme_cea8zw'
WHERE "sku" IN ('700004261')
  AND "manufacturerId" = 'mfr_unknown';

-- Mercedes Scientific (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mercedes-scientific_2wmpwi'
WHERE "sku" IN ('SPM0928')
  AND "manufacturerId" = 'mfr_unknown';

-- Merck (107 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_merck_2eika3'
WHERE "sku" IN ('"109543', '128848-5G', '117924', '69750-100G', '108418-100g', '1003142500', '95068-100MG', '21902-250G', '452882-25G', '1.06705.0100', '25688', '101076*1', '1005990001', '107689*10', '810033', '1004562500', '217255-500G', '1065861000', '1058130050', 'F3261-.1MG', '365130-5G', '1880520012', 'S2GPU01RE', 'L9133-25MG', 'MHA00P2TT', '1092570500', 'M1000008', 'Y0001376', 'Y0001381', '1000632500', '71859-25G', '1001880002', '07-729', '101076*2', 'HAWG02500', 'Y0001966', 'Y0000663', 'CPDI000S1', '1086020250', 'C0100000', 'D3000000', 'S0765000', 'Y0000664', '1.44243.0050', '1.44253.0050', '1.44244.0040', '1023782500', '8.22337.2500', '1072890050', '407710', 'SLGP05010', '2504', '1097130001', 'PHR1800', '1.055530001', '1059951000', 'SLHP033NS', 'HTTP02500', 'SIMFILTER', '1041480001', '1.44108.0040', '1054580500', 'MPGP002A1', 'PTEP24H48', '1102740002', '1.01544.1000', 'PTMP24H48', 'S2GPU10RE', '1004411000', 'SIPK0SIA1', 'CDUFBI001', '75164-100MG', 'MABS2005', '1226003', 'ZTC18S096', '1457301', '1.04352.0500', '1085003', '1414003', 'GE17-0948-01', 'P8375-25KU', '480905', '1015820001', '1015820001', 'UFC30GV00', '107689*100', 'MAB369', 'QTUM0TEX1', '1129790001', 'TZHVAB210', 'PR0G0T0S2', '1092572500', '16-202A', 'C0712-100ML', 'GE17-0480-01', 'SPR0LSIA1', '1009876025', '101076*20', '1503290001', 'MAK084', '1093859025', 'IPAKKIT00', '1004199025', '1048719050', 'UFC5010BK', 'UFC5030BK', 'UFC5100BK')
  AND "manufacturerId" = 'mfr_unknown';

-- Metrohm (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_metrohm_2os60z'
WHERE "sku" IN ('61050500', '6.1050.420', '2.781.0010')
  AND "manufacturerId" = 'mfr_unknown';

-- METTLER TOLEDO (16 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mettler-toledo_mj19e6bq'
WHERE "sku" IN ('51343182', '51350072', '51350074', '51350060', '51302079', '73664-5G-F', '51340228', '51340229', '51302069', '51302070', '51350080', '30266946', '51343160', '30005793', '30207949', '30330857')
  AND "manufacturerId" = 'mfr_unknown';

-- Mikromol (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mikromol_1uia16'
WHERE "sku" IN ('MM0516.01', 'MM0115.00-0250')
  AND "manufacturerId" = 'mfr_unknown';

-- Millipore (89 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_millipore_i49u99'
WHERE "sku" IN ('8030100500', '48722-100G-F', '1001810002', '1083370250', '1.32381.0001', '344206-100ML', '1198970500', '1370131000', 'TMKIT-10', 'S200B02RE', 'UFC501008', 'P4963', '1371170100', '1102740001', 'S200B05RE', '45653-250mg', 'Z805939-1EA', '1059820500', '71505-3', '1.32383.0001', '1062651000', '356350-500ML', 'TMKIT-60', 'SX0001300', '1086031000', '1.32356.0001', '648471', '1441070050', '71507', '1.32360.0001', '44924-500G', '1015430250', 'S2GPU02RE', 'UFC501024', 'UFC503024', '1370690100', '648311-1KG', 'S2GPT05RE', 'UFC5010', 'UFC30HVNB', '1.32359.0001', '6505-4L', '71509-3', '71510-3', 'T7293-250G', 'NY1H04700', '475855', 'B3801-100G', 'IPVH08100', '475855-1R', '324626-25GM', '1.32357.0002', 'GSTF04700', 'S2HVU05RE', '528877-1KG', 'MCSK10025', 'UFC800324', 'UFC810024', 'MSBVN1210', '344206-1L', 'MABF3038', '2500', '1015421000', 'MZHAWG251', 'UFC900324', 'UFC901024', 'WHA10463513', '100043', 'WBKLS0500', 'HAWG047S6', 'UFC501096', 'UFC500396', 'SLGV013SL', 'MERSSTX03', 'MRCF0R030', 'MAB1637', 'MRCPRT010', 'MERCK-SLHV033NB', 'SLHV033NB', 'SLHAR33SB', '1168830100', 'HVHP14250', '1.50377.0001', 'WHA10463062', 'UFC900396', 'SLHN033NK', 'YY3009000', 'UFC5050BK', 'SLFH025NK')
  AND "manufacturerId" = 'mfr_unknown';

-- Minerva (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_minerva_ldy07s'
WHERE "sku" IN ('52-0112')
  AND "manufacturerId" = 'mfr_unknown';

-- MoBiTec (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mobitec_xrskll'
WHERE "sku" IN ('2145-40')
  AND "manufacturerId" = 'mfr_unknown';

-- Molecular Probes (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_molecular-probes_h850s9'
WHERE "sku" IN ('A66521')
  AND "manufacturerId" = 'mfr_unknown';

-- Monosan (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_monosan_ke2cce'
WHERE "sku" IN ('MON-APP902')
  AND "manufacturerId" = 'mfr_unknown';

-- Morphisto (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_morphisto_957vnt'
WHERE "sku" IN ('12328,025')
  AND "manufacturerId" = 'mfr_unknown';

-- MP Biomedicals (22 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mp-biomedicals_mj19y058'
WHERE "sku" IN ('219544450', '2160053.1', '219544450', '219470580', '219122401', '219544480', '219470583', '219470590', '219544490', '92810305', '91692254', '8810061', '219470591', '219544491', '188247501', '116550500', 'ICN15123490', '116540400', '116560200', '8399001', '215507005', '8791501')
  AND "manufacturerId" = 'mfr_unknown';

-- MRC holland (33 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mrc-holland_0j7ooo'
WHERE "sku" IN ('SMR50', 'EK1-FAM', 'ME028-100R', 'ME030-100R', 'P015-100R', 'P021-100R', 'P033-100R', 'P034-100R', 'P035-100R', 'P036-100R', 'P050-100R', 'P080-100R', 'P095-100R', 'P125-100R', 'P160-100R', 'P163-100R', 'P245-100R', 'P255-100R', 'P460-100R', 'ME011-100R', 'ME012-100R', 'P088-100R', 'P105-100R', 'P252-100R', 'P301-100R', 'P302-100R', 'P303-100R', 'P315-100R', 'P370-100R', 'P420-100R', 'P438-100R', 'P483-100R', 'P520-100R')
  AND "manufacturerId" = 'mfr_unknown';

-- MyBioSource (93 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mybiosource_gkt5tr'
WHERE "sku" IN ('MBS821163-003', 'MBS125938_002', 'MBS821163-005', 'MBS4380726', 'MBS821163-01', 'MBS530693', 'MBS142672', 'MBS766110', 'MBS761338', 'MBS448083_06', 'MBS451331', 'MBS2882041', 'MBS125938-01', 'MBS2507393', 'MBS4502810', 'MBS264966', 'MBS402034', 'MBS580158', 'MBS261259', 'MBS160648', 'MBS165041', 'MBS9241471', 'MBS1608795-96', 'MBS9241896', 'MBS7606860', 'MBS761192', 'MBS2502004', 'MBS2506739', 'MBS269718', 'MBS269892', 'MBS423161_01', 'MBS766110', 'MBS2513798', 'MBS266722', 'MBS691869', 'MBS4753821', 'MBS282218', 'MBS177371', 'MBS2601943', 'MBS1603385', 'MBS389126*0,1', 'MBS2500932', 'MBS2515662', 'MBS2515841', 'MBS566228', 'MBS2021124', 'MBS2601089', 'MBS2513669', 'MBS2511939', 'MBS1603076', 'MBS9141543', 'MBS824507', 'MBS355465', 'MBS2020065', 'MBS9310888', 'MBS9310941', 'MBS289346', 'MBS456114', 'MBS281497', 'MBS564140', 'MBS2086964', 'MBS825091', 'MBS288269', 'MBS705029', 'MBS731336', 'MBS731482', 'MBS2508655', 'MBS7251045', 'MBS7230564', 'MBS285373-96 strip-wells', 'MBS728278', 'MBS169133', 'MBS105942', 'MBS6002814_01', 'MBS012415', 'MBS313935', 'MBS109183-96', 'MBS703664', 'MBS6142939', 'MBS700294', 'MBS618099_01', 'MBS448083_506', 'MBS125938-501', 'MBS264966', 'MBS423161_501', 'MBS564140', 'MBS264966', 'MBS407314', 'MBS262447', 'MBS389126*1', 'MBS6002814_501', 'MBS6142939*5', 'MBS618099_501')
  AND "manufacturerId" = 'mfr_unknown';

-- MZ (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_mz_fy15sx'
WHERE "sku" IN ('MZ2030-150046')
  AND "manufacturerId" = 'mfr_unknown';

-- Nalgene (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_nalgene_jqeziz'
WHERE "sku" IN ('VWR 514-0026')
  AND "manufacturerId" = 'mfr_unknown';
