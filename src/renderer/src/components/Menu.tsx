import { MouseEventHandler } from 'react'

interface menuProps {
  onClick: MouseEventHandler
  content: string
}
export default function Menu(props: menuProps): JSX.Element {
  return (
    <div id="Menu">
      <div id="content" onClick={props.onClick}>
        {props.content}
      </div>
    </div>
  )
}
