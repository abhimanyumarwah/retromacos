;(function() {
    function createWindow(options) {
        const desktop = document.getElementById('desktop');
        const win = document.createElement('div');
        win.className = 'window';
        win.style.left = (options.x || 80) + 'px';
        win.style.top = (options.y || 80) + 'px';
        win.style.width = (options.width || 420) + 'px';

        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';
        const title = document.createElement('div');
        title.className = 'title-text';
        title.textContent = options.title || 'Window';
        const controls = document.createElement('div');
        controls.className = 'controls';
        const closeBtn = document.createElement('div');
        closeBtn.className = 'control-btn';
        controls.appendChild(closeBtn);
        titleBar.appendChild(title);
        titleBar.appendChild(controls);

        const content = document.createElement('div');
        content.className = 'content';
        if (typeof options.content === 'string') {
            content.innerHTML = options.content;
        } else if (options.content instanceof Node) {
            content.appendChild(options.content);
        }

        const status = document.createElement('div');
        status.className = 'status-bar';
        const left = document.createElement('div');
        left.textContent = 'Ready';
        const right = document.createElement('div');
        right.textContent = new Date().toLocaleTimeString();
        status.appendChild(left);
        status.appendChild(right);

        win.appendChild(titleBar);
        win.appendChild(content);
        win.appendChild(status);
        desktop.appendChild(win);

        // Focus/z-index
        win.addEventListener('mousedown', () => bringToFront(win));
        function bringToFront(el) {
            const windows = Array.from(document.querySelectorAll('.window'));
            const z = Math.max(10, ...windows.map(w => parseInt(getComputedStyle(w).zIndex || '10')));
            el.style.zIndex = String(z + 1);
        }
        bringToFront(win);

        // Dragging
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;
        titleBar.addEventListener('mousedown', (e) => {
            dragging = true;
            const rect = win.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const maxX = window.innerWidth - win.offsetWidth;
            const maxY = window.innerHeight - win.offsetHeight;
            let nx = e.clientX - offsetX;
            let ny = e.clientY - offsetY;
            nx = Math.max(0, Math.min(nx, maxX));
            ny = Math.max(22, Math.min(ny, maxY));
            win.style.left = nx + 'px';
            win.style.top = ny + 'px';
        });
        window.addEventListener('mouseup', () => { dragging = false; });

        // Close
        closeBtn.addEventListener('click', () => {
            win.remove();
        });

        return { element: win, setContent(value) {
            content.innerHTML = '';
            if (typeof value === 'string') {
                content.innerHTML = value;
            } else if (value instanceof Node) {
                content.appendChild(value);
            }
        } };
    }

    function openAbout() {
        const html = [
            '<div style="display:flex;gap:12px;align-items:flex-start">',
            "<div style='width:64px;height:64px;border:1px solid #000;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:700'></div>",
            '<div>',
            '<div style="font-weight:700;margin-bottom:6px">About This Mac</div>',
            '<div>Retro Mac OS (Browser Edition)</div>',
            '<div>Version 0.1</div>',
            '<div style="margin-top:8px;font-size:12px;color:#333">Built with HTML/CSS/JS in this repo.</div>',
            '</div>',
            '</div>'
        ].join('');
        createWindow({ title: 'About This Mac', content: html, x: 120, y: 120, width: 360 });
    }

    function wireMenu() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                if (action === 'about') openAbout();
                if (action === 'beatbox') openBeatbox();
                if (action === 'gauntlet') openGauntlet();
                if (action === 'pixelpaint') openPixelPaint();
                if (action === 'notes') openNotes();
                if (action === 'snake') openSnake();
                if (action === 'ipod') { const ex = document.getElementById('ipod-overlay'); if (ex) ex.remove(); else openIPod(); }
                if (action === 'dream-macos') openDreamMacOS();
            });
        });
    }

    function wireIcons() {
        document.querySelectorAll('.icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.getAttribute('data-app');
                if (app === 'about') openAbout();
                if (app === 'beatbox') openBeatbox();
                if (app === 'gauntlet') openGauntlet();
                if (app === 'pixelpaint') openPixelPaint();
                if (app === 'notes') openNotes();
                if (app === 'snake') openSnake();
                if (app === 'ipod') { const ex = document.getElementById('ipod-overlay'); if (ex) ex.remove(); else openIPod(); }
                if (app === 'dream-macos') openDreamMacOS();
            });
            // Single click opens Gauntlet explicitly
            icon.addEventListener('click', () => {
                const app = icon.getAttribute('data-app');
                if (app === 'beatbox') openBeatbox();
                if (app === 'gauntlet') openGauntlet();
                if (app === 'pixelpaint') openPixelPaint();
                if (app === 'notes') openNotes();
                if (app === 'snake') openSnake();
                if (app === 'ipod') { const ex = document.getElementById('ipod-overlay'); if (ex) ex.remove(); else openIPod(); }
                if (app === 'dream-macos') openDreamMacOS();
            });
        });
    }

    window.addEventListener('load', () => {
        wireMenu();
        wireIcons();
        // Boot splash
        setTimeout(openAbout, 400);
    });
    
    // Beatbox App
    function openBeatbox() {
        // Reuse window if already open; bring to front
        const existing = Array.from(document.querySelectorAll('.window')).find(w => {
            const t = w.querySelector('.title-text');
            return t && t.textContent === 'Beatbox';
        });
        if (existing) {
            const windows = Array.from(document.querySelectorAll('.window'));
            const z = Math.max(10, ...windows.map(w => parseInt(getComputedStyle(w).zIndex || '10')));
            existing.style.zIndex = String(z + 1);
            return;
        }
        const win = createWindow({ title: 'Beatbox', x: 120, y: 90, width: 860, content: '' });
        const content = [
            '<div style="display:flex;gap:8px;align-items:stretch;min-height:260px;width:100%;box-sizing:border-box">',
            '<div style="flex:1;display:flex;flex-direction:column;min-width:0">',
            '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">',
            '<button id="bb-play">Play</button>',
            '<button id="bb-stop">Stop</button>',
            '<label style="display:flex;align-items:center;gap:8px">Tempo <input id="bb-tempo" type="range" min="60" max="200" value="120"></label>',
            '<button id="bb-clear">Clear</button>',
            '<button id="bb-random">Random</button>',
            '<span style="display:inline-flex;gap:8px;white-space:nowrap"><button id="bb-export">Export</button><button id="bb-import">Import</button></span>',
            '<input id="bb-import-file" type="file" accept="application/json" style="display:none">',
            '</div>',
            '<div id="bb-grid" style="flex:1"></div>',
            '</div>',
            '<div style="flex:0 0 208px;width:208px;display:flex;flex-direction:column;border-left:1px solid #000;padding-left:8px;padding-right:8px;box-sizing:border-box;overflow:hidden">',
            '<div style="font-weight:700;margin-bottom:8px">Sound Pads</div>',
            '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">',
            '<button class="bb-pad" data-sound="kick">Kick</button>',
            '<button class="bb-pad" data-sound="snare">Snare</button>',
            '<button class="bb-pad" data-sound="hihat">Hi-Hat</button>',
            '<button class="bb-pad" data-sound="clap">Clap</button>',
            '<button class="bb-pad" data-sound="tom">Tom</button>',
            '<button class="bb-pad" data-sound="rim">Rim</button>',
            '</div>',
            '<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">',
            '<div style="font-weight:700;margin-bottom:8px">Presets</div>',
            '<button class="bb-preset" data-name="four">Four On The Floor</button>',
            '<button class="bb-preset" data-name="break">Breakbeat</button>',
            '<button class="bb-preset" data-name="hiphop">Hip Hop</button>',
            '<button class="bb-preset" data-name="electro">Electro</button>',
            '</div>',
            '<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">',
            '<div style="font-weight:700;margin-bottom:6px">Backtrack</div>',
            '<input id="bb-audio-file" type="file" accept="audio/*">',
            '<label style="display:flex;align-items:center;gap:8px;width:100%">Volume <input id="bb-audio-vol" type="range" min="0" max="1" step="0.01" value="0.6" style="width:140px"></label>',
            '</div>',
            '</div>',
            '</div>'
        ].join('');
        win.setContent(content);

        // Build 16-step, 6-row grid
        const grid = document.getElementById('bb-grid');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '44px repeat(16, minmax(12px, 1fr))';
        grid.style.gap = '3px 3px';
        grid.style.overflow = 'auto';
        grid.style.paddingRight = '2px';
        grid.style.boxSizing = 'border-box';
        const rows = ['kick','snare','hihat','clap','tom','rim'];
        const steps = 16;
        const state = {};
        rows.forEach((row) => { state[row] = new Array(steps).fill(false); });

        // Row labels and cells
        rows.forEach((row) => {
            const label = document.createElement('div');
            label.textContent = row;
            label.style.fontSize = '12px';
            label.style.alignSelf = 'center';
            label.style.textAlign = 'left';
            label.style.paddingRight = '6px';
            label.style.width = '44px';
            label.style.whiteSpace = 'nowrap';
            grid.appendChild(label);
            for (let i = 0; i < steps; i++) {
                const cell = document.createElement('div');
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-step', String(i));
                // Stretch to fill available space evenly while keeping square shape
                cell.style.width = '100%';
                cell.style.aspectRatio = '1 / 1';
                cell.style.border = '1px solid #000';
                // Ensure the last (16th) step shows a right border clearly
                if (i === steps - 1) {
                    cell.style.borderRightWidth = '2px';
                }
                cell.style.background = '#fff';
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', () => {
                    const on = !state[row][i];
                    state[row][i] = on;
                    cell.style.background = on ? '#000' : '#fff';
                });
                grid.appendChild(cell);
            }
        });

        // Web Audio synths
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let backtrackEl = null;
        let backtrackSrc = null;
        let backtrackGain = null;
        function playKick(time) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(50, time + 0.12);
            gain.gain.setValueAtTime(0.9, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
            osc.connect(gain).connect(audioContext.destination);
            osc.start(time);
            osc.stop(time + 0.15);
        }
        function noiseBuffer() {
            const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            return buffer;
        }
        function playSnare(time) {
            const noise = audioContext.createBufferSource();
            noise.buffer = noiseBuffer();
            const noiseFilter = audioContext.createBiquadFilter();
            noiseFilter.type = 'highpass';
            noiseFilter.frequency.value = 1000;
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.5, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
            noise.connect(noiseFilter).connect(gain).connect(audioContext.destination);
            noise.start(time);
            noise.stop(time + 0.2);
        }
        function playHiHat(time) {
            const noise = audioContext.createBufferSource();
            noise.buffer = noiseBuffer();
            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 5000;
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            noise.connect(filter).connect(gain).connect(audioContext.destination);
            noise.start(time);
            noise.stop(time + 0.06);
        }
        function playClap(time) { playSnare(time); }
        function playTom(time) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.exponentialRampToValueAtTime(90, time + 0.18);
            gain.gain.setValueAtTime(0.6, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
            osc.connect(gain).connect(audioContext.destination);
            osc.start(time);
            osc.stop(time + 0.2);
        }
        function playRim(time) { playHiHat(time); }

        const instrumentToPlayer = { kick: playKick, snare: playSnare, hihat: playHiHat, clap: playClap, tom: playTom, rim: playRim };

        // Pads - immediate trigger
        document.querySelectorAll('.bb-pad').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = btn.getAttribute('data-sound');
                instrumentToPlayer[s](audioContext.currentTime + 0.001);
            });
        });

        // Scheduler
        let currentStep = 0;
        let isPlaying = false;
        let tempo = 120;
        const lookaheadMs = 25;
        const scheduleAheadTime = 0.1; // seconds
        let nextNoteTime = 0;

        function nextNote() {
            const secondsPerBeat = 60.0 / tempo;
            nextNoteTime += 0.25 * secondsPerBeat; // 16th notes
            currentStep = (currentStep + 1) % steps;
        }

        function schedule() {
            while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
                rows.forEach((row) => {
                    if (state[row][currentStep]) {
                        instrumentToPlayer[row](nextNoteTime);
                    }
                });
                highlightStep(currentStep);
                nextNote();
            }
        }

        let timerId = null;
        function play() {
            if (isPlaying) return;
            isPlaying = true;
            currentStep = -1;
            nextNoteTime = audioContext.currentTime + 0.05;
            timerId = setInterval(() => { schedule(); }, lookaheadMs);
            if (backtrackEl) {
                try { backtrackEl.currentTime = 0; backtrackEl.play(); } catch (e) {}
            }
        }
        function stop() {
            isPlaying = false;
            if (timerId) clearInterval(timerId);
            clearHighlights();
            if (backtrackEl) {
                try { backtrackEl.pause(); } catch (e) {}
            }
        }

        function highlightStep(step) {
            const cells = Array.from(grid.querySelectorAll('div[data-step]'));
            cells.forEach(c => {
                const s = parseInt(c.getAttribute('data-step'));
                const row = c.getAttribute('data-row');
                if (s === step) {
                    const on = state[row][s];
                    c.style.outline = '2px solid #000';
                    c.style.background = on ? '#000' : '#ddd';
                } else {
                    const on = state[row][s];
                    c.style.outline = 'none';
                    c.style.background = on ? '#000' : '#fff';
                }
            });
        }
        function clearHighlights() { highlightStep(-1); }

        // Controls
        document.getElementById('bb-play').addEventListener('click', play);
        document.getElementById('bb-stop').addEventListener('click', stop);
        document.getElementById('bb-tempo').addEventListener('input', (e) => { tempo = parseInt(e.target.value, 10); });
        document.getElementById('bb-clear').addEventListener('click', () => {
            rows.forEach(r => state[r].fill(false));
            highlightStep(-1);
        });
        document.getElementById('bb-random').addEventListener('click', () => {
            rows.forEach(r => { for (let i = 0; i < steps; i++) state[r][i] = Math.random() < 0.2; });
            highlightStep(-1);
        });
        document.getElementById('bb-export').addEventListener('click', () => {
            const data = { tempo, steps, rows, state };
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'beat.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        document.getElementById('bb-import').addEventListener('click', () => {
            document.getElementById('bb-import-file').click();
        });
        document.getElementById('bb-import-file').addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (data && Array.isArray(data.rows) && typeof data.steps === 'number' && data.state) {
                    tempo = typeof data.tempo === 'number' ? data.tempo : tempo;
                    const tempoEl = document.getElementById('bb-tempo');
                    if (tempoEl) tempoEl.value = String(tempo);
                    // Reset
                    rows.forEach(r => state[r].fill(false));
                    // Apply if shapes match
                    rows.forEach(r => {
                        if (data.state[r]) {
                            for (let i = 0; i < Math.min(steps, data.state[r].length); i++) {
                                state[r][i] = !!data.state[r][i];
                            }
                        }
                    });
                    // Refresh cell visuals
                    highlightStep(-1);
                }
            } catch (err) {}
            e.target.value = '';
        });
        document.querySelectorAll('.bb-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                applyPreset(name);
            });
        });

        function applyPreset(name) {
            rows.forEach(r => state[r].fill(false));
            if (name === 'four') {
                for (let i = 0; i < steps; i += 4) state.kick[i] = true;
                for (let i = 2; i < steps; i += 4) state.snare[i] = true;
                for (let i = 0; i < steps; i++) if (i % 2 === 1) state.hihat[i] = true;
            }
            if (name === 'break') {
                [0,3,6,10,12,14].forEach(i => state.kick[i] = true);
                [4,8,13,15].forEach(i => state.snare[i] = true);
                for (let i = 0; i < steps; i++) state.hihat[i] = (i % 2 === 0);
                [5,11].forEach(i => state.tom[i] = true);
            }
            if (name === 'hiphop') {
                [0,8,12].forEach(i => state.kick[i] = true);
                [4,10].forEach(i => state.snare[i] = true);
                for (let i = 0; i < steps; i++) state.hihat[i] = (i % 2 === 0);
                [7,15].forEach(i => state.clap[i] = true);
            }
            if (name === 'electro') {
                for (let i = 0; i < steps; i += 2) state.hihat[i] = true;
                for (let i = 0; i < steps; i += 4) state.kick[i] = true;
                [8].forEach(i => state.snare[i] = true);
                [12].forEach(i => state.tom[i] = true);
            }
            highlightStep(-1);
        }

        // Backtrack loader
        const fileInput = document.getElementById('bb-audio-file');
        const volInput = document.getElementById('bb-audio-vol');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) return;
                if (backtrackEl) {
                    try { backtrackEl.pause(); } catch (e) {}
                }
                backtrackEl = new Audio();
                backtrackEl.src = URL.createObjectURL(file);
                backtrackEl.loop = true;
                if (!backtrackGain) {
                    backtrackGain = audioContext.createGain();
                    backtrackGain.gain.value = parseFloat(volInput.value);
                }
                if (backtrackSrc) {
                    try { backtrackSrc.disconnect(); } catch (e) {}
                }
                backtrackSrc = audioContext.createMediaElementSource(backtrackEl);
                backtrackSrc.connect(backtrackGain).connect(audioContext.destination);
            });
        }
        if (volInput) {
            volInput.addEventListener('input', () => {
                if (backtrackGain) backtrackGain.gain.value = parseFloat(volInput.value);
            });
        }
    }

    // Infinity Gauntlet App (Retro 2D UI)
    function openGauntlet() {
        // Reuse window if already open; bring to front
        const existing = Array.from(document.querySelectorAll('.window')).find(w => {
            const t = w.querySelector('.title-text');
            return t && t.textContent === 'Infinity Gauntlet';
        });
        if (existing) {
            const windows = Array.from(document.querySelectorAll('.window'));
            const z = Math.max(10, ...windows.map(w => parseInt(getComputedStyle(w).zIndex || '10')));
            existing.style.zIndex = String(z + 1);
            return;
        }

        const win = createWindow({ title: 'Infinity Gauntlet', x: 160, y: 120, width: 520, content: '' });
        const content = [
            '<div style="display:flex;gap:12px;align-items:flex-start">',
            "<div style='width:96px;height:96px;border:1px solid #000;background:#fff;display:flex;align-items:center;justify-content:center'>",
            // Retro pixel gauntlet drawing
            "<svg width='90' height='90' viewBox='0 0 48 48' style='image-rendering:pixelated'>",
            "<rect width='48' height='48' fill='white' stroke='black' />",
            "<path d='M16 34 L32 34 L34 20 L30 12 L26 12 L26 18 L22 18 L22 12 L18 12 L14 20 Z' fill='#d4af37' stroke='black' />",
            "<circle cx='24' cy='20' r='3' fill='#ffdd00' stroke='black' />", // Mind
            "<circle cx='18' cy='22' r='2' fill='#0066ff' stroke='black' />", // Space
            "<circle cx='21' cy='24' r='2' fill='#aa44ff' stroke='black' />", // Power
            "<circle cx='27' cy='24' r='2' fill='#ff4444' stroke='black' />", // Reality
            "<circle cx='30' cy='22' r='2' fill='#44ff44' stroke='black' />", // Time
            "<circle cx='24' cy='28' r='2' fill='#ff8844' stroke='black' />", // Soul
            "</svg>",
            "</div>",
            '<div style="flex:1">',
            '<div style="font-weight:700;margin-bottom:6px">Infinity Stones</div>',
            '<div style="font-size:12px;color:#333;margin-bottom:8px">Click a stone to read its retro manual entry.</div>',
            '<div id="stone-list" style="display:grid;grid-template-columns:1fr;gap:6px"></div>',
            '</div>',
            '</div>',
            '<div style="margin-top:10px;border-top:1px solid #000;padding-top:8px">',
            '<div style="font-weight:700;margin-bottom:6px">Stone Manual</div>',
            '<div id="stone-details" style="font-size:12px;line-height:1.4">Select a stone from the list to view description and powers.</div>',
            '</div>'
        ].join('');
        win.setContent(content);

        const stones = [
            { key: 'space', name: 'Space Stone', color: '#0066ff', powers: ['Teleportation', 'Dimensional gateways', 'Spatial manipulation'], desc: 'Bends the fabric of space, permitting instantaneous travel and spatial warps.' },
            { key: 'mind', name: 'Mind Stone', color: '#ffdd00', powers: ['Telepathy', 'Amplify intellect', 'Control suggestions'], desc: 'Interfaces with consciousness. Increases cognitive bandwidth to formidable levels.' },
            { key: 'reality', name: 'Reality Stone', color: '#ff4444', powers: ['Matter rewrite', 'Illusion solidification', 'Physical law edits'], desc: 'Overrides physical constraints. Converts “what if” into “what is.”' },
            { key: 'power', name: 'Power Stone', color: '#aa44ff', powers: ['Energy projection', 'Massive strength amp', 'Shockwaves'], desc: 'Raw cosmic throughput. Handle with caution. May overload unshielded devices.' },
            { key: 'time', name: 'Time Stone', color: '#44ff44', powers: ['Temporal loop', 'Rewind/fast-forward', 'Causality tweaks'], desc: 'Adjusts local time flow parameters. Observe paradox budgeting guidelines.' },
            { key: 'soul', name: 'Soul Stone', color: '#ff8844', powers: ['Essence exchange', 'Soul tether', 'Spirit vision'], desc: 'Interfaces with the anima layer. Requires intent clarity for safe operation.' }
        ];

        const list = document.getElementById('stone-list');
        const details = document.getElementById('stone-details');
        stones.forEach(st => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '8px';
            row.style.cursor = 'pointer';

            const sw = document.createElement('div');
            sw.style.width = '12px';
            sw.style.height = '12px';
            sw.style.border = '1px solid #000';
            sw.style.background = st.color;

            const label = document.createElement('div');
            label.textContent = st.name;
            label.style.fontSize = '12px';

            row.appendChild(sw);
            row.appendChild(label);
            row.addEventListener('click', () => {
                details.innerHTML = [
                    `<div style="font-weight:700;margin-bottom:4px">${st.name}</div>`,
                    `<div style="margin-bottom:6px;font-size:12px;color:#333">${st.desc}</div>`,
                    '<div style="font-weight:700;margin-bottom:4px">Powers</div>',
                    `<ul style="margin:0;padding-left:16px;font-size:12px">${st.powers.map(p=>`<li>${p}</li>`).join('')}</ul>`
                ].join('');
            });
            list.appendChild(row);
        });
    }

    // Pixel Paint App
    function openPixelPaint() {
        const existing = Array.from(document.querySelectorAll('.window')).find(w => {
            const t = w.querySelector('.title-text');
            return t && t.textContent === 'Pixel Paint';
        });
        if (existing) {
            const windows = Array.from(document.querySelectorAll('.window'));
            const z = Math.max(10, ...windows.map(w => parseInt(getComputedStyle(w).zIndex || '10')));
            existing.style.zIndex = String(z + 1);
            return;
        }
        const win = createWindow({ title: 'Pixel Paint', x: 140, y: 80, width: 640, content: '' });
        const content = [
            '<div style="display:flex;gap:12px;align-items:stretch">',
            '<div style="flex:0 0 176px;border-right:1px solid #000;padding-right:8px">',
            '<div style="font-weight:700;margin-bottom:6px">Tools</div>',
            '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:10px" id="pp-palette"></div>',
            '<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px">Grid <input id="pp-grid" type="checkbox" checked></label>',
            '<label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12px">Brush <input id="pp-brush" type="range" min="1" max="8" value="1"></label>',
            '<div style="display:flex;gap:8px;flex-wrap:wrap">',
            '<button id="pp-clear" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Clear</button>',
            '<button id="pp-export" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Export PNG</button>',
            '</div>',
            '</div>',
            '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:4px">',
            '<canvas id="pp-canvas" width="288" height="288" style="border:1px solid #000;background:#fff;image-rendering:pixelated"></canvas>',
            '</div>',
            '</div>'
        ].join('');
        win.setContent(content);

        const canvas = document.getElementById('pp-canvas');
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        let currentColor = '#000000';
        let drawing = false;
        let brush = 1;
        const palette = ['#000000','#ffffff','#ff4444','#44ff44','#0066ff','#ffdd00','#aa44ff','#ff8844','#888888','#333333','#00ffff','#ff00ff','#660000','#004400','#000066','#663300'];
        const palEl = document.getElementById('pp-palette');
        let selectedSwatch = null;
        palette.forEach(col => {
            const sw = document.createElement('div');
            sw.style.width = '24px';
            sw.style.height = '24px';
            sw.style.border = '1px solid #000';
            sw.style.background = col;
            sw.style.cursor = 'pointer';
            sw.addEventListener('click', () => {
                currentColor = col;
                if (selectedSwatch) selectedSwatch.style.outline = 'none';
                sw.style.outline = '2px solid #000';
                selectedSwatch = sw;
            });
            palEl.appendChild(sw);
        });
        document.getElementById('pp-grid').addEventListener('change', (e) => {
            drawGrid(e.target.checked);
        });
        document.getElementById('pp-brush').addEventListener('input', (e) => { brush = parseInt(e.target.value, 10); });
        document.getElementById('pp-clear').addEventListener('click', () => { ctx.clearRect(0,0,canvas.width,canvas.height); drawGrid(document.getElementById('pp-grid').checked); });
        document.getElementById('pp-export').addEventListener('click', () => {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url; a.download = 'pixel-paint.png'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });
        function toGrid(x, y) { return [Math.floor(x), Math.floor(y)]; }
        function paint(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            const [gx, gy] = toGrid(x, y);
            ctx.fillStyle = currentColor;
            const s = brush;
            ctx.fillRect(gx - Math.floor(s/2), gy - Math.floor(s/2), s, s);
        }
        canvas.addEventListener('mousedown', (e) => { drawing = true; paint(e); });
        window.addEventListener('mousemove', (e) => { if (drawing) paint(e); });
        window.addEventListener('mouseup', () => { drawing = false; });
        function drawGrid(on) {
            // redraw grid overlay
            const img = ctx.getImageData(0,0,canvas.width,canvas.height);
            ctx.putImageData(img,0,0);
            if (!on) return;
            ctx.save();
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= canvas.width; i += 8) {
                ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, canvas.height); ctx.stroke();
            }
            for (let j = 0; j <= canvas.height; j += 8) {
                ctx.beginPath(); ctx.moveTo(0, j + 0.5); ctx.lineTo(canvas.width, j + 0.5); ctx.stroke();
            }
            ctx.restore();
        }
        drawGrid(true);
    }

    // Notes App
    function openNotes() {
        const existing = Array.from(document.querySelectorAll('.window')).find(w => {
            const t = w.querySelector('.title-text');
            return t && t.textContent === 'Notes';
        });
        if (existing) {
            const windows = Array.from(document.querySelectorAll('.window'));
            const z = Math.max(10, ...windows.map(w => parseInt(getComputedStyle(w).zIndex || '10')));
            existing.style.zIndex = String(z + 1);
            return;
        }
        const win = createWindow({ title: 'Notes', x: 220, y: 90, width: 520, content: '' });
        const content = [
            '<div style="display:flex;flex-direction:column;gap:10px">',
            '<div style="display:flex;gap:8px;align-items:center">',
            '<button id="nt-new" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">New</button>',
            '<button id="nt-save" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Save</button>',
            '<button id="nt-clear" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Clear</button>',
            '<div id="nt-status" style="font-size:11px;color:#333;margin-left:auto">Ready</div>',
            '</div>',
            '<input id="nt-title" placeholder="Untitled" style="border:1px solid #000;padding:6px;width:100%;box-sizing:border-box" />',
            '<textarea id="nt-body" style="width:100%;height:240px;border:1px solid #000;resize:vertical;line-height:1.4;padding:6px;box-sizing:border-box"></textarea>',
            '<div style="display:flex;gap:8px;align-items:center">',
            '<select id="nt-list" style="flex:1;border:1px solid #000;padding:4px 6px"></select>',
            '<button id="nt-load" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Load</button>',
            '<button id="nt-delete" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Delete</button>',
            '</div>',
            '</div>'
        ].join('');
        win.setContent(content);

        const KEY = 'retroNotes.v1';
        function loadAll() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
        function saveAll(data) { localStorage.setItem(KEY, JSON.stringify(data)); }
        function refreshList(sel) {
            const data = loadAll();
            sel.innerHTML = '';
            Object.keys(data).forEach(k => {
                const opt = document.createElement('option'); opt.value = k; opt.textContent = k; sel.appendChild(opt);
            });
        }
        const status = document.getElementById('nt-status');
        const title = document.getElementById('nt-title');
        const body = document.getElementById('nt-body');
        const list = document.getElementById('nt-list');
        refreshList(list);
        document.getElementById('nt-new').addEventListener('click', () => { title.value = ''; body.value = ''; status.textContent = 'New note'; });
        document.getElementById('nt-save').addEventListener('click', () => {
            const name = title.value.trim() || 'Untitled';
            const data = loadAll(); data[name] = body.value; saveAll(data); refreshList(list); list.value = name; status.textContent = 'Saved';
        });
        document.getElementById('nt-clear').addEventListener('click', () => { title.value=''; body.value=''; status.textContent='Cleared'; });
        document.getElementById('nt-load').addEventListener('click', () => { const data = loadAll(); const sel = list.value; if (sel && data[sel] !== undefined) { title.value = sel; body.value = data[sel]; status.textContent = 'Loaded'; } });
        document.getElementById('nt-delete').addEventListener('click', () => {
            const data = loadAll(); const sel = list.value;
            if (sel && data[sel] !== undefined) {
                if (confirm(`Delete note "${sel}"?`)) { delete data[sel]; saveAll(data); refreshList(list); status.textContent = 'Deleted'; }
            }
        });
    }

    // Snake App
    function openSnake() {
        const existing = Array.from(document.querySelectorAll('.window')).find(w => {
            const t = w.querySelector('.title-text');
            return t && t.textContent === 'Snake';
        });
        if (existing) {
            const windows = Array.from(document.querySelectorAll('.window'));
            const z = Math.max(10, ...windows.map(w => parseInt(getComputedStyle(w).zIndex || '10')));
            existing.style.zIndex = String(z + 1);
            return;
        }
        const win = createWindow({ title: 'Snake', x: 260, y: 120, width: 560, content: '' });
        const content = [
            '<div style="display:flex;gap:12px;align-items:stretch">',
            '<div style="flex:0 0 140px;border-right:1px solid #000;padding-right:8px">',
            '<div style="font-weight:700;margin-bottom:6px">Controls</div>',
            '<div style="font-size:12px;margin-bottom:8px">Use arrow keys to move.</div>',
            '<div style="display:flex;gap:8px;margin-bottom:8px"><button id="sn-start" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Start</button><button id="sn-stop" style="border:1px solid #000;background:#fff;padding:4px 8px;cursor:pointer">Stop</button></div>',
            '<div style="font-size:12px">Score: <span id="sn-score">0</span></div>',
            '</div>',
            '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:4px">',
            '<canvas id="sn-canvas" width="336" height="240" style="border:1px solid #000;background:#fff;image-rendering:pixelated"></canvas>',
            '</div>',
            '</div>'
        ].join('');
        win.setContent(content);

        const canvas = document.getElementById('sn-canvas');
        const ctx = canvas.getContext('2d');
        const grid = 12;
        // Snap canvas size to grid to prevent partial cells
        canvas.width = Math.floor(canvas.width / grid) * grid;
        canvas.height = Math.floor(canvas.height / grid) * grid;
        let snake, dir, food, timer, score;
        function reset() {
            snake = [{x: 5, y: 5}];
            dir = {x: 1, y: 0};
            placeFood();
            score = 0; updateScore();
            draw();
        }
        function updateScore() { document.getElementById('sn-score').textContent = String(score); }
        function placeFood() { food = { x: Math.floor(Math.random() * (canvas.width / grid)), y: Math.floor(Math.random() * (canvas.height / grid)) }; }
        function draw() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            // light grid background fully within bounds
            ctx.save();
            ctx.strokeStyle = '#eaeaea';
            ctx.lineWidth = 1;
            const cols = Math.floor(canvas.width / grid);
            const rows = Math.floor(canvas.height / grid);
            // Vertical lines
            for (let c = 0; c <= cols; c++) {
                const x = c * grid + 0.5;
                ctx.beginPath(); ctx.moveTo(x, 0.5); ctx.lineTo(x, canvas.height - 0.5); ctx.stroke();
            }
            // Horizontal lines
            for (let r = 0; r <= rows; r++) {
                const y = r * grid + 0.5;
                ctx.beginPath(); ctx.moveTo(0.5, y); ctx.lineTo(canvas.width - 0.5, y); ctx.stroke();
            }
            // Outer border for crisp bounds
            ctx.strokeStyle = '#000000';
            ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
            ctx.restore();
            // draw food
            ctx.fillStyle = '#ff4444'; ctx.fillRect(food.x*grid, food.y*grid, grid, grid);
            // draw snake
            ctx.fillStyle = '#000';
            snake.forEach(p => ctx.fillRect(p.x*grid, p.y*grid, grid, grid));
        }
        function step() {
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
            const maxX = Math.floor(canvas.width / grid); const maxY = Math.floor(canvas.height / grid);
            // wall collision (no wrap)
            if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) { stop(); reset(); return; }
            // collision with self
            if (snake.some((p, idx) => idx > 0 && p.x === head.x && p.y === head.y)) {
                stop(); reset(); return;
            }
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) { score += 1; updateScore(); placeFood(); }
            else { snake.pop(); }
            draw();
        }
        function start() { if (timer) return; timer = setInterval(step, 120); }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && dir.y !== 1) dir = {x:0,y:-1};
            if (e.key === 'ArrowDown' && dir.y !== -1) dir = {x:0,y:1};
            if (e.key === 'ArrowLeft' && dir.x !== 1) dir = {x:-1,y:0};
            if (e.key === 'ArrowRight' && dir.x !== -1) dir = {x:1,y:0};
        });
        document.getElementById('sn-start').addEventListener('click', () => { start(); });
        document.getElementById('sn-stop').addEventListener('click', () => { stop(); });
        reset();
    }

    // iPod App -> render as overlay (no outer window box)
    function openIPod() {
        const desktop = document.getElementById('desktop');
        // Remove any existing overlay
        const old = document.getElementById('ipod-overlay');
        if (old) old.remove();
        const overlay = document.createElement('div');
        overlay.id = 'ipod-overlay';
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.background = 'transparent';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        // Wrapper centered and draggable
        const wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        wrap.style.left = '50%';
        wrap.style.top = '50%';
        wrap.style.transform = 'translate(-50%, -50%)';
        wrap.style.pointerEvents = 'auto';
        wrap.style.cursor = 'move';
        overlay.appendChild(wrap);
        desktop.appendChild(overlay);
        // Dragging behavior
        (function enableDrag(handle){
            let dragging = false; let ox = 0; let oy = 0; let sx = 0; let sy = 0;
            handle.addEventListener('mousedown', (e) => {
                // Do not start drag when interacting with controls
                if (e.target && (e.target.closest && e.target.closest('.ipod-nodrag'))) return;
                dragging = true; const r = wrap.getBoundingClientRect(); sx = r.left; sy = r.top; ox = e.clientX; oy = e.clientY; e.preventDefault();
            });
            window.addEventListener('mousemove', (e) => { if (!dragging) return; const nx = sx + (e.clientX - ox); const ny = sy + (e.clientY - oy); wrap.style.left = nx + 'px'; wrap.style.top = ny + 'px'; wrap.style.transform = 'translate(0,0)'; });
            window.addEventListener('mouseup', () => { dragging = false; });
        })(wrap);
        // Close only via icon toggle (no outside click-to-close)
        renderLegacyIpod(wrap);
    }

    function renderLegacyIpod(root) {
        const html = [
            '<div style="display:flex;flex-direction:column;gap:8px;align-items:center;width:100%">',
            '<div style="width:260px;border:1px solid #000;border-radius:28px;padding:12px;background:linear-gradient(#f9f9f9,#e6e6e6);box-shadow:2px 2px 0 #000;position:relative">',
            // Boot overlay
            '<div id="ipod-boot" style="position:absolute;inset:12px;border:1px solid #000;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:48px;z-index:5"></div>',
            // Top bar
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">',
            '<div style="font-weight:700;font-size:12px">iPod</div>',
            '<div style="display:flex;align-items:center;gap:6px">',
            '<div id="ipod-battery" style="width:36px;height:10px;border:1px solid #000;position:relative;background:#e6e6e6"><div style="height:100%;background:#44c767;width:76%"></div><div style="position:absolute;right:-4px;top:2px;width:3px;height:6px;border:1px solid #000;background:#fff"></div></div>',
            '</div>',
            '</div>',
            // Screen
            '<div id="ipod-screen" style="border:1px solid #000;background:linear-gradient(#ffffff,#f2f2f2);height:118px;border-radius:6px;display:flex;flex-direction:column;gap:6px;padding:6px;box-shadow:inset 0 0 0 2px #e6e6e6">',
            '<div style="display:flex;align-items:center;gap:8px">',
            '<div id="ipod-art" style="width:40px;height:40px;border:1px solid #000;background:repeating-linear-gradient(45deg,#eee,#eee 6px,#ddd 6px,#ddd 12px)"></div>',
            '<div style="min-width:0">',
            '<div id="ipod-track" style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">No track</div>',
            '<div id="ipod-artist" style="font-size:12px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">—</div>',
            '</div>',
            '</div>',
            '<div id="ipod-bar" style="width:100%;height:8px;border:1px solid #000;background:#e6e6e6;position:relative;cursor:pointer"><div id="ipod-progress" style="position:absolute;left:0;top:0;bottom:0;width:0;background:#000"></div></div>',
            '<div style="display:flex;gap:8px;font-size:11px;width:100%;justify-content:space-between"><span id="ipod-time">0:00</span><span id="ipod-duration">0:00</span></div>',
            // In-screen song selector (keeps total height unchanged)
            '<div id="ipod-list" style="margin-top:4px;width:100%;max-height:52px;overflow:auto;border:1px solid #000;background:#fff"></div>',
            '</div>',
            // Controls row
            '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;margin-top:6px">',
            '<input id="ipod-file" type="file" accept="audio/*" multiple style="width:200px">',
            '<label style="font-size:12px;display:flex;align-items:center;gap:4px">Shuffle <input type="checkbox" id="ipod-shuf"></label>',
            '<label style="font-size:12px;display:flex;align-items:center;gap:4px">Repeat <select id="ipod-rep"><option value="off">Off</option><option value="one">One</option><option value="all">All</option></select></label>',
            '<label style="font-size:12px;display:flex;align-items:center;gap:4px">EQ <select id="ipod-eq"><option value="flat">Flat</option><option value="pop">Pop</option><option value="rock">Rock</option><option value="jazz">Jazz</option><option value="bass">Bass</option></select></label>',
            '<label style="font-size:12px;display:flex;align-items:center;gap:4px">Theme <select id="ipod-th"><option value="color">Color</option><option value="monochrome">Mono</option><option value="inverted">Invert</option></select></label>',
            '<label style="font-size:12px;display:flex;align-items:center;gap:4px">Backlight <input type="checkbox" id="ipod-bl" checked></label>',
            '</div>',
            // Wheel with progress ring (center aligned)
            '<div id="ipod-wheel" style="margin:8px auto 0;width:220px;height:220px;border:1px solid #000;border-radius:50%;position:relative;box-shadow:2px 2px 0 #000;"></div>',
            '</div>',
            '</div>'
        ].join('');
        root.innerHTML = html;

        // Build wheel buttons and progress ring
        const wheel = root.querySelector('#ipod-wheel');
        if (wheel) {
            // Smooth gradient circle with depth
            wheel.style.background = 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f3f3f3 60%, #e2e2e2 100%)';
            wheel.style.boxShadow = 'inset 0 12px 18px rgba(0,0,0,0.08), inset 0 -10px 14px rgba(0,0,0,0.05), 0 2px 0 #000';

            // Minimal circular-aligned text labels (no boxy buttons)
            const label = (id, text, style) => {
                const d = document.createElement('div');
                d.id = id; d.textContent = text; d.className = 'ipod-nodrag';
                d.style.cssText = 'position:absolute;color:#000;font-weight:700;letter-spacing:0.5px;cursor:pointer;user-select:none;transition:opacity .12s ease, text-shadow .08s ease;';
                d.style.cssText += style;
                d.addEventListener('mouseenter', () => { d.style.opacity = '0.8'; });
                d.addEventListener('mouseleave', () => { d.style.opacity = '1'; d.style.textShadow = 'none'; });
                d.addEventListener('mousedown', () => { d.style.textShadow = '0 1px 0 #999'; });
                d.addEventListener('mouseup', () => { d.style.textShadow = 'none'; });
                wheel.appendChild(d);
                return d;
            };
            label('ipod-menu','MENU','top:12px;left:50%;transform:translate(-50%,0)');
            label('ipod-prev','◀◀','left:14px;top:50%;transform:translate(0,-50%)');
            label('ipod-next','▶▶','right:14px;top:50%;transform:translate(0,-50%)');
            label('ipod-play','▸▐▐','bottom:12px;left:50%;transform:translate(-50%,0)');

            // Inset, responsive center Select button
            const select = document.createElement('div');
            select.id = 'ipod-sel'; select.className = 'ipod-nodrag';
            select.style.cssText = 'position:absolute;left:50%;top:50%;width:90px;height:90px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid #000;background:radial-gradient(circle at 50% 35%, #ededed, #dcdcdc);box-shadow:inset 0 0 0 2px #cfcfcf, inset 0 8px 12px rgba(0,0,0,0.12), 0 1px 0 #000;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;';
            const dot = document.createElement('div');
            dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#999;opacity:.65;';
            select.appendChild(dot);
            select.addEventListener('mousedown', () => { select.style.boxShadow = 'inset 0 0 0 2px #cfcfcf, inset 0 2px 4px rgba(0,0,0,0.25)'; });
            select.addEventListener('mouseup', () => { select.style.boxShadow = 'inset 0 0 0 2px #cfcfcf, inset 0 8px 12px rgba(0,0,0,0.12), 0 1px 0 #000'; });
            wheel.appendChild(select);
        }

        // State, audio, and persistence
        const STORE = 'legacyIpod.v1';
        function saveState(partial) {
            try {
                const cur = JSON.parse(localStorage.getItem(STORE) || '{}');
                localStorage.setItem(STORE, JSON.stringify({ ...cur, ...partial }));
            } catch {}
        }
        function loadState() { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; } }

        const audio = new Audio();
        audio.preload = 'metadata';
        const fileEl = document.getElementById('ipod-file');
        const trackEl = document.getElementById('ipod-track');
        const artistEl = document.getElementById('ipod-artist');
        const progressEl = document.getElementById('ipod-progress');
        const barEl = document.getElementById('ipod-bar');
        const timeEl = document.getElementById('ipod-time');
        const durEl = document.getElementById('ipod-duration');
        const artEl = document.getElementById('ipod-art');
        const themeEl = document.getElementById('ipod-th');
        const blEl = document.getElementById('ipod-bl');
        const shufEl = document.getElementById('ipod-shuf');
        const repEl = document.getElementById('ipod-rep');
        const bootEl = document.getElementById('ipod-boot');
        const screenEl = document.getElementById('ipod-screen');
        const listEl = document.getElementById('ipod-list');
        let playlist = [];
        let index = -1;

        function fmt(t) { if (!isFinite(t)) return '0:00'; const m = Math.floor(t/60); const s = Math.floor(t%60); return m + ':' + String(s).padStart(2,'0'); }
        function load(i) {
            if (i < 0 || i >= playlist.length) return;
            index = i;
            const item = playlist[index];
            audio.src = item.url; audio.play().catch(()=>{});
            trackEl.textContent = item.name;
            artistEl.textContent = 'Local File';
            saveState({ index, last: { name: item.name, url: item.url, time: 0 } });
        }
        function next() { if (!playlist.length) return; load((index + 1) % playlist.length); }
        function prev() { if (!playlist.length) return; load((index - 1 + playlist.length) % playlist.length); }

        fileEl.addEventListener('change', () => {
            const files = Array.from((fileEl).files || []);
            files.forEach(f => { playlist.push({ name: f.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(f) }); });
            if (index === -1 && playlist.length > 0) load(0);
            saveState({ playlist: playlist.map(p => ({ name: p.name })) });
        });
        function renderList() {
            if (!listEl) return;
            listEl.innerHTML = '';
            playlist.forEach((t, i) => {
                const row = document.createElement('div');
                row.textContent = `${i+1}. ${t.name}`;
                row.style.cssText = 'padding:4px 6px;cursor:pointer;border-bottom:1px dotted #ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
                if (i === index) { row.style.background = '#000'; row.style.color = '#fff'; }
                row.addEventListener('click', () => { load(i); renderList(); });
                listEl.appendChild(row);
            });
        }
        document.getElementById('ipod-next').addEventListener('click', (e) => { e.stopPropagation(); next(); });
        document.getElementById('ipod-prev').addEventListener('click', (e) => { e.stopPropagation(); prev(); });
        document.getElementById('ipod-play').addEventListener('click', (e) => { e.stopPropagation(); if (audio.paused) audio.play().catch(()=>{}); else audio.pause(); });
        document.getElementById('ipod-menu').addEventListener('click', (e) => { e.stopPropagation(); /* no-op in legacy */ });
        // Center button acts as Play/Pause for selected song
        const centerBtn = root.querySelector('#ipod-sel');
        if (centerBtn) {
            centerBtn.addEventListener('click', (e) => { e.stopPropagation();
                if (audio.src) { if (audio.paused) audio.play().catch(()=>{}); else audio.pause(); }
                else if (playlist.length) { load(Math.max(0, index)); }
            });
        }
        barEl.addEventListener('click', (e) => {
            const rect = barEl.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (isFinite(audio.duration)) audio.currentTime = audio.duration * pct;
        });
        audio.addEventListener('timeupdate', () => {
            const p = audio.duration ? (audio.currentTime / audio.duration) : 0;
            progressEl.style.width = Math.max(0, Math.min(1, p)) * 200 + 'px';
            timeEl.textContent = fmt(audio.currentTime);
            durEl.textContent = fmt(audio.duration);
            // Remove progress tint from wheel (keep static texture)
            const st = loadState();
            if (st && st.last) saveState({ last: { ...st.last, time: audio.currentTime } });
        });
        audio.addEventListener('ended', next);

        // Theme and backlight
        function applyTheme() {
            const mode = themeEl.value;
            if (mode === 'monochrome') {
                screenEl.style.filter = 'grayscale(1)';
            } else if (mode === 'inverted') {
                screenEl.style.filter = 'invert(1)';
            } else {
                screenEl.style.filter = 'none';
            }
        }
        themeEl.addEventListener('change', () => { applyTheme(); saveState({ theme: themeEl.value }); });
        blEl.addEventListener('change', () => {
            if (blEl.checked) screenEl.style.boxShadow = 'inset 0 0 40px rgba(255,255,200,0.35)'; else screenEl.style.boxShadow = 'inset 0 0 0 2px #e6e6e6';
            saveState({ backlight: blEl.checked });
        });
        shufEl.addEventListener('change', () => saveState({ shuffle: shufEl.checked }));
        repEl.addEventListener('change', () => saveState({ repeat: repEl.value }));

        // Boot animation
        setTimeout(() => { if (bootEl) bootEl.style.display = 'none'; }, 900);

        // Load real previews from iTunes (Ed Sheeran, Justin Bieber)
        async function loadPreviews() {
            try {
                const queries = [
                    'https://itunes.apple.com/search?term=ed%20sheeran&entity=song&limit=10&country=US',
                    'https://itunes.apple.com/search?term=justin%20bieber&entity=song&limit=10&country=US'
                ];
                const results = await Promise.all(queries.map(u => fetch(u).then(r => r.json())));
                const tracks = results.flatMap(r => (r.results || [])
                    .filter(it => it.previewUrl)
                    .map(it => ({ name: `${it.artistName} - ${it.trackName}`, url: it.previewUrl }))
                );
                if (tracks.length) {
                    playlist = tracks.slice(0, 20);
                    renderList();
                } else {
                    renderList();
                }
            } catch (e) {
                renderList();
            }
        }
        loadPreviews();

        // Resume last session if available
        const saved = loadState();
        if (saved.theme) { themeEl.value = saved.theme; applyTheme(); }
        if (typeof saved.backlight === 'boolean') { blEl.checked = saved.backlight; blEl.dispatchEvent(new Event('change')); }
        if (typeof saved.shuffle === 'boolean') shufEl.checked = saved.shuffle;
        if (saved.repeat) repEl.value = saved.repeat;
        if (saved.last && saved.last.url) {
            // Restore last track
            const foundIdx = playlist.findIndex(p => p.url === saved.last.url);
            if (foundIdx >= 0) {
                load(foundIdx);
            } else {
                playlist.unshift({ name: saved.last.name || 'Track', url: saved.last.url });
                load(0);
            }
            if (typeof saved.last.time === 'number') {
                audio.currentTime = Math.max(0, saved.last.time);
            }
            audio.pause(); // resume-ready
        }
        renderList();
    }

    // Dream macOS App
    function openDreamMacOS() {
        console.log('Opening Dream macOS...');
        
        // Create fullscreen overlay for Dream macOS
        const desktop = document.getElementById('desktop');
        let dreamOverlay = document.getElementById('dream-macos-overlay');

        if (dreamOverlay) {
            console.log('Closing existing Dream macOS...');
            dreamOverlay.remove();
            return;
        }

        console.log('Creating Dream macOS overlay...');
        dreamOverlay = document.createElement('div');
        dreamOverlay.id = 'dream-macos-overlay';
        dreamOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        `;

        // Create iframe to load Dream macOS
        const iframe = document.createElement('iframe');
        iframe.src = 'dream-macos.html?' + Date.now();
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: #000;
            pointer-events: auto;
        `;

        dreamOverlay.appendChild(iframe);
        document.body.appendChild(dreamOverlay);
        console.log('Dream macOS overlay created and added to DOM');

        // Close on Escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                console.log('Closing Dream macOS via Escape key');
                dreamOverlay.remove();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Prevent clicks from reaching retro OS elements
        dreamOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target === dreamOverlay) {
                console.log('Closing Dream macOS via outside click');
                dreamOverlay.remove();
                document.removeEventListener('keydown', handleKeyDown);
            }
        });
        
        // Prevent all mouse events from reaching retro OS
        dreamOverlay.addEventListener('mousedown', (e) => e.stopPropagation());
        dreamOverlay.addEventListener('mouseup', (e) => e.stopPropagation());
        dreamOverlay.addEventListener('mousemove', (e) => e.stopPropagation());
    }
})();


