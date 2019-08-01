import Clipboard from 'clipboard'
export const clip = ({
  event,
  text,
  response
}) => {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  });
  clipboard.on('success', () => {
    response(0, '复制成功')
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  });
  clipboard.on('error', () => {
    response(1, '复制失败, 请刷新后重试')
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  });
  clipboard.onClick(event)
}
