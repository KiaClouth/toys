import { useState, useEffect } from 'react'

export default function Versions(): JSX.Element {
  const [time, settime] = useState(0)

  useEffect(() => {
    // 记录运行时长
    const playTime = setInterval((): void => {
      settime((prevCount) => {
        return prevCount + 1
      })
    }, 1000)

    return function clear() {
      clearInterval(playTime)
    }
  }, [])

  try {
    const [versions] = useState(window.electron.process.versions)
    return (
      <div id="version_info" className="info">
        Node.js: <span id="node-version">{versions.node}</span>
        <br />
        Chromium: <span id="chrome-version">{versions.chrome}</span>
        <br />
        Electron: <span id="electron-version">{versions.electron}</span>
        <br />
        V8: <span id="V8-version">{versions.v8}</span>
        <br />
        已运行&nbsp;:&nbsp;&nbsp;{time}s
        <br />
      </div>
    )
  } catch (error) {
    return (
      <div id="version_info" className="info">
        已运行&nbsp;:&nbsp;&nbsp;{time}s
      </div>
    )
  }
}
