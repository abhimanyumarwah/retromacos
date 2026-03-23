import React, { useEffect, useRef, useState } from 'react';
import { useIPodStore } from '../state/store';
import { computeWheelDelta } from '../utils/wheelController';

export function ClickWheel() {
	const onWheelScroll = useIPodStore(s => s.onWheelScroll);
	const onSelect = useIPodStore(s => s.onSelect);
	const onMenu = useIPodStore(s => s.onMenu);
	const onPrev = useIPodStore(s => s.onPrev);
	const onNext = useIPodStore(s => s.onNext);
	const onPlayPause = useIPodStore(s => s.onPlayPause);
	const progress = useIPodStore(s => s.progress);
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const el = ref.current!;
		el.style.setProperty('--progress', String(progress));
	}, [progress]);

	useEffect(() => {
		const el = ref.current!;
		let lastAngle: number | null = null;
		let dragging = false;
		const center = () => {
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		};
		function start(e: MouseEvent | TouchEvent) { dragging = true; lastAngle = angle(e); setActive(true); }
		function end() { dragging = false; lastAngle = null; setActive(false); }
		function angle(e: MouseEvent | TouchEvent) {
			const c = center();
			const p = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
			return Math.atan2(p.y - c.y, p.x - c.x);
		}
		function move(e: MouseEvent | TouchEvent) {
			if (!dragging || lastAngle === null) return;
			const a = angle(e);
			const delta = computeWheelDelta(lastAngle, a);
			if (Math.abs(delta) > 0.05) {
				onWheelScroll(delta);
				lastAngle = a;
			}
		}
		el.addEventListener('mousedown', start as any);
		window.addEventListener('mouseup', end);
		window.addEventListener('mousemove', move as any);
		el.addEventListener('touchstart', start as any, { passive: true });
		window.addEventListener('touchend', end);
		window.addEventListener('touchmove', move as any, { passive: true });
		return () => {
			el.removeEventListener('mousedown', start as any);
			window.removeEventListener('mouseup', end);
			window.removeEventListener('mousemove', move as any);
			el.removeEventListener('touchstart', start as any);
			window.removeEventListener('touchend', end);
			window.removeEventListener('touchmove', move as any);
		};
	}, [onWheelScroll]);

	return (
		<div className={"wheel" + (active ? ' glow' : '')} ref={ref}>
			<button className="btn menu" onClick={onMenu}>MENU</button>
			<button className="btn prev" onClick={onPrev}>◀◀</button>
			<button className="btn next" onClick={onNext}>▶▶</button>
			<button className="btn play" onClick={onPlayPause}>▸▐▐</button>
			<button className="select" onClick={onSelect} aria-label="Select" />
		</div>
	);
}
