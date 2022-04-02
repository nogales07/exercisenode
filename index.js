const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = [
    {
        "name": "test",
        "password": "$2b$10$7v4O6kBxFkXCTVBkptTV6O/LVyaYCXNRSBkN7T2rFjRCp7xKfUEKa"
    }
]

app.get('/users', (req, res) => {
  res.json(users)
})


app.post('/image/transform', async (req, res) => {
  const user = users.find(user => user.name === req.body.user)
  if (user == null) {
    return res.status(401).send()
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
        let buff = new Buffer(req.body.link);
        let base64data = buff.toString('base64');
       res.status(201).json({'base64': base64data})
    } else {
      res.status(401).send()
    }
  } catch(e) {
    res.status(500).send(e)
  }
})


app.post('/object/clean', async (req, res) => {
  try {
      
    const obj = req.body
    if (Object.keys(obj).length === 0) {
        return res.status(400).json({})
      } else {
        try {
            let newObj = removeEmpty(obj)
            res.send(newObj)
          } catch(e) {
            res.status(500).send(e)
          }
      }
  } catch (e) {
    res.status(500).send(e)
  }
})

function removeEmpty(obj) {
    return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc,[k,v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }), {})
}

