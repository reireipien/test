import Fraction from 'fraction.js'

/**
 * Gauss–Jordan 消去を Fraction 型で行い，途中の行基本変形を履歴として返す
 * @param {Fraction[][]} input 係数行列 (Fraction の 2 次元配列)
 * @returns {{ rref: Fraction[][], steps: { op: string, snapshot: Fraction[][] }[] }}
 */
export function gaussJordan(input) {
  // ★ 0×0 や 0×n の行列に対する安全ガード
  if (input.length === 0 || input[0]?.length === 0) {
    throw new Error('行列のサイズが正しくありません (行または列が 0)')
  }

  const matrix = input.map((row) => row.map((f) => new Fraction(f)))
  const rows = matrix.length
  const cols = matrix[0].length
  const history = [{ op: 'Start', snapshot: clone(matrix) }]
  let lead = 0

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) return { rref: matrix, steps: history }

    // ピボット探索
    let i = r
    while (matrix[i][lead].equals(0)) {
      i++
      if (i === rows) {
        i = r
        lead++
        if (lead === cols) return { rref: matrix, steps: history }
      }
    }

    // 行交換
    if (i !== r) {
      ;[matrix[i], matrix[r]] = [matrix[r], matrix[i]]
      history.push({ op: `R${r + 1} ↔ R${i + 1}`, snapshot: clone(matrix) })
    }

    // ピボットを 1 に
    const lv = matrix[r][lead]
    if (!lv.equals(1)) {
      for (let j = 0; j < cols; j++) matrix[r][j] = matrix[r][j].div(lv)
      history.push({ op: `R${r + 1} ← R${r + 1} / ${lv.toFraction(true)}`, snapshot: clone(matrix) })
    }

    // 他の行を 0 に
    for (let i2 = 0; i2 < rows; i2++) {
      if (i2 === r) continue
      const lv2 = matrix[i2][lead]
      if (!lv2.equals(0)) {
        for (let j = 0; j < cols; j++) {
          matrix[i2][j] = matrix[i2][j].sub(lv2.mul(matrix[r][j]))
        }
        const coef = lv2.equals(1) ? '' : lv2.toFraction(true)
        history.push({ op: `R${i2 + 1} ← R${i2 + 1} - ${coef}R${r + 1}`, snapshot: clone(matrix) })
      }
    }
    lead++
  }
  return { rref: matrix, steps: history }
}

function clone(mat) {
  return mat.map((row) => row.map((x) => new Fraction(x)))
}
