/* src/utils/gaussJordan.js */
export function gaussJordan(input) {
  const matrix = input.map(row => row.slice())
  const rows = matrix.length
  const cols = matrix[0].length
  let lead = 0

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) return matrix
    let i = r
    while (Math.abs(matrix[i][lead]) < 1e-12) {
      i++
      if (i === rows) {
        i = r
        lead++
        if (lead === cols) return matrix
      }
    }
    ;[matrix[i], matrix[r]] = [matrix[r], matrix[i]]
    const lv = matrix[r][lead]
    for (let j = 0; j < cols; j++) matrix[r][j] /= lv

    for (let i2 = 0; i2 < rows; i2++) {
      if (i2 === r) continue
      const lv2 = matrix[i2][lead]
      for (let j = 0; j < cols; j++) {
        matrix[i2][j] -= lv2 * matrix[r][j]
      }
    }
    lead++
  }
  return matrix
}
