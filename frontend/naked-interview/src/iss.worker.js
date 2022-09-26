const message = () => {
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({worker: true})
}
// eslint-disable-next-line no-restricted-globals
setInterval(message, 5000)
