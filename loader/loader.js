(function() {
            // ---------- PROFESSIONAL LOADER SIMULATION (deterministic + realistic finish) ----------
            // This script handles:
            // 1. Animated ticker with fake but realistic market data.
            // 2. Progress bar that increments smoothly from 0% to 100% in 2.4 seconds (adjustable)
            // 3. Phase text cycles through trading initialization steps.
            // 4. Once complete, fades out loader and reveals main content.
            
            const loaderOverlay = document.getElementById('professionalLoader');
            const mainContent = document.getElementById('mainAppContent');
            const loadFill = document.getElementById('loadFillBar');
            const loadPercentSpan = document.getElementById('loadPercent');
            const phaseSpan = document.getElementById('loadPhase');
            
            // Ticker data: realistic trading instruments
            const tickerAssets = [
                { sym: "BTC/USD", price: 68452.30, delta: "+2.35%", pos: true },
                { sym: "ETH/USD", price: 3849.15, delta: "+1.08%", pos: true },
                { sym: "AAPL", price: 192.78, delta: "-0.32%", pos: false },
                { sym: "NVDA", price: 891.42, delta: "+3.12%", pos: true },
                { sym: "EUR/USD", price: 1.0894, delta: "+0.07%", pos: true },
                { sym: "GBP/JPY", price: 192.31, delta: "-0.18%", pos: false },
                { sym: "TSLA", price: 175.92, delta: "-1.45%", pos: false },
                { sym: "GOLD", price: 2364.20, delta: "+0.62%", pos: true }
            ];
            
            // helper: format price accordingly
            function formatPrice(sym, price) {
                if (sym.includes("BTC") || sym.includes("ETH")) return `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                if (sym === "GOLD") return `$${price.toFixed(2)}`;
                if (sym.includes("USD") && !sym.includes("BTC") && !sym.includes("ETH")) return price.toFixed(4);
                return `$${price.toFixed(2)}`;
            }
            
            // function to build ticker HTML (two loops for smooth seamless scroll)
            function buildTickerHTML() {
                let html = '';
                // double items to prevent empty gap
                for (let cycle = 0; cycle < 2; cycle++) {
                    tickerAssets.forEach(asset => {
                        const priceStr = formatPrice(asset.sym, asset.price);
                        const deltaClass = asset.pos ? 'pos' : 'neg';
                        const arrow = asset.pos ? '▲' : '▼';
                        html += `
                            <div class="ticker-chip">
                                <span class="ticker-sym">${asset.sym}</span>
                                <span class="ticker-val">${priceStr}</span>
                                <span class="ticker-delta ${deltaClass}">${arrow} ${asset.delta}</span>
                            </div>
                        `;
                    });
                }
                return html;
            }
            
            // render ticker
            const tickerContainer = document.getElementById('loaderTicker');
            if (tickerContainer) {
                tickerContainer.innerHTML = buildTickerHTML();
            }
            
            // slight live price drift simulation for loader ticker (adds realism not needed for core loading but nice)
            function updateTickerPricesRandomly() {
                tickerAssets.forEach(asset => {
                    let variation = (Math.random() - 0.5) * 0.006;
                    let newPrice = asset.price * (1 + variation);
                    if (asset.sym === "BTC/USD") newPrice = Math.min(72000, Math.max(66000, newPrice));
                    if (asset.sym === "ETH/USD") newPrice = Math.min(4100, Math.max(3700, newPrice));
                    asset.price = parseFloat(newPrice.toFixed(asset.sym.includes("USD") && !asset.sym.includes("BTC") ? 4 : 2));
                    let deltaRaw = ((asset.price - (asset.sym === "BTC/USD" ? 68452 : asset.sym === "ETH/USD" ? 3849 : asset.sym === "AAPL" ? 192.78 : asset.sym === "NVDA" ? 891.42 : asset.sym === "EUR/USD" ? 1.0894 : asset.sym === "GBP/JPY" ? 192.31 : asset.sym === "TSLA" ? 175.92 : 2364.20)) / (asset.sym === "BTC/USD" ? 68452 : asset.sym === "ETH/USD" ? 3849 : asset.sym === "AAPL" ? 192.78 : asset.sym === "NVDA" ? 891.42 : asset.sym === "EUR/USD" ? 1.0894 : asset.sym === "GBP/JPY" ? 192.31 : asset.sym === "TSLA" ? 175.92 : 2364.20)) * 100;
                    asset.delta = (deltaRaw >= 0 ? '+' : '') + deltaRaw.toFixed(2) + '%';
                    asset.pos = deltaRaw >= 0;
                });
                if (tickerContainer) {
                    tickerContainer.innerHTML = buildTickerHTML();
                }
            }
            
            // periodic ticker update every 2.5 seconds (makes loading overlay lively)
            let tickerInterval = setInterval(() => {
                if (loaderOverlay && loaderOverlay.style.opacity !== '0') {
                    updateTickerPricesRandomly();
                } else {
                    // if loader hidden, we can clear interval for performance
                    if (tickerInterval) clearInterval(tickerInterval);
                }
            }, 2600);
            
            // ----- LOADING PROGRESS SIMULATION (professional ramp from 0 to 100%) -----
            let progress = 0;
            let animationInterval = null;
            const LOAD_DURATION = 2200; // 2.2 seconds to full load (typical for modern trading app)
            const startTimestamp = performance.now();
            
            // Phases copy for trading platform
            const loadingPhases = [
                "CONNECTING FEEDS",
                "LOAD ORDER BOOKS",
                "SYNC LIQUITY POOLS",
                "VALIDATING GATEWAYS",
                "CALIBRATING RISK",
                "STREAM ACTIVE"
            ];
            
            function updateLoaderProgress(now) {
                const elapsed = now - startTimestamp;
                let rawPercent = (elapsed / LOAD_DURATION) * 100;
                if (rawPercent >= 100) {
                    rawPercent = 100;
                    // finish loading
                    if (animationInterval) cancelAnimationFrame(animationInterval);
                    // complete loading events
                    if (loadFill) loadFill.style.width = '100%';
                    if (loadPercentSpan) loadPercentSpan.innerText = '100%';
                    if (phaseSpan) phaseSpan.innerText = 'LIVE · READY';
                    // hide loader + show main content
                    if (loaderOverlay) {
                        loaderOverlay.style.opacity = '0';
                        setTimeout(() => {
                            loaderOverlay.style.visibility = 'hidden';
                            loaderOverlay.style.display = 'none';
                        }, 500);
                    }
                    if (mainContent) {
                        mainContent.style.visibility = 'visible';
                        mainContent.style.opacity = '1';
                    }
                    // clear any ongoing ticker interval to be clean
                    if (tickerInterval) clearInterval(tickerInterval);
                    return;
                }
                
                // easing for more natural loading feel
                let eased = Math.pow(rawPercent / 100, 1.2) * 100;
                const percentValue = Math.min(99, Math.floor(eased));
                if (loadFill) loadFill.style.width = percentValue + '%';
                if (loadPercentSpan) loadPercentSpan.innerText = percentValue + '%';
                
                // dynamic phase text based on progress
                let phaseIndex = Math.floor((percentValue / 100) * loadingPhases.length);
                if (phaseIndex >= loadingPhases.length) phaseIndex = loadingPhases.length - 1;
                if (phaseSpan && percentValue < 100) {
                    if (percentValue > 85) phaseSpan.innerText = "FINALIZING CONTRACTS";
                    else phaseSpan.innerText = loadingPhases[phaseIndex] || "LOADING ASSETS";
                }
            }
            
            function animateProgress() {
                const now = performance.now();
                updateLoaderProgress(now);
                if (progress < 100) {
                    animationInterval = requestAnimationFrame(animateProgress);
                }
            }
            
            // small fallback: ensure even if performance weird, max timeout hit.
            const safetyTimeout = setTimeout(() => {
                if (loaderOverlay && loaderOverlay.style.display !== 'none') {
                    // force finish loading
                    if (loadFill) loadFill.style.width = '100%';
                    if (loadPercentSpan) loadPercentSpan.innerText = '100%';
                    if (phaseSpan) phaseSpan.innerText = 'MARKET READY';
                    loaderOverlay.style.opacity = '0';
                    setTimeout(() => {
                        loaderOverlay.style.visibility = 'hidden';
                        loaderOverlay.style.display = 'none';
                    }, 400);
                    mainContent.style.visibility = 'visible';
                    mainContent.style.opacity = '1';
                    if (tickerInterval) clearInterval(tickerInterval);
                    if (animationInterval) cancelAnimationFrame(animationInterval);
                }
            }, 3200); // extra backup
            
            // start the progress animation
            animateProgress();
            
            // preemptively ensure that if page already loaded (DOMContentLoaded double safety)
            window.addEventListener('load', function() {
                // just to be safe, but animation already started. However we ensure no glitch.
                // also force ticker readability
                if (tickerContainer && tickerContainer.innerHTML === "") {
                    tickerContainer.innerHTML = buildTickerHTML();
                }
            });
            
            // Edge-case: if user navigates via back/forward, ensure loader disappears only once.
            window.addEventListener('pageshow', function(event) {
                if (event.persisted && loaderOverlay && loaderOverlay.style.display !== 'none') {
                    // if page loaded from bfcache, force hide loader after micro delay
                    setTimeout(() => {
                        if (loaderOverlay) {
                            loaderOverlay.style.opacity = '0';
                            loaderOverlay.style.visibility = 'hidden';
                            loaderOverlay.style.display = 'none';
                        }
                        if (mainContent) {
                            mainContent.style.visibility = 'visible';
                            mainContent.style.opacity = '1';
                        }
                        if (tickerInterval) clearInterval(tickerInterval);
                    }, 50);
                }
            });
            
            // cleanup intervals on unmount hypothetical
            window.addEventListener('beforeunload', () => {
                if (tickerInterval) clearInterval(tickerInterval);
                if (animationInterval) cancelAnimationFrame(animationInterval);
                clearTimeout(safetyTimeout);
            });
        })();