import { MouseEventHandler } from 'react'

interface menuProps {
  onClick: MouseEventHandler
  content: string
}
export default function Menu(props: menuProps): JSX.Element {
  return (
    <div className="GS_btn" onClick={props.onClick}>
      {props.content}
    </div>
  )
}
