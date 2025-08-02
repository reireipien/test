/* src/utils/gaussJordan.js */
import Fraction from 'fraction.js'

/**
 * Gauss‑Jordan 消去を Fraction 型で行う
 * @param {Fraction[][]} input 係数行列 (Fraction の 2 次元配列)
 * @returns {Fraction[][]} RREF
 */
export function gaussJordan(input) {
  // ディープコピー
  const matrix = input.map((row) => row.map((f) => new Fraction(f)))
  const rows = matrix.length
  const cols = matrix[0].length
  let lead = 0

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) return matrix

    // ピボット探索
    let i = r
    while (matrix[i][lead].equals(0)) {
      i++
      if (i === rows) {
        i = r
        lead++
        if (lead === cols) return matrix
      }
    }

    // 行交換
    ;[matrix[i], matrix[r]] = [matrix[r], matrix[i]]

    // ピボットを 1 に正規化
    const lv = matrix[r][lead]
    for (let j = 0; j < cols; j++) {
      matrix[r][j] = matrix[r][j].div(lv)
    }

    // 他の行を 0 に
    for (let i2 = 0; i2 < rows; i2++) {
      if (i2 === r) continue
      const lv2 = matrix[i2][lead]
      for (let j = 0; j < cols; j++) {
        matrix[i2][j] = matrix[i2][j].sub(lv2.mul(matrix[r][j]))
      }
    }
    lead++
  }
  return matrix
}
