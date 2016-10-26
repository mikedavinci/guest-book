const Event = require('../models/event');

module.exports = {
    showEvents: showEvents,
    showSingle: showSingle,
    seedEvents: seedEvents,
    showCreate: showCreate,
    processCreate: processCreate
}

function showEvents(req, res) {
    //  get all events
    Event.find({}, (err, events) => {
        if (err) {
            res.status(404);
            res.send('Events not found!');
        }

        // return a view with data
        res.render('pages/events', { events: events });
    });
    
}

// show a single events
function showSingle(req, res) {
    //get a single events
   Event.findOne({ slug: req.params.slug }, (err, event) => {
        if (err) {
            res.status(404);
            res.send('Event not found!');
        }
            res.render('pages/single', { 
                event: event,
                success: req.flash('success')
            });
   });
   
}

// seed our database
function seedEvents(req, res) {
    

        // use the Event model to insert/save
        Event.remove({}, () => {
            for (event of events) {
                var newEvent = new Event(event);
                newEvent.save();
            }
        });
        // seeded!
        res.send('Database seeded!');
    }

// show the create form 
function showCreate(req, res) {
    res.render('pages/create');
}

// process the creation form
function processCreate(req, res) {
    // create a new event
    const event = new Event({
        name: req.body.name,
        email: req.body.email,
        description: req.body.description
    });

    // save event
    event.save((err) => {
        if (err)
            throw err;

        // set a successful flash message
        req.flash('success', 'Sucessfully created event!')

        // redirect to the newly created event
        res.redirect(`/events/${event.slug}`);
    });
}