export const Deferred = () => {
  var d = {}
  d.promise = new Promise((resolve, reject) => {
    d.resolve = resolve
    d.reject = reject
  })
  return d
}