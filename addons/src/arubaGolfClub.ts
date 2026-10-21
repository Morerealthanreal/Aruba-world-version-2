// Aruba Golf Club (Golfweg, Lago Heights / Juwana Morto, east of San Nicolas) accuracy pass. Off with ?agc=0.
// A draws the course as a flat khaki-yellow park fill dotted with coconut palms and bright round shrubs.
// The real 1941 Lago-era course is a 9-hole desert course: pale tan sand and crushed-stone ground with dry
// grass patches, its "greens" are round discs of oiled sand (dark grey-brown, no turf), each with a flag pin,
// and it is lined and dotted with dark grey-green thorn-tree clumps; there are no palms on the course.
// Geometry is OSM (course 376593021; tree clumps on the course 627174078 / 627174081 / 627174084 /
// 627174086 / 627174089 / 627192712 / 628177119; dry forest and scrub around it 627174071 / 627174092 /
// 627174102 / 627192711) plus A's road and building data. The oiled-sand green positions were read off
// satellite imagery by eye; imagery was looked at only, nothing is traced into the repo.
// 3 draw calls: one vertex-coloured ground sheet (sand tint + green discs) draped on A's terrain, one
// InstancedMesh of thorn-tree crowns, and one merged props mesh (flag pins, flags, a few stones).
// Built once when the height regions have streamed in; per frame only a night colour lerp.
// A's palms and shrubs inside the course outline are dropped through the shared __awVegHit hook.
// Stays inside x 8240-9300, z 7140-7990: east of Juwana Mortostraat, west of Golfweg, far from San Nicolas town.
import {
  BufferGeometry, Color, CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// game metres (x east, z south). COURSE: OSM leisure=golf_course outline (simplified 2.5 m). INNER: OSM
// tree clumps on the course. EDGE: OSM dry forest / scrub that wraps the course (only its band next to the
// course is planted). GREENS: oiled-sand green centres. ROADS: A's road segments [ax, az, bx, bz, keep-clear
// radius]. BLD: A's building footprints near the course, as bboxes padded 3 m.
const COURSE: P[] = [[8320.9,7296.1],[8310.2,7417.6],[8314.4,7430.1],[8308.2,7492.2],[8316.7,7527.4],[8332.2,7565.9],[8362.5,7613.0],[8467.5,7603.5],[8504.4,7817.1],[8518.8,7825.4],[8513.8,7921.6],[9214.0,7781.1],[9217.3,7761.5],[9182.0,7694.1],[9184.6,7636.9],[9170.3,7589.7],[9135.0,7508.7],[9089.3,7412.1],[9021.4,7367.1],[8886.5,7341.4],[8732.7,7272.7],[8717.1,7223.9],[8590.3,7273.3],[8527.5,7303.2],[8509.6,7331.5],[8482.2,7347.9],[8391.6,7348.0],[8375.9,7328.1],[8344.2,7299.3]];
const INNER: P[][] = [[[8591.8,7354.7],[8611.9,7343.4],[8641.3,7312.1],[8668.1,7290.8],[8680.2,7286.2],[8693.6,7290.8],[8696.9,7309.4],[8694.2,7326.1],[8681.5,7337.4],[8660.7,7337.4],[8653.4,7355.3]],[[8496.7,7398.1],[8479.0,7394.6],[8475.1,7401.6],[8434.0,7401.2],[8425.6,7409.5],[8435.3,7423.1],[8447.2,7428.8],[8456.1,7427.1],[8465.3,7434.1],[8467.1,7442.4],[8487.0,7445.9],[8510.9,7422.2],[8495.4,7417.4],[8482.1,7426.2],[8476.4,7425.7],[8463.1,7418.3],[8460.9,7412.6],[8494.5,7403.4]],[[8448.1,7524.0],[8466.7,7510.4],[8517.9,7496.8],[8528.5,7499.0],[8528.1,7506.5],[8518.8,7514.4],[8501.6,7511.8],[8491.0,7515.3],[8483.5,7526.2]],[[8362.5,7613.0],[8375.7,7597.8],[8390.2,7597.3],[8410.1,7589.0],[8464.0,7600.8],[8483.0,7628.9],[8481.7,7668.0],[8471.1,7669.7],[8471.1,7661.4],[8458.1,7658.1],[8450.3,7637.3],[8453.0,7612.2],[8426.3,7607.3],[8403.7,7609.3],[8396.4,7615.3]],[[8393.3,7741.3],[8387.1,7748.3],[8392.9,7756.2],[8392.9,7765.4],[8368.6,7769.3],[8361.1,7784.3],[8372.6,7787.8],[8376.1,7806.6],[8504.4,7817.1],[8498.0,7804.4],[8483.5,7799.2],[8466.2,7805.8],[8450.8,7800.1],[8447.7,7779.9],[8457.8,7767.6],[8476.4,7754.9],[8484.3,7735.6]],[[8578.7,7855.0],[8612.8,7873.9],[8672.5,7858.8],[8696.2,7861.4],[8707.8,7853.0],[8742.8,7859.1],[8752.4,7851.0],[8755.6,7840.9],[8749.8,7834.2],[8730.3,7834.8],[8707.8,7843.2],[8682.5,7841.7],[8677.2,7846.9],[8665.6,7846.6],[8647.5,7852.7],[8629.1,7851.3],[8616.0,7858.8],[8609.0,7857.4],[8600.0,7845.2],[8584.8,7842.9]],[[8703.7,7526.8],[8729.6,7508.7],[8770.2,7500.1],[8779.9,7500.6],[8782.9,7506.7],[8777.3,7513.7],[8744.8,7516.2],[8721.9,7531.0]]];
const EDGE: P[][] = [[[8011.9,7264.1],[8011.9,7290.2],[8020.6,7320.9],[8016.5,7335.4],[7989.1,7369.0],[7981.6,7390.4],[8011.3,7395.0],[8019.5,7404.3],[8023.5,7417.6],[7999.6,7477.2],[7982.4,7480.1],[7948.6,7453.6],[7932.3,7473.6],[7965.2,7488.3],[7963.2,7501.7],[7982.3,7509.6],[7978.1,7524.7],[7982.7,7540.9],[7978.1,7569.3],[7913.4,7575.7],[7906.4,7595.9],[7940.8,7589.6],[7935.5,7602.9],[7951.8,7610.4],[7929.7,7648.6],[7946.8,7652.2],[8028.1,7650.6],[8059.7,7645.1],[8135.5,7615.5],[8155.3,7612.0],[8205.0,7619.0],[8294.8,7616.1],[8312.6,7687.7],[8329.5,7675.0],[8340.0,7638.0],[8362.5,7613.0],[8332.2,7565.9],[8316.7,7527.4],[8308.2,7492.2],[8314.4,7430.1],[8310.2,7417.6],[8311.5,7392.6],[8320.9,7296.1],[8344.2,7299.3],[8391.6,7348.0],[8482.2,7347.9],[8509.6,7331.5],[8527.2,7298.3],[8546.7,7294.1],[8592.8,7272.3],[8717.1,7223.9],[8732.7,7272.7],[8886.5,7341.4],[8920.0,7401.8],[8944.2,7431.6],[8967.5,7440.3],[9059.4,7508.1],[9083.4,7534.8],[9158.4,7555.9],[9181.1,7610.5],[9149.3,7634.7],[9217.3,7761.5],[9140.3,7366.4],[9134.2,7359.5],[9055.7,7355.7],[9027.2,7344.2],[8996.1,7313.6],[8951.5,7322.8],[8801.5,7235.0],[8790.3,7189.9],[8664.4,7205.0],[8491.0,7247.2],[8366.5,7269.2],[8298.5,7272.5],[8233.0,7288.8],[8203.8,7264.8],[8170.3,7257.5],[8138.8,7254.8],[8109.9,7264.0],[8078.0,7265.9]],[[8998.7,8027.7],[9017.9,8038.4],[9013.3,8056.7],[9037.2,8045.3],[9042.5,8050.6],[9064.9,8036.9],[9074.1,8017.0],[9111.8,8005.5],[9131.8,8009.3],[9178.7,8005.5],[9222.6,7996.4],[9257.9,8006.3],[9286.4,7986.4],[9292.6,7974.2],[9311.8,7965.0],[9321.8,7970.4],[9334.1,7966.6],[9340.2,7960.4],[9343.3,7945.9],[9361.6,7909.7],[9377.3,7896.0],[9380.1,7877.7],[9390.5,7867.7],[9424.6,7845.7],[9491.6,7830.3],[9521.6,7811.2],[9531.2,7808.6],[9549.9,7815.0],[9556.3,7811.8],[9562.1,7804.6],[9554.9,7795.0],[9560.4,7789.8],[9577.9,7786.0],[9572.1,7778.8],[9579.3,7769.2],[9567.7,7766.9],[9556.0,7781.7],[9548.7,7779.9],[9549.9,7772.1],[9545.2,7771.3],[9534.2,7781.1],[9525.7,7806.0],[9510.5,7813.0],[9493.8,7812.7],[9469.2,7824.3],[9421.4,7832.1],[9389.6,7852.6],[9381.7,7866.8],[9370.9,7870.9],[9368.0,7877.2],[9342.9,7876.9],[9339.2,7898.1],[9315.0,7930.5],[9305.3,7930.8],[9285.8,7952.8],[9272.1,7932.8],[9250.5,7942.4],[9246.8,7949.9],[9251.7,7960.6],[9248.5,7966.7],[9236.0,7959.5],[9212.7,7960.0],[9191.4,7951.9],[9181.5,7940.1],[9167.5,7932.2],[9152.6,7895.2],[9121.7,7892.6],[9095.8,7896.3],[9090.8,7900.4],[9097.5,7904.7],[9136.3,7904.5],[9152.3,7919.2],[9156.7,7938.0],[9173.0,7946.7],[9174.8,7964.4],[9164.6,7971.6],[9140.1,7977.4],[9138.3,7981.5],[9111.8,7986.7],[9103.4,7994.2],[9075.4,7995.1],[9036.0,7989.6],[9006.6,7973.9],[8993.5,7978.6],[8995.2,7998.0],[8989.7,8004.3],[8999.9,8010.7]],[[8381.3,7887.8],[8383.0,7911.6],[8415.7,7909.2],[8507.2,7920.3],[8516.0,7935.9],[8553.3,7941.7],[8574.3,7937.0],[8585.9,7948.6],[8604.0,7949.8],[8621.5,7981.6],[8642.5,7984.5],[8653.0,8001.3],[8613.3,8003.1],[8609.2,8021.6],[8612.1,8048.8],[8570.2,8033.2],[8557.3,8035.5],[8523.0,8056.9],[8529.9,8118.3],[8548.0,8120.6],[8550.4,8134.5],[8543.9,8147.2],[8506.6,8171.6],[8504.9,8132.2],[8470.5,8129.9],[8471.1,8099.2],[8440.2,8098.0],[8434.3,8135.7],[8359.1,8136.2],[8365.5,8051.8],[8398.6,8049.2],[8394.7,7990.3],[8355.6,7990.3],[8338.2,7904.0]],[[8612.1,8048.8],[8611.8,8111.6],[8650.7,8107.2],[8712.3,8114.9],[8736.7,8106.9],[8761.5,8114.6],[8801.7,8105.6],[8855.9,8115.6],[8865.3,8115.2],[8895.1,8102.3],[8924.2,8100.9],[8946.0,8107.6],[9006.9,8116.2],[9009.3,8143.2],[9014.3,8149.8],[9067.2,8156.5],[9074.5,8171.4],[9134.1,8168.8],[9209.5,8154.8],[9236.6,8152.8],[9259.7,8156.5],[9262.4,8119.5],[9279.8,8100.9],[9305.9,8100.6],[9314.9,8162.1],[9368.2,8165.4],[9390.3,8171.4],[9332.0,8034.1],[9300.4,7970.5],[9292.6,7974.2],[9281.8,7939.6],[9250.3,7885.4],[9229.6,7896.1],[9218.8,7872.4],[9239.6,7862.8],[9204.1,7786.0],[8513.8,7921.6],[8516.0,7935.9],[8554.9,7944.3],[8574.3,7937.0],[8585.9,7948.6],[8604.0,7949.8],[8619.6,7978.8],[8642.5,7984.5],[8651.2,7998.6],[8613.3,8003.1],[8609.2,8021.6]]];
const GREENS: P[] = [[8713.8,7295.7],[8379.2,7376.8],[8777.9,7388.4],[8375.7,7573.6],[8472.5,7567.9],[8894.5,7581.8],[8929.5,7662.8],[9013.5,7660.5],[8521.4,7758.9],[8929.5,7747.4],[8795.4,7834.2],[8882.9,7434.7]];
const ROADS: number[][] = [[8201.6,7255.9,8200.0,7255.5,5.0],[8221.8,7798.9,8201.4,7785.3,3.8],[8223.3,7274.3,8201.6,7255.9,5.0],[8246.2,7282.7,8223.3,7274.3,5.0],[8248.9,7811.6,8221.8,7798.9,3.8],[8249.9,7304.0,8246.2,7282.7,5.0],[8251.2,7314.5,8249.9,7304.0,5.0],[8252.3,7348.2,8252.6,7336.7,5.0],[8252.5,7356.6,8252.3,7348.2,5.0],[8252.6,7327.4,8251.2,7314.5,5.0],[8252.6,7336.7,8252.6,7327.4,5.0],[8252.6,7367.1,8252.5,7356.6,5.0],[8254.2,7277.8,8246.2,7282.7,5.0],[8254.5,7379.1,8252.6,7367.1,5.0],[8261.9,7405.4,8254.5,7379.1,5.0],[8264.3,7273.7,8254.2,7277.8,5.0],[8267.6,7816.9,8248.9,7811.6,3.8],[8268.1,7426.0,8261.9,7405.4,5.0],[8273.3,7535.3,8274.4,7526.5,5.0],[8273.3,7544.2,8273.3,7535.3,5.0],[8273.7,7442.3,8268.1,7426.0,5.0],[8274.0,7551.8,8273.3,7544.2,5.0],[8274.4,7526.5,8276.4,7513.8,5.0],[8275.2,7560.4,8274.0,7551.8,5.0],[8276.4,7513.8,8278.4,7502.3,5.0],[8277.7,7458.2,8273.7,7442.3,5.0],[8278.4,7502.3,8279.7,7491.6,5.0],[8279.5,7468.6,8277.7,7458.2,5.0],[8279.7,7491.6,8280.3,7478.4,5.0],[8280.1,7593.1,8275.2,7560.4,5.0],[8280.3,7478.4,8279.5,7468.6,5.0],[8287.8,7624.4,8200.0,7622.5,5.0],[8287.8,7624.4,8280.1,7593.1,5.0],[8290.4,7267.8,8264.3,7273.7,5.0],[8307.2,7694.6,8287.8,7624.4,5.0],[8318.0,7733.0,8307.2,7694.6,5.0],[8320.6,7952.0,8259.1,7930.1,3.8],[8326.3,7763.0,8318.0,7733.0,5.0],[8326.5,7268.2,8290.4,7267.8,5.0],[8328.0,7770.4,8326.3,7763.0,5.0],[8329.3,7779.7,8328.0,7770.4,5.0],[8329.7,7819.7,8267.6,7816.9,3.8],[8329.7,7819.7,8330.0,7798.4,5.0],[8330.0,7798.4,8329.3,7779.7,5.0],[8330.7,7871.6,8329.7,7819.7,5.0],[8331.4,7156.6,8304.3,7151.0,3.8],[8334.1,7912.9,8330.7,7871.6,5.0],[8341.8,7964.6,8320.6,7952.0,3.8],[8341.8,7964.6,8334.1,7912.9,5.0],[8348.8,7996.1,8341.8,7964.6,5.0],[8352.4,7169.0,8331.4,7156.6,3.8],[8356.0,8027.3,8348.8,7996.1,5.0],[8357.8,7165.6,8352.4,7169.0,3.8],[8358.3,8036.4,8356.0,8027.3,5.0],[8367.0,7162.3,8357.8,7165.6,3.8],[8379.5,7200.0,8352.4,7169.0,3.8],[8383.4,7166.1,8367.0,7162.3,3.8],[8392.8,7257.1,8326.5,7268.2,5.0],[8392.8,7257.1,8393.0,7215.5,3.8],[8393.0,7181.9,8383.4,7166.1,3.8],[8393.0,7200.0,8393.0,7181.9,3.8],[8393.0,7215.5,8379.5,7200.0,3.8],[8393.0,7215.5,8393.0,7200.0,3.8],[8456.2,7248.8,8392.8,7257.1,5.0],[8559.2,7226.8,8456.2,7248.8,5.0],[8654.7,7200.0,8559.2,7226.8,5.0],[8662.4,7197.8,8654.7,7200.0,5.0],[8766.7,7182.9,8662.4,7197.8,5.0],[8874.5,7169.6,8766.7,7182.9,5.0],[8929.1,7272.2,8968.0,7280.6,5.0],[8968.0,7280.6,9007.8,7313.3,5.0],[8992.3,7150.0,8874.5,7169.6,5.0],[9007.8,7313.3,9040.2,7338.8,5.0],[9035.3,7147.0,8992.3,7150.0,5.0],[9040.2,7338.8,9066.3,7348.9,5.0],[9066.3,7348.9,9143.7,7352.7,5.0],[9082.7,7143.3,9035.3,7147.0,5.0],[9106.0,7106.1,9110.5,7141.2,5.0],[9110.5,7141.2,9082.7,7143.3,5.0],[9110.5,7141.2,9112.6,7156.4,5.0],[9111.4,7075.2,9106.0,7106.1,5.0],[9112.6,7156.4,9119.5,7200.0,5.0],[9119.5,7200.0,9143.7,7352.7,5.0],[9143.7,7352.7,9187.2,7577.7,5.0],[9171.7,7757.4,9151.4,7750.2,3.8],[9187.2,7577.7,9200.0,7643.9,5.0],[9200.0,7575.2,9187.2,7577.7,3.8],[9200.0,7643.9,9223.6,7766.2,5.0],[9200.0,7773.8,9171.7,7757.4,3.8],[9203.2,7775.7,9200.0,7773.8,3.8],[9223.6,7766.2,9236.3,7831.6,5.0],[9236.3,7831.6,9203.2,7775.7,3.8],[9236.3,7831.6,9281.5,7927.3,5.0],[9281.5,7927.3,9320.7,8001.5,5.0],[9315.7,7552.5,9200.0,7575.2,3.8],[9320.7,8001.5,9402.4,8177.2,5.0],[9330.1,7618.2,9401.6,7523.0,3.8],[9368.9,7761.7,9330.1,7618.2,3.8],[9375.8,7531.3,9315.7,7552.5,3.8]];
const BLD: number[][] = [[8289.2,7149.1,8308.5,7160.3],[8289.1,7143.3,8306.8,7152.4],[8315.4,7127.9,8332.6,7145.7],[8315.8,7122.7,8334.7,7132.9],[9093.9,7694.8,9139.0,7733.3],[8925.8,7251.4,8959.9,7267.8],[8911.7,7244.0,8927.5,7262.0],[9162.3,7774.8,9171.8,7785.8],[9068.5,7761.9,9077.5,7778.2],[9047.1,7709.5,9063.3,7726.4],[9081.4,7727.1,9109.7,7751.1],[9084.4,7726.8,9101.1,7740.8],[8388.1,8013.1,8398.9,8029.2],[8272.4,7943.1,8283.7,7952.0],[8254.5,7961.4,8265.4,7972.9],[8253.5,7956.4,8264.8,7965.4],[8253.8,7950.7,8265.0,7961.9],[8244.4,7936.6,8260.7,7947.5],[8244.4,7940.1,8260.1,7954.4],[8241.0,7939.3,8249.3,7949.4],[8261.8,7773.1,8275.9,7791.7],[8201.0,7750.6,8213.4,7761.6],[8338.3,7715.6,8348.8,7725.6],[8366.3,7742.0,8376.9,7753.8],[8492.6,7871.2,8504.3,7902.4],[8393.2,7825.6,8406.4,7836.4],[8376.6,7812.9,8386.1,7832.4],[8384.4,7837.8,8401.3,7857.5],[8375.8,7858.9,8401.2,7880.0],[8423.3,7893.6,8439.6,7902.6],[8410.9,7886.7,8421.9,7905.8],[8383.4,7898.1,8397.6,7910.4],[8355.6,7943.1,8375.2,7962.7],[8370.0,7938.0,8386.6,7955.1],[8308.9,8026.3,8326.7,8044.3],[8319.3,8023.9,8351.1,8051.9],[8368.4,8021.9,8390.2,8040.6],[8366.1,8000.1,8378.6,8017.1],[9227.6,7875.4,9245.8,7892.4]];
const X_W = 8240, X_E = 9300, Z_N = 7140, Z_S = 7990;
const BAND = 40; // how far outside the course outline the edge forest is planted
const GR = 8.5; // oiled-sand green radius (about 17 m across on the imagery)

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
const smooth = (a: number, b: number, v: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const a = p[i], b = p[j];
    if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function ringDist(p: P[], x: number, z: number) {
  let m = 1e9; for (let i = 0, j = p.length - 1; i < p.length; j = i++) m = Math.min(m, segDist(x, z, p[j][0], p[j][1], p[i][0], p[i][1])); return m;
}
/** signed distance to the course outline: negative inside */
const sdCourse = (x: number, z: number) => (inside(COURSE, x, z) ? -1 : 1) * ringDist(COURSE, x, z);
/** smooth value noise, 0..1, cell size s */
function vnoise(x: number, z: number, s: number) {
  const fx = x / s, fz = z / s, ix = Math.floor(fx), iz = Math.floor(fz), tx = fx - ix, tz = fz - iz;
  const u = tx * tx * (3 - 2 * tx), v = tz * tz * (3 - 2 * tz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const dGreen = (x: number, z: number) => { let m = 1e9; for (const [gx, gz] of GREENS) m = Math.min(m, Math.hypot(x - gx, z - gz)); return m; };
function clear(x: number, z: number, pad = 0) {
  for (const [ax, az, bx, bz, r] of ROADS) if (segDist(x, z, ax, az, bx, bz) < r + pad) return false;
  for (const [x0, z0, x1, z1] of BLD) if (x > x0 - pad && x < x1 + pad && z > z0 - pad && z < z1 + pad) return false;
  return true;
}
/** Colour every vertex of a geometry and drop uvs, so differently built parts can be merged. */
function paint(g: BufferGeometry, hex: number, jitter = 0, seed = 0) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const c = new Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3);
  const k = 1 + (hash(seed, 3.7) - 0.5) * jitter;
  for (let i = 0; i < n; i++) { a[i * 3] = c.r * k; a[i * 3 + 1] = c.g * k; a[i * 3 + 2] = c.b * k; }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  return geo;
}

type Region = { rx: number; rz: number; H?: unknown; vegCache?: unknown };
type World = { heightAt(x: number, z: number): number; regions: Map<string, Region>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean };

export class ArubaGolfClub {
  stats = { built: false, tintQuads: 0, greens: 0, crowns: 0, flags: 0, vegHidden: 0, ms: 0 };
  private timer = 0;
  constructor(private g: AGame) {
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** Drop A's palms and round shrubs inside the course outline: the real course has neither. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if ((n === "p" || n === "s") && x > X_W && x < X_E && z > Z_N && z < Z_S && inside(COURSE, x, z)) { this.stats.vegHidden++; return true; }
      return prev ? prev(x, z, n) : false;
    };
  }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const keys = new Set<string>();
    for (let x = X_W; x <= X_E; x += 100) for (let z = Z_N; z <= Z_S; z += 100) keys.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    for (const k of keys) if (!W.regions.get(k)?.H) return;
    window.clearInterval(this.timer);
    const t0 = performance.now();
    // regions that were cached before the hook was installed rebuild their vegetation once
    for (const k of keys) { const r = W.regions.get(k); if (r?.vegCache) { r.vegCache = undefined; W.vegDirty = true; } }
    const low = this.g.real?.q?.name === "low";
    const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    this.g.scene.add(this.ground(h, low), this.crowns(h, low), this.props(h, low));
    this.stats.built = true;
    this.stats.ms = Math.round(performance.now() - t0);
  }

  /** Pale tan desert sand with dry-grass and stony patches over A's park fill, plus the dark oiled-sand greens. */
  private ground(h: (x: number, z: number) => number, low: boolean): Mesh {
    const S = low ? 5 : 4; // A's ground is bumpy here, so the sheet is finer than usual to stay on top of it
    const x0 = Math.floor(X_W / S) * S, z0 = Math.floor(Z_N / S) * S;
    const nx = Math.ceil((X_E - x0) / S) + 1, nz = Math.ceil((Z_S - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const sandC = [new Color(0x9c8b73), new Color(0xa9997f), new Color(0x8d7c66)];
    const grassC = new Color(0x8c8862), stoneC = new Color(0xc4bdae), rustC = new Color(0x9a7658), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, sd = sdCourse(x, z), o = S * 0.5;
      const y = Math.max(h(x, z), h(x + o, z), h(x - o, z), h(x, z + o), h(x, z - o)); // ride over the bumps between samples
      const n1 = vnoise(x, z, 26), n2 = vnoise(x + 311, z - 97, 8);
      c.copy(sandC[0]).lerp(sandC[1], n1).lerp(sandC[2], smooth(0.55, 0.9, n2));
      c.lerp(grassC, smooth(0.58, 0.78, vnoise(x - 53, z + 211, 34)) * 0.7); // thin dry-grass patches
      c.lerp(rustC, smooth(0.62, 0.85, vnoise(x + 700, z + 90, 48)) * 0.45); // reddish bare soil
      c.lerp(stoneC, smooth(0.7, 0.9, vnoise(x - 401, z - 77, 14)) * 0.35); // pale crushed-stone scrapes
      c.multiplyScalar(0.9 + hash(x * 0.37, z * 0.41) * 0.14); // grain
      pos.push(x, y + 0.15, z); col.push(c.r, c.g, c.b, 1 - smooth(-6, 10, sd));
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (sdCourse(cx, cz) > 10 + S) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.tintQuads++;
    }
    // oiled-sand greens: a dark disc with a lighter, scuffed rim, appended after the tint so it draws on top
    const seg = low ? 18 : 28, darkC = new Color(0x5a5348), rimC = new Color(0x857967);
    for (const [gx, gz] of GREENS) {
      const base = pos.length / 3, r0 = GR * (0.92 + hash(gx, gz) * 0.16);
      pos.push(gx, Math.max(h(gx, gz), h(gx + 2, gz), h(gx - 2, gz), h(gx, gz + 2), h(gx, gz - 2)) + 0.25, gz); c.copy(darkC).multiplyScalar(0.92 + hash(gz, gx) * 0.1); col.push(c.r, c.g, c.b, 1);
      for (const [rf, cc, a] of [[0.8, darkC, 1], [1, rimC, 0.9], [1.3, rimC, 0]] as [number, Color, number][]) {
        for (let s = 0; s < seg; s++) {
          const t = (s / seg) * Math.PI * 2, wob = 1 + (hash(gx + s, gz) - 0.5) * 0.08, r = r0 * rf * wob;
          const x = gx + Math.cos(t) * r, z = gz + Math.sin(t) * r;
          pos.push(x, Math.max(h(x, z), h(x + 1.5, z), h(x - 1.5, z), h(x, z + 1.5), h(x, z - 1.5)) + 0.25, z); col.push(cc.r, cc.g, cc.b, a);
        }
      }
      for (let s = 0; s < seg; s++) {
        const s1 = (s + 1) % seg;
        idx.push(base, base + 1 + s1, base + 1 + s);
        for (let ring = 0; ring < 2; ring++) {
          const a0 = base + 1 + ring * seg, b0 = a0 + seg;
          idx.push(a0 + s, a0 + s1, b0 + s, a0 + s1, b0 + s1, b0 + s);
        }
      }
      this.stats.greens++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(geo, mat); m.name = "aw:agc:ground";
    const dim = new Color(0x2c3448);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k * 0.8); mat.opacity = 0.97 - 0.7 * k; }; // hands over to A's night-lit ground
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = true;
    return m;
  }

  /** Thorn-tree crowns: OSM clumps on the course, the forest band that wraps it, and a few lone trees on the open ground. */
  private crowns(h: (x: number, z: number) => number, low: boolean): InstancedMesh {
    const spots: number[][] = [];
    const step = low ? 6 : 4.5;
    for (let x = X_W; x <= X_E; x += step) for (let z = Z_N; z <= Z_S; z += step) {
      const px = x + (hash(x, z) - 0.5) * step, pz = z + (hash(z, x) - 0.5) * step;
      const sd = sdCourse(px, pz);
      let p = 0;
      if (sd < 0) {
        if (INNER.some((r) => inside(r, px, pz))) p = 0.8;
        else if (vnoise(px + 1234, pz - 567, 30) > 0.78) p = 0.12; // lone trees and small clumps on the open course
      } else {
        const band = BAND * (0.45 + 0.55 * vnoise(px - 90, pz + 333, 60)); // ragged edge, not a hedge
        if (sd < band && EDGE.some((r) => inside(r, px, pz))) p = (0.35 + 0.4 * vnoise(px + 51, pz, 18)) * (1 - smooth(band - 12, band, sd));
      }
      if (p <= 0 || hash(px * 0.7, pz * 1.3) > p || dGreen(px, pz) < GR + 6 || !clear(px, pz, 2)) continue;
      spots.push([px, pz, h(px, pz)]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:agc:crowns"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tones = [0x4f5a34, 0x5b6239, 0x465230, 0x636a42, 0x575a37];
    spots.forEach(([x, z, y], i) => {
      const r = 1.8 + hash(x * 3, z) * 2.0, ht = r * 0.55;
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.35), ht, r); p.set(x, y + ht * 0.75, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tones[Math.floor(hash(x * 2, z * 2) * tones.length) % tones.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.crowns = spots.length;
    return im;
  }

  /** A flag pin on every green, plus a few pale stones scattered on the open course. */
  private props(h: (x: number, z: number) => number, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    GREENS.forEach(([gx, gz], i) => {
      const a = hash(i, 5) * 6.28, r = hash(i, 6) * 3, x = gx + Math.cos(a) * r, z = gz + Math.sin(a) * r, y = h(x, z);
      const pole = new CylinderGeometry(0.035, 0.04, 2.3, 5, 1); pole.translate(x, y + 1.15, z); parts.push(paint(pole, 0xeeeeea));
      // flag: a small pennant at the pin top, streaming west on the easterly trade wind
      const flag = new BufferGeometry();
      const fx = x, fy = y + 2.25, w = 0.55, hh = 0.38;
      flag.setAttribute("position", new Float32BufferAttribute([fx, fy, z, fx - w, fy - hh * 0.5, z + 0.05, fx, fy - hh, z], 3));
      flag.computeVertexNormals();
      parts.push(paint(flag, i % 2 ? 0xd8302a : 0xf0c419));
      this.stats.flags++;
    });
    const want = low ? 40 : 80;
    for (let i = 0, n = 0; i < 800 && n < want; i++) {
      const x = X_W + hash(i, 71) * (X_E - X_W), z = Z_N + hash(i, 72) * (Z_S - Z_N);
      if (sdCourse(x, z) > -4 || dGreen(x, z) < GR + 2 || !clear(x, z, 2)) continue;
      const g = new IcosahedronGeometry(1, 0), r = 0.25 + hash(i, 73) * 0.45;
      g.scale(r * 1.4, r * 0.6, r); g.rotateY(hash(i, 74) * 6.28); g.translate(x, h(x, z) + r * 0.15, z);
      parts.push(paint(g, [0xcdc4b0, 0xb3a68e, 0x9c8d76][i % 3], 0.2, i)); n++;
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:agc:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }
}
