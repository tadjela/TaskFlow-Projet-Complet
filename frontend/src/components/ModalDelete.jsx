export default function ModalDelete({ show, title, message, onConfirm, onCancel, loading }) {
  if (!show) return null

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title || 'Confirmer la suppression'}</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{message || 'Cette action est irréversible. Voulez-vous continuer ?'}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onCancel} disabled={loading}>
                Annuler
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  )
}
