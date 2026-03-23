import React from 'react';
import { useIPodStore } from '../../state/store';

export function MenuList() {
	const menu = useIPodStore(s => s.menu);
	const index = useIPodStore(s => s.menuIndex);
	return (
		<div className="menu">
			<div className="title">iPod</div>
			<ul>
				{menu.items.map((item, i) => (
					<li key={item.id} className={i === index ? 'active' : ''}>{item.label}</li>
				))}
			</ul>
		</div>
	);
}
