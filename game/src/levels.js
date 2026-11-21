// The three levels: name, scene painter and the ten differences each. Coordinates are in
// the panel's own 600x560 space and match the anchors drawn in scenes.js, so a click on
// either panel tests the same spot. `label` is what the game announces when a difference
// is found (and what a hint names).
import { drawGarden, drawHarbor, drawMarket } from './scenes.js';

export const LEVELS = [
  {
    id: 'pasar',
    name: 'Pasar Senja',
    subtitle: 'Pasar malam di tepi kota — lentera, sate, dan seekor kucing.',
    draw: drawMarket,
    differences: [
      { id: 'lantern', x: 300, y: 118, r: 22, label: 'Lentera tengah hilang!' },
      { id: 'cat', x: 512, y: 330, r: 26, label: 'Kucing di atas peti hilang!' },
      { id: 'awning', x: 313, y: 253, r: 30, label: 'Warna tenda warung berubah!' },
      { id: 'fruit', x: 113, y: 360, r: 26, label: 'Jeruk berubah jadi apel hijau!' },
      { id: 'sign', x: 313, y: 296, r: 26, label: 'Papan nama berubah: SATE jadi SOTO!' },
      { id: 'bike', x: 470, y: 490, r: 34, label: 'Sepeda di dekat peti hilang!' },
      { id: 'bird', x: 210, y: 96, r: 16, label: 'Ada burung tambahan di langit!' },
      { id: 'window', x: 75, y: 183, r: 22, label: 'Lampu jendela padam!' },
      { id: 'flag', x: 409, y: 191, r: 16, label: 'Bendera warung berubah warna!' },
      { id: 'moon', x: 520, y: 62, r: 20, label: 'Bulan sabit muncul di langit!' },
    ],
  },
  {
    id: 'taman',
    name: 'Taman Bunga',
    subtitle: 'Taman sore dengan kolam, jembatan, dan pohon willow.',
    draw: drawGarden,
    differences: [
      { id: 'butterfly', x: 420, y: 300, r: 20, label: 'Kupu-kupu biru tambahan!' },
      { id: 'flower', x: 170, y: 440, r: 18, label: 'Tulip merah berubah jadi biru!' },
      { id: 'bench', x: 325, y: 340, r: 30, label: 'Bangku taman hilang!' },
      { id: 'fish', x: 485, y: 445, r: 24, label: 'Ikan melompat dari kolam!' },
      { id: 'nest', x: 150, y: 145, r: 20, label: 'Sarang burung muncul di pohon!' },
      { id: 'cloud', x: 430, y: 170, r: 26, label: 'Awan tambahan di langit!' },
      { id: 'lily', x: 520, y: 508, r: 16, label: 'Daun teratai hilang!' },
      { id: 'stone', x: 250, y: 522, r: 16, label: 'Batu pijakan hilang!' },
      { id: 'rays', x: 90, y: 70, r: 40, label: 'Sinar matahari hilang!' },
      { id: 'fence', x: 584, y: 385, r: 24, label: 'Tiang pagar hilang!' },
    ],
  },
  {
    id: 'pelabuhan',
    name: 'Pelabuhan Pagi',
    subtitle: 'Dermaga pagi — mercusuar, perahu layar, dan laut biru.',
    draw: drawHarbor,
    differences: [
      { id: 'light', x: 86, y: 130, r: 20, label: 'Lampu mercusuar padam!' },
      { id: 'sail', x: 371, y: 358, r: 28, label: 'Layar perahu berubah merah!' },
      { id: 'gull', x: 380, y: 120, r: 14, label: 'Burung camar tambahan!' },
      { id: 'crate', x: 546, y: 494, r: 26, label: 'Peti paling atas hilang!' },
      { id: 'buoy', x: 200, y: 462, r: 20, label: 'Pelampung berubah kuning!' },
      { id: 'flag', x: 362, y: 323, r: 14, label: 'Bendera perahu berubah warna!' },
      { id: 'hutwindow', x: 179, y: 327, r: 18, label: 'Jendela gubuk gelap!' },
      { id: 'rope', x: 420, y: 528, r: 22, label: 'Gulungan tali hilang!' },
      { id: 'dolphin', x: 290, y: 430, r: 26, label: 'Lumba-lumba melompat!' },
      { id: 'smoke', x: 226, y: 238, r: 22, label: 'Asap cerobong muncul!' },
    ],
  },
];
