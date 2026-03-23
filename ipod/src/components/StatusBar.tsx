import React, { useEffect, useState } from 'react';
import { useIPodStore } from '../state/store';

export function StatusBar() {
	const battery = useIPodStore(s => s.battery);
	const [time, setTime] = useState<string>('');
	useEffect(() => {
		const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
		tick();
		const id = setInterval(tick, 30000);
		return () => clearInterval(id);
	}, []);
	return (
		<div className="status-bar">
			<div className="clock">{time}</div>
			<div className="battery">
				<div className="icon"><span className="cap" /><span className="level" style={{ width: `${Math.round(battery * 100)}%` }} /></div>
			</div>
		</div>
	);
}
