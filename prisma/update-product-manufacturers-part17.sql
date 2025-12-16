-- Update product manufacturers from CSV
-- Part 17 of 17
-- Run this script in Supabase SQL Editor
-- This script updates products with Unknown manufacturer to correct manufacturers

-- SignaChem (8 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_signachem_xwfcdc'
WHERE "sku" IN ('T4SX-E311U*50', 'T4SY-C501H*50', 'T4SX-E311U*100', 'T4SY-C501H*100', 'T4SX-E311U*200', 'T4SY-C501H*200', 'T4SY-C501H*500', 'T4SX-E311U*500')
  AND "manufacturerId" = 'mfr_unknown';

-- Simport (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_simport_a4cvh8'
WHERE "sku" IN ('M965FT')
  AND "manufacturerId" = 'mfr_unknown';

-- SinoBiological (28 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_sinobiological_2ox63d'
WHERE "sku" IN ('SSA001*200', 'SSA002*200', 'SSA001*500', 'SSA002*500', 'SSA001*1', 'SSA002*1', '90047-C08H', '100028-MM10', '90847-K08H', '100028-T38', '10217-H08H', '10377-H08H', '10616-H08H-100ug', '90251-C02H', 'CT127-H08H', '12047-HNAS_100', '13416-H18H', '90051-C08H', '15673-HNCE', '10004-H27H-B', '10374-H27H', '10620-H49H-B', '11066-H27H-B', '11880-H49H-B', 'CT123-H49H-B', '11066-HNAH-500ug', '10217-H08H-L', '12047-HNAS_1')
  AND "manufacturerId" = 'mfr_unknown';

-- Sisco (8 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_sisco_fxq755'
WHERE "sku" IN ('18240-100G', '28575-25G', '28575-100G', '18240-500G', '19219', '27094', '18240-5KG', '85171')
  AND "manufacturerId" = 'mfr_unknown';

-- siTOOLs Biotech (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_sitools-biotech_mafb7o'
WHERE "sku" IN ('dp-K012-26', 'dp-K012-50')
  AND "manufacturerId" = 'mfr_unknown';

-- Smith & Nephew (60 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_smith---nephew_x54xo2'
WHERE "sku" IN ('71422661', '71422662', '71422663', '71422664', '71422665', '71422667', '71422668', '71422669', '71422671', '71422672', '71422674', '71422675', '71422676', '71422677', '71422678', '71422681', '71422682', '71422683', '71422684', '71422685', '71422691', '71422692', '71422693', '71422694', '71422695', '71422696', '71422697', '71422698', '71422841', '71422842', '71422843', '71422844', '71422845', '71422846', '71422847', '71422848', '22801', '71422802', '71422803', '71422804', '71422805', '71422806', '71422813', '71422814', '71422815', '71422816', '71422817', '71422818', '71422821', '71422822', '71422823', '71422824', '71422825', '71422826', '71422833', '71422834', '71422835', '71422836', '71422837', '71422838')
  AND "manufacturerId" = 'mfr_unknown';

-- Sony Biotechnology (15 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_sony-biotechnology_78hpts'
WHERE "sku" IN ('1186550', '2105250', '2108070', '1122140', '2186700', '1122550', '2102590', '1367030', '1115730', '1377520', '2110090', '1322580', '2191740', '2583540', '2200630')
  AND "manufacturerId" = 'mfr_unknown';

-- SouthernBiotech (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_southernbiotech_cym7ew'
WHERE "sku" IN ('6140-05', '6300-31', '9522-16')
  AND "manufacturerId" = 'mfr_unknown';

-- Spectrum (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_spectrum_zwkwv2'
WHERE "sku" IN ('S1986')
  AND "manufacturerId" = 'mfr_unknown';

-- Spherotech (9 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_spherotech_owiule'
WHERE "sku" IN ('PP-10-10', 'PP-20-10', 'FH-5056-2', 'PP-30-10', 'PP-45-10', 'PP-60-10', 'PPXR-100-1', 'PPXR-25-1', 'PPXR-60-1')
  AND "manufacturerId" = 'mfr_unknown';

-- Stago (49 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_stago_y01tu7'
WHERE "sku" IN ('1163', '745', '744', '375', '367', '675', '360', '599', '26441', '89369', '625', '597', '975', '725', '38876', '201', '738', '376', '1164', '679', '973', '621', '743', '308', '480', '706', '595', '596', '802', '526', '1165', '678', '746', '665', '39430', '704', '540', '672', '310', '747', '673', '724', '339', '527', '518', '671', '662', '38669', '516')
  AND "manufacturerId" = 'mfr_unknown';

-- StemCell (134 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_stemcell_hjvh08'
WHERE "sku" IN ('100-0086', '100-0088', '100-0090', '74142', '78016.1', '75001.1', '7010', '100-0483', '78003.1', '34411', '7180', '78006.1', '60151.1', '7905', '74042', '72492', '72342', '7920', '7923', '7415', '72562', '7923', '72052', '20144', '72582', '73782', '72352', '8571', '10970', '72024', '10971', '36150', '75003', '10971', '78072.1', '10981', '78042.1', '78052.1', '78064.1', '78082', '78162', '72302', '5490', '18061', '72194', '7851', '100-0675', '78003', '100-0712', '5893', '72332', '27215', '9605', '60011AZ', '72304', '5402', '72304-5mg', '100-0214', '86415', '5040', '5465', '5990', '5445', '5751', '5751', '72054', '5411', '100-0016', '73724', '8581', '100-0338', '5455', '7922', '60003PE', '34415', '86450', '8570', '5411', '85850', '72564', '100-0672', '7913', '7912', '7913', '5412', '5855', '5855', '5833', '72774', '5150', '78155.1', '5839', '7930', '6010', '78062', '100-0245', '100-0354', '78045', '17664', '17853', '17877', '17852', '17851', '19844', '38071', '10990', '17847', '17856', '78137.1', '85857', '78210.1', '100-1003', '100-0448', '18000', '2694', '17951', '9655', 'H4436', '4431', '2002', '2006', '4431', '5275', '15064', '18001', '72308', '15361', '15065', '2692', '72307', '9720', '18002', '2691', '100-1044')
  AND "manufacturerId" = 'mfr_unknown';

-- Streck (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_streck_1fed7k'
WHERE "sku" IN ('230244')
  AND "manufacturerId" = 'mfr_unknown';

-- Stryker (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_stryker_6gl3jk'
WHERE "sku" IN ('PS1240', 'PS2040', 'PS2080', 'PS1160')
  AND "manufacturerId" = 'mfr_unknown';

-- Supelco (237 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_supelco_mj19kquz'
WHERE "sku" IN ('45660-100mg', '1023820250', '1031700025', '1099500001', '47863', '1054321000', '1099590001', '1090581000', '1090601000', '1091411000', '1090571000', '1064040500', '1090631000', '1091411003', '1099560001', '1065490100', '1003191000', '39435-250ML', '02483-1ML', '1702230100', '73285-1ML', 'N7889-100MG', '93183-25MG', 'N1607-100g', '1062680250', '65996-1ML-F', '1090791000', '1062670500', '47249', '1094750500', '1094770500', '47288', 'CRM44609', '1.04873.0250', '1049360500', '1066880100', '1091081000', '1063291000', '40127-U', '1099680001', '1050820250', '1072100250', '1027900250', '11038-1ML-F', 'C1915-1G', '78533-1L', '1099890001', '1012010500', '04070-1ML', '76046-100MG', 'P7003-200G', 'CRM47949', '69043-100MG', '1065370500', '19358-1ML', '1702230500', '1050331000', '47942', '1096345000', '1060501000', '1088791000', '1091221000', '1153332500', '51791-100ML', '73139-100ML', '1195140100', '74767-100mg', '1017190500', '76159-1G', '1091211003', '1167431000', '1063920500', '1.04984.0100', '1094391000', '1096521000', '1011920250', '1080870500', '1047110500', '1081220005', '10941-1G', '1097081000', '45802-250MG', '1064480500', '47302', '36969-1G', 'Z106453-200EA', '1081760005', '1109721000', '74026-100MG', '1062771000', '105051', '49453-U', '1049520250', '1162241000', '02476-1ML', 'PHR1228-500MG', '1024050080', '1091141003', 'PHR1270-1G', 'PHR1030-500MG', '1065801000', '91215-100MG', 'P9380-1G', '1043671000', 'PHR1236-1G', '00612-5L', 'PHR1117-1G', 'PHR1235-1G', '48231', '1096661000', '31732', '1012260100', '36932-1G', 'PHR1331-500MG', 'PHR1371-5ML', '1058861000', 'PHR1077-1G', 'TOC1000-100ML', '1039430250', '1990020001', '31581-250MG', '1065861000', '1880151000', 'PHR1274-1G', 'PHR1232-500MG', '46015-1ML', '1880111000', '1002441000', '1046160250', '1072091000', '1072101000', '48838', 'PHR1000-1G', 'PHR1002-1G', 'PHR1134-1G', 'CRM18918', '1880111003', '1090010500', '1005731000', '1051041000', '36125-100MG', 'PHR1109-1G', 'PHR1113-1G', 'PHR1559-1G', 'CRM46975', '1012130500', '30039-5ML', '70480-10G', '1129390010', 'CRM47885', 'PHR1127-1G', 'PHR1238-500MG', '1046030100', '1.00519.0510', '1078150250', 'Z106534-100EA', '49685-100ML', '21409-5G', 'PHR1159-1G', '1063931000', '1011161000', '47943', 'PHR3542-1G', '34093', '1030580100', '1.04933.0500', '1058550050', '1047610100', '1090170100', 'PHR1420-1G', '​​​​​​​32532-100mg', 'PHR1599-1G', '1003900001', '47742-100ML-F', 'Z188727-1PAK', '1063295000', '23205-U', '76509-5ML', '1703650100', '1008041000', '71804-25G', '1703660100', '1050430250', '46077-100MG', '72477-500MG-F', '1000301000', '1091379013', '1059831000', '1025360100', '44864-100MG', 'PHR1800-100MG', 'PHR1786-500MG', 'PHR2086-1G', '01934-1L', '1030920025', '1081210001', '52602-U', '37044-50mg', 'PHR2585-500MG', '96440-5G', 'LAA10-1KT', '57405', '76176-1G', '49792-100mg', '1025360250', 'PHR1505-50MG', 'PHR1506-50MG', 'PHR1963-50MG', '1063710100', '43807-25MG', '74882-10G-F', 'PHR2234-100MG', 'PHR1941-200MG', '1024020080', '1043902500', '1235300-200MG', '86854-500ML', '1054282500', '92936-1SET-F', '1183350001', '33182-U', '45985-5ML-F', '81153-100MG', '1045930025', '1050431000', 'M3913-10VL', '1081700250', '1183060025', 'PHR1940-50MG', '1019220100', '1015180250', '1063299025', '1021290001', '52862-50G-F', '1504580001', '1183060100', 'PHR1917-500MG')
  AND "manufacturerId" = 'mfr_unknown';

-- Synaptic Systems (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_synaptic-systems_6pjwwi'
WHERE "sku" IN ('400211')
  AND "manufacturerId" = 'mfr_unknown';

-- Sysmex (43 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_sysmex'
WHERE "sku" IN ('8340011-6', 'ORHO37', 'G52323975', '96406313', '83400116', '42411608', '96406119', '83400116', 'G52323900', 'CT661628', '5433212', '5433514', '213484', '213485', '213486', 'G54350600', '213570', '213571', '213572', 'CP066715', '37000305', '37000320', '90411317', '5433310', '90411414', 'BW056982', '97405216', 'G52323985', 'AL337564', '90407219', '6414810', '98416211', 'BT965910', '97407713', 'AA325279', '10481761', '98417216', 'BU306227', 'BN337547', 'G52323940', 'CV377552', 'CD994563', 'CY787031')
  AND "manufacturerId" = 'mfr_unknown';

-- Sysmex UF (11 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_sysmex-uf_mj19y4h4'
WHERE "sku" IN ('BL121531', 'BG689680', '10449436', 'AG792864', 'CB505392', 'CE604532', 'BY074501', 'CE919553', 'BE740265', 'CK920648', 'AU448468')
  AND "manufacturerId" = 'mfr_unknown';

-- System Biosciences (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_system-biosciences_r0mo7x'
WHERE "sku" IN ('PB210PA-1')
  AND "manufacturerId" = 'mfr_unknown';

-- Takara Bio (27 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_takara-bio_hawsa1'
WHERE "sku" IN ('T7132A', 'T100A', '6110A', 'R050A', '631231', 'T9181', '3340', '3340', 'T303', 'T110A', 'T7101B', '3361', '3362', '3363', '3364', '632496', 'T7102B', '631235', 'T7103B', '636102', '636113', '636118', '636146', '636176', '631232', 'T7104B', '639202')
  AND "manufacturerId" = 'mfr_unknown';

-- TargetMol (14 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_targetmol_gej0ai'
WHERE "sku" IN ('T2130-50mg', 'T20019', 'T21435', 'T15686', 'T2130-100mg', 'T4369', 'T16759', 'T22964', 'T5397', 'T22904', 'T11264-5MG', 'T31892*5', 'T31892*25', 'T29195')
  AND "manufacturerId" = 'mfr_unknown';

-- TCI (81 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_tci_1765444028486'
WHERE "sku" IN ('D0218-25ML', 'Q0007-1g', 'T0522-25ML', 'C0513-25ML', 'D0669-25ML', 'S0004-25G', 'I0135', 'P1099-25ML', 'S0111', 'T0136-25G', 'H0206-25g', 'F0060', 'C0365-25G', 'D0520', 'N0118-25g', 'Q0112', 'D0798-500G', 'D0269', 'H0974-25mL', 'A0367-25G', 'C0886-25G', 'G0171', 'S0489-100G', 'C0798-100UL', 'D0814-25g', 'B0575-500G', 'M0607', 'P1798-500G', 'P0168', 'X007825G', 'E0168-25ML', 'P0061-500ML', 'S0562-300G', 'T0179-100G', 'A0152', 'X0078-25G', 'M0044-500G', 'D1601-5G', 'T0233', 'C0365', 'C0365-500G', 'B1079-25G', 'T0136-500G', 'A0956-5G', 'D1074-25ML', 'D0060', 'M3688-500G', 'P0873-500G', 'O0577-100G', 'A0157', 'C0533', 'C3624-1G', 'P0103', 'C0316-25G', 'T0530', 'H1480', 'A1475-25G', 'C2623-200MG', 'R0008-500G', 'C0799', 'M0069-500ml', 'X0078-100G', 'S0879-100G', 'S0577', 'E1057-200MG', 'D0046', 'E0136', 'V0172-25g', 'C2770-5G', 'Q0007-25g', 'N0028-25g', 'C3624-5G', 'C0798-1ML', 'N0231', 'B1756-25G', 'M0837', 'M0383-500ml', 'M2288-5G', 'D0203-500g', 'P0197-25G', 'C0594-25G')
  AND "manufacturerId" = 'mfr_unknown';

-- Ted Pella (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_ted-pella_xgyt4i'
WHERE "sku" IN ('G6276-1EA')
  AND "manufacturerId" = 'mfr_unknown';

-- Teknova (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_teknova_kbn520'
WHERE "sku" IN ('T0223')
  AND "manufacturerId" = 'mfr_unknown';

-- Texwipe (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_texwipe_qgrmxo'
WHERE "sku" IN ('TX3342')
  AND "manufacturerId" = 'mfr_unknown';

-- TFS (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_tfs_iqc3lv'
WHERE "sku" IN ('ER0901', '26632', '15224025', 'B85502')
  AND "manufacturerId" = 'mfr_unknown';

-- The Native Antigen Company (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_the-native-antigen-company_01jph3'
WHERE "sku" IN ('REC31728-100', 'REC31729-100', 'REC31767-100')
  AND "manufacturerId" = 'mfr_unknown';

-- Thermo (453 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_thermo_1765444023960'
WHERE "sku" IN ('A31923', '11875093', 'PO0155A', '14025050', '21885025', 'R0191', '61870036', 'PO5210E', '31765035', '9066', '9066-11', '12634010', '12605010', '26050070', '418900010', 'A15398.22', '12604013', '12491015', 'EN0191', '427171000', 'ER0501', 'R0441', '10564011', '21985023', '424005001', 'ER0631', '15250061', 'ER0921', '419441000', '4488621', '32551020', '11067030', 'ER0301', 'ER0771', 'EN0321', 'A24975', '35050038', 'EF0654', 'L16698.MD', '4393718', '11431548', 'ER0541', '104570250', '370780010', '31150022', 'R007100', 'EN0531', 'BP1311-1', 'EC0111', 'FD1704', 'ER0781', 'R0861', '35050061', 'EP0751', '15260037', '596-4520', 'LC2675', 'EL0011', '12557013', 'NC2380', 'ER0671', 'A1110501', 'ER1121', 'T2015', 'SD1111', 'NI2300', '21103049', '15240062', '446060250', '11-4839-81', '18265017', 'ER1851', '4311320', '4050021', 'A26073', 'ER1351', 'SM1193', 'R0551', '15630056', '11-4317-87', 'ER0082', 'EN0601', '4336697', '23209', '17504044', 'A3890401', 'AM9930', 'S33102', 'DD0001B', '4440753', '10000C', 'A50668', 'SM0311', '00-4970-93', '87785', 'Q32856', 'Q33230', '11269016', '18091050', '36978', '78200.200.Ul', '01-3333-41', '16050122', '75001.200.UL', 'Q32851', 'Q10210', 'N301', '12558011', 'R0491', 'FD0854', 'Q33211', '20593', '29943-1-AP', '211677', 'AM9690', 'F10797', '131520025', '66380', '77145', 'J63472.MA', '17005042', '11837-1-AP', '20673-1-AP', 'AM9932', '4306737', 'SM1831', 'CM0507B', '26616', 'R37606', 'CM0435B', 'R0081', '343850', 'CM0854B', 'R302', 'SR0158E', 'A33401', 'AM8740', 'NI2380', 'A-10654', 'AM9937', 'AM2238', '11-4732-42', '31331093', '4393927', 'ER0752', '35040', 'A36498', '12-9948-41', '18912014', '4449754', '336840050', 'CM0469B', 'EP0752', 'H3569', 'R4606000', '10270106', 'SM1823', 'AM2616', '4306311', '10777019', '11-5322-82', '12633020', '200-17-25UG', '88242', '9990612', '9990610', 'ER0592', '200-08M-25UG', '250-13-20UG', '250-27B-20UG', '300-04-20UG', '300-28A-10UG', '300-29B-20UG', '300-35A-20UG', '300-45-20UG', 'SM0242', 'F36924', 'A-21433', '10488100', 'T7458', 'A50669', '31482', 'LP0037B', 'MA121315BTIN', '4427975', 'S11494', '4413020', '31432', 'EL0012', 'A35643', 'MA5-18096', 'A18793', 'ER0572', 'A11008', '267245', '17100017', '0010057DG', 'D3861', 'J64887.MA', 'CS12000', '12368010', '4336974', 'A35640', '44881', '12-0038-42', '32106', 'A55739', '4408256', '4440886', '12-0997-42', '17101015', '4440040', '31460', 'AM9464', '406-0209-42', '900-K57K', 'ER2202', '260895', '14-1631-82', '4392420', '10687010', '12-9878-42', '18064-014', '4393708', '14-9046-82', 'NI2387', '12-0739-42', '12-9969-42', 'MA558058', 'Q33231', '23235', '4345833', '14-4875-82', 'A29378', 'A29790', '01-3333-42', '25-7349-82', '4376486', 'F1201', '53-7319-42', '4404310', '13-6200', 'Q32854', '78-0036-42', 'Q32855', '62262', 'Q33212', '25-0209-42', 'MA5-52081', '14-9865-82', '17-0649-42', 'PA5-85070', 'MHTDT01-2', 'C3737', 'MA5-35204', '11789020', 'K1423', 'PA5101333', '46-1729-42', 'PA5-101657', 'PA5-99160', '12-7178-42', '12-9007-42', '4404312', '71-2700', '64-0247-42', 'PA5-143567', 'MA1-06101', '701339', '411735000', '39-6500', '17-0479-42', 'MA516409', 'CC25-PK', 'MA5-11195', '17-0739-42', '19524016', 'MA5-31992', 'PA586127', '300-28A-50UG', 'MA511195', '11791020', 'PA5-85525', 'AM7152', 'MA5-14916', 'MA5-32178', 'PA5-85429', '4484450', 'MA531990', '43-7800', '12-9185-42', 'PA5-88284', 'MA5-32841', 'GAS004', '26097-2840', 'MA5-28386', 'PA1-036', 'F530L', 'MA5-31967', 'Q32853', 'MA523561', 'SM0332', 'F14201', 'PA1337', '10500064', 'K146501', 'MA126771', 'PA1338', '4335613', '4479768', 'PA128530', '25-0399-42', 'MA1-82234', 'AM7024', 'S11352', '46-1969-42', 'PA523989', 'F1221', '49-1008', 'PA5-18039', '4202A', 'PA5-31817', '12604039', '25-6699-42', '26619X4', 'PA3030A', 'MA1-118', 'MA5-26323', '4404314', '9511', 'LC5928', '10828028', '61-1529-42', 'AM9782', '75001.1.ML', 'AM2239', 'R2802', '88018', '41-9865-82', 'MPXCALK25', 'AM1334', '53-9760-82', 'AM1830', 'IVGN3006', 'MA528274', 'MA5-14528', '4336791', '4337454', 'A5670701', 'MA523664', '53-9777-82', '78201.1.ML', '53-9893-82', '26620', '18009019', 'X14210', '11668027', '4369016', '10131027', 'PA5-56752', '30205-254030', 'PA5-61902', 'MPXPVERK25', 'ISO2-1KT', 'MPK10025', 'MPK1025', 'L3000008', '18427013', 'A35641', '4444557', 'LX2RPVERK25', '28105-253030', '12331D', 'R415', 'LX2RCALK25', '4412614', '310-01-50UG', '4323159', 'BMS2092', 'BMS2093', 'BMS2094', 'BMS2095', 'AM1344', '10004D', 'M1292', 'MA528124', '22103-154630', 'L3224', '4393710', '4393714', 'A5669801', 'AM1631', 'C36676', '11344D', '12574026', 'K0722', '11348D', '11350D', 'A15020', '78447', '4322682', '11301D', '4324287', '11143D', '11151D', 'EO0384', 'A26343', 'A1113902', '4452222', '4444963', '303025', '15508364', '54994', '10362100', '88837', 'MPK1096', '4337450', 'MPK10096', '4468802', 'EPX060-40042-901', 'A33671', '4337455', '4368813', '18091200', '25530031', '4404685', '4336699', 'A41331', '4404683', '4376487', '4363929', 'EPX100-26091-901', 'A48571', 'A36740', '4311818', 'EPX120-15849-901', 'EPX140-30120-901', 'EPX140-40040-901', '4483638', 'EPX160-12176-901', 'LHC0009M', '4460626', 'EPX200-12185-901', 'LPC0005M', 'EPX220-30122-901', 'Q45894', 'LHC6003M', 'EPX300-40044-901', 'EPX340-12167-901', 'EPX360-26092-901', 'EPX640-20064-901', 'EPX80010080901', '4337451')
  AND "manufacturerId" = 'mfr_unknown';

-- Tocris Bioscience (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_tocris-bioscience_mj19xmli'
WHERE "sku" IN ('0900/10')
  AND "manufacturerId" = 'mfr_unknown';

-- TOKU-e (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_toku-e_i6pont'
WHERE "sku" IN ('K016')
  AND "manufacturerId" = 'mfr_unknown';

-- Toronto Research Chemicals (12 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_toronto-research-chemicals_0lazxx'
WHERE "sku" IN ('C989918', 'TRC-C685095', 'TRC-C685095-5MG', 'V250005-5MG', 'Z270473', 'Z270478', 'TRC-C685095-1MG', 'TRC-C685096', 'TRC-C685095-10MG', 'TRC-C685097', 'Z270473-5', 'Z270478-10')
  AND "manufacturerId" = 'mfr_unknown';

-- TOSOH (6 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_tosoh_v1vk6e'
WHERE "sku" IN ('8543', '14947', '16049', '42168', '8641', '8541')
  AND "manufacturerId" = 'mfr_unknown';

-- TPP (6 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_tpp_w085m0'
WHERE "sku" IN ('90552', '90652', '99003', 'Z707783', 'Z707805', 'Z707759')
  AND "manufacturerId" = 'mfr_unknown';

-- Trajan (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_trajan_vc2jx3'
WHERE "sku" IN ('1035348')
  AND "manufacturerId" = 'mfr_unknown';

-- Transcat (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_transcat_mj19y5x0'
WHERE "sku" IN ('1045-265-000-9', '1030-260-000')
  AND "manufacturerId" = 'mfr_unknown';

-- TransGen (87 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_transgen_mj19faua'
WHERE "sku" IN ('GH101-01', 'AG111-01', 'DL101-02', 'BM201-01', 'GE201-01', 'HS101-01', 'BM311-01', 'JN301-01', 'JX201-01', 'JN401-01', 'FB101-01', 'FB102-02-V2', 'AS102-01', 'AS122-01', 'JB101-02', 'JE201-02', 'JH101-02', 'FL101-02', 'HT201-01', 'HT301-01', 'EC511-01', 'JB201-02', 'JE301-02', 'JS101-02', 'LN201-01', 'JK101-02', 'JN101-02', 'JS201-02', 'JS301-02', 'JS501-02', 'FT401-02', 'JP101-02', 'JS401-02', 'EE161-01', 'JN301-02', 'JS601-02', 'JS701-02', 'JX301-02', 'JE101-02', 'JX101-02', 'JX201-02', 'JN201-02', 'JN401-02', 'ET111-01', 'DI101-02', 'JP201-02', 'AI201-03', 'FR101-02', 'KI101-02', 'BM211-02', 'BM321-02', 'EE301-01', 'DW101-02', 'AD101-12', 'LN201-03', 'KA101-02', 'DM141-03', 'KP701-01-V4', 'EC511-02', 'EE101-02', 'FV101-01', 'AQ631-02', 'CB301-02', 'LE101-02', 'AP231-23', 'KI341-02', 'EC201-01', 'LP101-02', 'KI251-02', 'KD101-11', 'DW111-01', 'FT301-02', 'DW111-02', 'EC501-03', 'FE201-01', 'AW311-03', 'KP201-03-V2', 'DM151-03', 'AQ602-03', 'AQ142-14', 'AQ142-24', 'KP172-02', 'DH151-01', 'KP701-02-V4', 'EC401-04', 'KP701-02', 'KD101-03')
  AND "manufacturerId" = 'mfr_unknown';

-- TRC (45 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_trc_kupcz4'
WHERE "sku" IN ('C243300', 'C243200', 'S699058', 'C242970', 'C242958', 'C235250', 'M325934', 'F248850', 'C242600', 'B106505', 'C523500', 'C242700', 'C244760', 'A357480', 'C242930', 'C242770', 'A357460', 'C236800', 'C587402', 'R509502', 'C237495', 'C243500', 'R508002', 'C244500', 'G410200', 'C242540', 'D289982', 'C244003', 'C243005', 'C243850', 'R640050', 'TR-B161380-25g', 'F865300', 'D289980', 'S687303', 'D307550', 'C244300', 'D441813', 'D228583', 'P207600', 'D231150-25MG', 'O148500', 'TRC-K202050-5MG', 'A430040', 'D479552')
  AND "manufacturerId" = 'mfr_unknown';

-- TRC-Canada (18 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_trc-canada_ezx8ku'
WHERE "sku" IN ('TRC-M338160-5G', 'TRC-R701995-5', 'TRC-P336740-500MG', 'TRC-R702000', 'TRC-H953609', 'TRC-H669506', 'TRC-V094753', 'TRC-V760002', 'TRC-H946332', 'TRC-V094752', 'TRC-L173253', 'TRC-H946333', 'TRC-O992015-100MG', 'TRC-H825130', 'TRC-A656055-25MG', 'TRC-H953604', 'TRC-R701998', 'TRC-R701995-25')
  AND "manufacturerId" = 'mfr_unknown';

-- United States Biological (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_united-states-biological_yqfatj'
WHERE "sku" IN ('S1003-45-100ml')
  AND "manufacturerId" = 'mfr_unknown';

-- Upchurch (3 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_upchurch_mj19cip8'
WHERE "sku" IN ('A-102', 'A-430', 'A-316')
  AND "manufacturerId" = 'mfr_unknown';

-- USBio (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_usbio_lcsxq8'
WHERE "sku" IN ('449852-5g')
  AND "manufacturerId" = 'mfr_unknown';

-- USBiological (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_usbiological_fyzjy6'
WHERE "sku" IN ('470941')
  AND "manufacturerId" = 'mfr_unknown';

-- USP (140 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_usp_49g6vg'
WHERE "sku" IN ('C13213100', 'C15144000', 'C15590400', 'C15661000', 'C15755100', 'C16996500', 'C16342000', 'C10418000', 'C12560500', 'C15291000', 'C14283000', 'C15893500', 'C13083000', 'CA14488000', 'C11690000', 'C11693400', 'C16815400', 'C16662500', 'C16815000', 'CA15515000', 'CA14670000', 'C16990680', 'C14650000', 'C15793000', 'C10937000', 'C11691700', 'C11668700', 'C16904500', 'C10162000', '1468501', '1032007', '1269200', '1714608', '1609862', '1463508', '1617000', '1496008', '1585006', '1021204', '1027302', '1078201', '1188800', '1237000', '1324002', '1349706', '1366013', '1600813', '1295742', '1043003', '1587001', '1703805', '1442100', '1457505', '1000408', '1003009', '1031503', '1054000', '1134335', '1362103', '1471506', '1478108', '1659000', '1612007', '1043819', '1550001', '1286504', '1533002', '1287303', '1494895', '1233009', '1544927', '1577008', '1613564', '1535755', '1667213', '1235300', '1375105', '1082708', '1547925', '1181302', '1342059', '1374601', '1643383', '1375047', '1623637', '1371501-200MG', '1375025', '1491300', '1095506', 'C12147000', '1372050', '1356632', '1361009', '1335508', '1339000', '1613429', '1477502', '1492007', '1621008', '1617408', '1612619', '1342106', '1396309', '1479304-200MG', '1499414', '1076192', '1235831', '1235966', '1366534', '1667905', '1A07920', '1003027', '1003031', '1003042', '1003100', '1278302', '1362125', '1235106', '1374500', '1297205', '1012644', '1012655', '1031514', '1362114', '1609013', '1609024', '1134324', '1367570', '1012689', '1372061', '1477604', '1031547', '1367581', '1367592', '1235988', '1235977', '1420006', '1016000', '1578500', '1578554')
  AND "manufacturerId" = 'mfr_unknown';

-- Vazyme (13 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_vazyme_68bwvy'
WHERE "sku" IN ('C113-01', 'EM103-01', 'DC202-01', 'C113-02', 'Q511-02', 'C115-02', 'TL301-01', 'NC103-02', 'NDM627-02', 'ND627-02', 'N411-03', 'NC101-02', 'NC001-02')
  AND "manufacturerId" = 'mfr_unknown';

-- Vector Laboratories (28 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_vector-laboratories_tgvkk9'
WHERE "sku" IN ('SP-1120-20', 'S-1000-20', 'SK-4103-100', 'SK-5105', 'H-4000', 'H-1000-10', 'H-1000', 'SK-4400', 'BA-7000-1.5', 'BA-9500-1.5', 'BA-2000', 'BA-6000-1.5', 'MP-5401-15', 'A-2001-5', 'SK-4100', 'H-1200', 'H-1200-10', 'SA-1300-1', 'FL-1201', 'VEC-H-1000', 'BA-1400', 'MP-7444-15', 'BMK-2202', 'PK-6100', 'PK-8800', 'PK-4001', 'MP-5401-50', 'SK-4103-400')
  AND "manufacturerId" = 'mfr_unknown';

-- VMD (32 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_vmd_y2shlf'
WHERE "sku" IN ('MAD-000771QD-7', 'MAD-000773QD-7', 'MAD-000572QD-7', 'MAD-000589QD-7', 'MAD-000607QD-7', 'MAD-000673QD-7', 'MAD-001000QD-7', 'MAD-002097QD-7', 'MAD-005211QD-7', 'MAD-005671QD-7', 'MAD-000635QD-7', 'MAD-000237QK-S10', 'MAD-000645QD-7', 'MAD-000646QD-7', 'MAD-000656QD-7', 'MAD-000659QD-7', 'MAD-000239QD-7', 'MAD-000318QD-7', 'MAD-000586QD-7', 'MAD-000600QD-7', 'MAD-000784QD-7', 'MAD-000487QD-7', 'MAD-001619QD-7', 'MAD-000778QD-7', 'MAD-000528QD-7', 'MAD-000681QD-7', 'MAD-000485QD-7', 'MAD-001000QD-12', 'MAD-000470QD-7', 'MAD-000581QD-7', 'MAD-001709QD-7', 'MAD-001701QD-7')
  AND "manufacturerId" = 'mfr_unknown';

-- VWR (17 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_vwr_mj19ktax'
WHERE "sku" IN ('31627.290P', '1.04936.0250', '27414137', 'VWRC27480.260', '28244.295', '28877.235', '24560.260', '27652.298', '21200.297', 'VWRC27727.231', '525-1238', '3460-01', '216-1734', '60819-546', '0639-250G', '84883.260', 'ACE-121-2546')
  AND "manufacturerId" = 'mfr_unknown';

-- Wako (5 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_wako_sf87a0'
WHERE "sku" IN ('038-16153', '546-10061', 'WPEK4-50003', '125-05061', '129-02541')
  AND "manufacturerId" = 'mfr_unknown';

-- Waters (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_waters_jvs5tn'
WHERE "sku" IN ('186003836', '186006349')
  AND "manufacturerId" = 'mfr_unknown';

-- Welch (21 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_welch_vhdwa7'
WHERE "sku" IN ('H00808-05002', '00420-01043', 'H00201-31041', 'H00207-21039', 'H00201-31043', 'H00207-21041', 'H00201-11010', 'H00201-31064', 'H00277-31041', 'H00208-11010', '00101-21038', 'H00201-41035', '00101-01010', '00101-11037', '00101-21041', '00101-31035', 'H00201-11012', 'H00208-20039', '00101-21043', 'H00201-41067', 'H00253-31043')
  AND "manufacturerId" = 'mfr_unknown';

-- Whatman (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_whatman_hu82hs'
WHERE "sku" IN ('3030-917')
  AND "manufacturerId" = 'mfr_unknown';

-- Wilmad (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_wilmad_1kdjek'
WHERE "sku" IN ('528-PP-7QTZ-5')
  AND "manufacturerId" = 'mfr_unknown';

-- Worthington (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_worthington_bb2td0'
WHERE "sku" IN ('LS02100', 'LS02109')
  AND "manufacturerId" = 'mfr_unknown';

-- Wuhan (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_wuhan_5vp5jm'
WHERE "sku" IN ('FNab01791')
  AND "manufacturerId" = 'mfr_unknown';

-- XpressBio (5 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_xpressbio_nei7rk'
WHERE "sku" IN ('IM-503C', 'IM-601C', 'IM-608C', 'IM-610C', 'IM-612C')
  AND "manufacturerId" = 'mfr_unknown';

-- ZenBio (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_zenbio_d8tnb7'
WHERE "sku" IN ('LIP-2-RB')
  AND "manufacturerId" = 'mfr_unknown';

-- Zeptometrix (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_zeptometrix_p2djs9'
WHERE "sku" IN ('NATCT/NGNEG-6MC', 'NATNG-6MC', 'NATCT(434)-6MC', 'NATCT/NGP-C')
  AND "manufacturerId" = 'mfr_unknown';

-- Zymo Research (43 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_zymo-research_v0hvja'
WHERE "sku" IN ('D4001-1-50', 'D4003-1-L', 'D4003-2-24', 'C1005-50', 'C1078-50', 'D4001-1-100', 'D4013', 'D4060', 'E1004', 'T5051', 'R1059', 'D4015', 'D6030', 'E1011', 'R1017', 'D4068', 'E1005', 'D5001', 'E1007-2', 'E2005', 'E2006', 'C1003-250', 'R1100-250', 'D6012', 'D4200', 'D4213', 'R1018', 'D4014', 'D3025', 'D4203', 'D5014', 'D4016', 'D4020', 'D5004', 'D4201', 'D4204', 'R2062', 'D4211', 'D5326', 'R1051', 'D4215', 'R3000', 'D6400')
  AND "manufacturerId" = 'mfr_unknown';

-- ZytoLight (26 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_zytolight_puow57'
WHERE "sku" IN ('Z-2210-50', 'Z-2285-50', 'Z-2130-50', 'Z-2212-50', 'Z-2097-50', 'Z-2175-50', 'Z-2100-50', 'Z-2109-50', 'Z-2116-50', 'Z-2103-50', 'Z-2003-200', 'Z-2063-50', 'Z-2079-200', 'Z-2105-200', 'Z-2114-200', 'Z-2090-200', 'Z-2096-200', 'Z-2097-200', 'Z-2100-200', 'Z-2116-200', 'Z-2151-200', 'Z-2077-200', 'Z-2063-200', 'Z-2013-200', 'Z-2033-200', 'Z-2103-200')
  AND "manufacturerId" = 'mfr_unknown';

-- Zytomed (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_zytomed_okuc1l'
WHERE "sku" IN ('Z2420RP', 'RBK024')
  AND "manufacturerId" = 'mfr_unknown';
