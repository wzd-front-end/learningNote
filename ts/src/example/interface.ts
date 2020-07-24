interface Vegetable {
  color?: string,
  type: string
}

const getVegetables = ({color, type}: Vegetable):string => {
  return `A ${color ? (color + ' ') : ''}${type}`
}

console.log(getVegetables({
  color: 'red',
  type: 'tomato'
}))