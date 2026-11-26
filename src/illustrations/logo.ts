export const getLogoXml = (color: string, cutColor: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect x="36" y="6" width="28" height="88" rx="14" fill="${color}"/>
<rect x="6" y="36" width="88" height="28" rx="14" fill="${color}"/>
<path d="M16 58C16 46 24 40 40 40C40 52 32 58 16 58Z" fill="${cutColor}"/>
<path d="M84 42C84 54 76 60 60 60C60 48 68 42 84 42Z" fill="${cutColor}"/>
</svg>`;
