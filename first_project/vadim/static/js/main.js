document.addEventListener('DOMContentLoaded', function() {
    
    let currentCurrency = localStorage.getItem('selectedCurrency') || 'RUB';
    const rates = { 
        RUB: 1, 
        USD: 0.011, 
        EUR: 0.01, 
        BTC: 0.00000011, 
        ETH: 0.0000032, 
        USDT: 0.011 
    };
    const symbols = { 
        RUB: '₽', 
        USD: '$', 
        EUR: '€', 
        BTC: '₿', 
        ETH: 'Ξ', 
        USDT: '₮' 
    };
    
    const searchInput = document.querySelector('input[name="q"]');
    const priceMinInput = document.querySelector('input[name="price_min"]');
    const priceMaxInput = document.querySelector('input[name="price_max"]');
    const searchForm = document.querySelector('.search-form');
    const clearSearch = document.querySelector('.clear-search');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
    
    if (searchInput) {
        const tourCards = document.querySelectorAll('.tour-card');
        
        if (tourCards.length > 0) {
            const resultInfo = document.createElement('div');
            resultInfo.style.cssText = 'margin-top: 10px; color: #2563eb; font-weight: bold; text-align: center;';
            searchForm.appendChild(resultInfo);
            
            const tourPrices = new Map();
            tourCards.forEach(card => {
                const priceElement = card.querySelector('.price');
                if (priceElement) {
                    const priceText = priceElement.textContent;
                    const match = priceText.match(/[\d\s]+/);
                    if (match) {
                        const price = parseFloat(match[0].replace(/\s/g, '')) || 0;
                        tourPrices.set(card, price);
                    }
                }
            });
            
            function filterTours() {
                const query = searchInput.value.toLowerCase();
                
                let minPrice = parseFloat(priceMinInput?.value) || 0;
                let maxPrice = parseFloat(priceMaxInput?.value) || Infinity;
                
                if (currentCurrency !== 'RUB') {
                    const rate = rates[currentCurrency];
                    minPrice = Math.round(minPrice / rate);
                    maxPrice = maxPrice === Infinity ? Infinity : Math.round(maxPrice / rate);
                }
                
                let visibleCount = 0;
                
                tourCards.forEach(card => {
                    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                    const hotel = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
                    const price = tourPrices.get(card) || 0;
                    
                    const matchesSearch = !query || title.includes(query) || hotel.includes(query);
                    const matchesPrice = price >= minPrice && price <= maxPrice;
                    
                    if (matchesSearch && matchesPrice) {
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                if (query || minPrice > 0 || maxPrice < Infinity) {
                    resultInfo.textContent = `Найдено: ${visibleCount} из ${tourCards.length}`;
                    if (clearSearch) clearSearch.style.display = 'inline-block';
                } else {
                    resultInfo.textContent = `Всего: ${tourCards.length}`;
                    if (clearSearch) clearSearch.style.display = 'none';
                }
                
                const countStrong = document.querySelector('.search-results-info strong');
                if (countStrong) {
                    countStrong.textContent = visibleCount;
                }
            }
            
            searchInput.addEventListener('input', filterTours);
            if (priceMinInput) priceMinInput.addEventListener('input', filterTours);
            if (priceMaxInput) priceMaxInput.addEventListener('input', filterTours);
            
            if (clearSearch) {
                clearSearch.addEventListener('click', function(e) {
                    e.preventDefault();
                    searchInput.value = '';
                    if (priceMinInput) priceMinInput.value = '';
                    if (priceMaxInput) priceMaxInput.value = '';
                    filterTours();
                });
            }
            
            filterTours();
        }
    }

    const hotelSearchInput = document.querySelector('#hotel-search') || document.querySelector('input[name="q"]');
    const hotelCards = document.querySelectorAll('.hotel-card');
    
    if (hotelSearchInput && hotelCards.length > 0 && !document.querySelector('.tour-card')) {
        const hotelForm = hotelSearchInput.closest('form');
        if (hotelForm) {
            hotelForm.addEventListener('submit', function(e) {
                e.preventDefault();
            });
        }
        
        const resultInfo = document.createElement('div');
        resultInfo.style.cssText = 'margin-top: 10px; color: white; font-weight: bold; text-align: center;';
        hotelForm.appendChild(resultInfo);
        
        const clearBtn = document.querySelector('.clear-search');
        
        function filterHotels() {
            const query = hotelSearchInput.value.toLowerCase();
            let visibleCount = 0;
            
            hotelCards.forEach(card => {
                const name = card.querySelector('.hotel-name')?.textContent.toLowerCase() || '';
                const location = card.querySelector('.hotel-location')?.textContent.toLowerCase() || '';
                
                if (!query || name.includes(query) || location.includes(query)) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (query) {
                resultInfo.textContent = `Найдено: ${visibleCount} из ${hotelCards.length}`;
                if (clearBtn) clearBtn.style.display = 'inline-block';
            } else {
                resultInfo.textContent = `Всего: ${hotelCards.length}`;
                if (clearBtn) clearBtn.style.display = 'none';
            }
            
            const countStrong = document.querySelector('.search-results-info strong');
            if (countStrong) {
                countStrong.textContent = visibleCount;
            }
        }
        
        hotelSearchInput.addEventListener('input', filterHotels);
        
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                hotelSearchInput.value = '';
                filterHotels();
            });
        }
        
        filterHotels();
    }

    function getAllPriceElements() {
        return document.querySelectorAll(`
            .price, 
            .hotel-price, 
            .tour-price, 
            .price-badge,
            .hotel-category,
            .room-price
        `);
    }
    
    const priceElements = getAllPriceElements();
    
    if (priceElements.length > 0) {
        const originalPrices = new Map();
        
        priceElements.forEach(el => {
            const text = el.textContent;
            const match = text.match(/[\d\s]+/);
            if (match) {
                const num = parseFloat(match[0].replace(/\s/g, '')) || 0;
                if (num > 0) {
                    originalPrices.set(el, {
                        price: num,
                        originalText: text
                    });
                }
            }
        });
        
        const converter = document.createElement('div');
        converter.id = 'currency-converter';
        converter.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 998;
            display: flex;
            gap: 10px;
            align-items: center;
            border: 1px solid #e5e7eb;
        `;
        
        converter.innerHTML = `
            <span>💱</span>
            <select id="currency-select" style="padding: 6px; border-radius: 4px; border: 1px solid #d1d5db; cursor: pointer;">
                <option value="RUB" ${currentCurrency === 'RUB' ? 'selected' : ''}>₽ Рубли</option>
                <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>$ Доллары</option>
                <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>€ Евро</option>
                <option value="BTC" ${currentCurrency === 'BTC' ? 'selected' : ''}>₿ Bitcoin</option>
                <option value="ETH" ${currentCurrency === 'ETH' ? 'selected' : ''}>Ξ Ethereum</option>
                <option value="USDT" ${currentCurrency === 'USDT' ? 'selected' : ''}>₮ Tether</option>
            </select>
            <button id="reset-currency" style="padding: 6px 10px; background: #f3f4f6; border: none; border-radius: 4px; cursor: pointer;">↻</button>
        `;
        document.body.appendChild(converter);
        
        const select = document.getElementById('currency-select');
        const resetBtn = document.getElementById('reset-currency');
        
        function convertPrices(currency) {
            const rate = rates[currency];
            const symbol = symbols[currency];
            
            currentCurrency = currency;
            localStorage.setItem('selectedCurrency', currency);
            
            priceElements.forEach(el => {
                const data = originalPrices.get(el);
                if (data) {
                    const converted = data.price * rate;
                    let originalText = data.originalText;
                    
                    const numberRegex = /[\d\s]+/;
                    const match = originalText.match(numberRegex);
                    
                    if (match) {
                        let formatted;
                        if (currency === 'BTC' || currency === 'ETH') {
                            formatted = converted.toFixed(6);
                        } else if (currency === 'USDT') {
                            formatted = converted.toFixed(2);
                        } else {
                            formatted = Math.round(converted).toLocaleString();
                        }
                        
                        const newText = originalText.replace(match[0], formatted);
                        
                        if (originalText.includes('₽/ночь')) {
                            el.textContent = newText.replace('₽/ночь', symbol + '/ночь');
                        } else if (originalText.includes('₽')) {
                            el.textContent = newText.replace('₽', symbol);
                        } else {
                            el.textContent = formatted + ' ' + symbol;
                        }
                    }
                }
            });
            
            document.querySelectorAll('.currency').forEach(el => {
                el.textContent = symbol;
            });
            
            if (priceMinInput) {
                priceMinInput.placeholder = '0';
            }
            if (priceMaxInput) {
                const maxPlaceholder = currency === 'RUB' ? '100000' : Math.round(100000 * rate).toLocaleString();
                priceMaxInput.placeholder = maxPlaceholder;
            }
        }
        
        if (currentCurrency !== 'RUB') {
            convertPrices(currentCurrency);
        }
        
        select.addEventListener('change', function() {
            convertPrices(this.value);
            if (searchInput && typeof filterTours === 'function') {
                filterTours();
            }
        });
        
        resetBtn.addEventListener('click', function() {
            select.value = 'RUB';
            currentCurrency = 'RUB';
            localStorage.setItem('selectedCurrency', 'RUB');
            
            priceElements.forEach(el => {
                const data = originalPrices.get(el);
                if (data) {
                    el.textContent = data.originalText;
                }
            });
            
            document.querySelectorAll('.currency').forEach(el => {
                el.textContent = '₽';
            });
            
            if (priceMinInput) {
                priceMinInput.placeholder = '0';
            }
            if (priceMaxInput) {
                priceMaxInput.placeholder = '100000';
            }
        });
    }

    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        scrollBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const cards = document.querySelectorAll('.tour-card, .hotel-card');
    cards.forEach(function(card, i) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(function() {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 50);
    });

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});





