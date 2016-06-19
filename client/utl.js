const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
export const getRandomPastelColor = () => {
  const redHex = (getRandomInt(0, 128) + 127).toString(16)
  const greenHex = (getRandomInt(0, 128) + 127).toString(16)
  const blueHex = (getRandomInt(0, 128) + 127).toString(16)
  return `#${redHex}${greenHex}${blueHex}`
}
