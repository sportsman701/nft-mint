export const truncatedText = (sourceText) => {
  if (sourceText.length > 20) {
    return `${sourceText.substr(0, 10)}...${sourceText.substr(29, 5)}`
  } else {
    return sourceText
  }
}