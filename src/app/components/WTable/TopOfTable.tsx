import React from 'react'

interface TopOfTableProps {
  leftSideItems?: React.ReactNode
  rightSideItems?: React.ReactNode
}
export const TopOfTable: React.FC<TopOfTableProps> = props => {
  const { leftSideItems, rightSideItems } = props
  return (
    <div className="p-4 flex flex-col lg:flex-row gap-2 sm:flex-rowitems-center justify-between flex-nowrap">
      <div className="flex flex-col md:flex-row md:items-center gap-2">{leftSideItems}</div>
      <div className="flex flex-row md:items-center gap-4">{rightSideItems}</div>
    </div>
  )
}
