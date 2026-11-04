/**
 * Algeria's 69 wilayas: code (01–69), name (English UI uses the common French-based transliteration;
 * 16 is shown as "Algiers"), and the official Arabic name.
 *
 * ASSUMES THE CURRENT 69-WILAYA DIVISION (Law 26-06 of 4 April 2026). Re-check if the division changes.
 *
 * Starting point: docs/inputs/wilayas-from-rifkus.js (owner input). Re-verified 2026-11-04 against:
 * 1. Official text — Journal officiel de la République algérienne n° 25 of 5 April 2026, Law n° 26-06
 *    (French edition https://www.joradp.dz/FTP/jo-francais/2026/F2026025.pdf and Arabic edition
 *    https://www.joradp.dz/FTP/jo-arabe/2026/A2026025.pdf): the country "comprend soixante-neuf (69)
 *    wilayas"; articles 52 bis 10 to 52 bis 20 create the eleven new wilayas, whose chief towns are
 *    Aflou, Barika, El Kantara, Bir El Ater, El Aricha, Ksar Chellala, Aïn Ouessara, Messaad,
 *    Ksar El Boukhari, Bou Saada, El Abiodh Sidi Cheikh (Arabic text: آفلو، بريكة، القنطرة، بئر العاتر،
 *    العريشة، قصر الشلالة، عين وسارة، مسعد، قصر البخاري، بوسعادة، الأبيض سيدي الشيخ).
 * 2. Wikipedia — "Wilayas d'Algérie" (https://fr.wikipedia.org/wiki/Wilayas_d%27Alg%C3%A9rie) and
 *    "ولايات الجزائر" (https://ar.wikipedia.org/wiki/ولايات_الجزائر): codes 01–69 and Latin/Arabic names.
 *    Also consistent with the APS report (https://www.aps.dz/fr/algerie/actualite-nationale/
 *    mnn3qvxk-publication-de-la-loi-relative-a-la-nouvelle-organisation-territoriale-de-l-algerie).
 *
 * 3. Numbering of 59–69 — presidential decree n° 26-206 of 25 May 2026 completing decree n° 84-79 of
 *    3 April 1984 "fixant les noms et les chefs-lieux des wilayas", Journal officiel n° 40 of 3 June 2026
 *    (French https://www.joradp.dz/FTP/jo-francais/2026/F2026040.pdf p. 5, Arabic
 *    https://www.joradp.dz/FTP/JO-ARABE/2026/A2026040.pdf p. 6): it lists "59- Wilaya d'Aflou" …
 *    "69- Wilaya d'El Abiodh Sidi Cheikh" in exactly our order (checked line by line, both editions).
 *    The vehicle-code arrêté (JO n° 50, applicable from 1 January 2027) was not opened.
 *
 * `codeVerified`: true when the code is confirmed by an official text or long-standing institutional use.
 * 01–58: the established codes (decree 84-79 and later texts, as listed by Wikipedia and the supplied file;
 * the 1984/2019 texts themselves were not re-opened). 59–69: decree 26-206 above (verified 2026-11-04).
 * The UI shows wilaya NAMES only (no code numbers); codes stay internal (option values, store data).
 *
 * Differences found and how they were resolved:
 * - 59 Arabic: Law 26-06 (JO n° 25) writes آفلو, decree 26-206 (JO n° 40, the instrument that fixes the
 *   NAMES) and the supplied file write أفلو → the decree's أفلو is used.
 * - 65 Latin: "Aïn Ouessara" in both official texts vs French Wikipedia "Aïn Oussara" → official kept.
 * - 68 Latin: Law 26-06 "Bou Saada" vs decree 26-206 "Bou Saâda" → the decree's "Bou Saâda" is used.
 * - 34 Latin: "Bordj Bou Arréridj" (common official spelling) vs Wikipedia "Bordj Bou Arreridj" → kept.
 * - Arabic names 01–58 match Arabic Wikipedia exactly; 59–69 match decree 26-206 (Arabic edition).
 *
 * @typedef {{ code: string, name: string, nameAr: string, codeVerified: boolean }} Wilaya
 */

/** @type {Wilaya[]} */
export const wilayas = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار', codeVerified: true },
  { code: '02', name: 'Chlef', nameAr: 'الشلف', codeVerified: true },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط', codeVerified: true },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي', codeVerified: true },
  { code: '05', name: 'Batna', nameAr: 'باتنة', codeVerified: true },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية', codeVerified: true },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة', codeVerified: true },
  { code: '08', name: 'Béchar', nameAr: 'بشار', codeVerified: true },
  { code: '09', name: 'Blida', nameAr: 'البليدة', codeVerified: true },
  { code: '10', name: 'Bouira', nameAr: 'البويرة', codeVerified: true },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست', codeVerified: true },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة', codeVerified: true },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان', codeVerified: true },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت', codeVerified: true },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو', codeVerified: true },
  { code: '16', name: 'Algiers', nameAr: 'الجزائر', codeVerified: true },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة', codeVerified: true },
  { code: '18', name: 'Jijel', nameAr: 'جيجل', codeVerified: true },
  { code: '19', name: 'Sétif', nameAr: 'سطيف', codeVerified: true },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة', codeVerified: true },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة', codeVerified: true },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', codeVerified: true },
  { code: '23', name: 'Annaba', nameAr: 'عنابة', codeVerified: true },
  { code: '24', name: 'Guelma', nameAr: 'قالمة', codeVerified: true },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة', codeVerified: true },
  { code: '26', name: 'Médéa', nameAr: 'المدية', codeVerified: true },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم', codeVerified: true },
  { code: '28', name: "M'Sila", nameAr: 'المسيلة', codeVerified: true },
  { code: '29', name: 'Mascara', nameAr: 'معسكر', codeVerified: true },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة', codeVerified: true },
  { code: '31', name: 'Oran', nameAr: 'وهران', codeVerified: true },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض', codeVerified: true },
  { code: '33', name: 'Illizi', nameAr: 'إليزي', codeVerified: true },
  { code: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', codeVerified: true },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس', codeVerified: true },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف', codeVerified: true },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف', codeVerified: true },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت', codeVerified: true },
  { code: '39', name: 'El Oued', nameAr: 'الوادي', codeVerified: true },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة', codeVerified: true },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس', codeVerified: true },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة', codeVerified: true },
  { code: '43', name: 'Mila', nameAr: 'ميلة', codeVerified: true },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى', codeVerified: true },
  { code: '45', name: 'Naâma', nameAr: 'النعامة', codeVerified: true },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت', codeVerified: true },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية', codeVerified: true },
  { code: '48', name: 'Relizane', nameAr: 'غليزان', codeVerified: true },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون', codeVerified: true },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', codeVerified: true },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال', codeVerified: true },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس', codeVerified: true },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح', codeVerified: true },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام', codeVerified: true },
  { code: '55', name: 'Touggourt', nameAr: 'تقرت', codeVerified: true },
  { code: '56', name: 'Djanet', nameAr: 'جانت', codeVerified: true },
  { code: '57', name: "El M'Ghair", nameAr: 'المغير', codeVerified: true },
  { code: '58', name: 'El Meniaa', nameAr: 'المنيعة', codeVerified: true },
  { code: '59', name: 'Aflou', nameAr: 'أفلو', codeVerified: true },
  { code: '60', name: 'Barika', nameAr: 'بريكة', codeVerified: true },
  { code: '61', name: 'El Kantara', nameAr: 'القنطرة', codeVerified: true },
  { code: '62', name: 'Bir El Ater', nameAr: 'بئر العاتر', codeVerified: true },
  { code: '63', name: 'El Aricha', nameAr: 'العريشة', codeVerified: true },
  { code: '64', name: 'Ksar Chellala', nameAr: 'قصر الشلالة', codeVerified: true },
  { code: '65', name: 'Aïn Ouessara', nameAr: 'عين وسارة', codeVerified: true },
  { code: '66', name: 'Messaad', nameAr: 'مسعد', codeVerified: true },
  { code: '67', name: 'Ksar El Boukhari', nameAr: 'قصر البخاري', codeVerified: true },
  { code: '68', name: 'Bou Saâda', nameAr: 'بوسعادة', codeVerified: true },
  { code: '69', name: 'El Abiodh Sidi Cheikh', nameAr: 'الأبيض سيدي الشيخ', codeVerified: true },
];

// Visible label: names only, never the code number (official order is kept by the array order).
export const wilayaLabel = (w) => `${w.name} (${w.nameAr})`;
