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
 * Differences found and how they were resolved:
 * - 59 Arabic: the supplied file had أفلو; the official Arabic JO and Arabic Wikipedia write آفلو → آفلو.
 * - 65 Latin: JO "Aïn Ouessara" vs French Wikipedia "Aïn Oussara" → JO spelling kept.
 * - 68 Latin: JO "Bou Saada" vs French Wikipedia "Bou Saâda" → JO spelling kept.
 * - 34 Latin: "Bordj Bou Arréridj" (common official spelling) vs Wikipedia "Bordj Bou Arreridj" → kept.
 * - The law itself does not number the new wilayas. Codes 59–69 (in this order) come from Wikipedia and
 *   the supplied file; the instrument assigning them was NOT verified (press sources cite either
 *   presidential decree 26-206 of 25 May 2026 or an arrêté of 17 June 2026 in JO n° 50).
 * - Arabic names 01–58 match Arabic Wikipedia exactly; 59–69 match the Arabic JO text.
 *
 * @typedef {{ code: string, name: string, nameAr: string }} Wilaya
 */

/** @type {Wilaya[]} */
export const wilayas = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار' },
  { code: '02', name: 'Chlef', nameAr: 'الشلف' },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط' },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي' },
  { code: '05', name: 'Batna', nameAr: 'باتنة' },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية' },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة' },
  { code: '08', name: 'Béchar', nameAr: 'بشار' },
  { code: '09', name: 'Blida', nameAr: 'البليدة' },
  { code: '10', name: 'Bouira', nameAr: 'البويرة' },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست' },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة' },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان' },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت' },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو' },
  { code: '16', name: 'Algiers', nameAr: 'الجزائر' },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة' },
  { code: '18', name: 'Jijel', nameAr: 'جيجل' },
  { code: '19', name: 'Sétif', nameAr: 'سطيف' },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة' },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة' },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس' },
  { code: '23', name: 'Annaba', nameAr: 'عنابة' },
  { code: '24', name: 'Guelma', nameAr: 'قالمة' },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة' },
  { code: '26', name: 'Médéa', nameAr: 'المدية' },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم' },
  { code: '28', name: "M'Sila", nameAr: 'المسيلة' },
  { code: '29', name: 'Mascara', nameAr: 'معسكر' },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة' },
  { code: '31', name: 'Oran', nameAr: 'وهران' },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض' },
  { code: '33', name: 'Illizi', nameAr: 'إليزي' },
  { code: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج' },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس' },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف' },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف' },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت' },
  { code: '39', name: 'El Oued', nameAr: 'الوادي' },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة' },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس' },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة' },
  { code: '43', name: 'Mila', nameAr: 'ميلة' },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى' },
  { code: '45', name: 'Naâma', nameAr: 'النعامة' },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت' },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية' },
  { code: '48', name: 'Relizane', nameAr: 'غليزان' },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون' },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار' },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال' },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس' },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح' },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام' },
  { code: '55', name: 'Touggourt', nameAr: 'تقرت' },
  { code: '56', name: 'Djanet', nameAr: 'جانت' },
  { code: '57', name: "El M'Ghair", nameAr: 'المغير' },
  { code: '58', name: 'El Meniaa', nameAr: 'المنيعة' },
  { code: '59', name: 'Aflou', nameAr: 'آفلو' },
  { code: '60', name: 'Barika', nameAr: 'بريكة' },
  { code: '61', name: 'El Kantara', nameAr: 'القنطرة' },
  { code: '62', name: 'Bir El Ater', nameAr: 'بئر العاتر' },
  { code: '63', name: 'El Aricha', nameAr: 'العريشة' },
  { code: '64', name: 'Ksar Chellala', nameAr: 'قصر الشلالة' },
  { code: '65', name: 'Aïn Ouessara', nameAr: 'عين وسارة' },
  { code: '66', name: 'Messaad', nameAr: 'مسعد' },
  { code: '67', name: 'Ksar El Boukhari', nameAr: 'قصر البخاري' },
  { code: '68', name: 'Bou Saada', nameAr: 'بوسعادة' },
  { code: '69', name: 'El Abiodh Sidi Cheikh', nameAr: 'الأبيض سيدي الشيخ' },
];
