import { createPortal } from 'react-dom';
import css from './Modal.module.css';

function Modal() {
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal}></div>
    </div>,
    document.body
  );
}

export default Modal;
