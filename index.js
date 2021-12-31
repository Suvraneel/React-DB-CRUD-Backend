import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
var objId = mongoose.Types.ObjectId;
import cors from 'cors';
import dotenv from 'dotenv';

// Import schema models
import PostEntry from './src/models/post.js';

// Define Express Application
const app = express();

// Define DB conxn
// const url = 'mongodb://127.0.0.1:27017/simple-db-api'
// ENV Config
dotenv.config();
const PORT = process.env.PORT|| 9001;

app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());

app.get('/',(req,res)=>{
  PostEntry.find((error,post) =>{
      if(error) {
        // send error response
        res.status(422).send({ error: 'Unable to fetch posts '})
      } else {
        // send success response
        res.status(200).send(post)
      }
    })
})

app.post('/', (req, res, next) => {
  // initialise new Entry
  var newEntry = new PostEntry();
   // Assign values to the post model from request payload
  newEntry.title = req.body.title,
  newEntry.artist = req.body.artist,
  newEntry.metadata = req.body.metadata

   // Save the post
  newEntry.save((error, savedPost) => {
      if(error){
          res.status(500).send({error: 'Unable to save post.'});
      }
      else{
          res.status(200).send(savedPost);
      }
  })
})

app.put('/:id', (req, res) => {
  if (!objId.isValid(req.params.id))
      return res.status(400).send('No resource with given id : ' + req.params.id + ' found')

  var updatedRecord = {
      title: req.body.title,
      artist: req.body.artist,
      metadata: req.body.metadata
  }

  PostEntry.findByIdAndUpdate(req.params.id, { $set: updatedRecord },{new:true}, (error, post) => {
      if (error){
      res.status(604).send({error: 'Resrc could not be updated'})}
      else res.status(200).send(post)
  })
})

app.delete('/:id', (req, res) => {
  if (!objId.isValid(req.params.id))
      return res.status(400).send('No record with given id : ' + req.params.id + ' found')

  PostEntry.findByIdAndRemove(req.params.id, (error, post) => {
      if (error){
      res.status(305).send({error: 'Resrc could not deleted'})}
      else res.status(200).send(post)
  })
})


mongoose.connect(process.env.CONXN_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log('Server Running at Port:',{PORT})))
  .catch((error) => console.log({error},'Connection error'));
