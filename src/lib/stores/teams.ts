import type { TeamDef } from '$lib/types';

/** Static team definitions */
export const TEAMS: TeamDef[] = [
	{
		key: 'miles',
		name: 'Miles Team',
		platform: 'Telegram',
		color: '#00e5ff',
		agents: [
			{ id: 'miles', name: 'Miles', role: 'Chief of Staff', color: '#00e5ff', hair: 'messy-cap', hairColor: '#1a1a2e', capColor: '#4a5568', skinColor: '#e8c4a0', jacket: '#37474f', shirt: '#78909c', acc: 'dogtags' },
			{ id: 'dev', name: 'Dev', role: 'Full-Stack Dev', color: '#00e676', hair: 'messy-long', hairColor: '#0d0d0d', skinColor: '#d4a574', jacket: '#1b5e20', shirt: '#263238', acc: 'headphones' },
			{ id: 'architect', name: 'Architect', role: 'Solutions Arch.', color: '#b388ff', hair: 'neat-side', hairColor: '#3e2723', skinColor: '#e8c4a0', jacket: '#311b92', shirt: '#212121', acc: 'glasses' },
			{ id: 'community', name: 'Community', role: 'Ai4Managers', color: '#ffb300', hair: 'short-textured', hairColor: '#0d0d0d', skinColor: '#c68642', jacket: '#e65100', shirt: '#3e2723', acc: '' },
			{ id: 'content', name: 'Content', role: 'Strategy', color: '#ff5252', hair: 'wavy-beret', hairColor: '#4e342e', beretColor: '#b71c1c', skinColor: '#e8c4a0', jacket: '#880e4f', shirt: '#37474f', acc: '' },
			{ id: 'research', name: 'Research', role: 'Tech Intel', color: '#448aff', hair: 'messy-long', hairColor: '#1a1a2e', skinColor: '#d4a574', jacket: '#0d47a1', shirt: '#e0e0e0', acc: '' },
		],
	},
	{
		key: 'pmo',
		name: 'PMO Team',
		platform: 'Slack',
		color: '#ffb300',
		agents: [
			{ id: 'pmo', name: 'PMO', role: 'Project Manager', color: '#00e5ff', hair: 'messy-cap', hairColor: '#2d1b0e', capColor: '#37474f', skinColor: '#e8c4a0', jacket: '#004d40', shirt: '#455a64', acc: 'dogtags' },
			{ id: 'architect', name: 'Architect', role: 'Solutions Arch.', color: '#b388ff', hair: 'neat-side', hairColor: '#3e2723', skinColor: '#e8c4a0', jacket: '#4a148c', shirt: '#212121', acc: 'glasses' },
			{ id: 'dev2', name: 'Dev', role: 'Full-Stack Dev', color: '#00e676', hair: 'short-textured', hairColor: '#0d0d0d', skinColor: '#d4a574', jacket: '#1b5e20', shirt: '#263238', acc: 'headphones' },
		],
	},
];

/** Map agent labels to IDs for delegation detection */
export const DELEGATION_MAP: Record<string, Record<string, string>> = {
	miles: { dev: 'dev', architect: 'architect', community: 'community', content: 'content', research: 'research' },
	pmo: { dev: 'dev2', architect: 'architect' },
};
