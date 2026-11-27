const paths = {
  bell: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
  settings:
    '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2.5"/><circle cx="9" cy="12" r="2.5"/><circle cx="17" cy="18" r="2.5"/>',
  doctors:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.7a3.5 3.5 0 010 6.6M21.5 20c0-2.6-1.6-4.6-4-5.4"/>',
  heart: '<path d="M12 20s-8-4.9-8-10.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5C20 15.1 12 20 12 20z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/>',
  chat: '<path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4.2A8 8 0 1120 12z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:
    '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  fingerprint:
    '<path d="M6 10a6 6 0 0112 0v2"/><path d="M9 21c1-2 1.5-4 1.5-6.5a1.5 1.5 0 013 0c0 3 .5 5 1.5 7"/><path d="M5 14c0 2-.3 4-1 5.5M12 10v2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  comment: '<path d="M4 5h16v11H9l-5 4z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  logout: '<path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9"/>',
  female: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
  male: '<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  headset: '<path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  facebook: '<circle cx="12" cy="12" r="9"/><path d="M13 21v-8h3M13 13v-2a2 2 0 012-2h1M10 13h6"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M17 7h.01"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/><path d="M11 13l9-9"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
};

export type IconName = keyof typeof paths;

export const getIconXml = (name: IconName, color: string, filled: boolean) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${filled ? color : 'none'}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
