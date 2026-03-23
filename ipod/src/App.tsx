import React, { useEffect, useState } from 'react';
import { Screen } from './components/Screen';
import { ClickWheel } from './components/ClickWheel';
import { useIPodStore } from './state/store';
import './styles/app.css';

export default function App() {
	const [booted, setBooted] = useState(false);
	const theme = useIPodStore(s => s.settings.theme);
	useEffect(() => {
		const t = setTimeout(() => setBooted(true), 1200);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		const body = document.querySelector('.ipod-body');
		if (!body) return;
		body.classList.remove('theme-monochrome','theme-color','theme-inverted');
		body.classList.add(`theme-${theme}`);
	}, [theme]);

	return (
		<div className="ipod-frame">
			<div className="ipod-body theme-color">
				<div className="ipod-screen">
					{booted ? <Screen /> : <div className="boot"></div>}
				</div>
				<ClickWheel />
			</div>
		</div>
	);
}
