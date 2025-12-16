-- Update product manufacturers from CSV
-- Part 8 of 17
-- Run this script in Supabase SQL Editor
-- This script updates products with Unknown manufacturer to correct manufacturers

-- Ethicon (1691 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_ethicon_1765443994949'
WHERE "sku" IN ('et EH6849G', 'et MS0005', 'et EH6759G', 'et FCT10', 'et FCT12K', 'et FCT14', 'et FCT14K', 'et FCT16', 'et FCT16K', 'et FCT18', 'et FCT18K', 'et FCT20', 'et FCT22', 'et FCT24', 'et FCT26', 'et FCT8K', 'et FSH10', 'et FSH12', 'et FSH16', 'et FSH18', 'et FSH20', 'et FSH22', 'et FSH24', 'et FSH26', 'et FSH6', 'et FUR10K', 'et FUR12K', 'et FUR14K', 'et FUR16K', 'et FUR18K', 'et FUR20K', 'et FUR8K', 'et EH6758G', 'et ESH1', 'et ECP2', 'et ECP3', 'et ECP4', 'et ECP5', 'et ECT', 'et ECT1', 'et ECT2', 'et ECT3', 'et ECT4', 'et EFS1', 'et EFS2', 'et EFS4', 'et EFSL', 'et EKP3', 'et EKS2', 'et ESH2', 'et ESH3', 'et ESH4', 'et FCP10K', 'et FCP12', 'et FCP12K', 'et FCP14', 'et FCP14K', 'et FCP16', 'et FCP16K', 'et FCP18', 'et FCP20', 'et FCP22', 'et FCP6K', 'et FCP8K', 'et FFS10', 'et FFS12', 'et FFS14', 'et FFS16', 'et FFS18', 'et FFS2', 'et FFS20', 'et FFS22', 'et FFS4', 'et FFS6', 'et EH6740G', 'et PMR35', 'et MS0006', 'PMR35', 'et W9130', 'et 642G', 'et W320BG', 'et 18521G', 'et G662G', 'et EH453P', 'et V1205G', 'et EH6854H', 'et PMW35', 'et W736G', 'et 18502G', 'et 18505G', 'et W6156', 'et Y4950G', 'et 18506G', 'et 18516G', 'et 18501G', 'et 18507G', 'et EH7149G', 'et 18525G', 'et EH6853H', 'et EH6855H', 'et 18509G', 'et V304G', 'et 18533G', 'et E10R', 'et EH6887H', 'et 18514G', 'et EH7168G', 'et PXR35', 'et V392ZG', 'et W275', 'et 18539G', 'et 18540G', 'et 18305G', 'et W31C', 'et 18528G', 'et GP1', 'et PSX', 'W31C', 'et 8684G', 'et PXW35', 'et W9114', 'et EH6765H', 'et EH7963G', 'et EH7964G', 'et 18526G', 'et EH7962G', 'et 18510G', 'et 18544G', 'et 18546G', 'et 102K', 'et 18513G', 'et 869G', 'et V2150G', 'et V2190G', 'et W9999', 'et EH7667G', 'et EH7765G', 'et R9', 'et V2140G', 'et EH6734H', 'et V393G', 'et MCP219G', 'et V623E', 'et MCP3435G', 'et W277', 'et 18515G', 'et MCP3209G', 'et W748', 'et 18532G', 'et 18531G', 'et EH386', 'et EH387', 'et EH388', 'et EH389', 'et Y4930G', 'et V582G', 'et PRW35', 'et V652E', 'et EH6733H', 'et EH6735H', 'et 18535G', 'et V624E', 'et 1611G', 'et G667G', 'et EH7936H', 'et EH6935H', 'et EVK01DE', 'et V614H', 'et EH7796H', 'et EH7826H', 'et V625E', 'et 1665G', 'et EH7792H', 'et EH7794H', 'et EH7938H', 'et V653E', 'et EH7791H', 'et EH7824H', 'et EH7825H', 'et V636E', 'et EH7799H', 'et R8', 'et EH7143H', 'et EH7793H', 'et EH7506H', 'et 662H', 'et V626E', 'et V646E', 'et EH6732H', 'et EH7275H', 'et V654E', 'et EH7144H', 'et EH7942H', 'et EH7273H', 'et V618H', 'et V617H', 'et EH7271H', 'et W810T', 'et EH7174H', 'et EH7272H', 'et EH7013H', 'et EH7173H', 'et EH7269H', 'et EH7274H', 'et EH6762H', 'et EH7012H', 'et V301G', 'et V637E', 'et EH7790H', 'et EH7823H', 'et Y6840G', 'et LT300', 'et EH6763H', 'et EH6764H', 'W810T', 'et W1621T', 'et 664H', 'et EH7683H', 'et EH7822H', 'et EH7826BH', 'et EH7937H', 'et R665H', 'et R677H', 'et W1619T', 'et EH396E', 'et EH7821H', 'et 653H', 'et 663H', 'et 8750G', 'et EH7352H', 'et EH7546H', 'et EH7684H', 'et EH7689H', 'et EH7938BH', 'et R647H', 'et EH6848G', 'et R730H', 'et 100K', 'et 101K', 'et 1162H', 'et 1629H', 'et 662SLH', 'et 789G', 'et EH6767H', 'et EH7114H', 'et EH7145H', 'et EH7147H', 'et EH7638H', 'et EH7798H', 'et EH7827H', 'et EH7942BH', 'et R633H', 'et R683H', 'et W9410', 'et 8527G', 'et EH7166G', 'et EH7325H', 'et EH7637H', 'et EH7795H', 'et EH7797H', 'et EH7799BH', 'et EH7939H', 'et EH7338G', 'et EH6884H', 'et 1628H', 'et 661H', 'et 786G', 'et EH6824H', 'et EH7143BH', 'et R670H', 'et 18537G', 'et EH7350H', 'et EH7526H', 'et R691G', 'et 18538G', 'et 690G', 'et W1611G', 'et EH7961G', 'et 8663G', 'et EH6886H', 'et FJ5272H', 'et 1763G', 'et EH7387H', 'et FH5171H', 'et R833H', 'et AP302', 'et 1760G', 'et EH7386H', 'et R834H', 'et R844H', 'et 222721', 'et R871H', 'et Z626E', 'et 660H', 'et EH7385H', 'et EH74', 'et GP2', 'et V8653E', 'et VCP625E', 'et R845H', 'et 783G', 'et V583G', 'et VS3530E', 'et V643H', 'et V8654E', 'et VCP624E', 'et VCP626E', 'et EH36', 'et PVMN1', 'et 678H', 'et EH7344H', 'et EH7943H', 'et V8646E', 'et 780G', 'et EH7440G', 'et V634H', 'et V644H', 'et 2160', 'et V633H', 'et V557G', 'et 737H', 'et EH6664H', 'et EH7633H', 'et MCP3205G', 'et EH7281H', 'et 632H', 'et 684H', 'et EH7345H', 'et EH7547H', 'et EH6417H', 'et EH7270H', 'et EH7278H', 'et 683H', 'et 734H', 'et EH7724H', 'et V635H', 'et V645H', 'et EH7561H', 'et EH6712H', 'et 680H', 'et R943H', 'et R953H', 'et RS71G', 'et Z293E', 'et Z292E', 'et Z292ZE', 'et Z443E', 'et Z627E', 'et 682H', 'et EH7464G', 'et W9537', 'et Z291E', 'et Z423E', 'et Z442E', 'et EH6454H', 'et Z422E', 'et Z422ZE', 'et Z441E', 'et 105K', 'et EH6723E', 'et X698G', 'et EH6455H', 'et EH7435G', 'et EH7692H', 'et EH7171H', 'et EH7343H', 'et K832H', 'et K834H', 'et K844H', 'et K872H', 'et 2161', 'et EH6663H', 'et 691H', 'et EH7945H', 'et EBC01', 'et EH6456H', 'et V570G', 'et 2163', 'et 768G', 'et EH7118H', 'et EH7802H', 'et EH7808H', 'et PN2997E', 'et V655H', 'et EH7101H', 'et EH7115H', 'et EH7804H', 'et EH7933H', 'et EH7954H', 'et EH7276H', 'et EH7956H', 'et K870H', 'et 1906SK', 'et EH7751H', 'et EH7805H', 'et 1667H', 'et 103K', 'et 104K', 'et 2162', 'et 8670H', 'et W9235T', 'et EH7801H', 'et EH379G', 'et EH7800H', 'et 769G', 'et EH6457H', 'et Z485E', 'et EH7931H', 'et MS0007', 'et EH7930H', 'et EVK02DE', 'et 1780G', 'et EC1534G', 'et EH7279H', 'et EH7955H', 'et V571G', 'et V671G', 'et EH7280H', 'et EH7283H', 'et SN13G', 'et EH6726E', 'et EH7282H', 'et EH7663H', 'et EH7803H', 'et EH7662H', 'et Z458E', 'et EH6435H', 'et J601H', 'et EH7268H', 'et PVMM1', 'et EH7277H', 'et EH7932H', 'et EH7665H', 'et V632H', 'et V642H', 'et V8645E', 'et V398H', 'et 1696H', 'et V368G', 'et V627H', 'et Z605E', 'et 6832H', 'et EH6731H', 'et EH7071H', 'et V921H', 'et EH7070H', 'et ECC3543G', 'et J571G', 'et J671G', 'et V119G', 'et V551G', 'et V388H', 'et V8644E', 'et VCP636E', 'et 4PL2595Y', 'et X1004G', 'et EH6433H', 'et J570G', 'et V670G', 'et V8643E', 'et EH7623G', 'et 2808G', 'et 8648G', 'et VAA2973E', 'et PMS3', 'et V400G', 'et EH7957H', 'et Z498H', 'et V120G', 'et V546G', 'et Z620E', 'et K882H', 'et EH6436H', 'et EH7139H', 'et W9559', 'et 1617H', 'et 6664H', 'et V1211G', 'et V293H', 'et V393H', 'et AHV6', 'et V292H', 'et V292ZH', 'et V392H', 'et V392ZH', 'et V443H', 'et V453H', 'et 690H', 'et V291H', 'et V391H', 'et V442H', 'et V452H', 'et V585H', 'et V587H', 'et 6663H', 'et EH7346H', 'et EH7544H', 'et EH7579H', 'et PE6680H', 'et V397H', 'et V396H', 'et V423H', 'et R699H', 'et V387H', 'et R698H', 'et V451H', 'et 6683H', 'et 6833H', 'et EH6434H', 'et EH7142H', 'et EH7399H', 'et EH7679H', 'et EH7687H', 'et V302H', 'et EH7481H', 'et V586H', 'et 6964H', 'et 1903SK', 'et V460H', 'et 6872H', 'et AHVM12', 'et EH7111H', 'et EH7673H', 'et EH7688H', 'et EH7722H', 'et V317H', 'et V520H', 'et X412H', 'et EH7940H', 'et V422H', 'et V311H', 'et V316H', 'et V318H', 'et V416H', 'et Z1940G', 'et 6661H', 'et 6871H', 'et EH7397H', 'et V1227E', 'et V466H', 'et V305H', 'et EH7528H', 'et EH7674H', 'et V304H', 'et V467H', 'et V1210G', 'et V38G', 'et V548G', 'et V468H', 'et V638H', 'et 739H', 'et EH7822BH', 'et V224H', 'et V226H', 'et V323H', 'et VCP627H', 'et V219H', 'et V324H', 'et V3120H', 'et V312H', 'et V315H', 'et V3160H', 'et V322H', 'et V306H', 'et V310H', 'et V325H', 'et V215H', 'et V1228E', 'et 644H', 'et 648H', 'et 668H', 'et 8685H', 'et F3206BH', 'et V214H', 'et V246H', 'et V542G', 'et V220H', 'et V245H', 'et V247H', 'et EH7557H', 'et V3170H', 'et 8665H', 'et 8684H', 'et EH7124H', 'et EH7545H', 'et EH7920H', 'et V656H', 'et Y424H', 'et V225H', 'et V227H', 'et Z625H', 'et V547G', 'et EH7162H', 'et V216H', 'et V3110H', 'et V3100H', 'et Y293H', 'et Z2920H', 'et 6963H', 'et 8417H', 'et 8629H', 'et 8683H', 'et 8689H', 'et EH7151H', 'et EH7697H', 'et R843H', 'et R873H', 'et V3230H', 'et VC5673H', 'et VCP308H', 'et Y292H', 'et Y443H', 'et 2809G', 'et 641H', 'et Y442H', 'et Z630E', 'et 8622H', 'et 8675H', 'et 8832H', 'et 8834H', 'et EH7693H', 'et EH7694H', 'et PN120', 'et PN150', 'et V243H', 'et 640H', 'et V628H', 'et Y422H', 'et LT200', 'et V242H', 'et V3050H', 'et V3040H', 'et V3219H', 'et 667H', 'et 8614H', 'et 8661H', 'et 8831H', 'et EH7150H', 'et MD5642H', 'et V39G', 'et V4431H', 'et V81H', 'et V963E', 'et V3150H', 'et MPE7808H', 'et EH6437H', 'et MPE7933H', 'et MPE7954H', 'et XLL6373T', 'et MPE7161H', 'et R697H', 'et V620H', 'et V2930H', 'et V4421H', 'et V76H', 'et V7902H', 'et VCP293H', 'et VCP393H', 'et VCP460H', 'et V3060H', 'et Z497E', 'et Z682E', 'et V3220H', 'et MPE7801H', 'et V486H', 'et 8411H', 'et FH1642H', 'et MPE1621H', 'et V2920H', 'et V4430H', 'et V4550H', 'et VA1673H', 'et VCP14H', 'et VCP292H', 'et VCP292ZH', 'et VCP296H', 'et VCP333H', 'et VCP375H', 'et VCP392ZH', 'et VCP443H', 'et VCP453H', 'et VCP466H', 'et VCP586H', 'et VCP602H', 'et MPE24022H', 'et Z489E', 'et Z490E', 'et Z492E', 'et Z493E', 'et Z494E', 'et Z495E', 'et Z496E', 'et Z496ZE', 'et Z498E', 'et Z500E', 'et Z683E', 'et EH7123H', 'et V523H', 'et Y220H', 'et Y417H', 'et V101H', 'et 8412H', 'et 8424H', 'et EH7923H', 'et V4420H', 'et VCP295H', 'et VCP329H', 'et VCP334H', 'et VCP340H', 'et VCP352H', 'et VCP395H', 'et VCP398H', 'et VCP423H', 'et VCP442H', 'et VCP452H', 'et VCP467H', 'et VCP587H', 'et VCP603H', 'et VCP694H', 'et VR2298', 'et PHSM1', 'et V100H', 'et V102H', 'et V244H', 'et Y219H', 'et Y416H', 'et V485H', 'et EH7090H', 'et V1214E', 'et Y218H', 'et V1215E', 'et EH7120H', 'et MPE7930H', 'et 8660H', 'et E6942H', 'et EH7384H', 'et MPE1698H', 'et V103H', 'et V2910H', 'et VCP291H', 'et VCP326H', 'et VCP345H', 'et VCP391H', 'et VCP422H', 'et VCP451H', 'et Y215H', 'et EH6458H', 'et Y214H', 'et 8425H', 'et EH7038H', 'et EH7076H', 'et PK5676H', 'et V303H', 'et V328H', 'et V333H', 'et V339H', 'et VCP271H', 'et VCP335H', 'et VCP341H', 'et VCP365H', 'et VCP468H', 'et MPE7804H', 'et MS0002', 'et V4731H', 'et VCP2594H', 'et VCP330H', 'et VCP346H', 'et VCP358H', 'et VCP946H', 'VCP358H', 'et Y213H', 'et Y3170H', 'et V2430H', 'et V329H', 'et V334H', 'et V340H', 'et V479H', 'et Y423H', 'et EH7292H', 'et OL2995G', 'et EH7757H', 'et V2420H', 'et Y3110H', 'et Y3160H', 'et 6951H', 'et 736H', 'et PG1674H', 'et R964H', 'et V335H', 'et V338H', 'et V341H', 'et V4170H', 'et V55H', 'et V62H', 'et VCP220H', 'et VCP224H', 'et VCP246H', 'et VCP306H', 'et VCP312H', 'et VCP317H', 'et VCP323H', 'et Y212H', 'et V241H', 'et Y3100H', 'et Z370E', 'et ANX6', 'et EH7294H', 'et VCP331H', 'et VCP347H', 'et VCP371H', 'et V97H', 'et V2150H', 'et V2190H', 'et V4160H', 'et V56H', 'et V66H', 'et VCP215H', 'et VCP219H', 'et VCP245H', 'et VCP247H', 'et VCP305H', 'et VCP311H', 'et VCP316H', 'et VCP318H', 'et VCP322H', 'et VCP324H', 'et EH7169H', 'et Z358E', 'VCP311H', 'et EH7298H', 'et V213H', 'et V327H', 'et EH7690H', 'et Z684E', 'et EH7297H', 'et V270H', 'et Y3050H', 'et Z969H', 'et V3030H', 'et 593H', 'et EH7553H', 'et EH7559H', 'et EH7806H', 'et EH7953H', 'et EH7997G', 'et R952H', 'et V2140H', 'et V2180H', 'et V4150H', 'et V528H', 'et V600G', 'et V9450H', 'et VCP101H', 'et VCP214H', 'et VCP243H', 'et VCP304H', 'et VCP310H', 'et VCP315H', 'et VCPV426H', 'VCP310H', 'et VCP348H', 'et VCP482H', 'et Y3040H', 'et V321H', 'et Z983H', 'et V426H', 'et V57H', 'et Y3030H', 'et Z467H', 'et EH7086H', 'et EH7750H', 'et V9460H', 'et V9580H', 'et VCP100H', 'et VCP242H', 'et VCP244H', 'et Z984H', 'et V1216E', 'et X924G', 'et Z468H', 'et EH7075H', 'et EH7081H', 'et EH7085H', 'et EH7163H', 'et EH7164H', 'et EH7554H', 'et EH7761H', 'et K833H', 'et K890H', 'et V2130H', 'et VCP303H', 'et X32071H', 'et EH7295H', 'et V461H', 'et V70H', 'et Z317H', 'et Z323H', 'et EH7033H', 'et EH7563H', 'et MCP4330H', 'et Z630T', 'et Z311H', 'et Z316H', 'et V781G', 'et Y291H', 'et 1666H', 'et 1713G', 'et 6523H', 'et EH7981G', 'et K871H', 'et Z310H', 'et PG5674H', 'et Z631E', 'et V735G', 'et MCP293H', 'et Y229H', 'et Y3120H', 'et V481H', 'et V482H', 'et MCP292H', 'et VCP999H', 'et PDP984H', 'et Z3110H', 'et EH7845H', 'et PMP3', 'et Y259H', 'et Z3150H', 'et V439G', 'et V549G', 'et Y260H', 'et Y270H', 'et MCP4423H', 'et MCP442H', 'et R832H', 'et R872H', 'et V1217E', 'et VCP276H', 'et VCP279H', 'et VCP987H', 'et Z305H', 'et MPE1855H', 'et UV120', 'et APP6', 'et Z304H', 'et Y261H', 'et 711H', 'et EH7299H', 'et MCP4422H', 'et MIC551H', 'et V1002H', 'et VCP517H', 'et VCP994H', 'et EH7678H', 'et Z303H', 'et Z4870E', 'et ME2543H', 'et EH7286H', 'et EH7293H', 'et VCP518H', 'et Z464BE', 'et V346H', 'et EH7008H', 'et EH7032H', 'et EH7285H', 'et EH7291H', 'et K964H', 'et MCP227H', 'et V347H', 'et V336H', 'et V5190H', 'et VCP519H', 'et 6682H', 'et 8528H', 'et EH7160H', 'et EH7287H', 'et MCP4160H', 'et MCP418H', 'et Z3040H', 'et V1408E', 'et VCP837G', 'et EH7026H', 'et EH7176H', 'et EH7284H', 'et MS0003', 'et VCP635H', 'et VCP645H', 'et Z3030H', 'et 6698H', 'et 8522H', 'et 8558H', 'et V4971H', 'et V945H', 'et VCP498H', 'et V326H', 'et V345H', 'et PF2577H', 'et V330H', 'et V946H', 'et V924H', 'et VCP736G', 'et EH7552H', 'et EH7763H', 'et MCP2131H', 'et MS0001', 'et V4961H', 'et EH7288H', 'et EH7458G', 'et LC800', 'et V353H', 'et V944H', 'et V947H', 'et V331H', 'et V925H', 'et 6425H', 'et VCP634H', 'et VCP6441H', 'et Z328H', 'et Z333H', 'et LC105', 'et LC107', 'et LC205', 'et LC207', 'et LC210', 'et LC220', 'et LC307', 'et LC310', 'et LC320', 'et LC410', 'et LC420', 'et UHSM1', 'et 6936H', 'et EH7582H', 'et Z329H', 'et Z340H', 'et VCP737G', 'et Z334H', 'et V1027G', 'et 1678H', 'et 8556H', 'et EH7175H', 'et EH7457G', 'et PEE5692H', 'et Z335H', 'et Z341H', 'et V1225H', 'et V9240H', 'et V978H', 'et Z302H', 'et V1224H', 'et PDP293H', 'et V603H', 'et VCP633H', 'et EH7467G', 'et EH7596G', 'et EH7980G', 'et EH7991G', 'et MPP8695H', 'et V736G', 'et PMN3', 'et PDP14H', 'et PDP1923T', 'et PDP317H', 'et PDP328H', 'et PDP333H', 'et PDP443H', 'et PDP9133H', 'et PDP969H', 'et PDP9950H', 'et VCP3120H', 'et VCP3170H', 'et 6834H', 'et 6873H', 'et 8648H', 'et UHSL1', 'et 2814G', 'et EH7444G', 'et EH7900G', 'et U7003', 'et PDP311H', 'et PDP329H', 'et PDP9132H', 'et PDP983H', 'et VCP3050H', 'et VCP3110H', 'et VCP3160H', 'et PDP9262T', 'et PDP304H', 'et PDP422H', 'et V440G', 'et V449G', 'et VCP3040H', 'et VCP3100H', 'et VCPJV3150H', 'et V381H', 'et EH7100H', 'et EH8078H', 'et PDP335H', 'et PDP341H', 'et UMS3', 'et V382H', 'et 1663H', 'et 1669H', 'et PDP358H', 'et PDPL995H', 'et SN1G', 'et EH7138H', 'et 1667SLH', 'et 6697H', 'et EH7065H', 'et EH7808BH', 'et PDP303H', 'et PDP421H', 'et Y925H', 'et PDP334H', 'et PVM2S3', 'et Y432H', 'et 7062G', 'et V1226H', 'et V979H', 'et V375H', 'et 1668H', 'et 7060G', 'et EH7307H', 'et EH7417H', 'et F24022H', 'et V365H', 'et Z1012H', 'et MPP7756H', 'et V1058H', 'et Z634H', 'et 6681H', 'et MD2543H', 'et MPP8687H', 'et Y946H', 'et EH7584H', 'et MCP6830H', 'et EH7995G', 'et VCP1216E', 'et MIC4032', 'et V684H', 'et V359H', 'et V959H', 'et EH7787H', 'et MCP4960H', 'et PA2671H', 'et PBB5613H', 'et V926H', 'et V496H', 'et V496ZH', 'et V364H', 'et EH7260H', 'et MPP8699H', 'et MPP8698H', 'et EH7018H', 'et V371H', 'et MPP2847H', 'et V971G', 'et VCP1215E', 'et MPP7764H', 'et X1153G', 'et MPP8681H', 'et Z924H', 'et Z925H', 'et V686H', 'et UPA3612', 'et V687H', 'et 8833H', 'et EH7764H', 'et V358H', 'et R440G', 'et 7061G', 'et EH7465G', 'et EH7990G', 'et 8872H', 'et MCP3050H', 'et MCP3110H', 'et MCP3160H', 'et V237H', 'et V253H', 'et V491H', 'et 8871H', 'et EH7436G', 'et EH7581H', 'et MCP3040H', 'et MCP3100H', 'et PDP994H', 'et EH7290H', 'et 719H', 'et 1679H', 'et MIC182H', 'et V498H', 'et V999H', 'et EH7473G', 'et V450G', 'et V500H', 'et V276H', 'et V279H', 'et V998H', 'et OKK5672H', 'et V994H', 'et 8870H', 'et EH7289H', 'et V1059H', 'et V348H', 'et V490H', 'et EH7733H', 'et V255H', 'et V278H', 'et V170H', 'et VCPV113H', 'et V277H', 'et V499H', 'et EH7556H', 'et EH7830H', 'et V133H', 'et VCP9982H', 'et V114H', 'et V14H', 'et V274H', 'et V13H', 'et V987H', 'et EH7570H', 'et EH7755H', 'et PDP498H', 'et AP301', 'et EH7551H', 'et EH7760H', 'et JA6442H', 'et V667H', 'et EH7811E', 'et EH7896G', 'et EH7897G', 'et EH7569H', 'et PDP1311H', 'et V231H', 'et V572G', 'et Y4940H', 'et Y497H', 'et VCP924H', 'et Y493H', 'et Y4960H', 'et Y4970H', 'et Y6830H', 'et MPP2854H', 'et 699H', 'et 8964H', 'et EH7772H', 'et PDP2993H', 'et VCP133H', 'et VCP925H', 'et Z282H', 'et Z161E', 'et Z1701E', 'et Y959H', 'et 8943H', 'et 8953H', 'et 8963H', 'et EH7771H', 'et PDP3110H', 'et ER320', 'et UPPS1', 'et Y134H', 'et 698H', 'et 8942H', 'et 8952H', 'et EH7102H', 'et EH7756H', 'et EH7770H', 'et V1223H', 'et JE2672H', 'et Y999H', 'et Z4630H', 'et Z4640H', 'et Z513ZH', 'et 6710H', 'et 8682H', 'et 8951H', 'et EH7168H', 'et EH7472H', 'et EH7550H', 'et EH7758H', 'et EH7759H', 'et PDP3030H', 'et EH7815G', 'et EH7691H', 'et V8978E', 'et V8980E', 'et VCP1227E', 'et VCP980E', 'et 8592H', 'et V493H', 'et V494H', 'et V497H', 'et V683H', 'et Y470H', 'et Y489H', 'et Y490H', 'et Y491H', 'et Y492H', 'et Y494H', 'et Y496H', 'et Y498H', 'et Y683H', 'et Y684H', 'et V134H', 'et 1698H', 'et 697H', 'et EH7167H', 'et V6840H', 'et VCP684H', 'et UPPM1', 'et Y499H', 'et V4970H', 'et V6830H', 'et VCP497H', 'et EH7471H', 'et V4940H', 'et V4960H', 'et V9380H', 'et VCP494H', 'et VCP496H', 'et VCP496ZH', 'et V990H', 'et V517H', 'et V4270H', 'et V9360H', 'et Z463H', 'et Z464H', 'et Z487H', 'et Z513H', 'et Z514ZH', 'et V516H', 'et V518H', 'et V767G', 'et V919H', 'et Y4930H', 'et 1901SK', 'et 8559H', 'et 8881H', 'et V4260H', 'et V4930H', 'et V519H', 'et VCP500H', 'et VCP9580H', 'et VCP1228E', 'et UPPL1', 'et V928H', 'et OA2644H', 'et SXMD1B406', 'et 8557H', 'et 8710H', 'et 8880H', 'et EH7227H', 'et EH7255H', 'et EH7401H', 'et MCP925H', 'et VCP491H', '8557H', 'et V495H', 'et V905E', 'et EH383E', 'et EH384E', 'et EH385E', 'et Z114H', 'et Z14H', 'et Z999H', 'et V432H', 'et EH7060H', 'et MPV489H', 'et VCP499H', 'et Z113H', 'et Z15H', 'et Z276H', 'et V254H', 'et W9262T', 'et Z277H', 'et EH7226H', 'et EH7400H', 'et EH7835H', 'et PDP114H', 'et V555G', 'et V360H', 'et PDP113H', 'et Z13H', 'et PVM2P3', 'et 1647H', 'et 639H', 'et PDP924H', 'et Z275H', 'et Z994H', 'et Z997H', 'et PK2597H', 'et EH6527H', 'et JD2942H', 'et 2226', 'et 2228', 'et 2230', 'et FCC3542H', 'et Y5270H', 'et EH7976H', 'et 1902SK', 'et OB2593H', 'et Z995H', 'et Z274H', 'et EH6444H', 'et SN17G', 'et V912E', 'et EH7555H', 'et K802H', 'et PDP1312H', 'et PVML1', 'et MIC109G', 'et MPY493H', 'et MPY494H', 'et MPY500H', 'et MPY501H', 'et 8687H', 'et EH7788H', 'et Z1316H', 'et 8682SLH', 'et 8935H', 'et EH7253H', 'et EH7774H', 'et EH7975H', 'et MCP4940H', 'et MPP8682H', 'et EL5ML', 'et EH7972E', 'et EH7568H', 'et MPP2862H', 'et V492H', 'et Y919H', 'et EH6445H', 'et 8681H', 'et 8686H', 'et 8934H', 'et EH7167SLH', 'et EH7695H', 'et MCP4930H', 'et APPXL6', 'et MPVCP497H', 'et MPVCP683H', 'et PDP4640H', 'et UMP3', 'et AHV12', 'et D11LT', 'et D5LT', 'et MPP2833H', 'et MPVCP494H', 'et MPVR4940H', 'et V1218H', 'et EH7476H', 'et MPP8697H', 'et MPVCP493H', 'et MPVR4260H', 'et UML1', 'et EH6442H', 'et PVM2N3', 'et V1229H', '8521H', 'et 8521H', 'et 8581H', 'et 8890H', 'et EH7229H', 'et EH7404H', 'et EH7585H', 'et F2832H', 'et PDP513H', 'et V991H', 'et MIC110G', 'et MIC111G', 'et MPV494H', 'et MPV497H', 'et MPV683H', 'et 1940SK', 'et EH6446H', 'et EH7470E', 'et V489H', 'et 8889H', 'et EH7221H', 'et EH7228H', 'et EH7573H', 'et PDP495H', 'et PDP4630H', 'et PDP492H', 'et MCP497H', 'et Z1312H', 'et MCP496H', 'et MCP684H', 'et 5TC2576YG', 'et MCP4271H', 'et MCP428H', 'et MCP683H', 'et UMN3', 'et MPP2860H', 'et 8719H', 'et 8721H', 'et EH7446H', 'et MCP470H', 'et MCP494H', 'et MCP498H', 'et 8699H', 'et MCP491H', 'et MCP493H', 'et MCP500H', 'et PDP2971H', 'et MPY492H', 'et 8698H', 'et MCM20', 'et MCS20', 'et MSM20', 'et MIC515H', 'et MCP492H', 'et ZH303', 'et 8695H', 'et 8697H', 'et 8717H', 'et EH7478H', 'et PDP684H', 'et VCP493H', 'et PDP497H', 'et PDP514ZH', 'et 2227', 'et 2229', 'et 2231', 'et MPZ493H', 'et MPZ494H', 'et MPZ496H', 'et EH7411H', 'et EH7477H', 'et PDP494H', 'et PDP496H', 'et PDP507H', 'et PDPZ682H', 'et PDP975H', 'et 8720H', 'et PDP463H', 'et PDP493H', 'et PDP500H', 'et V32H', 'et MIC4034', 'et 44152', 'et EVK05DE', 'et 8706H', 'et 8711H', 'et EH7403H', 'et VH306', 'et K803H', 'et EH7812E', 'et Y864G', 'et VCP966H', 'et MNN2531H', 'et MPZ489H', 'et ANX12', 'et UMM3', 'et MCM30', 'et FD5640H', 'et V967H', 'et EH7402H', 'et PDP1043H', 'et LS200', 'et V904H', 'et EA2531H', 'et V783G', 'et V807E', 'et MIC540H', 'et V1219H', 'et MIC130G', 'et MIC170G', 'et ZV2001', 'et VCP1226H', 'et VCP9791H', 'et MIC133G', 'et V910H', 'et VCP798G', 'et VCP1225H', 'et VCP9781H', 'et EAA2641H', 'et EH7405H', 'et UPA31015', 'et V808E', 'et UPA3030', 'et MIC511G', 'et PDP464H', 'et VCP759E', 'et 2B5LT', 'et B11LT', 'et B12LT', 'et B5LT', 'et V747G', 'et VCP2574E', 'et PDP487H', 'et PDP489H', 'et Y3715G', 'et F2854H', 'et PDP1702H', 'et M8702G', 'et ETS45', 'et ML2642H', 'et 1942SK', 'et MIC4036', 'et UPA31515', 'et V742G', 'et UDD2831G', 'et ZH503', 'et RS21G', 'et ZP4013', 'et Z1751E', 'et MS0004', 'et 3DPL', 'et Z1702H', 'et EH6373H', 'et VCP771E', 'et 5DCS', 'et Y714G', 'et 431961', 'et PCDN1', 'et MIC572H', 'et EH1990', 'et EH41', 'et SXPD2B415', 'et Z1033E', 'et SXPD2B200', 'et SXMD2B410', 'et SXPD2B401', 'et LC2010Z', 'et LC3010Z', 'et LC4010Z', 'et SXPD2B409', 'et V782H', 'et Z1043H', 'et AP3010S', 'et EH7220H', 'et V7800H', 'et SXPP1B416', 'et T2091', 'et SXPP1B415', 'et PVPS', 'et TIM20', 'et ZK1206', 'et VCP782H', 'et EH7715LG', 'et PVPM', 'et MIC500Z', 'et EP7402H', 'et EP8708H', 'et EC60A', 'et ZK728', 'et EH40', 'et EP8741H', 'et V775E', 'et V771E', 'et V774E', 'et PPH03', 'et V733E', 'et 1943SK', 'et VCP770E', 'et V7330E', 'et ZK1506', 'et VCP774E', 'et VCP785E', 'et Z1032H', 'et V744E', 'et MS0008', 'et ZK1328', 'et EH41L', 'et X671', 'et MIC503Z', 'et E705R', 'et SRNH1', 'et 431962', 'et ZPA4013', 'et 6R45B', 'et ZX2026', 'et T2092', 'et Z838G', 'et ECR60B', 'et ECR60D', 'et ECR60G', 'et 431963', 'et UPPS6', 'et 0845', 'et UPPM6', 'et UPPL6', 'et T2093', 'et HP054', 'et GST60B', 'et GST60D', 'et GST60G', 'et HARHPBL', 'et HARHPGR')
  AND "manufacturerId" = 'mfr_unknown';

-- EURx (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_eurx_arnwfx'
WHERE "sku" IN ('E2501-02')
  AND "manufacturerId" = 'mfr_unknown';

-- Exbio (7 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_exbio_99x2df'
WHERE "sku" IN ('EXB0026', '1A-514-T100', '1P-688-T100', 'A7-817-T100', 'PB-359-T100', 'PO-684-T100', 'T7-706-T100')
  AND "manufacturerId" = 'mfr_unknown';

-- Fine Biotech (10 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_fine-biotech_tbsyju'
WHERE "sku" IN ('EH0287', 'EH0396', 'EH3267', 'EU0381', 'EH0118', 'EH0145', 'EH0588', 'EH0868', 'EH3234', 'EH3235')
  AND "manufacturerId" = 'mfr_unknown';

-- FineTest (24 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_finetest_jac5wt'
WHERE "sku" IN ('FNSA-0063*100', 'FNab09803', 'FNab02007', 'ER1094', 'EH0164', 'ER0042', 'ER0191', 'ER0841', 'ER1113', 'EU2624', 'FNSA-0063*500', 'EH0043', 'ER0115', 'ER1173', 'EU3126', 'P0797-200', 'ER0170', 'ER0430', 'ER0435', 'ER0996', 'ER0998', 'ER0999', 'ER1048', 'ER1587')
  AND "manufacturerId" = 'mfr_unknown';

-- FUJIFILM (6 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_fujifilm_ap65re'
WHERE "sku" IN ('182-01611,', '15809621', '201-10421', '94134-1L', '639-51001', '94120-10L')
  AND "manufacturerId" = 'mfr_unknown';

-- Fuller (2 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_fuller_snwdhk'
WHERE "sku" IN ('SFG-96K', 'RRM-96K')
  AND "manufacturerId" = 'mfr_unknown';

-- G-Biosciences (6 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_g-biosciences_57jrw1'
WHERE "sku" IN ('786-663', '786-922', '786-1677', '786-904', '786-254', 'IT7666')
  AND "manufacturerId" = 'mfr_unknown';

-- GE Healthcare (11 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_ge-healthcare_oak2l7'
WHERE "sku" IN ('17-1319-01', 'GE17-0446-01', '17-5268-01', 'GE17-0471-01', '17-0853-02', '17004201', '175­11301', '17-0456-01', 'GE17-0456-01', '28403841', '17-5186-01')
  AND "manufacturerId" = 'mfr_unknown';

-- GeneTex (9 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_genetex_pv74gv'
WHERE "sku" IN ('GTX77157', 'GTX101583', 'GTX102425-100', 'GTX26673', 'GTX300029', 'GTX65684-pro', 'GTX89040', 'GTX01748', 'GTX34954')
  AND "manufacturerId" = 'mfr_unknown';

-- Geno Chem (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_geno-chem_mj19jwun'
WHERE "sku" IN ('1501ML100')
  AND "manufacturerId" = 'mfr_unknown';

-- GenScript (16 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_genscript_4xt551'
WHERE "sku" IN ('RP10586- 1mg', 'A01004-40', 'A02257', 'Z03486-100', 'Z03502-100', 'A01861-200', 'L00432-1 ml', 'Z03163-50', 'Z03163-50ug', 'L01015', 'Z03621-0.5', 'Z03622*05', 'Z03622*1', 'Z03486-1', 'Z03502-1', 'Z03622*5')
  AND "manufacturerId" = 'mfr_unknown';

-- Gerbu (5 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_gerbu_gmcm5t'
WHERE "sku" IN ('1331-4kg', '2030-4kg', '1023-5kg', '2029-10kg', '2031-5kg')
  AND "manufacturerId" = 'mfr_unknown';

-- Gibco (10 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_gibco_mj19iao9'
WHERE "sku" IN ('11140-035', '41966029', '21056-023', '11530546', '52400025', '12800-082', '41300-070', '70011051', '13256-029', '13426156')
  AND "manufacturerId" = 'mfr_unknown';

-- Gilson (5 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_gilson_mj19m2ni'
WHERE "sku" IN ('F1619782', 'F117949', 'F117948', 'F144059M', 'F167900')
  AND "manufacturerId" = 'mfr_unknown';

-- GL Sciences (7 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_gl-sciences_lxfng6'
WHERE "sku" IN ('5020-01731', '5020-03945', '5020-01766', '5020-89858', '5020-01732', '5020-01790', '5020-87019')
  AND "manufacturerId" = 'mfr_unknown';

-- Glen Research (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_glen-research_e7gjxa'
WHERE "sku" IN ('60-5100-96')
  AND "manufacturerId" = 'mfr_unknown';

-- GoldBio (5 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_goldbio_95lsyg'
WHERE "sku" IN ('A-081-1', 'C-375-5', 'C-375-10', 'LUCK-1G', 'LUCK-5G')
  AND "manufacturerId" = 'mfr_unknown';

-- Grace Bio-Labs (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_grace-bio-labs_6jzliz'
WHERE "sku" IN ('405278')
  AND "manufacturerId" = 'mfr_unknown';

-- Grant Instruments (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_grant-instruments_klrogh'
WHERE "sku" IN ('QBD1', 'QBD2', 'QBD4', 'QBH2')
  AND "manufacturerId" = 'mfr_unknown';

-- Greiner (46 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_greiner_gw1k2m'
WHERE "sku" IN ('450040', '450041', '450066*50', '450089', '450263', '656101', '450181', '655001', '651101', '450530', '606180', '607180', '450545', '454024', '655074', '768180', '661195', '760180', '454023', '115071', '655201', '690195', '455028', '729073', '658195', '655900', '454061', '454036', '710180', '604181', '454064', '420180', '455056', '682060', '781101', '655983', '655986', '450541', '450533', '450427', '655801', '450066*1000', '681675', '681670', '781801', '227290')
  AND "manufacturerId" = 'mfr_unknown';

-- Hach (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hach_wtc614'
WHERE "sku" IN ('246142')
  AND "manufacturerId" = 'mfr_unknown';

-- Hamilton (26 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hamilton_mj19m44b'
WHERE "sku" IN ('238317', '238318', '238319', '238321', '238271', '238217', '238218', '238219', '238223', '238272', '238273', '238274', '238275', '238276', '238277', '238278', '238279', '80400', '235904', '235905', '235940', '235939', '235948', '235903', '4639642001', '79427')
  AND "manufacturerId" = 'mfr_unknown';

-- Hampton Research (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hampton-research_3ifp1u'
WHERE "sku" IN ('HR2110')
  AND "manufacturerId" = 'mfr_unknown';

-- Hanna (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hanna_mj19ns7p'
WHERE "sku" IN ('HI7009L', 'HI7006L', 'HI7001L', 'HI7004L')
  AND "manufacturerId" = 'mfr_unknown';

-- Hellma (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hellma_yjrbb0'
WHERE "sku" IN ('730-009-44')
  AND "manufacturerId" = 'mfr_unknown';

-- Hello Bio (4 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hello-bio_mgy7jx'
WHERE "sku" IN ('HB9081', 'HB9081-1', 'HB9081*1', 'HB9081*5')
  AND "manufacturerId" = 'mfr_unknown';

-- HemoCue (9 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hemocue_mj19o8j2'
WHERE "sku" IN ('139172', '139173', '130310', '111735', '110611', '110716', '110718', '111736', '110302')
  AND "manufacturerId" = 'mfr_unknown';

-- HERMLE (1 products)
UPDATE "Product"
SET "manufacturerId" = 'mfr_hermle_m7av97'
WHERE "sku" IN ('716.100')
  AND "manufacturerId" = 'mfr_unknown';
