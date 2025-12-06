// File System Access API types
// https://developer.mozilla.org/en-US/docs/Web/API/File_System_API

interface FileSystemHandle {
  kind: 'file' | 'directory'
  name: string
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  kind: 'directory'
}

interface DirectoryPickerOptions {
  id?: string
  mode?: 'read' | 'readwrite'
  startIn?:
    | FileSystemHandle
    | 'desktop'
    | 'documents'
    | 'downloads'
    | 'music'
    | 'pictures'
    | 'videos'
}

interface Window {
  showDirectoryPicker(
    options?: DirectoryPickerOptions
  ): Promise<FileSystemDirectoryHandle>
}
