export interface IFile {
  id: number
  fileName: string
  mimeType: string
  title?: string
  originUrl?: string
  resize?: {
    original?: string
    preview?: string
  }
}
