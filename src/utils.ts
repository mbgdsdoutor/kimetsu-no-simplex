const temElementoNegativoLinhaZ = (linhaZ: number[]): boolean => {
  return linhaZ.some(el => el < 0)
}

const findMaiorElementoNegativoLinhaZ = (grid: number[][]): number => {
  const linhaZ = grid[grid.length - 1]
  return Math.min.apply(Math, linhaZ)
}

const findColunaPivo = (grid: number[][], lowestValue: number): ColunaPivoObject => {
  const linhaZ = grid[grid.length - 1]
  const indexColunaPivo = linhaZ.indexOf(lowestValue)
  const colunaPivo:number[] = []
  grid.forEach(linha => {
    colunaPivo.push(linha[indexColunaPivo])
  })
  // colunaPivo.pop() // remove elemento da linha z
  return {
    colunaPivo,
    indexColunaPivo,
  }
}

export interface ColunaPivoObject {
  colunaPivo: number[],
  indexColunaPivo: number,
}

const getPivoAndLinhaPivo = (grid: number[][], colunaPivoObject: ColunaPivoObject): PivoObject => {
  const colunaRs = grid.map(row => row[row.length - 1])
  colunaRs.pop() // remove elemento da linha z
  const produtoDivisaoColunaRSePivo:number[] = []
  colunaRs.forEach((el, index) => {
    produtoDivisaoColunaRSePivo.push(el / colunaPivoObject.colunaPivo[index])
  })
  

  // const lowestValue = Math.min.apply(Math, produtoDivisaoColunaRSePivo) // cuidado com valores negativos
  // const indexPivo = produtoDivisaoColunaRSePivo.indexOf(lowestValue)

  const copyProdutoDivisaoColunaRSePivo = produtoDivisaoColunaRSePivo.filter(el => el > -1)
  const lowestValue = Math.min.apply(Math, copyProdutoDivisaoColunaRSePivo) // cuidado com valores negativos
  const indexPivo = copyProdutoDivisaoColunaRSePivo.indexOf(lowestValue)

  return {
    pivo: colunaPivoObject.colunaPivo[indexPivo],
    indexPivo: indexPivo,
    linhaPivo: grid[indexPivo],
    colunaPivo: colunaPivoObject.colunaPivo,
    indexColunaPivo: colunaPivoObject.indexColunaPivo,
    indexLinhaPivo: grid.indexOf(grid[indexPivo])
  }
}

const gauss = (grid:number[][], pivoObject: PivoObject): GaussResponse => {
  const linhaPivoAmaciada = pivoObject.linhaPivo.map(el => el / pivoObject.pivo)
  const gridPosGauss = grid.map((linha, index) => {
    if (index === pivoObject.indexPivo) {
      return linhaPivoAmaciada
    } else {
      const linhaPivoAmaciadaLocal = linhaPivoAmaciada.map(el => el * linha[pivoObject.indexColunaPivo])
      return linha.map((el, indexLinha) =>  el - linhaPivoAmaciadaLocal[indexLinha])
    }
  })
 console.log('MADOKA!', gridPosGauss)
 console.log('-----------------------------------------')
  return {
    grid: gridPosGauss,
    linhaZ: gridPosGauss[gridPosGauss.length - 1]
  }
}

export interface PivoObject {
  pivo: number,
  indexPivo: number,
  linhaPivo: number[],
  colunaPivo: number[],
  indexColunaPivo: number,
  indexLinhaPivo: number,
}

export interface GaussResponse {
  grid: number[][],
  linhaZ: number[],
}

export { temElementoNegativoLinhaZ }
export { findMaiorElementoNegativoLinhaZ }
export { findColunaPivo }
export { getPivoAndLinhaPivo }
export { gauss }