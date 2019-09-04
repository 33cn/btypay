
function sendMessage(action, payload) {
  window.chrome.runtime.sendMessage({
    action,
    payload,
  })
}

export default {
  data() {
    return {
      actionID: ''
    }
  },
  mounted() {
    if (this.$route.query.actionID) {
      this.actionID = this.$route.query.actionID
    }
  },
  methods: {
    replyBackground(payload) {
      switch(this.actionID) {
        case 'send-to-address':
          sendMessage('reply-background-send-to-address', payload)
          break
        case 'sign-tx':
          sendMessage('reply-background-sign-tx', payload)
          break
      }
      setTimeout(() => {
        try {
          window.chrome.tabs.getCurrent((tab) => {
            if (tab && tab.id) {
              window.chrome.tabs.remove(tab.id)
            }
          })
        } catch (e) {
          console.error(e)
        }
      }, 1000)
    },
    replyReject() {
      this.replyBackground({
        error: 'userReject',
        result: null
      })
    }
  }
}