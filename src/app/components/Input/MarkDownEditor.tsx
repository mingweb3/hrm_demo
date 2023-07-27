import React, { useState } from 'react'
import { styled } from '@mui/material'
import MDEditor from '@uiw/react-md-editor'

interface MarkDownEditorProps {
  className?: string
  defaultValue?: string
  height?: number
  preview?: 'live' | 'edit' | 'preview'
  onChange?: (val: string | undefined) => void
}

const _defaultProps: MarkDownEditorProps = {
  height: 200,
  preview: 'live'
}

const StyledMarkDownEditor = styled('div')(``)

const MarkDownEditor: React.FC<MarkDownEditorProps> = props => {
  const { className, defaultValue, height, preview, onChange } = props
  const [value, setValue] = useState(defaultValue || '')

  const handleChange = (val: string | undefined) => {
    setValue(val || '')
    if (onChange) onChange(val)
  }

  return (
    <StyledMarkDownEditor className={className} data-color-mode="light">
      <MDEditor value={value} onChange={handleChange} height={height} preview={preview} />
      {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
    </StyledMarkDownEditor>
  )
}

MarkDownEditor.defaultProps = _defaultProps

export default MarkDownEditor
