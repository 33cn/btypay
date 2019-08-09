import {
  Notification 
} from 'element-ui'
export const errNotify = (msgOrErr) => {
  let msg = msgOrErr
  if (typeof msgOrErr === 'object') {
    msg = msgOrErr.error || msgOrErr.Error
  }
  Notification({
    message: msg || 'error',
    customClass: 'error-notification',
    duration: 3000
  })
}

export const sucNotify = (msg) => {
  Notification({
    message: msg || 'error',
    customClass: 'success-notification',
    duration: 3000
  })
}

// export const messageBox = MessageBox
