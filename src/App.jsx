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
  const [result, setResult] = useState(null)  // Fraction[][] | null
  const [steps, setSteps] = useState([])      // 履歴

  // サイズ変更で初期化
  useEffect(() => {
    setMatrix(Array.from({ length: rows }, () => Array(cols).fill('')))
    setResult(null)
    setSteps([])
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
      const { rref, steps } = gaussJordan(numeric)
      setResult(rref)
      setSteps(steps)
    } catch (err) {
      alert('入力を確認してください: ' + err.message)
    }
  }

  return (
    <main>
      <h1>行列簡約化ツール (履歴付き)</h1>

      {/* サイズ入力 */}
      <div className="controls">
        <label>
          行数:
          <input type="number" min="1" value={rows} onChange={(e) => setRows(Number(e.target.value))} />
        </label>
        <label>
          列数:
          <input type="number" min="1" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
        </label>
      </div>

      {/* 入力テーブル */}
      {matrix.length > 0 && (
        <div className="scroll">
          <table>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  {row.map((value, c) => (
                    <td key={c}>
                      <input type="text" value={value} onChange={(e) => handleChange(r, c, e.target.value)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 簡約化ボタン */}
      {matrix.length > 0 && (
        <button className="primary" onClick={reduce}>簡約化</button>
      )}

      {/* 結果表示 */}
      {result && (
        <section>
          <h2>結果 (既約行列)</h2>
          <MatrixTable data={result} />
        </section>
      )}

      {/* 履歴表示 */}
      {steps.length > 0 && (
        <section>
          <h2>行基本変形の過程</h2>
          {steps.map((step, idx) => (
            <details key={idx} open={idx === steps.length - 1 /* 最終結果だけ開く */}>
              <summary>{`${idx}. ${step.op}`}</summary>
              <MatrixTable data={step.snapshot} />
            </details>
          ))}
        </section>
      )}

      <p className="note">※ 入力例 : 整数は <code>6</code>、分数は <code>-1/2</code>のように入力します。</p>
    </main>
  )
}

// 行列表示用コンポーネント
function MatrixTable({ data }) {
  return (
    <table className="matrix">
      <tbody>
        {data.map((row, r) => (
          <tr key={r}>
            {row.map((value, c) => (
              <td key={c}>{value.toFraction(true)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
