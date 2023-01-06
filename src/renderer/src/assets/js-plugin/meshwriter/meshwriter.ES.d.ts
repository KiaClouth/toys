export default function Wrapper(
  scene: BABYLON.Scene,
  prenfrences: {
    defaultFont?: string
    meshOrigin?: string
    scale?: number
    debug?: boolean
  }
): (lttrs: string, opt: object) => void {
  return MeshWriter(lttrs, opt)
}
