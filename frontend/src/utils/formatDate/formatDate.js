export const formatDate = (createdAt) => {
  const date = new Date(createdAt)
  const options = { day: "numeric", month: "long", year: "numeric" }
  return date.toLocaleDateString("en-GB", options)
}
