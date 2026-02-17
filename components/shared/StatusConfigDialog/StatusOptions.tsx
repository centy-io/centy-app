interface StatusOptionsProps {
  selectedOption: boolean | null
  setSelectedOption: (value: boolean) => void
}

export function StatusOptions({
  selectedOption,
  setSelectedOption,
}: StatusOptionsProps) {
  return (
    <>
      <p className="status-config-dialog-description">
        When an AI agent starts working on an issue, should the issue status be
        automatically updated to &quot;in-progress&quot;?
      </p>

      <div className="status-config-dialog-options">
        <label
          className={`status-config-option ${selectedOption === true ? 'selected' : ''}`}
        >
          <input
            type="radio"
            name="updateStatus"
            checked={selectedOption === true}
            onChange={() => setSelectedOption(true)}
          />
          <div className="status-config-option-content">
            <span className="status-config-option-title">
              Yes, update status automatically
            </span>
            <span className="status-config-option-description">
              Issue status will change to &quot;in-progress&quot; when an agent
              starts working
            </span>
          </div>
        </label>

        <label
          className={`status-config-option ${selectedOption === false ? 'selected' : ''}`}
        >
          <input
            type="radio"
            name="updateStatus"
            checked={selectedOption === false}
            onChange={() => setSelectedOption(false)}
          />
          <div className="status-config-option-content">
            <span className="status-config-option-title">
              No, keep status unchanged
            </span>
            <span className="status-config-option-description">
              Issue status will remain as-is when an agent starts working
            </span>
          </div>
        </label>
      </div>
    </>
  )
}
