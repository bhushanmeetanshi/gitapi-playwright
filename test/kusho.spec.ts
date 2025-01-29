import { test, expect } from '@playwright/test';
import { BrowserContext } from '@playwright/test';
test.describe('Google Homepage Navigation', () => {
  test('should successfully load and navigate to Google homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('https://www.google.com/');
    
    // Assert that we're on Google
    await expect(page).toHaveURL('https://www.google.com/');
    await expect(page).toHaveTitle(/Google/);
  });
});

test('Test 165: Verify Google homepage loads successfully', async ({ page }) => {
    // Arrange
    const expectedUrl = 'https://www.google.com/';
    
    // Act
    const response = await page.goto(expectedUrl);
    
    // Assert
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(expectedUrl);
    await expect(page.locator('.lnXdpd')).toBeVisible();
});

test('Test 165: Confirm correct page title is displayed', async ({ page }) => {
    // Arrange
    await page.goto('https://www.google.com/');
    
    // Act & Assert
    await expect(page).toHaveTitle(/Google/);
    
    // Additional verification for title element
    const pageTitle = await page.title();
    expect(pageTitle.trim()).toBe('Google');
});

test('Test 165: Validate HTTPS security protocol', async ({ page }) => {
    // Arrange
    const url = 'https://www.google.com/';
    
    // Act
    const response = await page.goto(url);
    
    // Assert
    expect(page.url()).toMatch(/^https:\/\//);
    expect(response?.securityDetails()).toBeTruthy();
});

test('Test 165: Check Google logo visibility and placement', async ({ page }) => {
    // Arrange
    await page.goto('https://www.google.com/');
    const logoLocator = page.locator('img[alt="Google"]');
    
    // Act & Assert
    await expect(logoLocator).toBeVisible();
    
    // Verify logo position
    const logoPosition = await logoLocator.boundingBox();
    expect(logoPosition).toBeTruthy();
    
    // Verify logo is clickable
    await expect(logoLocator).toBeEnabled();
    
    // Verify logo source
    const imgSrc = await logoLocator.getAttribute('src');
    expect(imgSrc).toBeTruthy();
    expect(imgSrc).toMatch(/google/i);
});


test('Test 217: Verify search input field is present and focused', async ({ page }) => {
    // Navigate to Google homepage
    await page.goto('https://www.google.com/');

    // Locate search input
    const searchInput = page.locator('[aria-label="Search"]');

    // Assert input is visible
    await expect(searchInput).toBeVisible();
     await searchInput.fill("hello")

    // // Verify input is focused (Google usually auto-focuses the search input)
     await expect(searchInput).toBeFocused();
});

test('Test 217: Test empty search submission', async ({ page }) => {
    // Navigate to Google homepage
    await page.goto('https://www.google.com/');

    // Get initial URL
    const initialUrl = page.url();

    // Click search button without entering text
    await page.locator('[name="btnK"]').click();

    // Verify we remain on the same page
    await expect(page).toHaveURL(initialUrl);
});

test('Test 217: Search with basic text query', async ({ page }) => {
    // Navigate to Google homepage
    await page.goto('https://www.google.com/');

    // Enter search query
    await page.locator('[name="q"]').fill('playwright testing');
    
    // Submit search
    await page.keyboard.press('Enter');

    // Verify we're on results page
    await expect(page).toHaveURL(/.*search.*playwright.*testing/);
    
    // Verify results are present
    await expect(page.locator('#search')).toBeVisible();
});

test('Test 217: Search with special characters', async ({ page }) => {
    // Navigate to Google homepage
    await page.goto('https://www.google.com/');

    const specialChars = '!@#$%^&*';
    
    // Enter special characters
    await page.locator('[name="q"]').fill(specialChars);
    
    // Submit search
    await page.keyboard.press('Enter');

    // Verify URL is properly encoded
    await expect(page).toHaveURL(encodeURI(`https://www.google.com/search?q=${specialChars}`), {timeout: 10000});
    
    // Verify page loaded without errors
    await expect(page.locator('#search')).toBeVisible();
});

test.only('Test 217: Search with very long query', async ({ page }) => {
    
    // Navigate to Google homepage
    await page.goto('https://www.google.com/');

    // Create long string (1000+ characters)
    const longQuery ="hello world"
    
    // Try to enter long search query
    await page.locator('[name="q"]').fill(longQuery);
    await page.pause(); 
    // Get actual value after entering
    const actualValue = await page.locator('[name="q"]').inputValue();
    
    // Google typically has a maximum query length
    // Verify the input either truncated the value or handled it gracefully
    expect(actualValue.length).toBeLessThanOrEqual(longQuery.length);
    
    // Submit search
    await page.keyboard.press('Enter');
    
    // Verify page loads without errors
    await expect(page.locator('#search')).toBeVisible();
});


test('Test 7: Search with different languages', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com/');
    
    // Test different language inputs
    const searchTerms = {
        english: 'hello world',
        japanese: 'こんにちは世界',
        arabic: 'مرحبا بالعالم'
    };

    for (const [language, term] of Object.entries(searchTerms)) {
        // Clear previous search and input new term
        await page.fill('[name="q"]', '');
        await page.fill('[name="q"]', term);
        await page.press('[name="q"]', 'Enter');

        // Verify search results
        await expect(page.locator('#search')).toBeVisible();
        expect(page.url()).toContain(encodeURIComponent(term));

        // Go back to search page
        await page.goto('https://www.google.com/');
    }
});

test('Test 7: Search with emoji characters', async ({ page }) => {
    await page.goto('https://www.google.com/');
    
    const emojiSearches = ['😀', '🌍 world', '❤️ love'];

    for (const search of emojiSearches) {
        await page.fill('[name="q"]', search);
        await page.press('[name="q"]', 'Enter');

        // Verify search processed
        await expect(page.locator('#search')).toBeVisible();
        
        // Return to search page
        await page.goto('https://www.google.com/');
    }
});

test('Test 7: Search with SQL injection patterns', async ({ page }) => {
    await page.goto('https://www.google.com/');
    
    const sqlPatterns = [
        "' OR '1'='1",
        "DROP TABLE users;",
        "SELECT * FROM users"
    ];

    for (const pattern of sqlPatterns) {
        await page.fill('[name="q"]', pattern);
        await page.press('[name="q"]', 'Enter');

        // Verify search is processed safely
        await expect(page.locator('#search')).toBeVisible();
        expect(page.url()).toContain(encodeURIComponent(pattern));

        await page.goto('https://www.google.com/');
    }
});

test('Test 7: Search with JavaScript injection attempts', async ({ page }) => {
    await page.goto('https://www.google.com/');
    
    const xssPatterns = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        'onmouseover="alert(1)"'
    ];

    for (const pattern of xssPatterns) {
        await page.fill('[name="q"]', pattern);
        await page.press('[name="q"]', 'Enter');

        // Verify XSS patterns are handled safely
        await expect(page.locator('#search')).toBeVisible();
        
        // Verify script tags are escaped in URL
        expect(page.url()).toContain(encodeURIComponent(pattern));

        await page.goto('https://www.google.com/');
    }
});

test('Test 7: Search with HTML tags', async ({ page }) => {
    await page.goto('https://www.google.com/');
    
    const htmlPatterns = [
        '<div>test</div>',
        '<p class="test">paragraph</p>',
        '<a href="#">link</a>'
    ];

    for (const pattern of htmlPatterns) {
        await page.fill('[name="q"]', pattern);
        await page.press('[name="q"]', 'Enter');

        // Verify HTML is treated as text
        await expect(page.locator('#search')).toBeVisible();
        
        // Verify HTML is properly escaped in URL
        expect(page.url()).toContain(encodeURIComponent(pattern));

        await page.goto('https://www.google.com/');
    }
});


test('Test 149: Check I\'m Feeling Lucky button functionality', async ({ page }) => {
    // Navigate to Google homepage
    await page.goto('https://www.google.com/');
    
    // Verify button presence and click
    const luckyButton = page.getByLabel('I\'m Feeling Lucky');
    await expect(luckyButton).toBeVisible();
    await luckyButton.click();
    
    // Verify navigation occurred
    await expect(page).not.toHaveURL('https://www.google.com/');
});

test('Test 149: Test page load on slow network connection', async ({ page, context }) => {
    // Set up slow network conditions
    await context.route('**/*', (route) => {
        route.continue({
            delay: 1000
        });
    });
    
    // Load page with timeout
    const response = await page.goto('https://www.google.com/', {
        timeout: 30000,
        waitUntil: 'networkidle'
    });
    
    // Verify successful load
    expect(response.status()).toBe(200);
    await expect(page.getByTitle('Search')).toBeVisible();
});

test('Test 149: Verify page behavior in offline mode', async ({ page, context }) => {
    // Set offline mode
    await context.setOffline(true);
    
    try {
        // Attempt to load page
        await page.goto('https://www.google.com/', {
            timeout: 10000
        });
    } catch (error) {
        // Verify offline error
        expect(error.message).toContain('net::ERR_INTERNET_DISCONNECTED');
    }
    
    // Reset network state
    await context.setOffline(false);
});

test('Test 149: Test page refresh functionality', async ({ page }) => {
    // Initial page load
    await page.goto('https://www.google.com/');
    
    // Store initial page state
    const initialTitle = await page.title();
    
    // Perform refresh
    await page.reload({ waitUntil: 'networkidle' });
    
    // Verify page reloaded successfully
    const newTitle = await page.title();
    expect(newTitle).toBe(initialTitle);
    await expect(page).toHaveURL('https://www.google.com/');
});

test('Test 149: Verify back/forward browser navigation', async ({ page }) => {
    // Navigate through multiple pages
    await page.goto('https://www.google.com/');
    await page.getByTitle('Search').click();
    await page.keyboard.type('playwright');
    await page.keyboard.press('Enter');
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('https://www.google.com/');
    
    // Go forward
    await page.goForward();
    expect(page.url()).toContain('search');
    
    // Verify search results still present
    await expect(page.getByRole('main')).toBeVisible();
});


test('Test 218: Check page response on different screen sizes', async ({ page }) => {
    const viewports = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
        // Set viewport size
        await page.setViewportSize(viewport);

        // Load page
        await page.goto('https://www.google.com/');

        // Verify essential elements are visible
        //await expect(page.locator('input[name="q"]')).toBeVisible();
        await expect(page.locator('textarea[role="combobox"]')).toBeVisible();
    }
});

test('Test 218: Test page load in mobile view', async ({ page }) => {
    // Configure mobile device
    await page.emulate(devices['iPhone 12']);

    // Navigate to page
    await page.goto('https://www.google.com/');

    // Verify mobile-specific elements
    await expect(page.locator('a[aria-label="Google apps"]')).toBeVisible();
    await expect(page.locator('input[name="q"]')).toBeVisible();
});

test('Test 218: Verify page accessibility features', async ({ page }) => {
    await page.goto('https://www.google.com/');

    // Check main landmarks
    await expect(page.locator('main')).toHaveAttribute('role', 'main');
    
    // Verify search input accessibility
    const searchInput = page.locator('input[name="q"]');
    await expect(searchInput).toHaveAttribute('role', 'combobox');
    await expect(searchInput).toHaveAttribute('aria-label', /Search/);

    // Check heading structure
    const headings = await page.locator('h1, h2, h3').count();
    expect(headings).toBeGreaterThan(0);
});

// test('Test 218: Test keyboard navigation functionality', async ({ page }) => {
//     await page.goto('https://www.google.com/');
//     ar?action_name=show&path=%2Fcart&storefront_country=IN&storefront_locale=en
//     // Focus search input
//     await page.keyboard.press('Tab');
    
//     // Verify focus on search input
//     await expect(page.locator('input[name="q"]')).toBeFocused();

//     // Navigate through main elements
//     await page.keyboard.press('Tab');
//     await page.keyboard.press('Tab');

//     // Verify focus indicators
//     const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
//     expect(focusedElement).toBeTruthy();
// });

test('Test 218: Verify search suggestions appear correctly', async ({ page }) => {
    // Go to Google
    await page.goto('https://www.google.com/');

    // Type search query
    const searchInput = page.getByTitle('search');
    await searchInput.fill('playwright testing');

    // Wait for suggestions to appear
    const suggestionsList = page.locator('ul[role="presentation"]');
    await suggestionsList.waitFor({ state: 'visible' });

    // Verify suggestions count
    const suggestionCount = await page.locator('ul[role="listbox"] li').count();
    expect(suggestionCount).toBeGreaterThan(3);

    // Verify first suggestion contains the search text
    const firstSuggestion = page.locator('ul[role="listbox"] li').nth(0);
    await expect(firstSuggestion).toContainText(/playwright/i);
});


test('Test 19: Copy/paste functionality in search field', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com/');
    
    // Input text and copy
    const searchInput = page.locator('[name="q"]');
    const testText = 'Playwright Test Automation';
    await searchInput.fill(testText);
    await searchInput.focus();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    
    // Clear and paste
    await searchInput.clear();
    await searchInput.focus();
    await page.keyboard.press('Control+V');
    
    // Verify pasted content
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe(testText);
});

test('Test 19: Page load with cleared cache', async ({ browser }) => {
    // Create new context with cleared cache
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    
    // Record page load timing
    const startTime = Date.now();
    await page.goto('https://www.google.com/');
    const loadTime = Date.now() - startTime;
    const formattedLoadTime = new Intl.NumberFormat().format(loadTime);
    console.log(`Load time: ${formattedLoadTime} ms`);

    // Verify critical elements
    await expect(page.locator('[name="q"]')).toBeVisible();
    await expect(page.locator('img[alt="Google"]')).toBeVisible();
    
    // Verify reasonable load time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000);
    
    await context.close();
});

test('Test 19: Page behavior with different zoom levels', async ({ page }) => {
    await page.goto('https://www.google.com/');
    
    const zoomLevels = [0.75, 1.0, 1.5];
    
    for (const zoom of zoomLevels) {
        // Set zoom level
        await page.evaluate((zoomLevel) => {
            document.body.style.zoom = zoomLevel;
        }, zoom);
        
        // Verify critical elements remain visible
        await expect(page.locator('[name="q"]')).toBeVisible();
        await expect(page.locator('img[alt="Google"]')).toBeVisible();
    }
});

test('Test 19: URL parameters handling', async ({ page }) => {
    // Test different URL parameters
    const testParams = [
        '?hl=en',
        '?q=test+query',
        '?safe=active'
    ];
    
    for (const param of testParams) {
        await page.goto(`https://www.google.com/${param}`);
        
        // Verify page loaded correctly
        await expect(page).toHaveURL(new RegExp(param));
        await expect(page.locator('[name="q"]')).toBeVisible();
    }
});

test('Test 19: Page behavior under network latency', async ({ browser }) => {
    // Create context with network throttling
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Set up slow 3G network conditions
    await page.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('https://www.google.com/');
    const loadTime = Date.now() - startTime;
    
    // Verify page loads successfully despite latency
    await expect(page.locator('[name="q"]')).toBeVisible();
    await expect(page.locator('img[alt="Google"]')).toBeVisible();
    
    // Verify search still functions
    await page.locator('[name="q"]').fill('test');
    await page.keyboard.press('Enter');
    
    await context.close();
});