// ! Dont change this code
const { fetchProductsData, setProductsCards, convertToRupiah, countDiscount } = require('../src/index.js');
const cartData = require('../src/data/cart.js');

// @ Write your code here
// NO 1.
describe('Product API Testing', () => {
  test('Test Case 1: should return product data with id 1', async () => {
    const productData = await fetchProductsData(1);
    expect(productData.id).toBe(1);
  });

  test('Test Case 2: should check products.length with limit', async () => {
    const productData = await fetchProductsData();
    expect(productData.products.length).toBeLessThanOrEqual(30);
  });

  test('Test Case 3: should handle error for invalid product id', async () => {
    const invalidProductId = 'invalidId';
    const productData = await fetchProductsData(invalidProductId);
    expect(productData).toEqual({}); // Assuming the API returns an empty object for an invalid id
  });
});

// NO 2.
const { fetchCartsData } = require('../src/dataService');
jest.mock('../src/dataService', () => {
  const originalModule = jest.requireActual('../src/dataService');
  return {
    __esModule: true,
    ...originalModule,
    fetchCartsData: jest.fn(),
  };
});

describe('Cart API Testing', () => {
  // fetchCartsData Test Case 1
  test('should compare total cart items with length of fetched data', async () => {
    // Mocking fetchCartsData untuk mengembalikan data dummy
    fetchCartsData.mockResolvedValue(cartData.carts);

    const cartsData = await fetchCartsData();

    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal); // Memeriksa apakah jumlah item dalam keranjang sesuai dengan panjang data yang diharapkan
  });
});

//NO 3.
describe('Product Utility Testing', () => {
  let productData; // Variabel untuk menyimpan data produk dari API

  beforeAll(async () => {
    // Setup: Ambil data produk dari API dan simpan dalam variabel productData
    productData = await fetchProductsData();
  });

  // Test Case untuk convertToRupiah
  describe('convertToRupiah Function', () => {
    test('should convert price to IDR currency format', () => {
      const price = 1000;
      const result = convertToRupiah(price);
      expect(result).toMatch(/Rp\s15.436.000,\d{2}/); // Memastikan hasil sesuai format Rupiah
    });

    test('should handle zero price', () => {
      const price = 0;
      const result = convertToRupiah(price);
      expect(result).toMatch(/^Rp\s?0,00$/); // Memastikan hasil untuk harga nol
    });
  });

  // Test Case untuk countDiscount
  describe('countDiscount Function', () => {
    test('should calculate discounted price correctly', () => {
      const price = 1000;
      const discount = 10;
      const result = countDiscount(price, discount);
      expect(result).toBe(900); // Memastikan hasil perhitungan diskon benar
    });

    test('should handle zero discount', () => {
      const price = 1000;
      const discount = 0;
      const result = countDiscount(price, discount);
      expect(result).toBe(price); // Memastikan hasil ketika diskon nol
    });
  });

  // Test Case untuk setProductsCards
  describe('setProductsCards Function', () => {
    test('should return an array of objects with the correct keys', () => {
      // Contoh data produk yang akan diuji
      const products = [
        {
          id: 1,
          title: 'Product 1',
          price: 100,
          discountPercentage: 10,
          thumbnail: 'path/to/image1.jpg',
        },
        // ... tambahkan produk lainnya ...
      ];

      // Panggil fungsi setProductsCards dengan data produk
      const productsCards = setProductsCards(products);

      // Periksa setiap objek di dalam array
      productsCards.forEach((productCard) => {
        // Periksa apakah objek memiliki properti yang diharapkan
        expect(productCard).toHaveProperty('price');
        expect(productCard).toHaveProperty('after_discount');
        expect(productCard).toHaveProperty('image');
      });
    });
  });
});
// Asyncronous Testing
// https://jestjs.io/docs/asynchronous

// Mocking
// https://jestjs.io/docs/mock-functions

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown
