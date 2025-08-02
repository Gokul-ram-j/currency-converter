class CurrencyConverter {
    constructor() {
        this.apiKey = '748805839d55f74fa0d8d6ea';
        this.baseUrl = 'https://v6.exchangerate-api.com/v6';
        this.countriesUrl = 'https://restcountries.com/v3.1/all';
        
        this.countryData = {};
        this.exchangeRates = {};
        this.currentBase = 'USD';
        this.isLoading = false;
        
        this.popularCurrencies = [
            'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY',
            'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY'
        ];
        
        this.init();
    }
    
    async init() {
        try {
            await this.showLoadingScreen();
            await this.loadCountryData();
            await this.loadExchangeRates();
            this.setupEventListeners();
            this.populateSelectOptions();
            this.setDefaultCurrencies();
            this.renderPopularCurrencies();
            this.hideLoadingScreen();
            this.updateLastUpdated();
        } catch (error) {
            console.error('Initialization failed:', error);
            this.handleError('Failed to initialize currency converter');
        }
    }
    
    async showLoadingScreen() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = '100%';
            }, 100);
        }
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (mainContent) {
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 500);
        }
    }
    
    async loadCountryData() {
        try {
            // Try to fetch from API first
            const response = await fetch(this.countriesUrl);
            if (response.ok) {
                const countries = await response.json();
                
                countries.forEach(country => {
                    const name = country.name.common;
                    const currencies = country.currencies;
                    const countryCode = country.cca2;
                    
                    if (currencies) {
                        const currencyCode = Object.keys(currencies)[0];
                        const currencyName = currencies[currencyCode]?.name || currencyCode;
                        
                        this.countryData[currencyCode] = {
                            country: name,
                            countryCode: countryCode.toLowerCase(),
                            currencyName: currencyName,
                            flag: `https://flagsapi.com/${countryCode}/flat/64.png`
                        };
                    }
                });
                return;
            }
        } catch (error) {
            console.warn('Failed to fetch country data from API, using fallback data:', error);
        }
        
        // Fallback to static data
        this.loadFallbackCountryData();
    }
    
    loadFallbackCountryData() {
        // Static country data as fallback
        const fallbackData = {
            'USD': { country: 'United States', countryCode: 'us', currencyName: 'US Dollar', flag: 'https://flagsapi.com/US/flat/64.png' },
            'EUR': { country: 'European Union', countryCode: 'eu', currencyName: 'Euro', flag: 'https://flagsapi.com/EU/flat/64.png' },
            'GBP': { country: 'United Kingdom', countryCode: 'gb', currencyName: 'British Pound', flag: 'https://flagsapi.com/GB/flat/64.png' },
            'JPY': { country: 'Japan', countryCode: 'jp', currencyName: 'Japanese Yen', flag: 'https://flagsapi.com/JP/flat/64.png' },
            'AUD': { country: 'Australia', countryCode: 'au', currencyName: 'Australian Dollar', flag: 'https://flagsapi.com/AU/flat/64.png' },
            'CAD': { country: 'Canada', countryCode: 'ca', currencyName: 'Canadian Dollar', flag: 'https://flagsapi.com/CA/flat/64.png' },
            'CHF': { country: 'Switzerland', countryCode: 'ch', currencyName: 'Swiss Franc', flag: 'https://flagsapi.com/CH/flat/64.png' },
            'CNY': { country: 'China', countryCode: 'cn', currencyName: 'Chinese Yuan', flag: 'https://flagsapi.com/CN/flat/64.png' },
            'SEK': { country: 'Sweden', countryCode: 'se', currencyName: 'Swedish Krona', flag: 'https://flagsapi.com/SE/flat/64.png' },
            'NZD': { country: 'New Zealand', countryCode: 'nz', currencyName: 'New Zealand Dollar', flag: 'https://flagsapi.com/NZ/flat/64.png' },
            'MXN': { country: 'Mexico', countryCode: 'mx', currencyName: 'Mexican Peso', flag: 'https://flagsapi.com/MX/flat/64.png' },
            'SGD': { country: 'Singapore', countryCode: 'sg', currencyName: 'Singapore Dollar', flag: 'https://flagsapi.com/SG/flat/64.png' },
            'HKD': { country: 'Hong Kong', countryCode: 'hk', currencyName: 'Hong Kong Dollar', flag: 'https://flagsapi.com/HK/flat/64.png' },
            'NOK': { country: 'Norway', countryCode: 'no', currencyName: 'Norwegian Krone', flag: 'https://flagsapi.com/NO/flat/64.png' },
            'KRW': { country: 'South Korea', countryCode: 'kr', currencyName: 'South Korean Won', flag: 'https://flagsapi.com/KR/flat/64.png' },
            'TRY': { country: 'Turkey', countryCode: 'tr', currencyName: 'Turkish Lira', flag: 'https://flagsapi.com/TR/flat/64.png' },
            'INR': { country: 'India', countryCode: 'in', currencyName: 'Indian Rupee', flag: 'https://flagsapi.com/IN/flat/64.png' },
            'BRL': { country: 'Brazil', countryCode: 'br', currencyName: 'Brazilian Real', flag: 'https://flagsapi.com/BR/flat/64.png' },
            'RUB': { country: 'Russia', countryCode: 'ru', currencyName: 'Russian Ruble', flag: 'https://flagsapi.com/RU/flat/64.png' },
            'ZAR': { country: 'South Africa', countryCode: 'za', currencyName: 'South African Rand', flag: 'https://flagsapi.com/ZA/flat/64.png' },
            'PLN': { country: 'Poland', countryCode: 'pl', currencyName: 'Polish Zloty', flag: 'https://flagsapi.com/PL/flat/64.png' },
            'THB': { country: 'Thailand', countryCode: 'th', currencyName: 'Thai Baht', flag: 'https://flagsapi.com/TH/flat/64.png' },
            'MYR': { country: 'Malaysia', countryCode: 'my', currencyName: 'Malaysian Ringgit', flag: 'https://flagsapi.com/MY/flat/64.png' },
            'IDR': { country: 'Indonesia', countryCode: 'id', currencyName: 'Indonesian Rupiah', flag: 'https://flagsapi.com/ID/flat/64.png' },
            'PHP': { country: 'Philippines', countryCode: 'ph', currencyName: 'Philippine Peso', flag: 'https://flagsapi.com/PH/flat/64.png' },
            'VND': { country: 'Vietnam', countryCode: 'vn', currencyName: 'Vietnamese Dong', flag: 'https://flagsapi.com/VN/flat/64.png' },
            'AED': { country: 'UAE', countryCode: 'ae', currencyName: 'UAE Dirham', flag: 'https://flagsapi.com/AE/flat/64.png' },
            'SAR': { country: 'Saudi Arabia', countryCode: 'sa', currencyName: 'Saudi Riyal', flag: 'https://flagsapi.com/SA/flat/64.png' },
            'ILS': { country: 'Israel', countryCode: 'il', currencyName: 'Israeli Shekel', flag: 'https://flagsapi.com/IL/flat/64.png' },
            'EGP': { country: 'Egypt', countryCode: 'eg', currencyName: 'Egyptian Pound', flag: 'https://flagsapi.com/EG/flat/64.png' },
            'DKK': { country: 'Denmark', countryCode: 'dk', currencyName: 'Danish Krone', flag: 'https://flagsapi.com/DK/flat/64.png' },
            'CZK': { country: 'Czech Republic', countryCode: 'cz', currencyName: 'Czech Koruna', flag: 'https://flagsapi.com/CZ/flat/64.png' },
            'HUF': { country: 'Hungary', countryCode: 'hu', currencyName: 'Hungarian Forint', flag: 'https://flagsapi.com/HU/flat/64.png' },
            'RON': { country: 'Romania', countryCode: 'ro', currencyName: 'Romanian Leu', flag: 'https://flagsapi.com/RO/flat/64.png' },
            'BGN': { country: 'Bulgaria', countryCode: 'bg', currencyName: 'Bulgarian Lev', flag: 'https://flagsapi.com/BG/flat/64.png' },
            'HRK': { country: 'Croatia', countryCode: 'hr', currencyName: 'Croatian Kuna', flag: 'https://flagsapi.com/HR/flat/64.png' },
            'ISK': { country: 'Iceland', countryCode: 'is', currencyName: 'Icelandic Krona', flag: 'https://flagsapi.com/IS/flat/64.png' },
            'CLP': { country: 'Chile', countryCode: 'cl', currencyName: 'Chilean Peso', flag: 'https://flagsapi.com/CL/flat/64.png' },
            'ARS': { country: 'Argentina', countryCode: 'ar', currencyName: 'Argentine Peso', flag: 'https://flagsapi.com/AR/flat/64.png' },
            'COP': { country: 'Colombia', countryCode: 'co', currencyName: 'Colombian Peso', flag: 'https://flagsapi.com/CO/flat/64.png' },
            'PEN': { country: 'Peru', countryCode: 'pe', currencyName: 'Peruvian Sol', flag: 'https://flagsapi.com/PE/flat/64.png' },
            'UYU': { country: 'Uruguay', countryCode: 'uy', currencyName: 'Uruguayan Peso', flag: 'https://flagsapi.com/UY/flat/64.png' }
        };
        
        this.countryData = fallbackData;
        console.log('Using fallback country data with', Object.keys(fallbackData).length, 'currencies');
    }
    
    async loadExchangeRates(base = 'USD') {
        try {
            this.setLoadingState(true);
            
            const response = await fetch(`${this.baseUrl}/${this.apiKey}/latest/${base}`);
            if (!response.ok) {
                // If API fails, use mock data
                console.warn('Exchange rate API failed, using mock data');
                this.loadMockExchangeRates(base);
                return;
            }
            
            const data = await response.json();
            
            if (data.result === 'success') {
                this.exchangeRates = data.conversion_rates;
                this.currentBase = base;
                this.lastUpdated = new Date(data.time_last_update_unix * 1000);
            } else {
                throw new Error(data['error-type'] || 'API Error');
            }
            
        } catch (error) {
            console.warn('Error loading exchange rates, using mock data:', error);
            this.loadMockExchangeRates(base);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    loadMockExchangeRates(base = 'USD') {
        // Mock exchange rates for demonstration
        const mockRates = {
            'USD': 1.0,
            'EUR': 0.85,
            'GBP': 0.73,
            'JPY': 110.0,
            'AUD': 1.35,
            'CAD': 1.25,
            'CHF': 0.92,
            'CNY': 6.45,
            'SEK': 8.60,
            'NZD': 1.42,
            'MXN': 20.15,
            'SGD': 1.35,
            'HKD': 7.80,
            'NOK': 8.50,
            'KRW': 1180.0,
            'TRY': 8.50,
            'INR': 74.50,
            'BRL': 5.20,
            'RUB': 75.0,
            'ZAR': 14.50,
            'PLN': 3.85,
            'THB': 32.0,
            'MYR': 4.15,
            'IDR': 14250.0,
            'PHP': 50.0,
            'VND': 23000.0,
            'AED': 3.67,
            'SAR': 3.75,
            'ILS': 3.25,
            'EGP': 15.70,
            'DKK': 6.35,
            'CZK': 21.50,
            'HUF': 300.0,
            'RON': 4.20,
            'BGN': 1.66,
            'HRK': 6.40,
            'ISK': 125.0,
            'CLP': 780.0,
            'ARS': 98.0,
            'COP': 3750.0,
            'PEN': 3.60,
            'UYU': 43.5
        };
        
        // Adjust rates based on base currency
        if (base !== 'USD') {
            const baseRate = mockRates[base] || 1;
            Object.keys(mockRates).forEach(currency => {
                mockRates[currency] = mockRates[currency] / baseRate;
            });
        }
        
        this.exchangeRates = mockRates;
        this.currentBase = base;
        this.lastUpdated = new Date();
        
        console.log('Using mock exchange rates for', Object.keys(mockRates).length, 'currencies');
    }
    
    setupEventListeners() {
        // Convert button
        const convertBtn = document.getElementById('convertButton');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertCurrency());
        }
        
        // Swap button
        const swapBtn = document.getElementById('swapButton');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapCurrencies());
        }
        
        // Amount input
        const amountInput = document.getElementById('amountInput');
        if (amountInput) {
            amountInput.addEventListener('input', () => this.debounce(() => this.convertCurrency(), 500));
            amountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.convertCurrency();
            });
        }
        
        // Currency selects
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        if (fromSelect) {
            fromSelect.addEventListener('change', (e) => {
                this.updateFlagDisplay('fromFlag', e.target.value);
                this.convertCurrency();
            });
        }
        
        if (toSelect) {
            toSelect.addEventListener('change', (e) => {
                this.updateFlagDisplay('toFlag', e.target.value);
                this.convertCurrency();
            });
        }
        
        // Quick convert buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                const amountInput = document.getElementById('amountInput');
                if (amountInput) {
                    amountInput.value = amount;
                    this.convertCurrency();
                }
            });
        });
        
        // Show all currencies button
        const showAllBtn = document.getElementById('showAllBtn');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => this.toggleAllCurrencies());
        }
        
        // Chart controls
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                // Chart functionality would go here
            });
        });
    }
    
    populateSelectOptions() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        if (!fromSelect || !toSelect) return;
        
        // Clear existing options except the first one
        fromSelect.innerHTML = '<option value="">Select Currency...</option>';
        toSelect.innerHTML = '<option value="">Select Currency...</option>';
        
        // Sort currencies alphabetically
        const sortedCurrencies = Object.keys(this.countryData).sort();
        
        sortedCurrencies.forEach(currencyCode => {
            const data = this.countryData[currencyCode];
            const optionText = `${currencyCode} - ${data.country}`;
            
            const fromOption = new Option(optionText, currencyCode);
            const toOption = new Option(optionText, currencyCode);
            
            fromSelect.appendChild(fromOption);
            toSelect.appendChild(toOption);
        });
    }
    
    setDefaultCurrencies() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        if (fromSelect && toSelect) {
            fromSelect.value = 'USD';
            toSelect.value = 'EUR';
            
            this.updateFlagDisplay('fromFlag', 'USD');
            this.updateFlagDisplay('toFlag', 'EUR');
            
            // Trigger initial conversion
            setTimeout(() => this.convertCurrency(), 100);
        }
    }
    
    updateFlagDisplay(flagElementId, currencyCode) {
        const flagElement = document.getElementById(flagElementId);
        if (!flagElement || !currencyCode || !this.countryData[currencyCode]) return;
        
        const flagUrl = this.countryData[currencyCode].flag;
        flagElement.style.backgroundImage = `url(${flagUrl})`;
    }
    
    async convertCurrency() {
        if (this.isLoading) return;
        
        const fromCurrency = document.getElementById('fromCurrency')?.value;
        const toCurrency = document.getElementById('toCurrency')?.value;
        const amount = parseFloat(document.getElementById('amountInput')?.value) || 1;
        
        if (!fromCurrency || !toCurrency) {
            this.hideConversionResult();
            return;
        }
        
        try {
            // Load rates for the base currency if needed
            if (this.currentBase !== fromCurrency) {
                await this.loadExchangeRates(fromCurrency);
            }
            
            let convertedAmount;
            if (fromCurrency === toCurrency) {
                convertedAmount = amount;
            } else {
                const rate = this.exchangeRates[toCurrency];
                if (!rate) {
                    throw new Error(`Exchange rate not found for ${toCurrency}`);
                }
                convertedAmount = amount * rate;
            }
            
            this.displayConversionResult(
                amount,
                fromCurrency,
                convertedAmount,
                toCurrency
            );
            
        } catch (error) {
            console.error('Conversion error:', error);
            this.handleError('Failed to convert currency');
        }
    }
    
    displayConversionResult(fromAmount, fromCurrency, toAmount, toCurrency) {
        const resultContainer = document.getElementById('conversionResult');
        const fromAmountEl = document.getElementById('fromAmount');
        const toCurrencyNameEl = document.getElementById('fromCurrencyName');
        const toAmountEl = document.getElementById('toAmount');
        const toCurrencyEl = document.getElementById('toCurrencyName');
        const exchangeRateEl = document.getElementById('exchangeRate');
        
        if (!resultContainer) return;
        
        // Format amounts
        const formattedFromAmount = this.formatAmount(fromAmount);
        const formattedToAmount = this.formatAmount(toAmount);
        
        // Update display elements
        if (fromAmountEl) fromAmountEl.textContent = formattedFromAmount;
        if (toCurrencyNameEl) toCurrencyNameEl.textContent = fromCurrency;
        if (toAmountEl) toAmountEl.textContent = formattedToAmount;
        if (toCurrencyEl) toCurrencyEl.textContent = toCurrency;
        
        // Update exchange rate
        if (exchangeRateEl) {
            const rate = fromCurrency === toCurrency ? 1 : this.exchangeRates[toCurrency];
            exchangeRateEl.textContent = `1 ${fromCurrency} = ${this.formatAmount(rate)} ${toCurrency}`;
        }
        
        // Show result with animation
        resultContainer.classList.add('show');
        
        // Add animation class
        resultContainer.classList.add('scale-in');
        setTimeout(() => {
            resultContainer.classList.remove('scale-in');
        }, 400);
    }
    
    hideConversionResult() {
        const resultContainer = document.getElementById('conversionResult');
        if (resultContainer) {
            resultContainer.classList.remove('show');
        }
    }
    
    swapCurrencies() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        if (!fromSelect || !toSelect) return;
        
        const fromValue = fromSelect.value;
        const toValue = toSelect.value;
        
        fromSelect.value = toValue;
        toSelect.value = fromValue;
        
        this.updateFlagDisplay('fromFlag', toValue);
        this.updateFlagDisplay('toFlag', fromValue);
        
        // Add swap animation
        const swapBtn = document.getElementById('swapButton');
        if (swapBtn) {
            swapBtn.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                swapBtn.style.transform = '';
                this.convertCurrency();
            }, 200);
        }
    }
    
    renderPopularCurrencies() {
        const grid = document.getElementById('currenciesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.popularCurrencies.forEach(currencyCode => {
            if (!this.countryData[currencyCode]) return;
            
            const data = this.countryData[currencyCode];
            const rate = this.exchangeRates[currencyCode] || 1;
            const change = this.generateRandomChange(); // In real app, get actual change data
            
            const card = this.createCurrencyCard(currencyCode, data, rate, change);
            grid.appendChild(card);
        });
    }
    
    createCurrencyCard(currencyCode, data, rate, change) {
        const card = document.createElement('div');
        card.className = 'currency-card fade-in';
        
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSymbol = change >= 0 ? '▲' : '▼';
        
        card.innerHTML = `
            <div class="currency-header">
                <div class="currency-flag" style="background-image: url(${data.flag})"></div>
                <div class="currency-info">
                    <h3>${data.country}</h3>
                    <p>${currencyCode} - ${data.currencyName}</p>
                </div>
            </div>
            <div class="currency-rate">
                <span class="rate-value">${this.formatAmount(rate)}</span>
                <span class="rate-change ${changeClass}">
                    ${changeSymbol} ${Math.abs(change).toFixed(2)}%
                </span>
            </div>
        `;
        
        // Add click handler to set as currencies
        card.addEventListener('click', () => {
            const fromSelect = document.getElementById('fromCurrency');
            const toSelect = document.getElementById('toCurrency');
            
            if (fromSelect && !fromSelect.value) {
                fromSelect.value = currencyCode;
                this.updateFlagDisplay('fromFlag', currencyCode);
            } else if (toSelect) {
                toSelect.value = currencyCode;
                this.updateFlagDisplay('toFlag', currencyCode);
            }
            
            this.convertCurrency();
        });
        
        return card;
    }
    
    toggleAllCurrencies() {
        const grid = document.getElementById('currenciesGrid');
        const showAllBtn = document.getElementById('showAllBtn');
        
        if (!grid || !showAllBtn) return;
        
        const isShowingAll = showAllBtn.textContent.includes('Show Less');
        
        if (isShowingAll) {
            this.renderPopularCurrencies();
            showAllBtn.innerHTML = '<span>Show All Currencies</span><div class="btn-arrow">→</div>';
        } else {
            this.renderAllCurrencies();
            showAllBtn.innerHTML = '<span>Show Less</span><div class="btn-arrow">←</div>';
        }
    }
    
    renderAllCurrencies() {
        const grid = document.getElementById('currenciesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Object.keys(this.countryData).sort().forEach(currencyCode => {
            const data = this.countryData[currencyCode];
            const rate = this.exchangeRates[currencyCode] || 1;
            const change = this.generateRandomChange();
            
            const card = this.createCurrencyCard(currencyCode, data, rate, change);
            grid.appendChild(card);
        });
    }
    
    updateLastUpdated() {
        const updateElement = document.getElementById('lastUpdated');
        if (!updateElement || !this.lastUpdated) return;
        
        const now = new Date();
        const diffMinutes = Math.floor((now - this.lastUpdated) / (1000 * 60));
        
        let timeText;
        if (diffMinutes < 1) {
            timeText = 'Just now';
        } else if (diffMinutes < 60) {
            timeText = `${diffMinutes} minutes ago`;
        } else {
            const diffHours = Math.floor(diffMinutes / 60);
            timeText = `${diffHours} hours ago`;
        }
        
        updateElement.textContent = `Updated ${timeText}`;
    }
    
    formatAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
        
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(2) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(2) + 'K';
        } else if (amount >= 1) {
            return amount.toFixed(2);
        } else {
            return amount.toFixed(4);
        }
    }
    
    generateRandomChange() {
        return (Math.random() * 10 - 5); // Random change between -5% and +5%
    }
    
    setLoadingState(loading) {
        this.isLoading = loading;
        const convertBtn = document.getElementById('convertButton');
        
        if (convertBtn) {
            if (loading) {
                convertBtn.classList.add('loading');
                convertBtn.disabled = true;
            } else {
                convertBtn.classList.remove('loading');
                convertBtn.disabled = false;
            }
        }
    }
    
    handleError(message, isWarning = false) {
        if (isWarning) {
            console.warn(message);
        } else {
            console.error(message);
        }
        
        // Only show toast for actual errors, not warnings
        if (!isWarning) {
            // Create a simple toast notification
            const toast = document.createElement('div');
            toast.className = 'error-toast';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--error-color);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
                z-index: 10000;
                font-weight: 500;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 5 seconds
            setTimeout(() => {
                toast.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 5000);
        }
    }
    
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }
}

// Initialize the currency converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.currency-card, .converter-card').forEach(el => {
        observer.observe(el);
    });
});