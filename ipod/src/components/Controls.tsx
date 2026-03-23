import React from 'react';
import { useIPodStore } from '../state/store';

export function Controls() {
	const shuffle = useIPodStore(s => s.shuffle);
	const repeat = useIPodStore(s => s.repeat);
	const setShuffle = useIPodStore(s => s.setShuffle);
	const setRepeat = useIPodStore(s => s.setRepeat);
	const settings = useIPodStore(s => s.settings);
	const setTheme = useIPodStore(s => s.setTheme);
	const setEq = useIPodStore(s => s.setEq);
	const toggleBacklight = useIPodStore(s => s.toggleBacklight);
	return (
		<div className="controls">
			<div className={"pill" + (shuffle ? ' active' : '')} onClick={() => setShuffle(!shuffle)}>Shuffle</div>
			<div className="pill group">
				<span>Repeat</span>
				<div className={"opt" + (repeat === 'off' ? ' active' : '')} onClick={() => setRepeat('off')}>Off</div>
				<div className={"opt" + (repeat === 'one' ? ' active' : '')} onClick={() => setRepeat('one')}>One</div>
				<div className={"opt" + (repeat === 'all' ? ' active' : '')} onClick={() => setRepeat('all')}>All</div>
			</div>
			<div className="pill group">
				<span>EQ</span>
				{(['flat','pop','rock','jazz','bass'] as const).map(k => (
					<div key={k} className={"opt" + (settings.eq === k ? ' active' : '')} onClick={() => setEq(k)}>{k}</div>
				))}
			</div>
			<div className="pill group">
				<span>Theme</span>
				{(['monochrome','color','inverted'] as const).map(t => (
					<div key={t} className={"opt" + (settings.theme === t ? ' active' : '')} onClick={() => setTheme(t)}>{t}</div>
				))}
			</div>
			<div className={"pill" + (settings.backlight ? ' active' : '')} onClick={toggleBacklight}>Backlight</div>
		</div>
	);
}
