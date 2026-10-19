// Mangel Halto / Pos Chikito coast: the mangrove coast, the jetty and the rock groynes. Off with ?mangel=0.
// A draws this shore as bare sand running into open sea. Satellite and drone references show dense,
// dark mangrove all along it:
//  - the Mangel Halto peninsula beside the swimming cove
//  - the strip from the jetty to Isla di Oro / La Granja, which stands in the shallow reef flat past the tide line
//  - a 50 m wooden jetty
//  - two short wooden steps into the water
//  - three low rock groynes across the reef flat
// Rebuilt in code from OSM geometry; photos are reference only. 3 draw calls: one InstancedMesh of mangrove
// clumps, one InstancedMesh of groyne rocks, and one merged wooden jetty mesh. Built once when the
// height regions have streamed in, with no per-frame work. Stops west of Savaneta and keeps clear of the
// La Granja hero, roads and the two OSM beaches.
import {
  BoxGeometry, BufferGeometry, Color, DodecahedronGeometry, Euler, IcosahedronGeometry, InstancedMesh, Matrix4,
  Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// OSM natural=wood (mangrove) ways 463354310, 97431471, 97431549, 97431562, 485601319, then the unmapped band between the
// coastline (352778212, 1072277803/04) and the Savaneta road (30420166, 93794360) from the jetty east,
// which satellite shows as one continuous mangrove. It takes in OSM wood 799353403
// (game metres, simplified to 1.5 m).
const POLYS: P[][] = [[[102.4,6175.5],[94.4,6178.3],[92.1,6182.1],[98.5,6192.5],[100.3,6200.8],[92.8,6222.0],[108.0,6232.1],[112.9,6239.1],[97.0,6262.8],[94.4,6280.1],[105.4,6285.1],[111.7,6295.6],[111.0,6306.7],[121.8,6313.7],[129.3,6315.2],[146.4,6315.7],[159.9,6319.0],[173.8,6323.0],[199.3,6335.1],[214.7,6338.9],[228.0,6337.9],[240.7,6332.3],[250.0,6314.2],[256.2,6307.3],[276.9,6302.7],[294.5,6307.6],[299.3,6297.9],[295.0,6288.9],[230.6,6249.3],[191.7,6238.7],[161.8,6226.4],[140.6,6210.3],[111.3,6179.1]],[[490.4,6438.9],[495.2,6436.2],[506.7,6438.8],[510.8,6445.8],[507.9,6458.4],[502.0,6462.5],[496.4,6462.1],[490.1,6461.8],[490.4,6469.4],[495.9,6477.8],[494.0,6481.8],[490.1,6481.7],[480.5,6471.8],[480.8,6450.8]],[[431.4,6379.0],[447.7,6383.0],[464.2,6398.5],[464.5,6404.6],[451.7,6409.7],[447.1,6396.4],[440.0,6390.8],[432.1,6391.6],[428.0,6387.8]],[[582.2,6483.7],[569.9,6483.3],[555.4,6469.6],[549.1,6470.3],[537.4,6466.4],[532.2,6467.9],[524.5,6476.9],[523.6,6487.0],[527.3,6490.3],[541.4,6493.4],[542.6,6498.4],[551.1,6509.8],[552.4,6515.6],[547.2,6524.9],[547.7,6529.1],[556.7,6536.5],[613.7,6525.1],[601.4,6515.5],[598.2,6510.8],[598.4,6501.0],[595.9,6496.7]],[[1359.8,6613.0],[1335.1,6657.5],[1344.1,6681.0],[1317.5,6717.0],[1344.9,6729.5],[1236.0,6786.1],[1168.7,6730.8],[1158.5,6738.8],[1154.4,6747.8],[1196.4,6794.1],[1260.5,6858.9],[1284.4,6872.9],[1305.4,6841.6],[1354.3,6869.4],[1382.3,6896.0],[1422.0,6914.5],[1445.3,6928.4],[1512.9,6952.8],[1517.6,6929.6],[1480.3,6920.3],[1434.9,6894.0],[1373.2,6875.1],[1405.6,6775.6],[1419.6,6761.7],[1439.5,6755.9],[1470.9,6759.4],[1522.2,6773.3],[1524.6,6722.2],[1471.1,6708.6],[1493.9,6639.0],[1518.6,6597.7],[1554.6,6578.7],[1563.2,6559.2],[1566.9,6543.6],[1567.4,6522.2],[1564.8,6506.4],[1561.8,6502.0],[1555.8,6502.0],[1539.6,6509.6],[1527.8,6506.1],[1523.2,6508.9],[1520.9,6524.1],[1517.2,6527.5],[1496.1,6530.7],[1496.3,6562.9],[1491.7,6572.8],[1490.1,6585.6],[1478.3,6606.1],[1478.1,6627.5],[1482.5,6648.4],[1482.0,6658.5],[1469.7,6682.8],[1454.9,6698.5],[1452.8,6714.3],[1448.9,6724.0],[1442.0,6736.2],[1414.9,6742.6],[1395.2,6750.2],[1392.2,6754.3],[1392.5,6759.4],[1398.9,6779.4],[1398.9,6786.0],[1395.5,6790.6],[1386.2,6795.7],[1375.1,6796.6],[1366.5,6789.2],[1360.8,6788.8],[1346.7,6797.5],[1338.3,6823.2],[1326.5,6835.4],[1299.5,6840.9],[1283.0,6847.6],[1266.6,6848.3],[1257.6,6841.2],[1254.1,6820.0],[1234.4,6814.3],[1228.2,6805.8],[1226.4,6795.7],[1229.4,6791.5],[1234.4,6790.8],[1277.0,6792.7],[1292.8,6786.9],[1301.1,6780.0],[1314.7,6762.6],[1349.7,6733.4],[1381.1,6684.7],[1407.7,6665.8],[1417.0,6652.3],[1432.7,6637.1],[1435.3,6620.1],[1424.4,6588.9],[1424.6,6572.1],[1429.9,6562.4],[1429.3,6550.9],[1438.5,6538.5],[1447.5,6513.3],[1452.6,6490.5],[1462.1,6477.6],[1475.1,6468.9],[1480.4,6469.6],[1495.4,6478.1],[1502.4,6470.8],[1501.7,6459.7],[1479.4,6450.3],[1475.8,6446.6],[1464.9,6413.3],[1457.7,6403.9],[1446.6,6400.7],[1424.2,6399.8],[1420.2,6403.0],[1414.7,6435.4],[1397.6,6461.3],[1394.1,6471.4],[1385.1,6538.3],[1385.1,6543.6],[1389.5,6546.1],[1408.0,6546.8],[1417.5,6553.0],[1416.1,6562.0],[1404.5,6580.6],[1403.1,6591.6],[1385.5,6593.2],[1370.3,6586.3],[1364.7,6586.6],[1360.1,6590.0],[1352.9,6597.6],[1351.7,6602.6]],[[533.4,6483.2],[557.1,6499.5],[565.4,6538.9],[592.5,6566.0],[666.7,6629.4],[688.4,6655.0],[694.8,6670.6],[692.6,6692.5],[699.2,6722.4],[719.7,6749.4],[778.0,6764.1],[826.8,6790.7],[848.4,6806.6],[868.2,6814.1],[887.9,6814.7],[925.0,6796.5],[949.6,6803.4],[965.8,6826.4],[973.9,6855.0],[973.9,6873.8],[979.4,6887.7],[988.0,6898.3],[1005.5,6912.4],[1020.8,6914.6],[1037.6,6920.7],[1050.0,6933.4],[1053.6,6949.6],[1037.5,7015.7],[1013.7,7060.8],[1014.0,7068.6],[1024.5,7079.3],[1029.9,7081.4],[1038.5,7096.1],[1043.3,7099.0],[1051.2,7098.1],[1053.6,7092.7],[1049.5,7077.0],[1053.9,7074.4],[1063.5,7075.5],[1083.7,7084.3],[1089.5,7092.1],[1087.7,7105.4],[1082.0,7113.1],[1080.9,7120.4],[1092.1,7133.1],[1112.1,7145.0],[1135.5,7152.3],[1147.8,7154.3],[1173.3,7149.6],[1201.7,7151.6],[1217.7,7157.2],[1236.1,7174.2],[1240.8,7184.6],[1244.6,7214.2],[1250.9,7219.5],[1260.5,7221.1],[1270.5,7217.1],[1278.2,7217.1],[1301.3,7232.2],[1316.6,7235.9],[1330.2,7235.8],[1348.6,7242.0],[1398.6,7269.5],[1416.5,7288.0],[1429.7,7294.3],[1427.5,7132.4],[1364.3,7057.6],[1265.6,6894.8],[1195.6,6819.3],[1181.0,6810.5],[1155.6,6807.1],[1139.1,6801.8],[961.2,6706.8],[915.2,6666.4],[671.0,6427.6],[522.5,6448.3]]];
// OSM coastline 352778212 / 1072277803 / 1072277804 from the jetty to Isla di Oro: the mangrove stands past it in the reef flat
const COAST: P[] = [[533.4,6483.2],[557.1,6499.5],[565.4,6538.9],[592.5,6566.0],[666.7,6629.4],[688.4,6655.0],[694.8,6670.6],[692.6,6692.5],[699.2,6722.4],[719.7,6749.4],[750.9,6756.0],[778.0,6764.1],[826.8,6790.7],[848.4,6806.6],[868.2,6814.1],[887.9,6814.7],[904.5,6806.7],[925.0,6796.5],[949.6,6803.4],[965.8,6826.4],[973.9,6855.0],[973.9,6873.8],[979.4,6887.7],[988.0,6898.3],[1005.5,6912.4],[1020.8,6914.6],[1037.6,6920.7],[1037.6,6920.7],[1050.0,6933.4],[1053.6,6949.6],[1037.5,7015.7],[1019.8,7048.3],[1013.7,7060.8],[1014.0,7068.6],[1024.5,7079.3],[1029.9,7081.4],[1035.4,7090.5],[1038.5,7096.1],[1043.3,7099.0],[1051.2,7098.1],[1053.6,7092.7],[1050.1,7082.4],[1049.5,7077.0],[1053.9,7074.4],[1063.5,7075.5],[1083.7,7084.3],[1089.5,7092.1],[1087.7,7105.4],[1082.0,7113.1],[1080.9,7120.4],[1092.1,7133.1],[1112.1,7145.0],[1135.5,7152.3],[1147.8,7154.3],[1173.3,7149.6],[1201.7,7151.6],[1217.7,7157.2],[1236.1,7174.2],[1240.8,7184.6],[1240.8,7184.6],[1242.7,7199.0],[1244.6,7214.2],[1250.9,7219.5],[1256.1,7220.3],[1260.5,7221.1],[1266.0,7218.8],[1270.5,7217.1],[1274.4,7217.0],[1278.2,7217.1],[1281.4,7218.0],[1284.5,7221.2],[1290.8,7225.7],[1301.3,7232.2],[1316.6,7235.9],[1330.2,7235.8],[1348.6,7242.0],[1361.7,7249.5],[1373.4,7254.9],[1383.7,7260.3],[1398.6,7269.5],[1404.9,7277.1],[1410.9,7283.1],[1416.5,7288.0],[1423.6,7291.5],[1429.7,7294.3]];
const ROADS: number[][] = [[1148.2,6804.8,1139.1,6801.8],[1139.1,6801.8,1103.1,6782.0],[999.3,6727.6,976.0,6715.3],[976.0,6715.3,961.2,6706.8],[961.2,6706.8,947.7,6696.6],[947.7,6696.6,915.2,6666.4],[915.2,6666.4,671.0,6427.6],[1525.3,6969.5,1529.3,6954.9],[1529.3,6954.9,1532.4,6933.9],[1532.4,6933.9,1531.0,6921.7],[1531.0,6921.7,1533.4,6909.9],[1138.9,6747.1,1162.1,6730.3],[1162.1,6730.3,1185.1,6716.9],[1185.1,6716.9,1194.1,6711.3],[1309.1,6666.3,1317.4,6662.0],[1317.4,6662.0,1321.2,6659.0],[1321.2,6659.0,1324.8,6655.6],[1324.8,6655.6,1328.3,6650.1],[1328.3,6650.1,1331.8,6643.9],[1331.8,6643.9,1346.6,6606.3],[1346.6,6606.3,1354.4,6583.7],[1354.4,6583.7,1365.7,6555.2],[1365.7,6555.2,1371.3,6540.5],[1371.3,6540.5,1375.3,6526.6],[1375.3,6526.6,1376.0,6511.0],[660.3,6439.6,809.0,6580.7],[1148.2,6804.8,1155.6,6807.1],[1155.6,6807.1,1162.4,6808.1],[1162.4,6808.1,1168.2,6809.0],[1168.2,6809.0,1174.6,6809.8],[1174.6,6809.8,1181.0,6810.5],[1181.0,6810.5,1187.0,6813.1],[1187.0,6813.1,1190.8,6815.6],[1190.8,6815.6,1195.6,6819.3],[1195.6,6819.3,1200.8,6824.8],[1200.8,6824.8,1206.6,6829.9],[1206.6,6829.9,1216.0,6841.6],[1226.2,6851.8,1265.6,6894.8],[1265.6,6894.8,1276.1,6909.8],[1276.1,6909.8,1287.4,6929.3],[1340.7,7021.3,1351.2,7038.3],[1351.2,7038.3,1364.3,7057.6],[1364.3,7057.6,1396.9,7096.0],[1396.9,7096.0,1427.5,7132.4],[1427.5,7132.4,1466.9,7184.0],[1466.9,7184.0,1592.0,7351.9],[1546.3,6885.0,1401.1,6843.5],[1561.0,6825.0,1431.8,6791.1],[1522.0,6433.8,1511.2,6449.6],[1378.5,6499.2,1384.4,6484.1],[1384.4,6484.1,1391.8,6464.8],[1391.8,6464.8,1413.0,6418.0],[1413.0,6418.0,1414.1,6414.4],[1414.1,6414.4,1414.6,6411.1],[1414.6,6411.1,1414.5,6408.1],[1414.5,6408.1,1413.8,6404.9],[1413.8,6404.9,1411.4,6401.2],[1411.4,6401.2,1408.5,6398.9],[1408.5,6398.9,1405.8,6397.8],[1405.8,6397.8,1401.6,6397.3],[1401.6,6397.3,1396.9,6397.3],[1396.9,6397.3,1370.5,6396.5],[1508.2,7017.9,1525.3,6969.5],[1408.5,6398.9,1417.7,6396.5],[1417.7,6396.5,1442.7,6395.9],[1442.7,6395.9,1452.6,6394.7],[1452.6,6394.7,1459.5,6395.6],[1459.5,6395.6,1465.6,6398.6],[1465.6,6398.6,1468.6,6402.7],[1468.6,6402.7,1474.4,6439.0],[1474.4,6439.0,1477.8,6445.2],[1477.8,6445.2,1483.2,6447.8],[1483.2,6447.8,1490.1,6447.8],[1490.1,6447.8,1499.6,6445.7],[1499.6,6445.7,1506.2,6446.4],[1506.2,6446.4,1507.9,6447.0],[1507.9,6447.0,1511.2,6449.6],[1511.2,6449.6,1511.7,6453.7],[1511.7,6453.7,1508.9,6472.1],[1508.9,6472.1,1510.2,6477.2],[1510.2,6477.2,1517.8,6480.0],[1517.8,6480.0,1524.6,6479.7],[1524.6,6479.7,1546.8,6468.6],[1561.3,6472.7,1566.9,6503.0],[1566.9,6503.0,1572.7,6521.8],[1572.7,6521.8,1580.6,6533.5],[1580.6,6533.5,1581.7,6540.6],[1581.7,6540.6,1580.6,6547.5],[1580.6,6547.5,1568.4,6570.1],[1568.4,6570.1,1564.6,6587.1],[1564.6,6587.1,1562.9,6594.4],[1562.9,6594.4,1567.2,6602.8],[1533.0,6694.1,1525.8,6699.9],[1525.8,6699.9,1490.3,6692.8],[1490.3,6692.8,1486.5,6684.7],[1486.5,6684.7,1501.9,6634.4],[1501.9,6634.4,1522.6,6606.2],[1522.6,6606.2,1546.2,6595.0],[1546.2,6595.0,1564.6,6587.1],[1564.6,6587.1,1588.7,6579.0],[1604.9,6541.7,1604.6,6575.9],[531.4,6421.5,529.9,6428.6],[529.9,6428.6,529.5,6432.2],[529.5,6432.2,528.3,6436.7],[528.3,6436.7,522.5,6448.3],[466.5,6407.1,473.9,6382.1],[473.9,6382.1,490.9,6345.7],[522.5,6448.3,533.8,6455.0],[533.8,6455.0,552.6,6464.1],[552.6,6464.1,560.3,6467.9],[560.3,6467.9,569.0,6474.0],[569.0,6474.0,580.8,6479.9],[580.8,6479.9,592.5,6487.0],[592.5,6487.0,600.5,6493.5],[600.5,6493.5,607.4,6500.0],[522.5,6448.3,517.3,6443.7],[517.3,6443.7,504.6,6434.7],[504.6,6434.7,490.3,6424.9],[490.3,6424.9,466.5,6407.1],[1105.7,6709.5,1138.9,6747.1],[1138.9,6747.1,1175.9,6786.2],[1175.9,6786.2,1184.2,6795.3],[1184.2,6795.3,1237.1,6851.8],[667.6,6647.4,681.9,6632.0],[681.9,6632.0,707.1,6633.7],[736.1,6607.2,759.9,6579.8],[1275.7,6886.5,1303.6,6909.7],[1237.1,6851.8,1275.7,6886.5],[1352.0,6948.8,1374.7,6914.4],[1374.7,6914.4,1375.3,6910.9],[1375.3,6910.9,1374.8,6906.3],[1374.8,6906.3,1372.9,6902.8],[1372.9,6902.8,1353.4,6890.3],[1400.6,6984.9,1430.7,6945.6],[1430.7,6945.6,1433.9,6942.9],[1433.9,6942.9,1438.3,6941.0],[1438.3,6941.0,1444.0,6940.3],[1444.0,6940.3,1450.5,6940.3],[1450.5,6940.3,1454.4,6941.4],[1441.1,7014.1,1400.1,7076.5],[1391.5,7070.7,1388.5,7065.8],[1388.5,7065.8,1388.5,7063.2],[1388.5,7063.2,1390.6,7059.5]];
// A building footprints (region data) inside the mangrove areas, as bboxes padded 3 m
const BLD: number[][] = [[799.4,6585.3,812.7,6597.4],[771.8,6561.7,796.1,6582.8],[761.0,6546.8,781.5,6573.0],[752.5,6538.7,773.5,6559.3],[737.1,6535.9,758.0,6556.1],[713.5,6511.8,749.7,6545.6],[668.9,6472.7,689.7,6491.7],[687.2,6482.8,709.2,6505.3],[682.1,6478.4,700.8,6497.1],[653.9,6465.4,675.3,6487.9],[635.9,6458.0,657.7,6481.1],[617.0,6455.5,635.8,6479.3],[607.9,6442.8,626.9,6467.4],[610.2,6470.8,624.4,6489.2],[599.3,6463.8,617.6,6483.6],[591.3,6437.1,604.8,6450.9],[573.2,6445.7,590.1,6458.4],[603.6,6437.1,616.4,6451.4],[271.4,6257.6,291.7,6279.3],[244.6,6309.0,265.4,6329.5],[1075.7,6792.6,1094.9,6811.2],[1327.9,6964.7,1369.9,7010.1],[1344.2,6644.9,1360.1,6661.1],[1182.5,6714.4,1219.0,6751.8],[1409.1,6915.6,1433.6,6950.3],[1323.6,6861.5,1360.0,6902.0],[1360.2,7007.8,1420.1,7060.3],[1394.1,6560.3,1411.3,6580.1],[1370.0,6575.8,1389.0,6593.0]];
const PIERS: { w: number; p: P[] }[] = [
  { w: 2.4, p: [[522.5, 6448.3], [500.4, 6491.0], [496.5, 6498.8]] }, // way 799353401, the jetty
  { w: 1.5, p: [[311.9, 6330.6], [319.4, 6320.7]] }, // way 972828316
  { w: 1.5, p: [[387.9, 6389.5], [393.7, 6378.6]] }, // way 972828317
];
const GROYNES: P[][] = [ // OSM man_made=breakwater 885056861-63
  [[260.6, 6357.3], [267.2, 6361.3], [277.9, 6364.7], [287.9, 6372.4], [300.0, 6375.1]],
  [[320.0, 6380.3], [332.5, 6387.8], [339.6, 6390.7], [344.8, 6395.0], [356.8, 6401.3]],
  [[378.7, 6428.4], [399.6, 6438.1], [412.1, 6445.6], [426.2, 6450.6], [456.9, 6463.9]],
];
const BEACHES: P[][] = [ // OSM natural=beach 1083055160, 1083055163 stay open sand
  [[451.7, 6409.7], [465.9, 6409.1], [483.4, 6423.4], [483.4, 6429.7], [480.4, 6433.3], [463.5, 6429.1], [455.3, 6422.8]],
  [[244.9, 6330.3], [254.6, 6332.6], [267.2, 6321.2], [297.3, 6311.3], [305.6, 6310.7], [299.0, 6308.0], [287.0, 6307.8], [277.2, 6304.2], [256.2, 6307.3], [246.9, 6316.7], [244.6, 6325.2]],
];
const KEEP_CLEAR: number[][] = [[1355, 6982, 45]]; // lagranja_sav hero (x, z, r)

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
function lineDist(x: number, z: number, p: P[]) {
  let m = 1e9; for (let i = 1; i < p.length; i++) m = Math.min(m, segDist(x, z, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1])); return m;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class MangelHalto {
  stats = { built: false, clumps: 0, placed: 0, rocks: 0, pierTris: 0, ms: 0 };
  private timer = 0;
  private im: InstancedMesh | null = null;
  private pending = new Map<string, number[][]>(); // region key -> mangrove spots waiting for heights
  private shoreDone = false;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  private key(W: World, x: number, z: number) { return `${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`; }

  /** The coast spans several 1 km height regions: each part is placed once its region has heights. */
  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const t0 = performance.now();
    const low = (this.g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    if (!this.im) this.im = this.mangroves(W, low);
    const ready = new Set<string>();
    for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
    for (const [k, list] of this.pending) if (ready.has(k)) { this.place(list, h); this.pending.delete(k); }
    if (!this.shoreDone) {
      const keys = new Set<string>();
      for (const pr of PIERS) for (const [x, z] of pr.p) keys.add(this.key(W, x, z));
      for (const gr of GROYNES) for (const [x, z] of gr) keys.add(this.key(W, x, z));
      if ([...keys].every((k) => ready.has(k))) { this.g.scene.add(this.groynes(h), this.piers(h)); this.shoreDone = true; }
    }
    if (this.shoreDone && !this.pending.size) { window.clearInterval(this.timer); this.stats.built = true; }
    this.stats.ms += Math.round(performance.now() - t0);
  }

  private clear(x: number, z: number) {
    for (const [ax, az, bx, bz] of ROADS) if (segDist(x, z, ax, az, bx, bz) < 6) return false;
    for (const b of BEACHES) if (inside(b, x, z)) return false;
    for (const [x0, z0, x1, z1] of BLD) if (x > x0 && x < x1 && z > z0 && z < z1) return false;
    for (const pr of PIERS) if (lineDist(x, z, pr.p) < 6) return false;
    for (const [cx, cz, r] of KEEP_CLEAR) if (Math.hypot(x - cx, z - cz) < r) return false;
    return true;
  }

  private mangroves(W: World, low: boolean): InstancedMesh {
    const spots: number[][] = [];
    for (const poly of POLYS) {
      // big interiors read as one canopy from the road and the sea: wider spacing, bigger clumps there
      let area = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) area += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
      const step = (low ? 8.5 : 6) * (Math.abs(area / 2) > 40000 ? 1.4 : 1);
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (const [x, z] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
      for (let x = x0; x <= x1; x += step) for (let z = z0; z <= z1; z += step) {
        const px = x + (hash(x, z) - 0.5) * step * 0.8, pz = z + (hash(z, x) - 0.5) * step * 0.8;
        if (inside(poly, px, pz) && this.clear(px, pz)) spots.push([px, pz, step]);
      }
    }
    // seaward fringe: OSM coastlines keep land on the left, so the sea is on the right
    const fs = low ? 6 : 4.5;
    for (let i = 1; i < COAST.length; i++) {
      const [ax, az] = COAST[i - 1], [bx, bz] = COAST[i], L = Math.hypot(bx - ax, bz - az);
      if (L < 0.01) continue;
      const nx = -(bz - az) / L, nz = (bx - ax) / L;
      for (let s = 0; s < L; s += fs) for (const off of low ? [3, 11] : [2, 8, 14]) {
        const o = off + hash(s + i, off) * 3;
        const px = ax + ((bx - ax) * s) / L + nx * o, pz = az + ((bz - az) * s) / L + nz * o;
        if (this.clear(px, pz)) spots.push([px, pz, fs * 1.3]);
      }
    }
    for (const sp of spots) { const k = this.key(W, sp[0], sp[1]); let l = this.pending.get(k); if (!l) this.pending.set(k, (l = [])); l.push(sp); }
    const geo = new IcosahedronGeometry(1, 0);
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, spots.length); im.name = "aw:mangel:mangroves"; im.castShadow = false; im.receiveShadow = !low;
    im.count = 0; im.frustumCulled = false; // grows region by region; bounds are recomputed as it does
    const dim = new Color(0x4a5a70);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    this.g.scene.add(im);
    return im;
  }

  private place(list: number[][], h: (x: number, z: number) => number) {
    const im = this.im!, m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tones = [0x1b4a22, 0x22552a, 0x2c5e27, 0x1e4626, 0x355f2c, 0x3a6a2e];
    for (const [x, z, st] of list) {
      const i = im.count++;
      const r = st * 0.55 + hash(x * 3, z) * 1.6, y = Math.max(0, h(x, z));
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * 1.2, r * 0.75, r * 1.2); p.set(x, y + r * 0.75 + 0.3, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tones[Math.floor(hash(x * 2, z * 2) * tones.length) % tones.length]));
    }
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); im.frustumCulled = true;
    this.stats.placed = im.count;
  }

  private groynes(h: (x: number, z: number) => number): InstancedMesh {
    const spots: number[][] = [];
    for (const g of GROYNES) for (let i = 1; i < g.length; i++) {
      const [ax, az] = g[i - 1], [bx, bz] = g[i], L = Math.hypot(bx - ax, bz - az);
      for (let s = 0; s < L; s += 1.7) spots.push([ax + ((bx - ax) * s) / L, az + ((bz - az) * s) / L]);
    }
    const im = new InstancedMesh(new DodecahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:mangel:groynes"; im.castShadow = false;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    spots.forEach(([x, z], i) => {
      const r = 0.7 + hash(x, z) * 0.6, jx = (hash(z, x) - 0.5) * 1.2, jz = (hash(x + 1, z) - 0.5) * 1.2;
      e.set(hash(x, 2) * 3, hash(3, z) * 3, 0); q.setFromEuler(e);
      s.set(r * 1.2, r * 0.6, r); p.set(x + jx, Math.max(-0.2, h(x, z)) + r * 0.25, z + jz); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(hash(x * 5, z) < 0.5 ? 0x9a9284 : 0x857d70));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); this.stats.rocks = spots.length;
    return im;
  }

  /** Wooden decks on posts, merged into one mesh. */
  private piers(h: (x: number, z: number) => number): Mesh {
    const parts: BufferGeometry[] = [];
    const mtx = new Matrix4(), q = new Quaternion(), Y = new Vector3(0, 1, 0);
    const box = (cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw: number) => {
      const b = new BoxGeometry(sx, sy, sz); q.setFromAxisAngle(Y, yaw);
      mtx.compose(new Vector3(cx, cy, cz), q, new Vector3(1, 1, 1)); b.applyMatrix4(mtx); parts.push(b.toNonIndexed());
    };
    for (const pr of PIERS) for (let i = 1; i < pr.p.length; i++) {
      const [ax, az] = pr.p[i - 1], [bx, bz] = pr.p[i], L = Math.hypot(bx - ax, bz - az), yaw = Math.atan2(-(bz - az), bx - ax);
      const mx = (ax + bx) / 2, mz = (az + bz) / 2, deck = Math.max(1.0, Math.max(h(ax, az), h(bx, bz)) + 0.35);
      box(mx, deck, mz, L + 0.2, 0.22, pr.w, yaw); // deck planks
      const ux = (bx - ax) / L, uz = (bz - az) / L, nx = -uz, nz = ux;
      for (let s = 0; s <= L; s += 3) for (const sd of [1, -1]) { // posts and handrail stanchions
        const px = ax + ux * s + nx * sd * (pr.w / 2 - 0.1), pz = az + uz * s + nz * sd * (pr.w / 2 - 0.1);
        const base = Math.min(h(px, pz), 0) - 0.6;
        box(px, (base + deck + 0.9) / 2, pz, 0.2, deck + 0.9 - base, 0.2, yaw);
      }
      for (const sd of [1, -1]) box(mx + nx * sd * (pr.w / 2 - 0.1), deck + 0.9, mz + nz * sd * (pr.w / 2 - 0.1), L, 0.1, 0.12, yaw); // rails
    }
    const geo = mergeGeometries(parts)!; parts.forEach((p) => p.dispose());
    const mat = new MeshLambertMaterial({ color: 0x8c6b4c });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:mangel:piers"; mesh.castShadow = true; mesh.receiveShadow = true;
    this.stats.pierTris = (geo.attributes.position.count / 3) | 0;
    return mesh;
  }
}
