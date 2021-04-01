// MODELS
const Pet = require('../models/pet');

// PET ROUTES
module.exports = (app) => {

  // INDEX PET => index.js

  // NEW PET
  app.get('/pets/new', (req, res) => {
    res.render('pets-new');
  });

  // CREATE PET
  app.post('/pets', (req, res) => {
    var pet = new Pet(req.body);

    pet.save()
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`);
      })
      .catch((err) => {
        // Handle Errors
      }) ;
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-show', { pet: pet });
    });
  });

  // SEARCH PET
  app.get('/search', (req, res) => {
    const term = new RegExp(req.query.term, 'i')

    const page = req.query.page || 1 
    Pet.paginate(
      {
        // take existing $or query and put it as that query parameter for paginate
        $or: [
          {'name': term}, 
          {'spaces': term}
        ]
      }, 
      {page: page}).then((results) => {

        // pass original term (not RegExp) to populate correct URL w/ string
        res.render('pets-index', { pets: results.docs, pagesCount: results.pages, 
                                    currentPage: page, term: req.query.term });
      });

    // Pet.find({$or:[
    //   {'name': term},
    //   {'species': term}
    // ]}).exec((err, pets) => {
    //   res.render('pets-index', { pets: pets });
    // })
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-edit', { pet: pet });
    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`)
      })
      .catch((err) => {
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      return res.redirect('/')
    });
  });
}
