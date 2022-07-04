export const getTextColorFrom = (backgroundColor: string) => {
  let colorHexa = backgroundColor.split("#")[1];
  let rgb = [
    parseInt(colorHexa.slice(0,2), 16),
    parseInt(colorHexa.slice(2,4), 16),
    parseInt(colorHexa.slice(4,6), 16)
  ];
  const brightness = Math.round(((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000);
  return brightness > 50 ? 'black' : 'white';
}
