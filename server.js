const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

/* Schemas */
const Character = require('./schemas/character.js');

mongoose.connect('mongodb://localhost:27017/tekken7');

app.set('views','./views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger('combined'));
app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials',true);
  next();
})

const port = process.env.PORT || 8080;
const router = express.Router();

router.route('/').get(function(req,res){
  res.render('index', {title:'hey', message:'hello there!'});
  //res.json({message: 'welcome to /'});
});

router.route('/character').post(function(req,res) {
  const character = new Character();
  character.name = req.body.name;
  character.description = req.body.description;
  character.portrait = req.body.portrait;
  const cdata = JSON.parse(req.body.moves);
  character.moves = cdata.moves;
  character.save(function(err){
    res.redirect('/character');
  });
});

router.route('/character/:id').get(function(req,res) {
  Character.findById(req.params.id, function(error, character){
    if(error) res.send(error);
    //res.json(character);
    if(req.query.json){ res.json(character); } else {
      res.render('character', {character:character});
    }
  });
});

router.route('/character/:id').delete(function(req,res) {
  Character.remove({_id: req.params.id}, function(error,character){
    if(error) res.send(error);
    res.json({message: 'character deleted'});
  })
});
router.route('/del/character/:id').get(function(req,res) {
  Character.remove({_id: req.params.id}, function(error,character){
    if(error) res.send(error);
    res.redirect('/character');
  })
});

router.route('/character/:id').put(function(req,res) {
  Character.findById(req.params.id, function(error, character) {
    if(error) res.send(error);
    character.name = req.body.name;
    character.description = req.body.description;
    character.portrait = req.body.portrait;
    const cdata = JSON.parse(req.body.moves);
    character.moves = cdata.moves;
    character.save(function(err) {
      if(err) res.send(err);
      res.json({message: 'character updated!'});
    });
  });
});

router.route('/character').get(function(req,res) {
  Character.find(function(error, characters) {
    if(error) res.send(error);
    if(req.query.json){ res.json(characters); } else {
      res.render('character-list',{characters:characters});
    }
  });
});

app.use('/', router);
app.listen(port);
console.log('Listening on port: '+port);
