import React from 'react';
import { MenuList } from './menus/MenuList';
import { NowPlaying } from './nowPlaying/NowPlaying';
import { Settings } from './settings/Settings';
import { StatusBar } from './StatusBar';
import { Controls } from './Controls';
import { useIPodStore } from '../state/store';

export function Screen() {
	const route = useIPodStore(s => s.route);
	return (
		<div className="screen-wrap">
			<StatusBar />
			<div className="screen-content">
				{route.name === 'menu' && <MenuList />}
				{route.name === 'now' && <NowPlaying />}
				{route.name === 'settings' && <Settings />}
			</div>
			<Controls />
		</div>
	);
}
