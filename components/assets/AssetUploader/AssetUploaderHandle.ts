export interface AssetUploaderHandle {
  uploadAllPending: (targetId: string, isPrUpload?: boolean) => Promise<boolean>
}
