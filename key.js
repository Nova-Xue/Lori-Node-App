// spotify = {
//   id: process.env.SPOTIFY_ID,
//   secret: process.env.SPOTIFY_SECRECT
// };
// module.exports = {
//   spotify : spotify
// };
spotify = {
  id : process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRECT
}
omdb = {
  prefix : process.env.OMDB_LINK
}
bandsintown = {
  id : process.env.BIT_ID,
  prefix : process.env.BIT_PRE
}
module.exports = {
  spotify : spotify,
  omdb : omdb,
  bit : bandsintown
}