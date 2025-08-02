/* src/App.jsx */
import React, { useState, useEffect } from 'react'
import Fraction from 'fraction.js'
import { gaussJordan } from './utils/gaussJordan'

function parseFraction(str) {
  const s = str.trim()
  if (s === '') return new Fraction(0)
  if (s.includes('/')) {
    const [n, d] = s.split('/')
    return new Fraction(Number(n), Number(d))
  }
  return new Fraction(Number(s))
}

export default function App() {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [matrix, setMatrix] = useState([])
  const [result, setResult] = useState(null)

  // 行列サイズ変更時に初期化
  useEffect(() => {
    setMatrix(Array.from({ length: rows }, () => Array(cols).fill('')))
    setResult(null)
  }, [rows, cols])

  const handleChange = (r, c, value) => {
    setMatrix((prev) => {
      const next = prev.map((row) => row.slice())
      next[r][c] = value
      return next
    })
  }

  const reduce = () => {
    try {
      const numeric = matrix.map((row) => row.map(parseFraction))
      const reduced = gaussJordan(numeric)
      setResult(reduced)
    } catch (err) {
      alert('入力を確認してください: ' + err.message)
    }
  }

  return (
    <main>
      <h1>行列簡約化ツール (分数対応)</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          行数:
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            style={{ width: '4rem', marginLeft: '0.25rem' }}
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          列数:
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            style={{ width: '4rem', marginLeft: '0.25rem' }}
          />
        </label>
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
                        onChange={(e) => handleChange(r, c, e.target.value)}
                        style={{ width: '5rem', textAlign: 'center' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {matrix.length > 0 && (
        <button onClick={reduce} style={{ padding: '0.4rem 1rem' }}>
          簡約化
        </button>
      )}

      {result && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2>結果 (既約行列・分数表示)</h2>
          <table>
            <tbody>
              {result.map((row, r) => (
                <tr key={r}>
                  {row.map((value, c) => (
                    <td key={c} style={{ textAlign: 'center', padding: '0.25rem 0.5rem' }}>
                      {value.toFraction(true)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        ※ 分数入力例: <code>-5/7</code>、整数は <code>3</code> のように入力します。
      </p>
    </main>
  )
}
