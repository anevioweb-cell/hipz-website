// Stockists for the store finder on /distributors. EMPTY on purpose: no store, distributor or area is
// known yet (owner). Add only real, owner-confirmed entries.
//
// Shape of one entry:
// {
//   id: 'unique-id',            // string, stable
//   name: 'Shop name',          // string
//   wilayaCode: '16',           // string, a code from src/data/wilayas.js
//   address: 'Street, town',    // string
//   phone: '05 XX XX XX XX',    // optional string, shown with a tel: link
//   mapUrl: 'https://...',      // optional string, external map link
// }
export const stores = [];
