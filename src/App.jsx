/* src/App.jsx */
import React, { useState } from 'react'
import { gaussJordan } from './utils/gaussJordan'

function parseNumber(str) {
  if (!str) return 0
  if (str.includes('/')) {
    const [num, den] = str.split('/')
    return Number(num) / Number(den)
  }
  return Number(str)
}

export default function App() {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)
  const [matrix, setMatrix] = useState([['', ''], ['', '']])
  const [result, setResult] = useState(null)

  const initMatrix = () => {
    setMatrix(Array.from({ length: rows }, () => Array(cols).fill('')))
    setResult(null)
  }

  const handleChange = (r, c, value) => {
    const next = matrix.map(row => row.slice())
    next[r][c] = value
    setMatrix(next)
  }

  const reduce = () => {
    const numeric = matrix.map(row => row.map(parseNumber))
    const reduced = gaussJordan(numeric)
    setResult(reduced)
  }

  return (
    <main>
      <h1>行列簡約化ツール</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          行数:
          <input
            type="number"
            min="1"
            value={rows}
            onChange={e => setRows(Number(e.target.value))}
            style={{ width: '4rem', marginLeft: '0.25rem' }}
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          列数:
          <input
            type="number"
            min="1"
            value={cols}
            onChange={e => setCols(Number(e.target.value))}
            style={{ width: '4rem', marginLeft: '0.25rem' }}
          />
        </label>
        <button onClick={initMatrix} style={{ marginLeft: '1rem' }}>
          設定
        </button>
      </div>

      {matrix.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
          <table>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  {row.map((value, c) => (
                    <td key={c}>
                      <input
                        type="text"
                        value={value}
                        onChange={e => handleChange(r, c, e.target.value)}
                        style={{ width: '4rem', textAlign: 'center' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {matrix.length > 0 && <button onClick={reduce}>簡約化</button>}

      {result && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2>結果 (既約行列)</h2>
          <table>
            <tbody>
              {result.map((row, r) => (
                <tr key={r}>
                  {row.map((value, c) => (
                    <td key={c} style={{ textAlign: 'center' }}>
                      {Number.isFinite(value) ? value.toFixed(3) : 'NaN'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        ※値が極端に大きい/小さい場合、オーバーフロー/アンダーフローにより正しく計算できないことがあります。
      </p>
    </main>
  )
}