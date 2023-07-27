import React from 'react'
import WToolBox from '@/app/components/WCard/WToolBox'

interface WToolBoxProps {
  children: React.ReactNode
}

const ToolBarForm: React.FC<WToolBoxProps> = props => {
  const { children } = props
  return (
    <WToolBox className="p-4">
      <div className="flex items-center justify-between gap-2">{children}</div>
    </WToolBox>
  )
}

export default ToolBarForm
