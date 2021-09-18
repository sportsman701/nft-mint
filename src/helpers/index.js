export const truncatedText = (sourceText) => {
  if (sourceText.length > 20) {
    return `${sourceText.substr(0, 10)}...${sourceText.substr(29, 5)}`
  } else {
    return sourceText
  }
}

export const getBigNumber = (source:any) => {
  source += '';
  const parts = source.split(".");
  let decimals = 18;
  if (parts[1] && parts[1].length) decimals -= parts[1].length;
  let zero = "0";
  if (decimals < 0) return parts[0] + parts[1].slice(0, 18);
  return parts[0] + (parts[1]?parts[1]:"") + (zero.repeat(decimals));
}