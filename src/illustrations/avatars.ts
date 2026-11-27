type Preset = {
  background: string;
  skin: string;
  hair: string;
  coat: string;
  long: boolean;
};

const presets: Preset[] = [
  { background: '#CFE0FF', skin: '#F2C9A5', hair: '#6B4A2F', coat: '#FFFFFF', long: true },
  { background: '#D9E3FF', skin: '#E3B48C', hair: '#1F1B1A', coat: '#FFFFFF', long: false },
  { background: '#E1D9FF', skin: '#F6D3B8', hair: '#2A211E', coat: '#FFFFFF', long: true },
  { background: '#C8E6F5', skin: '#D9A77D', hair: '#3A2A22', coat: '#FFFFFF', long: false },
  { background: '#DDE8FF', skin: '#EDBE98', hair: '#8A5A33', coat: '#FFFFFF', long: true },
  { background: '#BFD0FF', skin: '#E8B992', hair: '#2B2320', coat: '#5B7CFA', long: false },
];

const silhouetteXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#CFD8DC"/>
<circle cx="50" cy="40" r="18" fill="#FFFFFF"/>
<path d="M16 100c0-22 15-36 34-36s34 14 34 36z" fill="#FFFFFF"/>
</svg>`;

export const getAvatarXml = (index: number) => {
  if (index === userAvatarIndex) return silhouetteXml;
  const p = presets[index % presets.length];
  const backHair = p.long ? `<path d="M26 46c0-20 10-30 24-30s24 10 24 30v30H26z" fill="${p.hair}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="${p.background}"/>
${backHair}
<path d="M12 100c0-22 16-34 38-34s38 12 38 34z" fill="${p.coat}"/>
<path d="M40 66h20L50 84z" fill="${p.skin}"/>
<rect x="44" y="52" width="12" height="16" rx="5" fill="${p.skin}"/>
<ellipse cx="50" cy="44" rx="15" ry="18" fill="${p.skin}"/>
<path d="M33 42c0-14 7-22 17-22s17 8 17 22c-4-8-10-12-17-12s-13 4-17 12z" fill="${p.hair}"/>
<circle cx="44" cy="46" r="1.8" fill="#1C1F3A"/>
<circle cx="56" cy="46" r="1.8" fill="#1C1F3A"/>
<path d="M45 54c3 3 7 3 10 0" stroke="#1C1F3A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
</svg>`;
};

export const userAvatarIndex = 5;
