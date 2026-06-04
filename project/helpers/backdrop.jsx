// backdrop.jsx — soft, low-opacity tiled childcare-motif wallpaper.
// Outline shapes (cloud, balloon, star, rattle, teddy, dots) tiled as an SVG
// data-URI. Sits behind content as a non-interactive layer.
(function () {
  function tile(color) {
    const c = color;
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='210' height='210' viewBox='0 0 210 210' fill='none' stroke='${c}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>` +
        // cloud (top-left)
        `<path d='M24 56a9 9 0 0 1 1-17 12 12 0 0 1 23-3 8 8 0 0 1 4 20z'/>` +
        // balloon (top-right)
        `<ellipse cx='160' cy='34' rx='12' ry='15'/><path d='M160 49v9'/>` +
        // star (center)
        `<path d='M104 84l3.2 6.5 7.2 1-5.2 5.1 1.2 7.1-6.4-3.4-6.4 3.4 1.2-7.1-5.2-5.1 7.2-1z'/>` +
        // rattle (bottom-left)
        `<circle cx='46' cy='140' r='12'/><circle cx='46' cy='140' r='4.5'/><path d='M46 152v15'/><circle cx='46' cy='170' r='3.5'/>` +
        // teddy face (bottom-right)
        `<circle cx='165' cy='156' r='14'/><circle cx='154' cy='145' r='5'/><circle cx='176' cy='145' r='5'/><circle cx='165' cy='159' r='3'/>` +
        // scattered dots
        `<circle cx='100' cy='150' r='2.4'/><circle cx='30' cy='100' r='2.4'/><circle cx='188' cy='100' r='2.4'/><circle cx='120' cy='25' r='2.4'/>` +
      `</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  function MotifBackdrop({ color = "#356a48", opacity = 0.06, size = 210, style = {} }) {
    return (
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: tile(color), backgroundSize: `${size}px ${size}px`,
        opacity, ...style,
      }} />
    );
  }

  window.MotifBackdrop = MotifBackdrop;
})();
