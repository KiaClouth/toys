import { PolygonMeshBuilder } from "babylonjs"

export default function Wrapper(
  scene: BABYLON.Scene,
  prenfrences: {
    defaultFont?: string
    meshOrigin?: string
    scale?: number
    debug?: boolean
    methods?: {
      Vector2?: BABYLON.Vector2
      Vector3?: BABYLON.Vector3
      Path2?: BABYLON.Path2
      Curve3?: BABYLON.Curve3
      Color3?: BABYLON.Color3
      SolidParticleSystem?: BABYLON.SolidParticleSystem
      PolygonMeshBuilder?: PolygonMeshBuilder
      CSG?: BABYLON.CSG
      StandardMaterial?: BABYLON.StandardMaterial
      Mesh?: BABYLON.Mesh
    }
  }
): (lttrs: string, opt: object) => void {
  return MeshWriter(lttrs, opt)
}
