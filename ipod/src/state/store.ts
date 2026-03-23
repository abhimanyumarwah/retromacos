import create from 'zustand';

type Route = { name: 'menu' } | { name: 'now' } | { name: 'settings' };

type Track = { id: string; title: string; artist?: string; url?: string; duration?: number; albumArt?: string };

type Playlist = { id: string; name: string; trackIds: string[] };

type MenuItem = { id: string; label: string; action: () => void };

type Theme = 'monochrome' | 'color' | 'inverted';

type EqPreset = 'flat' | 'pop' | 'rock' | 'jazz' | 'bass';

type RepeatMode = 'off' | 'one' | 'all';

type Settings = { theme: Theme; sfx: boolean; backlight: boolean; eq: EqPreset };

type Library = { tracks: Record<string, Track>; playlists: Playlist[] };

type State = {
	route: Route;
	menu: { items: MenuItem[] };
	menuIndex: number;
	library: Library;
	queue: string[]; // list of track ids for current session
	queueIndex: number; // index into queue
	currentTrack: Track | null;
	playbackStatus: 'playing' | 'paused' | 'stopped';
	progress: number; // 0..1
	shuffle: boolean;
	repeat: RepeatMode;
	settings: Settings;
	battery: number;
	// actions
	onWheelScroll: (delta: number) => void;
	onSelect: () => void;
	onMenu: () => void;
	onPrev: () => void;
	onNext: () => void;
	onPlayPause: () => void;
	setTheme: (t: Theme) => void;
	toggleSfx: () => void;
	toggleBacklight: () => void;
	setEq: (eq: EqPreset) => void;
	setShuffle: (on: boolean) => void;
	setRepeat: (mode: RepeatMode) => void;
	createPlaylist: (name: string) => void;
	addToPlaylist: (playlistId: string, trackId: string) => void;
	setCurrentById: (id: string) => void;
	setAlbumArt: (id: string, url: string) => void;
	setProgress: (p: number) => void;
};

const KEY = 'ipod.sim.state.v1';

function persist(state: Partial<State>) {
	try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function restore(): Partial<State> | null {
	try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

export const useIPodStore = create<State>((set, get) => {
	const saved = restore();
	const initial: State = {
		route: saved?.route || { name: 'menu' },
		menu: {
			items: [
				{ id: 'music', label: 'Music', action: () => set({ route: { name: 'now' } }) },
				{ id: 'playlists', label: 'Playlists', action: () => {} },
				{ id: 'settings', label: 'Settings', action: () => set({ route: { name: 'settings' } }) },
				{ id: 'extras', label: 'Extras', action: () => {} },
			],
		},
		menuIndex: 0,
		library: saved?.library || { tracks: {}, playlists: [] },
		queue: saved?.queue || [],
		queueIndex: saved?.queueIndex ?? -1,
		currentTrack: saved?.currentTrack || null,
		playbackStatus: 'stopped',
		progress: saved?.progress ?? 0,
		shuffle: saved?.shuffle ?? false,
		repeat: saved?.repeat ?? 'off',
		settings: saved?.settings || { theme: 'color', sfx: true, backlight: true, eq: 'flat' },
		battery: saved?.battery ?? 0.76,

		onWheelScroll: (delta) => {
			const dir = delta > 0 ? 1 : -1;
			const { menu } = get();
			set((s) => ({ menuIndex: (s.menuIndex + dir + menu.items.length) % menu.items.length }));
		},
		onSelect: () => {
			const { menu, menuIndex } = get();
			menu.items[menuIndex]?.action();
			persist({ route: get().route, menuIndex: get().menuIndex });
		},
		onMenu: () => { set({ route: { name: 'menu' } }); persist({ route: { name: 'menu' } }); },
		onPrev: () => {
			const { queue, queueIndex, repeat } = get();
			if (queue.length === 0) return;
			let idx = queueIndex - 1;
			if (idx < 0) idx = repeat === 'all' ? queue.length - 1 : 0;
			get().setCurrentById(queue[idx]);
		},
		onNext: () => {
			const { queue, queueIndex, repeat } = get();
			if (queue.length === 0) return;
			let idx = queueIndex + 1;
			if (idx >= queue.length) idx = repeat === 'all' ? 0 : queue.length - 1;
			get().setCurrentById(queue[idx]);
		},
		onPlayPause: () => set((s) => { const next = s.playbackStatus === 'playing' ? 'paused' : 'playing'; persist({ playbackStatus: next }); return { playbackStatus: next }; }),
		setTheme: (t) => set((s) => { const next = { ...s.settings, theme: t }; persist({ settings: next }); return { settings: next }; }),
		toggleSfx: () => set((s) => { const next = { ...s.settings, sfx: !s.settings.sfx }; persist({ settings: next }); return { settings: next }; }),
		toggleBacklight: () => set((s) => { const next = { ...s.settings, backlight: !s.settings.backlight }; persist({ settings: next }); return { settings: next }; }),
		setEq: (eq) => set((s) => { const next = { ...s.settings, eq }; persist({ settings: next }); return { settings: next }; }),
		setShuffle: (on) => set(() => { persist({ shuffle: on }); return { shuffle: on }; }),
		setRepeat: (mode) => set(() => { persist({ repeat: mode }); return { repeat: mode }; }),
		createPlaylist: (name) => set((s) => { const p = { id: crypto.randomUUID(), name, trackIds: [] }; const lib = { ...s.library, playlists: [...s.library.playlists, p] }; persist({ library: lib }); return { library: lib }; }),
		addToPlaylist: (playlistId, trackId) => set((s) => {
			const playlists = s.library.playlists.map(p => p.id === playlistId ? { ...p, trackIds: [...p.trackIds, trackId] } : p);
			const lib = { ...s.library, playlists };
			persist({ library: lib });
			return { library: lib };
		}),
		setCurrentById: (id) => set((s) => {
			const t = s.library.tracks[id] || null;
			const queueIndex = Math.max(0, s.queue.indexOf(id));
			persist({ currentTrack: t, queueIndex, progress: 0 });
			return { currentTrack: t, queueIndex, progress: 0, playbackStatus: 'playing' };
		}),
		setAlbumArt: (id, url) => set((s) => {
			const tr = s.library.tracks[id]; if (!tr) return {} as any;
			const updated = { ...tr, albumArt: url };
			const tracks = { ...s.library.tracks, [id]: updated };
			const lib = { ...s.library, tracks };
			persist({ library: lib });
			return { library: lib };
		}),
		setProgress: (p) => set(() => { const clamped = Math.max(0, Math.min(1, p)); persist({ progress: clamped }); return { progress: clamped }; }),
	};
	// If there is a saved current track, ensure it's set in queue
	if (initial.currentTrack && initial.queue.length && initial.queueIndex >= 0) {
		// ok
	}
	return initial;
});
