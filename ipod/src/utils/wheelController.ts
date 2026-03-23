export function computeWheelDelta(prev: number, next: number): number {
	let delta = next - prev;
	// Wrap to -pi..pi
	if (delta > Math.PI) delta -= Math.PI * 2;
	if (delta < -Math.PI) delta += Math.PI * 2;
	return delta;
}
