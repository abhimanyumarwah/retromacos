import React from 'react';
import { useIPodStore } from '../../state/store';

export function Settings() {
	const settings = useIPodStore(s => s.settings);
	const setTheme = useIPodStore(s => s.setTheme);
	const toggleSfx = useIPodStore(s => s.toggleSfx);
	const toggleBacklight = useIPodStore(s => s.toggleBacklight);
	const eq = settings.eq;
	const setEq = useIPodStore(s => s.setEq);
	const shuffle = useIPodStore(s => s.shuffle);
	const repeat = useIPodStore(s => s.repeat);
	const setShuffle = useIPodStore(s => s.setShuffle);
	const setRepeat = useIPodStore(s => s.setRepeat);
	return (
		<div className="settings">
			<div className="row">
				<label>Theme</label>
				<select value={settings.theme} onChange={e => setTheme(e.target.value as any)}>
					<option value="monochrome">Monochrome</option>
					<option value="color">Color</option>
					<option value="inverted">Inverted</option>
				</select>
			</div>
			<div className="row">
				<label>Backlight</label>
				<input type="checkbox" checked={settings.backlight} onChange={toggleBacklight} />
			</div>
			<div className="row">
				<label>Sound Effects</label>
				<input type="checkbox" checked={settings.sfx} onChange={toggleSfx} />
			</div>
			<div className="row">
				<label>EQ</label>
				<select value={eq} onChange={e => setEq(e.target.value as any)}>
					<option value="flat">Flat</option>
					<option value="pop">Pop</option>
					<option value="rock">Rock</option>
					<option value="jazz">Jazz</option>
					<option value="bass">Bass Boost</option>
				</select>
			</div>
			<div className="row">
				<label>Shuffle</label>
				<input type="checkbox" checked={shuffle} onChange={e => setShuffle(e.target.checked)} />
			</div>
			<div className="row">
				<label>Repeat</label>
				<select value={repeat} onChange={e => setRepeat(e.target.value as any)}>
					<option value="off">Off</option>
					<option value="one">One</option>
					<option value="all">All</option>
				</select>
			</div>
		</div>
	);
}
