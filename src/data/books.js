// Books already on my shelf, waiting their turn - the ones I'll be reading next.
// Add to this list as the pile grows.
export const readingList = [
  { title: 'The Master and Margarita', author: 'Mikhail Bulgakov' },
  { title: 'The Idiot', author: 'Fyodor Dostoevsky' },
  { title: 'Tress of the Emerald Sea', author: 'Brandon Sanderson' }
];

// Books I've finished but haven't written about. The reviewed ones are added
// to the shelf from the journal on their own (see shelf.js), so they don't
// need listing here - unless the year I read one isn't the year I reviewed
// it: list it with the right year and the shelf uses that instead.
// { title: 'Norwegian Wood', author: 'Haruki Murakami', year: 2023, rating: 4.5 }
export const finished = [];
