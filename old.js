app.get("/", (req, res) => {
  const oauth2client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  )

  const loginLink = oauth2client.generateAuthUrl({
    access_type: "offline",
    scope: CONFIG.oauth2Credentials.scopes,
  })

  return res.render("index", { loginLink: loginLink })
})

const service = google.youtube("v3")
service.search
  .list({
    part: "snippet,contentDetails",
    order: "viewCount",
    maxResults: 50,
  })
  .then((response) => {
    console.log(response)
  })

app.get("/outh2callback", (req, res) => {
  const oauth2client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  )

  if (req.query.error) {
    //if error, user was not granted permission
    return res.redirect("/")
  } else {
    oauth2client.getToken(req.query.code, function (err, token) {
      if (err) {
        return res.redirect("/")
      }

      res.cookie("jwt", jwt.sign(token, CONFIG.JWTsecret))

      return res.redirect("/list")
    })
  }
})

app.get("/list", (req, res) => {
  console.log(req.cookies.jwt)
  if (!req.cookies.jwt) {
    return res.redirect("/")
  }

  const oauth2client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  )

  oauth2client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret)

  //call youtube api

  const service = google.youtube("v3")
  service.search
    .list({
      part: "snippet,contentDetails",
      order: "viewCount",
      maxResults: 50,
    })
    .then((response) => {
      console.log(response)

      res.render("subscriptions", { list: response.data.items })
    })
})
