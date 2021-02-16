const express = require("express")
const app = express()
const { google } = require("googleapis")
app.set("view engine", "ejs")

let api_key = "api_key"
const youtube = google.youtube({
  version: "v3",
  auth: api_key,
})

app.get("/", async function (req, res) {
  let result = await youtube.search.list({
    type: "video",
    part: "snippet",

    maxResult: 50,
  })
  console.log(result.data.items)
  let list = result.data.items
  res.render("list", { list: list })
})

app.listen(3000, function () {
  console.log("I am connected!")
})
