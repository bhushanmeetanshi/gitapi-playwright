// scrapedata.ts
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

interface ProductData {
  price: string;
  imageAlt: string;
  url: string;
}

async function scrapeProductPage(page: any, url: string): Promise<ProductData> {
  console.log(`Scraping: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const productData: ProductData = {
    price: '',
    imageAlt: '',
    url: url
  };

  try {
    // Wait for and extract price
    const priceSelector = '.price';
    await page.waitForSelector(priceSelector, { timeout: 5000 });
    const priceElement = await page.$(priceSelector);
    if (priceElement) {
      productData.price = await priceElement.textContent() || '';
      productData.price = productData.price.trim();
    }

    // Wait for and extract image alt
    const imageSelector = '.inventory_item_img';
    await page.waitForSelector(imageSelector, { timeout: 5000 });
    const imageElement = await page.$(imageSelector);
    if (imageElement) {
      productData.imageAlt = await imageElement.getAttribute('alt') || '';
    }

    console.log('Scraped data:', productData);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }

  return productData;
}

async function scrapeMultipleProducts(): Promise<ProductData[]> {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: false // Set to false to see the browser in action
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  const page = await context.newPage();
  const results: ProductData[] = [];

  try {
    // Go to the demo site
    const url = 'https://meetanshi.com/magento-2-extensions.html';
    console.log('Navigating to product listing page...');
    await page.goto(url);

    // Login
    console.log('Logging in...');
    

    // Wait for products page to load
    await page.waitForSelector('.inventory_item', { timeout: 5000 });

    // Get all product elements
    const productElements = await page.$$('.inventory_item');
    console.log(`Found ${productElements.length} products`);

    for (const element of productElements) {
      const price = await element.$eval('.inventory_item_price', (el: any) => el.textContent || '');
      const imageAlt = await element.$eval('.inventory_item_img', (el: any) => el.getAttribute('alt') || '');
      
      results.push({
        price: price.trim(),
        imageAlt: imageAlt,
        url: url
      });
    }

    // Save results to JSON file
    await fs.writeFile(
      'product_data.json', 
      JSON.stringify(results, null, 2)
    );

    console.log('Results saved to product_data.json');

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }

  return results;
}

// Execute the scraper
scrapeMultipleProducts()
  .then(results => {
    console.log('Scraping completed!');
    console.log('Total products scraped:', results.length);
  })
  .catch(error => {
    console.error('Script failed:', error);
  });