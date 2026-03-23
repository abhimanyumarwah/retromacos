import React from 'react';
import { useIPodStore } from '../../state/store';

export function NowPlaying() {
	const current = useIPodStore(s => s.currentTrack);
	const status = useIPodStore(s => s.playbackStatus);
	const progress = useIPodStore(s => s.progress);
	const battery = useIPodStore(s => s.battery);
	const backlight = useIPodStore(s => s.settings.backlight);
	return (
		<div className={"now"}>
			<div className={"now-top"}>
				<div className="battery">
					<div className="bar"><div className="level" style={{ width: `${Math.round(battery * 100)}%` }} /></div>
				</div>
			</div>
			<div className={"screen-inner" + (backlight ? ' backlight' : '')}>
				<div className="meta">
					{current?.albumArt ? <img src={current.albumArt} alt="art" className="art" /> : <div className="art placeholder" />}
					<div className="text">
						<div className="title">{current?.title || 'No Track'}</div>
						<div className="artist">{current?.artist || '—'}</div>
					</div>
				</div>
				<div className="bar">
					<div className="fill" style={{ width: `${progress * 100}%` }} />
				</div>
				<div className="status">{status}</div>
			</div>
		</div>
	);
}
